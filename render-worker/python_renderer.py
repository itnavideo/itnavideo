#!/usr/bin/env python3
"""Builds advanced FFmpeg filter graphs for the Itnavideo render worker.

The Node worker still downloads assets and runs FFmpeg. Python is used as a
backend planner for richer, easier-to-evolve editing logic: animated text cards,
mobile captions, color treatment, and voice audio polish.
"""

from __future__ import annotations

import json
import math
import subprocess
import re
import sys
from pathlib import Path
from typing import Any

try:
    import ffmpeg as ffmpeg_python  # type: ignore
except Exception:
    ffmpeg_python = None

try:
    import moviepy  # type: ignore
except Exception:
    moviepy = None

WIDTH = 1080
HEIGHT = 1920
FPS = 30


def main() -> int:
    if len(sys.argv) == 4 and sys.argv[1] == "--render":
        request_path = Path(sys.argv[2])
        response_path = Path(sys.argv[3])
        payload = json.loads(request_path.read_text(encoding="utf-8"))
        result = render_video(payload)
        response_path.write_text(json.dumps(result, ensure_ascii=True), encoding="utf-8")
        return 0

    if len(sys.argv) != 3:
        raise SystemExit("Usage: python_renderer.py <request.json> <response.json> or python_renderer.py --render <request.json> <response.json>")

    request_path = Path(sys.argv[1])
    response_path = Path(sys.argv[2])
    payload = json.loads(request_path.read_text(encoding="utf-8"))
    plan = build_render_plan(payload)
    response_path.write_text(json.dumps(plan, ensure_ascii=True), encoding="utf-8")
    return 0


def render_video(payload: dict[str, Any]) -> dict[str, Any]:
    output_path = str(payload.get("outputPath") or "").strip()
    if not output_path:
        return {"success": False, "error": "outputPath is required"}

    if ffmpeg_python is None:
        return {"success": False, "error": "ffmpeg-python is not installed"}

    plan = build_render_plan(payload)
    args = build_ffmpeg_args(payload, plan, output_path)

    try:
        process = subprocess.run(args, capture_output=True, text=True, timeout=int(float(payload.get("timeoutMs") or 900)))
    except subprocess.TimeoutExpired as error:
        return {"success": False, "error": f"Python FFmpeg render timed out: {error}"}

    if process.returncode != 0:
        return {
            "success": False,
            "error": f"Python FFmpeg render failed with code {process.returncode}: {(process.stderr or process.stdout)[-4000:]}",
            "engine": "python-ffmpeg",
        }

    return {
        "success": True,
        "engine": "python-ffmpeg",
        "outputPath": output_path,
        "features": plan.get("features", []),
        "pythonWrappers": plan.get("pythonWrappers", {}),
    }


def build_ffmpeg_args(payload: dict[str, Any], plan: dict[str, Any], output_path: str) -> list[str]:
    assets = payload.get("assets") or {}
    profile = payload.get("profile") or {}
    all_inputs = assets.get("allInputs") or []
    ffmpeg_path = str(payload.get("ffmpegPath") or "ffmpeg")
    width = int(profile.get("width") or WIDTH)
    height = int(profile.get("height") or HEIGHT)
    fps = int(profile.get("fps") or FPS)
    preset = str(profile.get("preset") or "ultrafast")
    crf = str(profile.get("crf") or 26)
    audio_bitrate = str(profile.get("audioBitrate") or "128k")

    args = [ffmpeg_path, "-y", "-hide_banner", "-stats"]

    for input_asset in all_inputs:
        duration = round_time(max(float(input_asset.get("duration") or 1), 0.5))
        generated_color = input_asset.get("generatedColor")
        if generated_color:
            args.extend([
                "-f",
                "lavfi",
                "-t",
                duration,
                "-i",
                f"color=c={generated_color}:s={width}x{height}:r={fps}",
            ])
            continue

        if input_asset.get("isImage"):
            args.extend(["-loop", "1", "-t", duration])

        asset_path = str(input_asset.get("path") or "").strip()
        if not asset_path:
            raise ValueError("Renderable input is missing path")
        args.extend(["-i", asset_path])

    args.extend([
        "-filter_complex",
        str(plan["filterGraph"]),
        "-map",
        str(plan.get("videoMap") or "[v_base]"),
        "-map",
        str(plan.get("audioMap") or "[a_final]"),
        "-c:v",
        "libx264",
        "-preset",
        preset,
        "-threads",
        "0",
        "-crf",
        crf,
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        audio_bitrate,
        "-movflags",
        "+faststart",
        output_path,
    ])

    return args


