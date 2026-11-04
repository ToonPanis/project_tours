import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AudioGuidePlayer } from "@/features/audio/components/AudioGuidePlayer";
import { clampTime, formatAudioTime, formatRate, isPlaybackRate } from "@/features/audio/logic/audio-time";
import { GuideCardArticle } from "@/features/guide/components/CardDeck";
import { createTranslator, englishTranslator } from "@/i18n/translate";
import type { AudioTrack } from "@/types/audio";
import type { GuideCard } from "@/types/guide";

const t = englishTranslator;
const track: AudioTrack = { src: "/audio/test/en/stop-abc.mp3", durationSeconds: 270, credit: "Piper · RDH (Flemish man) · MIT model, CC0 data" };

// jsdom has no media playback: play() and pause() only fire the events a browser would.
let playSpy: ReturnType<typeof vi.fn>;
let pauseSpy: ReturnType<typeof vi.fn>;
beforeEach(() => {
  playSpy = vi.fn(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  pauseSpy = vi.fn(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("pause"));
  });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playSpy as unknown as () => Promise<void>);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pauseSpy as unknown as () => void);
});
afterEach(() => window.localStorage.clear());

/** Lets the test set the position like a browser would (jsdom keeps it at 0). */
function fakePosition(audio: HTMLAudioElement) {
  let time = 0;
  Object.defineProperty(audio, "currentTime", { get: () => time, set: (value: number) => (time = value), configurable: true });
  Object.defineProperty(audio, "duration", { get: () => 270, configurable: true });
}

const audioElement = (container: HTMLElement) => container.querySelector("audio")!;

describe("audio time helpers", () => {
  test("times, speeds and positions", () => {
    expect(formatAudioTime(85)).toBe("01:25");
    expect(formatAudioTime(270.9)).toBe("04:30");
    expect(formatAudioTime(3725)).toBe("1:02:05");
    expect(formatAudioTime(Number.NaN)).toBe("00:00");
    expect(clampTime(-5, 100)).toBe(0);
    expect(clampTime(120, 100)).toBe(100);
    expect(isPlaybackRate(1.25)).toBe(true);
    expect(isPlaybackRate(2)).toBe(false);
    expect(formatRate(0.75, "nl")).toBe("0,75×");
    expect(formatRate(1.5, "en")).toBe("1.5×");
  });
});

describe("the audio guide player", () => {
  test("shows the length before loading anything, and never starts by itself", () => {
    const { container } = render(<AudioGuidePlayer track={track} title="Antwerpen-Centraal" t={t} />);
    expect(screen.getByRole("heading", { name: t("audio.listen") })).toBeDefined();
    expect(screen.getByText("00:00 / 04:30")).toBeDefined();
    expect(audioElement(container).getAttribute("preload")).toBe("none");
    expect(playSpy).not.toHaveBeenCalled();
    // The visitor knows it's an AI voice, and which one.
    expect(screen.getByText(`${t("audio.aiVoice")} · ${track.credit}`)).toBeDefined();
  });

  test("play, pause and resume with one button", async () => {
    render(<AudioGuidePlayer track={track} title="Antwerpen-Centraal" t={t} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: t("audio.play") })));
    expect(playSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: t("audio.pause") }));
    expect(pauseSpy).toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: t("audio.play") })));
    expect(playSpy).toHaveBeenCalledTimes(2);
  });

  test("forward, back, the progress bar and start again", () => {
    const { container } = render(<AudioGuidePlayer track={track} title="Antwerpen-Centraal" t={t} />);
    const audio = audioElement(container);
    fakePosition(audio);
    fireEvent.click(screen.getByRole("button", { name: t("audio.forward", { seconds: 15 }) }));
    expect(audio.currentTime).toBe(15);
    fireEvent.change(screen.getByRole("slider", { name: t("audio.progress") }), { target: { value: "85" } });
    expect(audio.currentTime).toBe(85);
    expect(screen.getByText("01:25 / 04:30")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: t("audio.back", { seconds: 15 }) }));
    expect(audio.currentTime).toBe(70);
    fireEvent.click(screen.getByRole("button", { name: t("audio.restart") }));
    expect(audio.currentTime).toBe(0);
  });

  test("speed: 1× by default, the choice is used and remembered for the next stop", () => {
    const { container, unmount } = render(<AudioGuidePlayer track={track} title="A" t={t} />);
    const speeds = screen.getByRole("group", { name: t("audio.speed") });
    expect(speeds.querySelector('[aria-pressed="true"]')!.textContent).toBe("1×");
    fireEvent.click(screen.getByRole("button", { name: "1.25×" }));
    expect(audioElement(container).playbackRate).toBe(1.25);
    unmount();

    render(<AudioGuidePlayer track={track} title="B" t={t} />);
    expect(screen.getByRole("button", { name: "1.25×" }).getAttribute("aria-pressed")).toBe("true");
  });

  test("one recording at a time; leaving the stop stops its audio", async () => {
    const { unmount } = render(
      <>
        <AudioGuidePlayer track={track} title="Stop" t={t} />
        <AudioGuidePlayer track={{ ...track, src: "/audio/test/en/slide.mp3" }} title="Slide" t={t} />
      </>,
    );
    const [first, second] = screen.getAllByRole("button", { name: t("audio.play") });
    await act(async () => fireEvent.click(first));
    pauseSpy.mockClear();
    await act(async () => fireEvent.click(second));
    expect(pauseSpy).toHaveBeenCalledTimes(1);
    pauseSpy.mockClear();
    unmount();
    expect(pauseSpy).toHaveBeenCalled();
  });

  test("a file that can't load says so in the always-present status", () => {
    const { container } = render(<AudioGuidePlayer track={track} title="A" t={t} />);
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("");
    fireEvent.error(audioElement(container));
    expect(status.textContent).toBe(t("audio.loadError"));
  });

  test("in the visitor's language", () => {
    const nl = createTranslator("nl");
    render(<AudioGuidePlayer track={track} title="A" t={nl} />);
    expect(screen.getByRole("heading", { name: nl("audio.listen") })).toBeDefined();
    expect(screen.getByRole("button", { name: "0,75×" })).toBeDefined();
  });
});

describe("a slide with its own recording", () => {
  const card: GuideCard = { id: "matsijs", title: "Quinten Matsijs", sections: [{ kind: "history", paragraphs: ["The smith who became a painter."] }] };

  test("shows its player; a slide without a recording has none", () => {
    const { container, rerender } = render(<GuideCardArticle card={{ ...card, audio: track }} t={t} />);
    expect(container.querySelector("audio")!.getAttribute("src")).toBe(track.src);
    rerender(<GuideCardArticle card={card} t={t} />);
    expect(container.querySelector("audio")).toBeNull();
  });
});
