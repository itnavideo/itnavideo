#!/usr/bin/env python3
"""Python talking-head editing engine for Itnavideo.

This script is a concrete version of the face-camera blueprint:

1. Load transcript/timestamps when available.
2. Calculate good ranges by removing silence/filler/repeated words.
3. Create engaging jump-cut clips with alternating zoom.
4. Burn large colorful subtitles and keyword icon overlays with FFmpeg.
5. Save the final MP4 in final_output.

It accepts a JSON request/response pair:

python_talking_head_engine.py <request.json> <response.json>
"""

from __future__ import annotations

import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

try:
    from moviepy import VideoFileClip, concatenate_videoclips  # type: ignore
except Exception:
    VideoFileClip = None
    concatenate_videoclips = None


WIDTH = 1080
HEIGHT = 1920
FPS = 30
FILLER_WORDS = {"um", "umm", "uh", "uhh", "ah", "aah", "erm", "hmm", "like"}
KEYWORD_ICON_ALIASES = {
    "money": ["money", "dollar", "cash", "coin", "rupee"],
    "cash": ["money", "dollar", "cash", "coin", "rupee"],
    "dollar": ["money", "dollar", "cash", "coin"],
    "paisa": ["money", "rupee", "cash", "coin"],
    "profit": ["profit", "growth", "chart", "money"],
    "growth": ["growth", "chart", "up"],
    "stop": ["stop", "warning", "alert"],
    "warning": ["warning", "alert", "stop"],
    "mistake": ["mistake", "warning", "cross"],
    "galti": ["mistake", "warning", "cross"],
    "important": ["important", "star", "alert"],
    "zaroori": ["important", "star", "alert"],
    "secret": ["secret", "lock", "key"],
    "idea": ["idea", "bulb", "light"],
    "solution": ["solution", "check", "tick", "idea"],
    "problem": ["problem", "warning", "question"],
    "time": ["time", "clock", "timer"],
}


def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python_talking_head_engine.py <request.json> <response.json>")

    request_path = Path(sys.argv[1])
    response_path = Path(sys.argv[2])
    payload = json.loads(request_path.read_text(encoding="utf-8"))
    result = edit_talking_head_video(payload)
    response_path.write_text(json.dumps(result, ensure_ascii=True), encoding="utf-8")
    return 0


def edit_talking_head_video(payload: dict[str, Any]) -> dict[str, Any]:
    video_id = safe_id(payload.get("videoId") or payload.get("jobId") or "talking_head")
    workspace_root = Path(str(payload.get("workspaceRoot") or os.getenv("RENDER_WORKSPACE_DIR") or Path.cwd()))
    raw_video_path = Path(str(payload.get("inputPath") or workspace_root / "raw_assets" / "user_videos" / f"{video_id}.mp4"))
    output_video_path = Path(str(payload.get("outputPath") or workspace_root / "final_output" / f"{video_id}_edited.mp4"))
    ffmpeg_path = str(payload.get("ffmpegPath") or os.getenv("FFMPEG_PATH") or "ffmpeg")
    ffprobe_path = str(payload.get("ffprobePath") or os.getenv("FFPROBE_PATH") or "ffprobe")

    if VideoFileClip is None or concatenate_videoclips is None:
        return {"success": False, "error": "moviepy is not installed or could not be imported"}
    if not raw_video_path.exists():
        return {"success": False, "error": f"input video not found: {raw_video_path}"}

    output_video_path.parent.mkdir(parents=True, exist_ok=True)
    transcript_data = load_transcript(payload)
    duration = probe_duration(raw_video_path, ffprobe_path)
    valid_ranges = calculate_good_parts(raw_video_path, duration, transcript_data, ffmpeg_path, payload)

    temp_dir = Path(tempfile.mkdtemp(prefix="itnavideo_talking_head_"))
    intermediate_path = temp_dir / f"{video_id}_moviepy.mp4"

    try:
        moviepy_result = render_moviepy_cut(raw_video_path, intermediate_path, valid_ranges, payload)
        caption_events = build_caption_events(transcript_data, duration, payload)
        icon_events = build_icon_events(transcript_data, duration, workspace_root, payload)
        burn_subtitles_and_icons(intermediate_path, output_video_path, caption_events, icon_events, ffmpeg_path, payload)

        return {
            "success": True,
            "engine": "python_moviepy_ffmpeg_talking_head",
            "outputPath": str(output_video_path),
            "inputPath": str(raw_video_path),
            "inputDuration": duration,
            "outputDuration": probe_duration(output_video_path, ffprobe_path),
            "keepRanges": [{"start": round(a, 3), "end": round(b, 3)} for a, b in valid_ranges],
            "captionEvents": len(caption_events),
            "iconEvents": len(icon_events),
            "moviepy": moviepy_result,
            "features": [
                "transcript_timestamps",
                "silence_and_filler_jump_cuts",
                "alternating_zoom_clips",
                "big_colorful_subtitles",
                "keyword_icon_overlays",
            ],
            "message": "Engaging video editing completed.",
        }
    finally:
        cleanup_dir(temp_dir)