def build_render_plan(payload: dict[str, Any]) -> dict[str, Any]:
    timeline = payload.get("timeline") or {}
    assets = payload.get("assets") or {}
    scenes = timeline.get("scenes") or []
    captions = timeline.get("captions") or []
    total_duration = max(float(payload.get("totalDuration") or 0), 0.5)

    filters: list[str] = []
    scene_labels: list[str] = []

    for index, scene in enumerate(scenes):
        input_asset = (assets.get("sceneInputs") or [])[index]
        label = f"pyv{index}"
        duration = max(float(scene.get("end") or 0) - float(scene.get("start") or 0), 0.5)
        scene_labels.append(f"[{label}]")
        filters.append(build_scene_filter(scene, input_asset, label, duration, index, timeline))

    if scene_labels:
        filters.append(f"{''.join(scene_labels)}concat=n={len(scene_labels)}:v=1:a=0[py_v_concat]")
    else:
        filters.append(f"color=c=0x050506:s={WIDTH}x{HEIGHT}:r={FPS}:d={total_duration}[py_v_concat]")

    filters.append(build_caption_filter(captions, "py_v_concat", "v_base"))
    filters.append(build_audio_filter(assets, total_duration))

    return {
        "engine": "python",
        "filterGraph": ";".join(filters),
        "videoMap": "[v_base]",
        "audioMap": "[a_final]",
        "features": [
            "animated_text_cards",
            "dynamic_caption_sizing",
            "mobile_color_grade",
            "voice_loudness_polish",
        ],
        "pythonWrappers": {
            "ffmpegPython": ffmpeg_python is not None,
            "moviepy": moviepy is not None,
        },
    }


def build_scene_filter(
    scene: dict[str, Any],
    input_asset: dict[str, Any],
    label: str,
    duration: float,
    index: int,
    timeline: dict[str, Any],
) -> str:
    frame = input_asset.get("safeFrame") or {"width": 1080, "height": 1350, "x": 0, "y": 285}
    safe_width = int(frame.get("width") or 1080)
    safe_height = int(frame.get("height") or 1350)
    safe_x = int(frame.get("x") or 0)
    safe_y = int(frame.get("y") or 285)
    input_index = int(input_asset.get("inputIndex") or 0)
    text_card = input_asset.get("textCard") or build_fallback_text_card(scene, index)
    style = get_style_name(timeline, scene)

    base = (
        f"[{input_index}:v]"
        f"scale={safe_width}:{safe_height}:force_original_aspect_ratio=decrease,"
        f"pad={safe_width}:{safe_height}:(ow-iw)/2:(oh-ih)/2:color=black,"
        f"setsar=1,trim=duration={round_time(duration)},setpts=PTS-STARTPTS,format=yuv420p[{label}_safe];"
        f"color=c=black:s={WIDTH}x{HEIGHT}:r={FPS}:d={round_time(duration)}[{label}_canvas];"
        f"[{label}_canvas][{label}_safe]overlay=x={safe_x}:y={safe_y}:shortest=1[{label}_framed];"
        f"[{label}_framed]{color_grade_filter(style)}[{label}_grade];"
        f"[{label}_grade]vignette=angle=PI/5:eval=frame[{label}_look];"
        f"[{label}_look]{build_text_card_chain(text_card, label, duration)}"
    )
    return base


