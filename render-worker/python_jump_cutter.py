#!/usr/bin/env python3
"""Create face-camera jump cuts by removing long silence gaps.

The script accepts a JSON request with input/output paths, detects silence with
FFmpeg, optionally removes filler/repeated words from a transcript JSON, and
renders a cleaned intermediate MP4 for the Shorts pipeline.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

try:
    import ffmpeg  # type: ignore
except Exception:
    ffmpeg = None

FILLER_WORDS = {
    "um",
    "umm",
    "uh",
    "uhh",
    "ah",
    "aah",
    "erm",
    "hmm",
    "like",
}


def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python_jump_cutter.py <request.json> <response.json>")

    request_path = Path(sys.argv[1])
    response_path = Path(sys.argv[2])
    payload = json.loads(request_path.read_text(encoding="utf-8"))
    result = create_jump_cut_video(payload)
    response_path.write_text(json.dumps(result, ensure_ascii=True), encoding="utf-8")
    return 0


def create_jump_cut_video(payload: dict[str, Any]) -> dict[str, Any]:
    input_path = Path(str(payload.get("inputPath") or ""))
    output_path = Path(str(payload.get("outputPath") or ""))
    ffmpeg_path = str(payload.get("ffmpegPath") or "ffmpeg")
    ffprobe_path = str(payload.get("ffprobePath") or "ffprobe")

    if not input_path.exists():
        return {"success": False, "error": f"inputPath does not exist: {input_path}"}
    if not output_path:
        return {"success": False, "error": "outputPath is required"}

    output_path.parent.mkdir(parents=True, exist_ok=True)
    duration = probe_duration(input_path, ffprobe_path)
    has_audio = probe_has_audio(input_path, ffprobe_path)

    if not has_audio:
        shutil.copyfile(input_path, output_path)
        return {
            "success": True,
            "outputPath": str(output_path),
            "inputDuration": duration,
            "outputDuration": duration,
            "cuts": [],
            "reason": "no_audio_stream",
        }

    silence_cuts = detect_silence_cuts(input_path, ffmpeg_path, payload)
    transcript_cuts = detect_transcript_cuts(payload)
    cut_ranges = merge_ranges(silence_cuts + transcript_cuts, duration)
    keep_ranges = invert_ranges(cut_ranges, duration, min_keep=float(payload.get("minKeepDuration") or 0.18))

    if len(keep_ranges) <= 1 and not cut_ranges:
        shutil.copyfile(input_path, output_path)
        return {
            "success": True,
            "outputPath": str(output_path),
            "inputDuration": duration,
            "outputDuration": duration,
            "cuts": [],
            "keepRanges": keep_ranges,
            "reason": "no_jump_cuts_needed",
        }

    render_concat(input_path, output_path, keep_ranges, ffmpeg_path, payload)
    output_duration = probe_duration(output_path, ffprobe_path)

    return {
        "success": True,
        "outputPath": str(output_path),
        "inputDuration": duration,
        "outputDuration": output_duration,
        "cuts": [{"start": round(a, 3), "end": round(b, 3)} for a, b in cut_ranges],
        "keepRanges": [{"start": round(a, 3), "end": round(b, 3)} for a, b in keep_ranges],
        "removedSeconds": round(max(0.0, duration - output_duration), 3),
        "engine": "python_ffmpeg_jump_cutter",
        "ffmpegPythonAvailable": ffmpeg is not None,
    }


def detect_silence_cuts(input_path: Path, ffmpeg_path: str, payload: dict[str, Any]) -> list[tuple[float, float]]:
    threshold = str(payload.get("silenceThresholdDb") or "-38dB")
    min_silence = float(payload.get("minSilenceDuration") or 0.5)
    padding = float(payload.get("silencePadding") or 0.08)
    max_cut = float(payload.get("maxSilenceCutDuration") or 4.0)
    command = [
        ffmpeg_path,
        "-hide_banner",
        "-i",
        str(input_path),
        "-af",
        f"silencedetect=n={threshold}:d={min_silence}",
        "-f",
        "null",
        "-",
    ]
    process = subprocess.run(command, capture_output=True, text=True)
    log = f"{process.stderr}\n{process.stdout}"
    starts = [float(match.group(1)) for match in re.finditer(r"silence_start:\s*([0-9.]+)", log)]
    ends = [float(match.group(1)) for match in re.finditer(r"silence_end:\s*([0-9.]+)", log)]

    ranges: list[tuple[float, float]] = []
    for start, end in zip(starts, ends):
        if end <= start:
            continue
        cut_start = start + padding
        cut_end = min(end - padding, start + max_cut)
        if cut_end - cut_start >= min_silence:
            ranges.append((cut_start, cut_end))
    return ranges


def detect_transcript_cuts(payload: dict[str, Any]) -> list[tuple[float, float]]:
    transcript_path = str(payload.get("transcriptPath") or "").strip()
    if not transcript_path:
        return []

    path = Path(transcript_path)
    if not path.exists():
        return []

    data = json.loads(path.read_text(encoding="utf-8"))
    words = data.get("words") if isinstance(data, dict) else None
    if not isinstance(words, list):
        return []

    ranges: list[tuple[float, float]] = []
    previous_clean = ""
    for item in words:
        word = clean_word(item.get("word") if isinstance(item, dict) else "")
        start = to_float(item.get("start") if isinstance(item, dict) else None)
        end = to_float(item.get("end") if isinstance(item, dict) else None)
        if start is None or end is None or end <= start:
            continue
        if word in FILLER_WORDS or (word and word == previous_clean):
            ranges.append((max(0.0, start - 0.04), end + 0.04))
        if word:
            previous_clean = word
    return ranges


def render_concat(input_path: Path, output_path: Path, keep_ranges: list[tuple[float, float]], ffmpeg_path: str, payload: dict[str, Any]) -> None:
    filters: list[str] = []
    labels: list[str] = []

    for index, (start, end) in enumerate(keep_ranges):
        filters.append(f"[0:v]trim=start={start:.3f}:end={end:.3f},setpts=PTS-STARTPTS[v{index}]")
        filters.append(f"[0:a]atrim=start={start:.3f}:end={end:.3f},asetpts=PTS-STARTPTS[a{index}]")
        labels.append(f"[v{index}][a{index}]")

    filter_complex = ";".join(filters + [f"{''.join(labels)}concat=n={len(keep_ranges)}:v=1:a=1[vout][aout]"])
    command = [
        ffmpeg_path,
        "-y",
        "-hide_banner",
        "-i",
        str(input_path),
        "-filter_complex",
        filter_complex,
        "-map",
        "[vout]",
        "-map",
        "[aout]",
        "-c:v",
        "libx264",
        "-preset",
        str(payload.get("preset") or "veryfast"),
        "-crf",
        str(payload.get("crf") or "23"),
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        str(payload.get("audioBitrate") or "160k"),
        "-movflags",
        "+faststart",
        str(output_path),
    ]
    process = subprocess.run(command, capture_output=True, text=True)
    if process.returncode != 0:
        raise RuntimeError(f"Jump cut FFmpeg failed: {(process.stderr or process.stdout)[-4000:]}")


def merge_ranges(ranges: list[tuple[float, float]], duration: float) -> list[tuple[float, float]]:
    cleaned = sorted((max(0.0, a), min(duration, b)) for a, b in ranges if b > a)
    if not cleaned:
        return []

    merged = [cleaned[0]]
    for start, end in cleaned[1:]:
        prev_start, prev_end = merged[-1]
        if start <= prev_end + 0.06:
            merged[-1] = (prev_start, max(prev_end, end))
        else:
            merged.append((start, end))
    return merged


def invert_ranges(cut_ranges: list[tuple[float, float]], duration: float, min_keep: float) -> list[tuple[float, float]]:
    keep: list[tuple[float, float]] = []
    cursor = 0.0
    for start, end in cut_ranges:
        if start - cursor >= min_keep:
            keep.append((cursor, start))
        cursor = max(cursor, end)
    if duration - cursor >= min_keep:
        keep.append((cursor, duration))
    return keep or [(0.0, duration)]


def probe_duration(path: Path, ffprobe_path: str) -> float:
    if ffmpeg is not None:
        try:
            data = ffmpeg.probe(str(path), cmd=ffprobe_path)
            duration = float((data.get("format") or {}).get("duration") or 0)
            if duration > 0:
                return duration
        except Exception:
            pass

    process = subprocess.run(
        [ffprobe_path, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True,
        text=True,
    )
    return float(process.stdout.strip() or 0)


def probe_has_audio(path: Path, ffprobe_path: str) -> bool:
    process = subprocess.run(
        [ffprobe_path, "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=codec_type", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True,
        text=True,
    )
    return process.stdout.strip() == "audio"


def clean_word(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "", str(value or "").lower())


def to_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


if __name__ == "__main__":
    raise SystemExit(main())
