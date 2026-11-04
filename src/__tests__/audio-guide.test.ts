import { describe, expect, test } from "vitest";
import { getClassicsWalk } from "@/data/walks/classics-of-antwerp";
import audioFile from "@/data/walks/classics-of-antwerp/audio.json";
import { audioGuideVoiceKey, getAudioGuideVoice } from "@/features/audio/audio-guide-voice";
import { attachAudioGuide, type AudioGuideFile } from "@/features/audio/logic/attach-audio";
import { getAudioJobs } from "@/features/audio/logic/audio-jobs";
import { cardNarration, getStopNarrationTracks, narrationHash, stopNarration } from "@/features/audio/logic/narration";
import { toSpoken } from "@/features/audio/logic/pronunciation";
import { locales } from "@/i18n/config";
import { createTranslator, englishTranslator } from "@/i18n/translate";
import { getOrderedLocations } from "@/lib/walk-locations";

const t = englishTranslator;
const walk = getClassicsWalk("en");
const stops = getOrderedLocations(walk);
const byId = (id: string) => stops.find((location) => location.id === id)!;

describe("what the audio guide reads", () => {
  test("a stop: its name, introduction, story, did you know and the way on, exactly as on the page", () => {
    const station = byId("classics-central-station");
    const guide = station.guide!;
    const spoken = stopNarration(station.name, guide, t).join("\n");
    expect(spoken.startsWith(`${station.name}. ${guide.subtitle}.`)).toBe(true);
    for (const paragraph of [...guide.introduction, ...guide.sections.flatMap((section) => section.paragraphs), ...guide.didYouKnow]) {
      expect(spoken).toContain(paragraph);
    }
    expect(spoken).toContain(t("guide.didYouKnow"));
    expect(spoken).toContain(guide.transitionToNext!);
    // Not read: captions of the images.
    for (const image of guide.images) expect(spoken).not.toContain(image.caption);
  });

  test("a legend is announced as a legend (never read as history)", () => {
    const brabo = byId("classics-brabo");
    const legend = brabo.guide!.sections.find((section) => section.kind === "legend")!;
    const spoken = stopNarration(brabo.name, brabo.guide!, t);
    const index = spoken.indexOf(legend.paragraphs[0]);
    expect(spoken[index - 1]).toContain(t("guide.sectionLabels.legend"));
  });

  test("each slide has its own track, with only its own story", () => {
    const cathedral = byId("classics-cathedral");
    const cards = cathedral.guide!.cards!;
    const tracks = getStopNarrationTracks(cathedral, t, "en");
    expect(tracks.map((track) => track.id)).toEqual([cathedral.id, ...cards.map((card) => `${cathedral.id}.card.${card.id}`)]);
    for (const [index, card] of cards.entries()) {
      const own = tracks[index + 1].paragraphs.join("\n");
      expect(own).toContain(card.sections[0].paragraphs[0]);
      for (const other of cards.filter((candidate) => candidate !== card)) {
        expect(own).not.toContain(other.sections[0].paragraphs[0]);
      }
    }
    // The main track doesn't read the slides either.
    expect(tracks[0].paragraphs.join("\n")).not.toContain(cards[1].sections[0].paragraphs[0]);
    expect(cardNarration(cards[0], t)[0]).toContain(cards[0].title);
  });

  test("the hidden stories behind \"Discover more stories\" have their own track", () => {
    const district = byId("classics-diamond-district");
    const story = district.guide!.moreStories![0];
    const tracks = getStopNarrationTracks(district, t, "en");
    expect(tracks.map((track) => track.id)).toContain(`${district.id}.more.${story.id}`);
  });

  test("Spooky's \"find the place\" quest: read under the name the stop page shows once found", () => {
    const questStop = stops.find((location) => location.quest?.type === "location")!;
    if (questStop.quest?.type !== "location") throw new Error("expected a location quest");
    const [main] = getStopNarrationTracks(questStop, t, "en");
    expect(main.paragraphs[0].startsWith(questStop.quest.revealedName)).toBe(true);
  });

  test("Spooky's quests stay secret on the way: no stop's audio names the answer of the NEXT quest", () => {
    for (const [index, location] of stops.entries()) {
      const next = stops[index + 1];
      if (next?.quest?.type !== "location") continue;
      const spoken = getStopNarrationTracks(location, t, "en").flatMap((track) => track.paragraphs).join("\n");
      expect(spoken).not.toContain(next.quest.revealedName);
      expect(spoken).not.toContain(next.quest.revealedAddress);
    }
  });
});