def build_text_card_chain(text_card: dict[str, Any], output_label: str, duration: float) -> str:
    headline = split_text(text_card.get("headline") or "Your idea becomes a video", 22)[:3]
    body = split_text(text_card.get("body") or "", 34)[:2]
    eyebrow = split_text(text_card.get("eyebrow") or "", 28)[:1]
    accent = color(text_card.get("accentColor") or "0x5eead4")
    headline_color = color(text_card.get("headlineColor") or "0xffffff")
    body_color = color(text_card.get("bodyColor") or "0xe5e7eb")
    shadow = color(text_card.get("strokeColor") or "0x000000")
    panel = panel_color(text_card.get("panelColor") or "black@0.50")

    chain = [
        f"drawbox=x=72:y=226:w=936:h=10:color={accent}:t=fill",
    ]

    if eyebrow:
        chain.append(
            "drawtext="
            f"text='{escape_text(eyebrow[0].upper())}':fontcolor={accent}:fontsize=34:"
            f"x={animated_x(72)}:y={animated_y(252)}:shadowcolor={shadow}:shadowx=2:shadowy=2:"
            f"alpha='{fade_alpha(0.06, 0.28)}'"
        )

    for line_index, line in enumerate(headline):
        font_size = dynamic_font_size(line, 82, 54)
        chain.append(
            "drawtext="
            f"text='{escape_text(line)}':fontcolor={headline_color}:fontsize={font_size}:"
            f"x={animated_x(72)}:y={animated_y(318 + line_index * 92)}:"
            f"borderw=3:bordercolor={shadow}:shadowcolor={shadow}:shadowx=3:shadowy=4:"
            f"box=1:boxcolor={panel}:boxborderw=18:fix_bounds=1:"
            f"alpha='{fade_alpha(0.10 + line_index * 0.05, 0.32)}'"
        )

    for line_index, line in enumerate(body):
        y = min(780, 634 + len(headline) * 24 + line_index * 58)
        chain.append(
            "drawtext="
            f"text='{escape_text(line)}':fontcolor={body_color}:fontsize={dynamic_font_size(line, 44, 34)}:"
            f"x={animated_x(72)}:y={animated_y(y)}:"
            f"borderw=2:bordercolor={shadow}:shadowcolor={shadow}:shadowx=2:shadowy=3:"
            f"fix_bounds=1:alpha='{fade_alpha(0.22 + line_index * 0.05, 0.30)}'"
        )

    if duration > 1.2:
        chain.append(f"fade=t=in:st=0:d=0.16,fade=t=out:st={round_time(max(duration - 0.18, 0))}:d=0.18")

    return ",".join(chain) + f"[{output_label}]"


def build_caption_filter(captions: list[dict[str, Any]], input_label: str, output_label: str) -> str:
    cues = normalize_captions(captions)
    if not cues:
        return f"[{input_label}]null[{output_label}]"

    draw_filters: list[str] = []
    for cue in cues[:140]:
        lines = split_text(cue["text"], 27)[:2]
        base_y = 1392 if len(lines) > 1 else 1444
        for line_index, line in enumerate(lines):
            font_size = dynamic_font_size(line, 66, 48)
            start = cue["start"]
            end = cue["end"]
            pop_end = min(end, start + 0.18)
            draw_filters.append(
                "drawtext="
                f"text='{escape_text(line)}':fontcolor=white:fontsize={font_size}:"
                f"x=(w-text_w)/2:y={base_y + line_index * 74}:"
                "box=1:boxcolor=black@0.62:boxborderw=24:"
                "borderw=2:bordercolor=black:shadowcolor=black:shadowx=3:shadowy=4:"
                f"enable='between(t,{round_time(start)},{round_time(end)})':"
                f"alpha='{caption_alpha(start, pop_end, end)}':fix_bounds=1"
            )

    return f"[{input_label}]{','.join(draw_filters)}[{output_label}]"


def build_audio_filter(assets: dict[str, Any], total_duration: float) -> str:
    voice = assets.get("voiceover")
    if not voice:
        return f"anullsrc=r=44100:cl=stereo:d={round_time(total_duration)}[a_final]"

    index = int(voice.get("index") or 0)
    return (
        f"[{index}:a]"
        "aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,"
        "highpass=f=80,lowpass=f=15500,"
        "acompressor=threshold=-18dB:ratio=2.8:attack=8:release=120:makeup=2,"
        "loudnorm=I=-16:TP=-1.5:LRA=11,"
        f"atrim=duration={round_time(total_duration)}[a_final]"
    )


