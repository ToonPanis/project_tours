import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, test } from "vitest";

/**
 * P9 security audit, as tests that keep holding: they read the source code
 * itself, so a new route or page that forgets its access check, a secret
 * pasted into the code, or a log line with an email address fails CI.
 */

const root = process.cwd();
const src = join(root, "src");

function filesUnder(dir: string, name: RegExp): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...filesUnder(path, name));
    else if (name.test(entry)) found.push(path);
  }
  return found;
}

const rel = (path: string) => relative(root, path).split(sep).join("/");
const read = (path: string) => readFileSync(path, "utf-8");

describe("every protected route and page checks access itself (never only a layout)", () => {
  test("admin API routes: adminPost or adminFromRequest (sign-in routes excepted)", () => {
    const routes = filesUnder(join(src, "app", "api", "admin"), /^route\.ts$/).filter((path) => !rel(path).includes("/admin/auth/"));
    expect(routes.length).toBeGreaterThan(15);
    const unguarded = routes.filter((path) => !/adminPost(<[^>]*>)?\(|adminFromRequest\(/.test(read(path))).map(rel);
    expect(unguarded).toEqual([]);
  });

  test("admin pages in the console: requireAdmin()", () => {
    const pages = filesUnder(join(src, "app", "admin", "(console)"), /^page\.tsx$/);
    expect(pages.length).toBeGreaterThan(10);
    expect(pages.filter((path) => !read(path).includes("requireAdmin()")).map(rel)).toEqual([]);
  });

  test("partner API routes: partnerFromRequest (sign-in routes excepted); portal pages: requirePartner()", () => {
    const routes = filesUnder(join(src, "app", "api", "partner"), /^route\.ts$/).filter((path) => !rel(path).includes("/partner/auth/"));
    expect(routes.length).toBeGreaterThan(0);
    expect(routes.filter((path) => !read(path).includes("partnerFromRequest(")).map(rel)).toEqual([]);
    const pages = filesUnder(join(src, "app", "partner"), /^page\.tsx$/).filter((path) => !rel(path).includes("/partner/login"));
    expect(pages.filter((path) => !read(path).includes("requirePartner()")).map(rel)).toEqual([]);
  });

  test("cron routes refuse without CRON_SECRET and compare it in constant time", () => {
    const crons = filesUnder(join(src, "app", "api", "cron"), /^route\.ts$/);
    expect(crons.length).toBeGreaterThan(0);
    for (const path of crons) {
      const code = read(path);
      expect(code, rel(path)).toContain("process.env.CRON_SECRET");
      expect(code, rel(path)).toContain("timingSafeEqual");
    }
  });

  test("POST routes outside the admin area check origin and JSON (or are signed one-click/webhook endpoints)", () => {
    const routes = filesUnder(join(src, "app", "api"), /^route\.ts$/).filter((path) => /export async function POST/.test(read(path)));
    const allowed = ["src/app/api/webhooks/stripe/route.ts", "src/app/api/games/[code]/media/upload/route.ts"];
    const unchecked = routes
      .filter((path) => !/checkPostRequest\(|adminPost(<[^>]*>)?\(|checkSameOrigin\(/.test(read(path)))
      .map(rel)
      .filter((path) => !allowed.includes(path));
    expect(unchecked).toEqual([]);
  });
});

describe("secrets and logs", () => {
  const tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf-8" })
    .split("\n")
    .filter((path) => path && !path.startsWith("public/") && !/\.(png|jpe?g|webp|avif|mp3|svg|ico|woff2?)$/i.test(path) && path !== "package-lock.json");

  test("no API keys or connection strings in any tracked file", () => {
    const patterns = [
      /sk_live_[A-Za-z0-9]{8,}/,
      /sk_test_[A-Za-z0-9]{16,}/,
      /rk_(live|test)_[A-Za-z0-9]{16,}/,
      /whsec_[A-Za-z0-9]{16,}/,
      /xkeysib-[a-f0-9]{20,}/,
      // A real user:password (placeholders like <db_username> in .env.example are fine).
      /mongodb(\+srv)?:\/\/[^\s:"'`/<]+:[^\s@"'`<]+@/,
      /vercel_blob_rw_[A-Za-z0-9]{10,}/,
    ];
    const leaks: string[] = [];
    for (const path of tracked) {
      let text: string;
      try {
        text = readFileSync(join(root, path), "utf-8");
      } catch {
        continue;
      }
      for (const pattern of patterns) if (pattern.test(text)) leaks.push(`${path}: ${pattern}`);
    }
    expect(leaks).toEqual([]);
  });

  test("secrets are never NEXT_PUBLIC_ (only those reach the browser)", () => {
    const code = filesUnder(src, /\.(ts|tsx|mjs)$/).map(read).join("\n");
    expect(code).not.toMatch(/NEXT_PUBLIC_(STRIPE_SECRET|STRIPE_WEBHOOK|BREVO|MONGODB|TICKET_SIGNING|CRON|ADMIN_EMAILS|BLOB)/);
  });

  test("server logs never contain emails, tokens or secrets (only names and codes)", () => {
    const files = [...filesUnder(join(src, "features"), /\.(ts|tsx)$/), ...filesUnder(join(src, "app"), /\.(ts|tsx)$/)].filter(
      // The memory mailer prints emails in DEVELOPMENT only (that's how you get your sign-in link locally).
      (path) => !rel(path).endsWith("commerce/server/mailer.ts"),
    );
    const offending: string[] = [];
    for (const path of files) {
      read(path)
        .split("\n")
        .forEach((line, index) => {
          if (/console\.(log|info|warn|error)\(/.test(line) && /\$\{[^}]*(email|token|secret|password|\.to\b|cookie)/i.test(line)) {
            offending.push(`${rel(path)}:${index + 1}`);
          }
        });
    }
    expect(offending).toEqual([]);
  });
});
