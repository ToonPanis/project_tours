import { describe, expect, test, vi } from "vitest";
import { EMAIL_MAX_ATTEMPTS, EMAIL_RETRY_DELAYS_MS } from "@/features/commerce/config";
import { deliverDueEmails, queueEmail } from "@/features/commerce/server/email-service";
import { BrevoMailer, MailerError, MemoryMailer, type Mailer } from "@/features/commerce/server/mailer";
import { testCommerceContext } from "./fixtures/commerce-context";

const MESSAGE = { to: "someone@example.com", subject: "Hello", text: "Body with a secret link" };

/** A mailer that fails the first `failures` times. */
function flakyMailer(failures: number): Mailer & { calls: number } {
  return {
    provider: "memory",
    calls: 0,
    async send() {
      this.calls += 1;
      if (this.calls <= failures) throw new MailerError("brevo-503");
    },
  };
}

describe("email outbox", () => {
  test("the same id is sent once, even when queued twice", async () => {
    const setup = testCommerceContext();
    expect(await queueEmail(setup.ctx, "order-paid:1", MESSAGE)).toBe("queued");
    expect(await queueEmail(setup.ctx, "order-paid:1", MESSAGE)).toBe("duplicate");
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 1, retrying: 0, failed: 0 });
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 0, retrying: 0, failed: 0 });
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(1);
  });

  test("two senders at the same moment send it once (the first one claims it)", async () => {
    const setup = testCommerceContext();
    await queueEmail(setup.ctx, "login:abc", MESSAGE);
    await Promise.all([deliverDueEmails(setup.ctx), deliverDueEmails(setup.ctx)]);
    expect((setup.mailer as MemoryMailer).sent).toHaveLength(1);
  });

  test("after sending, the text is removed from the outbox (no sign-in link stays in the database)", async () => {
    const setup = testCommerceContext();
    const update = vi.spyOn(setup.store, "updateEmail");
    await queueEmail(setup.ctx, "login:abc", MESSAGE);
    await deliverDueEmails(setup.ctx);
    expect(update).toHaveBeenLastCalledWith("login:abc", expect.objectContaining({ status: "sent", text: null }));
  });

  test("a refused email is retried with growing pauses, then sent", async () => {
    const mailer = flakyMailer(2);
    const setup = testCommerceContext({ mailer });
    await queueEmail(setup.ctx, "x", MESSAGE);
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 0, retrying: 1, failed: 0 });
    // Not yet due: nothing happens.
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 0, retrying: 0, failed: 0 });
    setup.advance(EMAIL_RETRY_DELAYS_MS[0]);
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 0, retrying: 1, failed: 0 });
    setup.advance(EMAIL_RETRY_DELAYS_MS[1]);
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 1, retrying: 0, failed: 0 });
    expect(mailer.calls).toBe(3);
  });

  test(`after ${EMAIL_MAX_ATTEMPTS} failures it's marked failed, with a short error code and without its text`, async () => {
    const mailer = flakyMailer(99);
    const setup = testCommerceContext({ mailer });
    const update = vi.spyOn(setup.store, "updateEmail");
    await queueEmail(setup.ctx, "x", MESSAGE);
    for (let attempt = 1; attempt <= EMAIL_MAX_ATTEMPTS; attempt++) {
      await deliverDueEmails(setup.ctx);
      setup.advance(EMAIL_RETRY_DELAYS_MS[attempt - 1] ?? 0);
    }
    expect(mailer.calls).toBe(EMAIL_MAX_ATTEMPTS);
    expect(update).toHaveBeenLastCalledWith("x", expect.objectContaining({ status: "failed", lastError: "brevo-503", text: null }));
    expect(await deliverDueEmails(setup.ctx)).toEqual({ sent: 0, retrying: 0, failed: 0 });
  });

  test("an unexpected error is stored as 'unexpected', never with its message", async () => {
    const setup = testCommerceContext({
      mailer: {
        provider: "memory",
        send: async () => {
          throw new Error("secret details");
        },
      },
    });
    const update = vi.spyOn(setup.store, "updateEmail");
    await queueEmail(setup.ctx, "x", MESSAGE);
    await deliverDueEmails(setup.ctx);
    expect(update).toHaveBeenLastCalledWith("x", expect.objectContaining({ lastError: "unexpected" }));
  });
});

describe("Brevo", () => {
  const SENDER = { email: "no-reply@hiddenantwerp.example", name: "Hidden Antwerp" };

  test("sends one JSON request to Brevo's transactional API with the key in its header", async () => {
    const fetchFn = vi.fn(async () => new Response("{}", { status: 201 }));
    await new BrevoMailer("key-123", SENDER, fetchFn).send(MESSAGE);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["api-key"]).toBe("key-123");
    expect(JSON.parse(String(init.body))).toEqual({
      sender: SENDER,
      to: [{ email: MESSAGE.to }],
      subject: MESSAGE.subject,
      textContent: MESSAGE.text,
    });
  });

  test("a refusal becomes a short code; the key and Brevo's message never end up in the error", async () => {
    const fetchFn = vi.fn(async () => new Response('{"message":"Key key-123 is not valid"}', { status: 401 }));
    const error = await new BrevoMailer("key-123", SENDER, fetchFn).send(MESSAGE).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(MailerError);
    expect((error as MailerError).code).toBe("brevo-401");
    expect((error as Error).message).not.toContain("key-123");
  });

  test("no connection: code 'network'", async () => {
    const fetchFn = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(new BrevoMailer("k", SENDER, fetchFn).send(MESSAGE)).rejects.toMatchObject({ code: "network" });
  });

  test("the memory mailer prints emails only when asked (development)", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    await new MemoryMailer(false).send(MESSAGE);
    expect(log).not.toHaveBeenCalled();
    await new MemoryMailer(true).send(MESSAGE);
    expect(log).toHaveBeenCalledTimes(1);
  });
});
