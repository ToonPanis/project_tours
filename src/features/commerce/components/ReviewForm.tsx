"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale, useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { MAX_REVIEW_NAME_LENGTH, MAX_REVIEW_TEXT_LENGTH } from "../config";
import { postCommerce } from "./commerce-errors";

const KNOWN_ERRORS = new Set([
  "invalid-review-link",
  "already-reviewed",
  "invalid-rating",
  "invalid-review-text",
  "invalid-name",
  "too-many-requests",
  "offline",
]);
const errorKey = (code: string) => (KNOWN_ERRORS.has(code) ? `feedback.errors.${code}` : "feedback.errors.generic") as MessageKey;

type LinkState = { status: "checking" } | { status: "invalid" } | { status: "done" } | { status: "open"; productName: string; rewardPercent: number | null };
interface Reward {
  code: string;
  percent: number;
  validUntil: string;
}

const field = "w-full rounded-sm border border-parchment/30 bg-ink/40 px-4 text-lg text-parchment focus:border-gold focus:outline-none";

/**
 * The review form behind the link in the follow-up email (/review#<token>).
 * The token (after "#", never sent to a server by the browser itself) is only
 * sent to our API, which checks it is a real ticket.
 */
export function ReviewForm() {
  const t = useT();
  const locale = useLocale();
  const [token, setToken] = useState("");
  const [link, setLink] = useState<LinkState>({ status: "checking" });
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mayPublish, setMayPublish] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reward, setReward] = useState<Reward | null | "none">(null);

  // Once, when the page opens: read the token and ask the server about it.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    let isCancelled = false;
    async function check() {
      if (!fromHash) {
        setLink({ status: "invalid" });
        return;
      }
      const result = await postCommerce<{ status: "open" | "done"; productName: string; rewardPercent: number | null }>("/api/reviews/check", { token: fromHash });
      if (isCancelled) return;
      setToken(fromHash);
      if (!result.ok) setLink({ status: "invalid" });
      else if (result.data.status === "done") setLink({ status: "done" });
      else setLink({ status: "open", productName: result.data.productName, rewardPercent: result.data.rewardPercent });
    }
    void check();
    return () => {
      isCancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) {
      setError(t(errorKey("invalid-rating")));
      return;
    }
    setIsSending(true);
    setError(null);
    const result = await postCommerce<{ reward: Reward | null }>("/api/reviews", { token, rating, text, displayName, mayPublish, locale });
    setIsSending(false);
    if (!result.ok) setError(t(errorKey(result.error)));
    else setReward(result.data.reward ?? "none");
  }

  const percent = (value: number) => new Intl.NumberFormat(locale, { style: "percent" }).format(value / 100);
  const day = (iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Brussels" }).format(new Date(iso));

  if (reward !== null) {
    return (
      <div role="status" className="flex flex-col gap-3 rounded-sm border border-emerald-400/50 bg-emerald-950/40 p-4">
        <p className="text-lg font-semibold">{t("feedback.review.thanks")}</p>
        {reward !== "none" && (
          <>
            <p>{t("feedback.review.codeIntro", { percent: percent(reward.percent) })}</p>
            <p className="font-mono text-2xl tracking-wider text-gold">{reward.code}</p>
            <p className="text-sm text-parchment/80">{t("feedback.review.codeValid", { date: day(reward.validUntil) })}</p>
          </>
        )}
      </div>
    );
  }
  if (link.status === "checking") return <p role="status">{t("feedback.review.checking")}</p>;
  if (link.status === "invalid") return <p role="status" className="rounded-sm border border-red-400/50 bg-red-950/40 p-3">{t("feedback.review.invalid")}</p>;
  if (link.status === "done") return <p role="status" className="rounded-sm border border-parchment/30 p-3">{t("feedback.review.done")}</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-parchment/85">{t("feedback.review.product", { product: link.productName })}</p>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold uppercase tracking-wider text-gold">{t("feedback.review.rating")}</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} className="peer sr-only" />
              <span
                aria-hidden="true"
                className={`flex size-12 items-center justify-center rounded-sm border text-2xl peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold ${value <= rating ? "border-gold text-gold" : "border-parchment/30 text-parchment/40"}`}
              >
                ★
              </span>
              <span className="sr-only">{t.plural("feedback.review.stars", value)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("feedback.review.text")}</span>
        <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={MAX_REVIEW_TEXT_LENGTH} rows={5} className={`${field} py-3`} />
        <span className="text-sm text-parchment/70">{t("feedback.review.textHint", { max: MAX_REVIEW_TEXT_LENGTH })}</span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("feedback.review.name")}</span>
        <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={MAX_REVIEW_NAME_LENGTH} className={`${field} min-h-12`} />
        <span className="text-sm text-parchment/70">{t("feedback.review.nameHint")}</span>
      </label>
      <label className="flex min-h-11 items-start gap-3 text-parchment/85">
        <input type="checkbox" checked={mayPublish} onChange={(event) => setMayPublish(event.target.checked)} className="mt-1 size-5 shrink-0" />
        <span>{t("feedback.review.mayPublish")}</span>
      </label>
      {link.rewardPercent !== null && <p className="text-sm text-parchment/80">{t("feedback.review.rewardNote", { percent: percent(link.rewardPercent) })}</p>}
      <p className="text-sm text-parchment/70">{t("feedback.review.moderation")}</p>
      <Button type="submit" disabled={isSending} fullWidth>
        {isSending ? t("feedback.review.sending") : t("feedback.review.submit")}
      </Button>
      <p role="status" className={error ? "rounded-sm border border-red-400/50 bg-red-950/40 p-3" : "sr-only"}>
        {error ?? ""}
      </p>
    </form>
  );
}
