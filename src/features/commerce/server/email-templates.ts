import type { EmailMessage } from "./mailer";

/**
 * Hidden Antwerp's email layout (P8, brief 7.1): every customer email is built
 * from the same small structure and comes out twice, as plain text (read
 * everywhere, also by screen readers and simple mail apps) and as HTML (the
 * "professional" look: the site's colours, one clear button).
 *
 * The HTML is a plain table layout with inline styles (what mail apps
 * understand); every value is escaped, so a name typed by a customer can never
 * become markup. No images, no tracking pixels, no external fonts.
 */

export interface EmailContent {
  subject: string;
  /** The first line ("Hello,"). */
  greeting: string;
  /** Paragraphs; a paragraph may contain line breaks (e.g. an order summary). */
  paragraphs: string[];
  /** The one action of the email (ticket link, review page…). */
  button?: { label: string; url: string };
  /** Paragraphs after the button (validity, small print). */
  after?: string[];
  /** Closing lines ("See you soon", "Hidden Antwerp"). */
  signoff: string[];
  /** Why the reader gets this email, and the way out (only for non-transactional mail). */
  footer?: string[];
  unsubscribe?: { label: string; url: string };
}

const COLORS = { ink: "#17120e", parchment: "#f3ead8", gold: "#8a6a2f", text: "#2b241d", muted: "#6b6157", line: "#e4d9c3" };

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Only http(s) links ever go into an href (a stored value can't become "javascript:"). */
function safeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : "#";
}

const paragraph = (text: string, color = COLORS.text, size = 16) =>
  `<p style="margin:0 0 16px;font-size:${size}px;line-height:1.5;color:${color};">${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;

export function renderEmail(content: EmailContent): Pick<EmailMessage, "subject" | "text" | "html" | "unsubscribeUrl"> {
  const text: string[] = [content.greeting, "", ...content.paragraphs.flatMap((part) => [part, ""])];
  if (content.button) text.push(content.button.label, content.button.url, "");
  for (const part of content.after ?? []) text.push(part, "");
  text.push(...content.signoff);
  if (content.footer || content.unsubscribe) text.push("", "—");
  for (const part of content.footer ?? []) text.push(part);
  if (content.unsubscribe) text.push(`${content.unsubscribe.label}: ${content.unsubscribe.url}`);

  const button = content.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:${COLORS.ink};border-radius:4px;">` +
      `<a href="${escapeHtml(safeUrl(content.button.url))}" style="display:inline-block;padding:14px 24px;font-size:16px;font-weight:bold;color:${COLORS.parchment};text-decoration:none;">${escapeHtml(content.button.label)}</a>` +
      `</td></tr></table>` +
      paragraph(content.button.url, COLORS.muted, 13)
    : "";
  const footer = [
    ...(content.footer ?? []).map((part) => paragraph(part, COLORS.muted, 13)),
    content.unsubscribe
      ? `<p style="margin:0;font-size:13px;color:${COLORS.muted};"><a href="${escapeHtml(safeUrl(content.unsubscribe.url))}" style="color:${COLORS.muted};">${escapeHtml(content.unsubscribe.label)}</a></p>`
      : "",
  ].join("");

  const html = [
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(content.subject)}</title></head>`,
    `<body style="margin:0;padding:0;background:${COLORS.parchment};font-family:Georgia,'Times New Roman',serif;">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.parchment};"><tr><td align="center" style="padding:24px 12px;">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${COLORS.line};border-radius:4px;">`,
    `<tr><td style="padding:20px 24px;background:${COLORS.ink};color:${COLORS.parchment};font-size:20px;letter-spacing:0.08em;text-transform:uppercase;">Hidden Antwerp</td></tr>`,
    `<tr><td style="padding:24px;font-family:Arial,Helvetica,sans-serif;">`,
    paragraph(content.greeting),
    ...content.paragraphs.map((part) => paragraph(part)),
    button,
    ...(content.after ?? []).map((part) => paragraph(part)),
    paragraph(content.signoff.join("\n")),
    footer ? `<div style="border-top:1px solid ${COLORS.line};padding-top:16px;margin-top:8px;">${footer}</div>` : "",
    `</td></tr></table></td></tr></table></body></html>`,
  ].join("");

  return { subject: content.subject, text: text.join("\n"), html, unsubscribeUrl: content.unsubscribe?.url ?? null };
}