def color_grade_filter(style: str) -> str:
    style = style.lower()
    if "cinematic" in style:
        return "eq=contrast=1.10:saturation=0.92:brightness=-0.018,unsharp=5:5:0.45"
    if "luxury" in style:
        return "eq=contrast=1.13:saturation=0.84:gamma=0.97,unsharp=5:5:0.38"
    if "meme" in style or "fast" in style or "reels" in style:
        return "eq=contrast=1.08:saturation=1.16:brightness=0.010,unsharp=5:5:0.55"
    return "eq=contrast=1.06:saturation=1.05,unsharp=5:5:0.40"


def normalize_captions(captions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    for caption in captions or []:
        text = " ".join(str(caption.get("text") or "").split())
        start = to_float(caption.get("start"))
        end = to_float(caption.get("end"))
        if text and math.isfinite(start) and math.isfinite(end) and end > start:
            normalized.append({"text": text, "start": round(start, 3), "end": round(end, 3)})
    return normalized


def split_text(value: Any, max_chars: int) -> list[str]:
    words = re.sub(r"\s+", " ", str(value or "").strip()).split(" ")
    lines: list[str] = []
    current = ""
    for word in [w for w in words if w]:
        next_line = f"{current} {word}".strip()
        if len(next_line) > max_chars and current:
            lines.append(current)
            current = word
        else:
            current = next_line
    if current:
        lines.append(current)
    return lines


def dynamic_font_size(line: str, large: int, small: int) -> int:
    length = len(line)
    if length <= 16:
        return large
    if length >= 32:
        return small
    scale = (length - 16) / 16
    return round(large - (large - small) * scale)


def fade_alpha(start: float, duration: float) -> str:
    end = start + duration
    return escape_expr(f"if(lt(t,{start:.2f}),0,if(lt(t,{end:.2f}),(t-{start:.2f})/{duration:.2f},1))")


def caption_alpha(start: float, pop_end: float, end: float) -> str:
    fade_out_start = max(start, end - 0.16)
    return escape_expr(
        f"if(lt(t,{start:.3f}),0,if(lt(t,{pop_end:.3f}),(t-{start:.3f})/{max(pop_end-start,0.01):.3f},"
        f"if(gt(t,{fade_out_start:.3f}),max(0,({end:.3f}-t)/{max(end-fade_out_start,0.01):.3f}),1)))"
    )


def animated_x(base: int) -> str:
    return escape_expr(f"{base}-36*if(lt(t,0.45),(0.45-t)/0.45,0)")


def animated_y(base: int) -> str:
    return escape_expr(f"{base}-18*if(lt(t,0.45),(0.45-t)/0.45,0)")


def escape_expr(value: str) -> str:
    return value.replace(",", r"\,")


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


def color(value: Any) -> str:
    raw = str(value or "").strip()
    if re.match(r"^0x[0-9a-fA-F]{6}$", raw):
        return raw
    if re.match(r"^#[0-9a-fA-F]{6}$", raw):
        return f"0x{raw[1:]}"
    return "0xffffff"


def panel_color(value: Any) -> str:
    raw = str(value or "").strip()
    if re.match(r"^(black|white|0x[0-9a-fA-F]{6}|#[0-9a-fA-F]{6})(@\d?(?:\.\d+)?)?$", raw):
        return color(raw) if raw.startswith("#") else raw
    return "black@0.50"


def build_fallback_text_card(scene: dict[str, Any], index: int) -> dict[str, Any]:
    return {
        "headline": scene.get("role") or f"Scene {index + 1}",
        "body": ((scene.get("source") or {}).get("query") or "AI-built visual scene from your voiceover."),
        "accentColor": "0x5eead4" if index % 2 == 0 else "0xfbbf24",
        "headlineColor": "0xffffff",
        "bodyColor": "0xe5e7eb",
        "strokeColor": "0x000000",
        "panelColor": "black@0.50",
    }


def get_style_name(timeline: dict[str, Any], scene: dict[str, Any]) -> str:
    metadata = timeline.get("metadata") or {}
    template = metadata.get("template") or {}
    return str(
        scene.get("editingStyle")
        or metadata.get("editingStyle")
        or template.get("editingStyle")
        or template.get("style")
        or ""
    )


def to_float(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return float("nan")


def round_time(value: float) -> str:
    return f"{float(value):.3f}".rstrip("0").rstrip(".")


if __name__ == "__main__":
    raise SystemExit(main())