describe("pronunciation", () => {
  test("Russian and Ukrainian: names in Cyrillic, centuries and rulers as words", () => {
    expect(toSpoken("Перед вами Antwerpen-Centraal, в конце XIX века.", "ru")).toBe("Перед вами Антверпен-Сентрал, в конце девятнадцатого века.");
    expect(toSpoken("В XVI веке император Карл V…", "ru")).toBe("В шестнадцатом веке император Карл Пятый…");
    expect(toSpoken("из XX века в XIX, к Рубенсу", "ru")).toBe("из двадцатого века в девятнадцатый, к Рубенсу");
    expect(toSpoken("На початку XXI століття, у XVI столітті", "uk")).toBe("На початку двадцять першого століття, у шістнадцятому столітті");
    expect(toSpoken("ракета V-2 і Карла V", "uk")).toBe("ракета Фау-2 і Карла П'ятого");
    // Whole words only, and other languages are untouched.
    expect(toSpoken("Meirbrug", "ru")).toBe("Meirbrug");
    expect(toSpoken("The Meir in the XIX century", "en")).toBe("The Meir in the XIX century");
  });

  test.each(["ru", "uk"] as const)("%s: no Latin word is left for the voice to stumble over", (locale) => {
    const localWalk = getClassicsWalk(locale);
    const tl = createTranslator(locale);
    const leftovers = getOrderedLocations(localWalk)
      .flatMap((location) => getStopNarrationTracks(location, tl, locale))
      .flatMap((track) => track.paragraphs)
      .flatMap((paragraph) => paragraph.match(/[A-Za-zÀ-ɏ]+/g) ?? []);
    expect([...new Set(leftovers)]).toEqual([]);
  });
});

describe("recordings and versions", () => {
  test("the fingerprint changes with the text and with the voice", () => {
    const hash = narrationHash(["Hallo", "Antwerpen"], "piper:nl_BE-rdh-medium");
    expect(narrationHash(["Hallo", "Antwerpen"], "piper:nl_BE-rdh-medium")).toBe(hash);
    expect(narrationHash(["Hallo", "Antwerpen!"], "piper:nl_BE-rdh-medium")).not.toBe(hash);
    expect(narrationHash(["Hallo", "Antwerpen"], "kokoro:bm_george")).not.toBe(hash);
    expect(hash).toMatch(/^[0-9a-f]{14}$/);
  });

  test("the guide's voice exists in all 8 languages; Dutch is Flemish", () => {
    for (const locale of locales) expect(getAudioGuideVoice(locale)).toBeDefined();
    expect(getAudioGuideVoice("nl")!.voice).toBe("nl_BE-rdh-medium");
  });

  test("a recording is only used for the exact text it was made from", () => {
    const tl = createTranslator("nl");
    const nlWalk = getClassicsWalk("nl");
    const [job, cardJob] = [
      getAudioJobs(nlWalk, "nl", tl)[0],
      getAudioJobs(nlWalk, "nl", tl).find((candidate) => candidate.trackId.includes(".card."))!,
    ];
    const file: AudioGuideFile = {
      locales: {
        nl: {
          tracks: {
            [job.trackId]: { file: job.file, hash: job.hash, durationSeconds: 61 },
            [cardJob.trackId]: { file: cardJob.file, hash: "outdated", durationSeconds: 30 },
          },
        },
      },
    };
    const plain = getOrderedLocations({ ...nlWalk, locations: nlWalk.locations.map((location) => ({ ...location, guide: location.guide && { ...location.guide, audio: undefined } })) });
    const withAudio = attachAudioGuide(plain, file, "nl", tl);
    const first = withAudio.find((location) => location.id === job.trackId)!;
    expect(first.guide!.audio).toEqual({ src: job.file, durationSeconds: 61, credit: expect.stringContaining("RDH") });
    // The slide's text changed since its recording: no player rather than an old story.
    const cardStop = withAudio.find((location) => cardJob.trackId.startsWith(`${location.id}.`))!;
    expect(cardStop.guide!.cards!.every((card) => card.audio === undefined)).toBe(true);
    expect(job.file).toBe(`/audio/classics-of-antwerp/nl/${job.trackId}-${job.hash}.mp3`);
  });

  test.each(locales)("%s: every stop and slide of Classics of Antwerp has an up-to-date recording", (locale) => {
    const recorded = (audioFile as AudioGuideFile).locales[locale]?.tracks ?? {};
    const voiceKey = audioGuideVoiceKey(getAudioGuideVoice(locale)!);
    const localWalk = getClassicsWalk(locale);
    const tl = createTranslator(locale);
    const missing = getOrderedLocations(localWalk)
      .flatMap((location) => getStopNarrationTracks(location, tl, locale))
      .filter((track) => recorded[track.id]?.hash !== narrationHash(track.paragraphs, voiceKey))
      .map((track) => track.id);
    // Fails after a text change: run `node scripts/generate-audio-guide.mjs classics-of-antwerp` (with npm run dev).
    expect(missing).toEqual([]);
  });
});