def render_moviepy_cut(
    input_path: Path,
    output_path: Path,
    keep_ranges: list[tuple[float, float]],
    payload: dict[str, Any],
) -> dict[str, Any]:
    zoom_scale = float(payload.get("zoomScale") or os.getenv("FACE_VIDEO_ZOOM_SCALE") or 1.12)
    preset = str(payload.get("preset") or os.getenv("FFMPEG_PRESET") or "veryfast")
    crf = str(payload.get("crf") or 23)

    with VideoFileClip(str(input_path)) as video:
        clips = []
        for index, (start, end) in enumerate(keep_ranges):
            clip = video.subclipped(start, end)
            clip = fit_vertical_canvas(clip)
            if index % 2 == 0:
                clip = clip.resized(zoom_scale).cropped(
                    x_center=round(WIDTH * zoom_scale / 2),
                    y_center=round(HEIGHT * zoom_scale / 2),
                    width=WIDTH,
                    height=HEIGHT,
                )
            clips.append(clip)

        if not clips:
            raise RuntimeError("No valid clips were produced for talking-head edit")

        final_clip = concatenate_videoclips(clips, method="compose")
        final_clip.write_videofile(
            str(output_path),
            codec="libx264",
            audio_codec="aac",
            fps=FPS,
            preset=preset,
            ffmpeg_params=["-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart"],
            logger=None,
        )
        final_clip.close()
        for clip in clips:
            clip.close()

    return {"intermediatePath": str(output_path), "clips": len(keep_ranges)}


def fit_vertical_canvas(clip: Any) -> Any:
    width = getattr(clip, "w", WIDTH) or WIDTH
    height = getattr(clip, "h", HEIGHT) or HEIGHT
    scale = min(WIDTH / width, HEIGHT / height)
    fitted = clip.resized(scale)
    return fitted.with_position(("center", "center")).with_background_color(size=(WIDTH, HEIGHT), color=(0, 0, 0))


def calculate_good_parts(
    input_path: Path,
    duration: float,
    transcript_data: dict[str, Any] | None,
    ffmpeg_path: str,
    payload: dict[str, Any],
) -> list[tuple[float, float]]:
    cuts = []
    cuts.extend(detect_silence_cuts(input_path, ffmpeg_path, payload))
    cuts.extend(detect_transcript_cuts(transcript_data))
    merged = merge_ranges(cuts, duration)
    return invert_ranges(merged, duration, min_keep=float(payload.get("minKeepDuration") or 0.22))


def detect_silence_cuts(input_path: Path, ffmpeg_path: str, payload: dict[str, Any]) -> list[tuple[float, float]]:
    threshold = str(payload.get("silenceThresholdDb") or os.getenv("FACE_VIDEO_SILENCE_THRESHOLD_DB") or "-38dB")
    min_silence = float(payload.get("minSilenceDuration") or os.getenv("FACE_VIDEO_MIN_SILENCE_SECONDS") or 0.5)
    padding = float(payload.get("silencePadding") or os.getenv("FACE_VIDEO_SILENCE_PADDING_SECONDS") or 0.08)
    max_cut = float(payload.get("maxSilenceCutDuration") or os.getenv("FACE_VIDEO_MAX_SILENCE_CUT_SECONDS") or 4.0)
    process = subprocess.run(
        [ffmpeg_path, "-hide_banner", "-i", str(input_path), "-af", f"silencedetect=n={threshold}:d={min_silence}", "-f", "null", "-"],
        capture_output=True,
        text=True,
    )
    log = f"{process.stderr}\n{process.stdout}"
    starts = [float(match.group(1)) for match in re.finditer(r"silence_start:\s*([0-9.]+)", log)]
    ends = [float(match.group(1)) for match in re.finditer(r"silence_end:\s*([0-9.]+)", log)]

    ranges = []
    for start, end in zip(starts, ends):
        cut_start = start + padding
        cut_end = min(end - padding, start + max_cut)
        if cut_end - cut_start >= min_silence:
            ranges.append((cut_start, cut_end))
    return ranges


