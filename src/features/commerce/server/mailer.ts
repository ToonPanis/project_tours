/**
 * Sending email. Two implementations behind one small interface:
 * - BrevoMailer: the real thing (decision B6), Brevo's HTTPS API called with
 *   plain fetch, so no SDK is needed;
 * - MemoryMailer: development and tests. It keeps what was "sent" so tests can
 *   read it, and in development prints it to the terminal (that's how you get
 *   your sign-in link locally without an email provider).
 */

export interface EmailMessage {
  to: string;
  subject: string;
  /** Plain text only for now: readable everywhere, nothing to escape. */
  text: string;
}

export interface Mailer {
  readonly provider: "brevo" | "memory";
  /** Resolves when the provider accepted the email; throws MailerError otherwise. */
  send(message: EmailMessage): Promise<void>;
}

/**
 * A failed send. `code` is short and safe to store or log ("brevo-401",
 * "network"): never the provider's message, which could echo the API key or
 * the recipient back.
 */
export class MailerError extends Error {
  constructor(readonly code: string) {
    super(`Email could not be sent (${code}).`);
    this.name = "MailerError";
  }
}

const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

export class BrevoMailer implements Mailer {
  readonly provider = "brevo";

  constructor(
    private readonly apiKey: string,
    private readonly sender: { email: string; name: string },
    // Passed in so tests can check the request without calling Brevo.
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async send(message: EmailMessage): Promise<void> {
    let response: Response;
    try {
      response = await this.fetchFn(BREVO_SEND_URL, {
        method: "POST",
        headers: { "api-key": this.apiKey, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: this.sender,
          to: [{ email: message.to }],
          subject: message.subject,
          textContent: message.text,
        }),
        // Never wait forever for the provider.
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new MailerError("network");
    }
    if (!response.ok) throw new MailerError(`brevo-${response.status}`);
  }
}

export class MemoryMailer implements Mailer {
  readonly provider = "memory";
  readonly sent: EmailMessage[] = [];

  constructor(private readonly printToConsole = false) {}

  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
    if (this.printToConsole) {
      console.info(`\n✉ Email to ${message.to}: ${message.subject}\n${message.text}\n`);
    }
  }
}
