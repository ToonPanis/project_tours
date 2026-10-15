import { afterEach, describe, expect, test, vi } from "vitest";
import { getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import { speechCacheKey } from "@/features/audio/tts/audio-cache";
import { isVoiceStudioEnabled } from "@/features/audio/voice-studio/access";
import { getVoiceStudioSampleText } from "@/features/audio/voice-studio/sample-text";
import { findVoiceRole, getStudioVoices, googleLanguageCode, pickVoiceName, VOICE_ROLES } from "@/features/audio/voice-studio/voices";
import { locales } from "@/i18n/config";
import { getOrderedLocations } from "@/lib/walk-locations";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Voice Studio sample text", () => {
  test.each(locales)("%s: the walk's own opening of the first stop, about a minute of speech", (locale) => {
    const text = getVoiceStudioSampleText(locale);
    const first = getOrderedLocations(getClassicsWalk(locale))[0];
    // Exactly the approved text, nothing written for the audio.
    for (const paragraph of first.guide!.introduction) expect(text).toContain(paragraph);
    expect(text).toContain(first.guide!.didYouKnow[0]);
    expect(text.startsWith(first.name)).toBe(true);
    // ~14 characters per second of calm narration → 45–75 s; within Google's 5,000-byte limit.
    expect(text.length).toBeGreaterThan(650);
    expect(text.length).toBeLessThan(1100);
    expect(new TextEncoder().encode(text).length).toBeLessThan(5000);
  });
});

describe("the three voices", () => {
  test("three different speakers (not one voice at three speeds), each with fallbacks", () => {
    expect(VOICE_ROLES.map((role) => role.number)).toEqual([1, 2, 3]);
    const firstChoices = VOICE_ROLES.map((role) => role.speakers[0]);
    expect(new Set(firstChoices).size).toBe(3);
    const allSpeakers = VOICE_ROLES.flatMap((role) => role.speakers);
    expect(new Set(allSpeakers).size).toBe(allSpeakers.length);
    for (const role of VOICE_ROLES) expect(role.speakingRate).toBeGreaterThanOrEqual(0.9);
  });

  test("the Antwerp guide speaks Flemish in Dutch; every language has a Google code", () => {
    expect(googleLanguageCode(findVoiceRole("antwerp-guide")!, "nl")).toBe("nl-BE");
    expect(googleLanguageCode(findVoiceRole("historian")!, "nl")).toBe("nl-NL");
    expect(googleLanguageCode(findVoiceRole("historian")!, "uk")).toBe("uk-UA");
    for (const voice of getStudioVoices()) expect(Object.keys(voice.languageCodes).sort()).toEqual([...locales].sort());
  });

  test("picks the first preferred speaker Google offers, or none", () => {
    const role = { speakers: ["Sadaltager", "Charon"] };
    expect(pickVoiceName(role, "nl-BE", ["nl-BE-Chirp3-HD-Charon", "nl-BE-Chirp3-HD-Sadaltager"])).toBe(
      "nl-BE-Chirp3-HD-Sadaltager",
    );
    expect(pickVoiceName(role, "nl-BE", ["nl-BE-Chirp3-HD-Charon", "nl-BE-Wavenet-C"])).toBe("nl-BE-Chirp3-HD-Charon");
    expect(pickVoiceName(role, "nl-BE", ["nl-NL-Chirp3-HD-Sadaltager"])).toBeNull();
    expect(findVoiceRole("narrator")).toBeUndefined();
    expect(findVoiceRole(null)).toBeUndefined();
  });
});

describe("the free local voices", () => {
  test("a man, a woman and a Flemish guide in Dutch; English for all three", () => {
    const [historian, storyteller, guide] = VOICE_ROLES;
    expect(historian.local.nl?.label).toMatch(/man/);
    expect(storyteller.local.nl?.label).toMatch(/woman/);
    expect(guide.local.nl?.voice).toMatch(/^nl_BE-/);
    for (const role of VOICE_ROLES) expect(role.local.en).toBeDefined();
    // Three different voices per language.
    for (const locale of ["en", "nl"] as const) {
      expect(new Set(VOICE_ROLES.map((role) => role.local[locale]?.voice)).size).toBe(3);
    }
  });

  test("no local voice with a license that forbids commercial use (or an unknown one)", () => {
    for (const role of VOICE_ROLES) {
      for (const voice of Object.values(role.local)) expect(voice.license).not.toMatch(/NC|non-commercial|unknown|AGPL/i);
    }
  });

  test("a language without a local voice says so, without starting anything", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { GET } = await import("@/app/api/admin/voice-studio/route");
    const response = await GET(new Request("http://localhost/api/admin/voice-studio?provider=local&voice=historian&locale=fr"));
    expect(response.status).toBe(404);
    expect(((await response.json()) as { error: string }).error).toContain("No free local voice");
  });
});

describe("audio cache key", () => {
  test("the same input → the same key, whatever the key order; any change → a new key", () => {
    const base = { voiceName: "nl-BE-Chirp3-HD-Achird", text: "Hallo", settings: { rate: 1, pitch: 0 } };
    const key = speechCacheKey(base);
    expect(speechCacheKey({ settings: { pitch: 0, rate: 1 }, text: "Hallo", voiceName: "nl-BE-Chirp3-HD-Achird" })).toBe(key);
    expect(speechCacheKey({ ...base, text: "Hallo!" })).not.toBe(key);
    expect(speechCacheKey({ ...base, settings: { rate: 1.05, pitch: 0 } })).not.toBe(key);
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("access", () => {
  test("only in development", () => {
    expect(isVoiceStudioEnabled("development")).toBe(true);
    expect(isVoiceStudioEnabled("production")).toBe(false);
    expect(isVoiceStudioEnabled("test")).toBe(false);
    expect(isVoiceStudioEnabled(undefined)).toBe(false);
  });
});

describe("the API route", () => {
  async function get(query: string) {
    const { GET } = await import("@/app/api/admin/voice-studio/route");
    return GET(new Request(`http://localhost/api/admin/voice-studio?${query}`));
  }

  test("a production build answers 404 and never calls Google", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("GOOGLE_TTS_API_KEY", "test-key");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect((await get("provider=google&voice=historian&locale=nl")).status).toBe(404);
    expect((await get("provider=local&voice=historian&locale=nl")).status).toBe(404);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("only the known providers, voices and languages (no free text)", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect((await get("provider=openai&voice=historian&locale=nl")).status).toBe(400);
    expect((await get("voice=narrator&locale=nl")).status).toBe(400);
    expect((await get("voice=historian&locale=pt")).status).toBe(400);
    expect((await get("voice=historian&text=anything")).status).toBe(400);
  });

  test("without an API key: a clear message, no call to Google", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("GOOGLE_TTS_API_KEY", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const response = await get("provider=google&voice=storyteller&locale=en");
    expect(response.status).toBe(503);
    expect(((await response.json()) as { error: string }).error).toContain("GOOGLE_TTS_API_KEY");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("Google's error message is passed on, the key never", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("GOOGLE_TTS_API_KEY", "secret-test-key");
    const fetchSpy = vi.fn(async () =>
      Response.json({ error: { message: "Cloud Text-to-Speech API has not been used in project 1" } }, { status: 403 }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    const response = await get("provider=google&voice=antwerp-guide&locale=uk");
    const body = (await response.json()) as { error: string };
    expect(response.status).toBe(502);
    expect(body.error).toContain("has not been used");
    expect(body.error).not.toContain("secret-test-key");
    // The key went in a header to Google only, not in the URL.
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).not.toContain("secret-test-key");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("secret-test-key");
  });
});