def detect_transcript_cuts(transcript_data: dict[str, Any] | None) -> list[tuple[float, float]]:
    words = get_words(transcript_data)
    ranges = []
    previous = ""
    for item in words:
        word = clean_word(item.get("word") or item.get("text") or "")
        start = to_float(item.get("start") or item.get("startTime"))
        end = to_float(item.get("end") or item.get("endTime"))
        if start is None or end is None or end <= start:
            continue
        if word in FILLER_WORDS or (word and word == previous):
            ranges.append((max(0.0, start - 0.04), end + 0.04))
        if word:
            previous = word
    return ranges


def burn_subtitles_and_icons(
    input_path: Path,
    output_path: Path,
    caption_events: list[dict[str, Any]],
    icon_events: list[dict[str, Any]],
    ffmpeg_path: str,
    payload: dict[str, Any],
) -> None:
    filters = []
    current = "0:v"
    for index, event in enumerate(caption_events[: int(payload.get("maxCaptionEvents") or 80)]):
        next_label = f"cap{index}"
        filters.append(f"[{current}]{build_drawtext(event)}[{next_label}]")
        current = next_label

    icon_input_start = 1
    for index, event in enumerate(icon_events[: int(payload.get("maxIconEvents") or 12)]):
        icon_label = f"icon{index}"
        next_label = f"iconout{index}"
        size = int(payload.get("iconSize") or os.getenv("FACE_VIDEO_ICON_SIZE") or 132)
        filters.append(f"[{icon_input_start + index}:v]scale={size}:{size}:force_original_aspect_ratio=decrease,format=rgba[{icon_label}]")
        filters.append(
            f"[{current}][{icon_label}]overlay=x=(W-w)/2:y=H*0.53:"
            f"enable='between(t,{round_time(event['start'])},{round_time(event['end'])})'[{next_label}]"
        )
        current = next_label

    filters.append(f"[{current}]null[vout]")
    command = [ffmpeg_path, "-y", "-hide_banner", "-stats", "-i", str(input_path)]
    for event in icon_events[: int(payload.get("maxIconEvents") or 12)]:
        command.extend(["-loop", "1", "-framerate", "30", "-i", str(event["iconPath"])])

    command.extend([
        "-filter_complex",
        ";".join(filters),
        "-map",
        "[vout]",
        "-map",
        "0:a?",
        "-c:v",
        "libx264",
        "-preset",
        str(payload.get("preset") or os.getenv("FFMPEG_PRESET") or "veryfast"),
        "-crf",
        str(payload.get("crf") or 23),
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        str(payload.get("audioBitrate") or "160k"),
        "-movflags",
        "+faststart",
        str(output_path),
    ])
    process = subprocess.run(command, capture_output=True, text=True)
    if process.returncode != 0:
        raise RuntimeError(f"Subtitle/icon FFmpeg failed: {(process.stderr or process.stdout)[-4000:]}")


def build_drawtext(event: dict[str, Any]) -> str:
    text = escape_text(str(event.get("text") or "").upper())
    start = round_time(float(event["start"]))
    end = round_time(float(event["end"]))
    pop_end = round_time(min(float(event["end"]), float(event["start"]) + 0.16))
    font_size = int(event.get("fontSize") or os.getenv("FACE_VIDEO_CAPTION_FONT_SIZE") or 76)
    color = event.get("color") or caption_color(text)
    y = f"if(lt(t\\,{pop_end})\\,h*0.68+({pop_end}-t)*180\\,h*0.68)"
    alpha = f"if(lt(t\\,{start})\\,0\\,if(lt(t\\,{pop_end})\\,(t-{start})/max({max(float(pop_end)-float(start), 0.001):.3f}\\,0.001)\\,if(lt(t\\,{end})\\,1\\,0)))"
    return (
        "drawtext="
        f"text='{text}':fontcolor={color}:fontsize={font_size}:x=(w-text_w)/2:y='{y}':"
        "borderw=5:bordercolor=black:shadowcolor=black@0.75:shadowx=4:shadowy=4:"
        f"alpha='{alpha}':enable='between(t,{start},{end})':fix_bounds=1"
    )


def build_caption_events(transcript_data: dict[str, Any] | None, duration: float, payload: dict[str, Any]) -> list[dict[str, Any]]:
    words = get_words(transcript_data)
    events = []
    for item in words:
        text = str(item.get("word") or item.get("text") or "").strip()
        start = to_float(item.get("start") or item.get("startTime"))
        end = to_float(item.get("end") or item.get("endTime"))
        if not text or start is None:
            continue
        if end is None or end <= start:
            end = start + min(0.72, max(0.32, len(text) * 0.055))
        events.append({
            "text": " ".join(text.split()[:3]),
            "start": round(max(0.0, start), 3),
            "end": round(min(duration, max(start + 0.25, end)), 3),
            "color": caption_color(text),
        })
    return events[: int(payload.get("maxCaptionEvents") or os.getenv("FACE_VIDEO_MAX_CAPTION_EVENTS") or 80)]


