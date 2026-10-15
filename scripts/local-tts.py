"""
Free, local text-to-speech for the Voice Studio (and later the audio guide).
No account, no API, no internet: the voices run on this computer.

Engines (installed by `scripts/setup-local-tts.ps1` into the git-ignored `.tts/` folder):
- Piper  (https://github.com/OHF-Voice/piper1-gpl): many languages, incl. Flemish (nl_BE).
- Kokoro (https://huggingface.co/hexgrad/Kokoro-82M, via kokoro-onnx): English, French,
  Spanish, Italian, … (no Dutch).

Called by the Next.js dev server (src/features/audio/tts/local-tts.ts) as:
    .tts/venv/Scripts/python -I scripts/local-tts.py < job.json
with one JSON job on stdin:
    {"engine": "piper", "voice": "nl_BE-rdh-medium", "speed": 1.0,
     "paragraphs": ["…", "…"], "out": "<path>.wav"}
    {"engine": "kokoro", "voice": "af_heart", "lang": "en-us", "speed": 1.0, …}
    ("speaker": 1 picks a speaker of a Piper model with several voices.)
or several jobs at once, {"jobs": [job, job, …]}: each voice is then loaded only once.
Writes a mono WAV file, or an MP3 when "out" ends in .mp3 (48 kbit/s: clear speech,
small files for phones). Each paragraph is spoken separately with a pause in between,
like a guide taking a breath between two parts of a story.
"""

import json
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / ".tts"
PARAGRAPH_PAUSE_SECONDS = 0.7
MP3_KBPS = 48
TARGET_RMS = 10 ** (-18 / 20)


# Loaded models, so a batch of jobs loads each voice only once.
_piper_voices = {}
_kokoro = None


def piper_paragraphs(job):
    from piper import PiperVoice, SynthesisConfig

    if job["voice"] not in _piper_voices:
        _piper_voices[job["voice"]] = PiperVoice.load(str(MODELS / "piper" / f"{job['voice']}.onnx"))
    voice = _piper_voices[job["voice"]]
    # Piper's "length scale" is the inverse of speed: 1.1 = 10% slower.
    config = SynthesisConfig(length_scale=1 / job["speed"], speaker_id=job.get("speaker"))
    rate = voice.config.sample_rate
    for text in job["paragraphs"]:
        chunks = [chunk.audio_float_array for chunk in voice.synthesize(text, syn_config=config)]
        yield np.concatenate(chunks), rate


def kokoro_paragraphs(job):
    global _kokoro
    from kokoro_onnx import Kokoro

    if _kokoro is None:
        _kokoro = Kokoro(str(MODELS / "kokoro" / "kokoro-v1.0.onnx"), str(MODELS / "kokoro" / "voices-v1.0.bin"))
    for text in job["paragraphs"]:
        samples, rate = _kokoro.create(text, voice=job["voice"], speed=job["speed"], lang=job["lang"])
        yield samples, rate


def normalize(audio):
    """Same loudness for every voice and stop (about -18 dBFS), without clipping."""
    rms = float(np.sqrt(np.mean(audio**2)))
    peak = float(np.max(np.abs(audio)))
    if rms == 0 or peak == 0:
        return audio
    gain = min(TARGET_RMS / rms, 0.97 / peak)
    return audio * gain


def synthesize(job):
    engines = {"piper": piper_paragraphs, "kokoro": kokoro_paragraphs}
    parts, rate = [], None
    for samples, rate in engines[job["engine"]](job):
        parts.append(samples)
        parts.append(np.zeros(int(rate * PARAGRAPH_PAUSE_SECONDS), dtype=np.float32))
    audio = normalize(np.concatenate(parts[:-1]))  # no pause after the last paragraph
    pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2")

    out = Path(job["out"])
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".tmp")
    if out.suffix == ".mp3":
        import lameenc

        encoder = lameenc.Encoder()
        encoder.set_bit_rate(MP3_KBPS)
        encoder.set_in_sample_rate(rate)
        encoder.set_channels(1)
        encoder.set_quality(2)  # 2 = high quality, slower encoding
        tmp.write_bytes(encoder.encode(pcm.tobytes()) + encoder.flush())
    else:
        with wave.open(str(tmp), "wb") as file:
            file.setnchannels(1)
            file.setsampwidth(2)
            file.setframerate(rate)
            file.writeframes(pcm.tobytes())
    tmp.replace(out)  # never leave a half-written file behind
    return {"out": job["out"], "seconds": round(len(audio) / rate, 1), "sampleRate": rate}


def main():
    # Bytes → UTF-8 ourselves: on Windows, text stdin would use the old code page (é, ”, Cyrillic break).
    data = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    # One job, or {"jobs": [...]}: one line of JSON per finished job (the caller shows progress).
    for job in data.get("jobs", [data]):
        print(json.dumps(synthesize(job)), flush=True)


if __name__ == "__main__":
    main()