def build_icon_events(
    transcript_data: dict[str, Any] | None,
    duration: float,
    workspace_root: Path,
    payload: dict[str, Any],
) -> list[dict[str, Any]]:
    icon_dir = Path(str(payload.get("iconDir") or workspace_root / "assets_library" / "icons"))
    words = get_words(transcript_data)
    events = []
    last_start = -999.0
    min_spacing = float(payload.get("iconMinSpacing") or os.getenv("FACE_VIDEO_ICON_MIN_SPACING_SECONDS") or 2.4)
    for item in words:
        keyword = clean_word(item.get("word") or item.get("text") or "")
        start = to_float(item.get("start") or item.get("startTime"))
        end = to_float(item.get("end") or item.get("endTime"))
        icon_path = find_icon(keyword, icon_dir)
        if start is None or icon_path is None or start - last_start < min_spacing:
            continue
        events.append({
            "keyword": keyword,
            "iconPath": str(icon_path),
            "start": round(start, 3),
            "end": round(min(duration, max(start + 0.55, end or start + 0.9)), 3),
        })
        last_start = start
    return events[: int(payload.get("maxIconEvents") or os.getenv("FACE_VIDEO_MAX_ICON_EVENTS") or 12)]


def load_transcript(payload: dict[str, Any]) -> dict[str, Any] | None:
    transcript = payload.get("transcript")
    if isinstance(transcript, dict):
        return transcript
    transcript_path = str(payload.get("transcriptPath") or "").strip()
    if not transcript_path:
        return None
    path = Path(transcript_path)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def get_words(transcript_data: dict[str, Any] | None) -> list[dict[str, Any]]:
    if not isinstance(transcript_data, dict):
        return []
    if isinstance(transcript_data.get("words"), list):
        return transcript_data["words"]
    nested = transcript_data.get("transcript")
    if isinstance(nested, dict) and isinstance(nested.get("words"), list):
        return nested["words"]
    words = []
    for segment in transcript_data.get("segments") or []:
        if isinstance(segment, dict) and isinstance(segment.get("words"), list):
            words.extend(segment["words"])
    return words


def find_icon(keyword: str, icon_dir: Path) -> Path | None:
    if not keyword or not icon_dir.exists():
        return None
    terms = [keyword, *KEYWORD_ICON_ALIASES.get(keyword, [])]
    icon_files = [p for p in icon_dir.iterdir() if p.suffix.lower() in {".png", ".webp", ".jpg", ".jpeg"}]
    for icon_file in icon_files:
        name = icon_file.name.lower()
        if any(term in name for term in terms):
            return icon_file
    return None


def caption_color(text: str) -> str:
    word = clean_word(text)
    if word in {"money", "cash", "dollar", "profit", "sale", "price", "paisa"}:
        return "0xFFFF00"
    if word in {"stop", "warning", "mistake", "problem", "galti", "danger"}:
        return "0xFF3B30"
    if word in {"secret", "important", "zaroori", "solution", "win", "growth"}:
        return "0x00FFFF"
    return ["0xFFFF00", "0x00FFFF", "0xFFFFFF"][abs(hash(word or "caption")) % 3]


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
    keep = []
    cursor = 0.0
    for start, end in cut_ranges:
        if start - cursor >= min_keep:
            keep.append((cursor, start))
        cursor = max(cursor, end)
    if duration - cursor >= min_keep:
        keep.append((cursor, duration))
    return keep or [(0.0, duration)]


def probe_duration(path: Path, ffprobe_path: str) -> float:
    process = subprocess.run(
        [ffprobe_path, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True,
        text=True,
    )
    try:
        value = float(process.stdout.strip())
        return value if math.isfinite(value) and value > 0 else 0.0
    except ValueError:
        return 0.0


def safe_id(value: Any) -> str:
    return re.sub(r"[^a-zA-Z0-9_-]+", "_", str(value or "video"))[:120]


def clean_word(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "", str(value or "").lower())


def to_float(value: Any) -> float | None:
    try:
        parsed = float(value)
        return parsed if math.isfinite(parsed) else None
    except (TypeError, ValueError):
        return None


def round_time(value: float) -> str:
    return f"{float(value):.3f}".rstrip("0").rstrip(".")


def escape_text(value: Any) -> str:
    return (
        str(value or "")
        .replace("\\", r"\\")
        .replace(":", r"\:")
        .replace("'", r"\'")
        .replace("%", r"\%")
        .replace("[", r"\[")
        .replace("]", r"\]")
    )


def cleanup_dir(path: Path) -> None:
    try:
        if path.exists():
            shutil.rmtree(path)
    except Exception:
        pass


if __name__ == "__main__":
    raise SystemExit(main())
