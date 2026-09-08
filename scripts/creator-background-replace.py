#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

numba_cache_dir = Path(os.environ.get("NUMBA_CACHE_DIR") or Path.cwd() / ".tmp" / "numba-cache")
numba_cache_dir.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("NUMBA_CACHE_DIR", str(numba_cache_dir))

try:
    import cv2
    import numpy as np
    from PIL import Image
    from rembg import new_session, remove
except Exception as exc:
    print(
        "Missing Python dependencies for Creator Background Replace. "
        "Install: pip install rembg opencv-python pillow numpy onnxruntime",
        file=sys.stderr,
    )
    print(str(exc), file=sys.stderr)
    sys.exit(12)


PREVIEW_WIDTH = 1080
PREVIEW_HEIGHT = 1920


def main():
    parser = argparse.ArgumentParser(description="Remove creator video background and composite over an uploaded image.")
    parser.add_argument("--input-video", required=True)
    parser.add_argument("--background-image", required=True)
    parser.add_argument("--output-video", required=True)
    parser.add_argument("--settings", required=True)
    parser.add_argument("--ffmpeg", required=True)
    parser.add_argument("--max-seconds", type=float, default=60)
    args = parser.parse_args()

    settings = read_settings(args.settings)
    cap = cv2.VideoCapture(args.input_video)
    if not cap.isOpened():
        raise RuntimeError("Could not open input video.")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 30)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if width <= 0 or height <= 0:
        raise RuntimeError("Input video has invalid dimensions.")
    if fps <= 0 or fps > 240:
        fps = 30

    max_frames = int(max(1, args.max_seconds) * fps)
    frame_limit = min(total_frames, max_frames) if total_frames > 0 else max_frames
    bg_frame = build_background(args.background_image, width, height, settings)
    session = new_session("u2net_human_seg")

    with tempfile.TemporaryDirectory(prefix="itnavideo-bg-replace-") as temp_dir:
        silent_path = str(Path(temp_dir) / "silent.mp4")
        writer = cv2.VideoWriter(
            silent_path,
            cv2.VideoWriter_fourcc(*"mp4v"),
            fps,
            (width, height),
        )
        if not writer.isOpened():
            raise RuntimeError("Could not create temporary video writer.")

        frame_index = 0
        try:
            while frame_index < frame_limit:
                ok, frame = cap.read()
                if not ok:
                    break
                cutout = remove_background(frame, session)
                composed = composite_creator(bg_frame, cutout, width, height, settings)
                writer.write(composed)
                frame_index += 1
        finally:
            writer.release()
            cap.release()

        if frame_index <= 0:
            raise RuntimeError("No frames were processed from the input video.")

        mux_audio(args.ffmpeg, silent_path, args.input_video, args.output_video, fps)


def read_settings(path):
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    return {
        "backgroundFit": "contain" if data.get("backgroundFit") == "contain" else "cover",
        "backgroundScale": finite_number(data.get("backgroundScale"), 1.0, 0.2, 4.0),
        "backgroundX": finite_number(data.get("backgroundX"), 0.0, -3000.0, 3000.0),
        "backgroundY": finite_number(data.get("backgroundY"), 0.0, -3000.0, 3000.0),
        "creatorScale": finite_number(data.get("creatorScale"), 1.0, 0.2, 4.0),
        "creatorX": finite_number(data.get("creatorX"), 0.0, -3000.0, 3000.0),
        "creatorY": finite_number(data.get("creatorY"), 0.0, -3000.0, 3000.0),
    }


def finite_number(value, fallback, minimum, maximum):
    try:
        number = float(value)
    except Exception:
        return fallback
    if not np.isfinite(number):
        return fallback
    return max(minimum, min(maximum, number))


def build_background(path, width, height, settings):
    image = Image.open(path).convert("RGB")
    source_width, source_height = image.size
    fit_scale = max(width / source_width, height / source_height)
    if settings["backgroundFit"] == "contain":
        fit_scale = min(width / source_width, height / source_height)
    scale = fit_scale * settings["backgroundScale"]
    resized_width = max(1, int(round(source_width * scale)))
    resized_height = max(1, int(round(source_height * scale)))
    image = image.resize((resized_width, resized_height), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (width, height), (10, 10, 10))
    offset_x = int(round((width - resized_width) / 2 + scale_x(settings["backgroundX"], width)))
    offset_y = int(round((height - resized_height) / 2 + scale_y(settings["backgroundY"], height)))
    canvas.paste(image, (offset_x, offset_y))
    return cv2.cvtColor(np.array(canvas), cv2.COLOR_RGB2BGR)


def remove_background(frame_bgr, session):
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    source = Image.fromarray(frame_rgb)
    result = remove(source, session=session).convert("RGBA")
    return np.array(result)


def composite_creator(background_bgr, cutout_rgba, width, height, settings):
    scale = settings["creatorScale"]
    creator_width = max(1, int(round(width * scale)))
    creator_height = max(1, int(round(height * scale)))
    creator = Image.fromarray(cutout_rgba, "RGBA").resize((creator_width, creator_height), Image.Resampling.LANCZOS)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    offset_x = int(round((width - creator_width) / 2 + scale_x(settings["creatorX"], width)))
    offset_y = int(round(height - creator_height + scale_y(settings["creatorY"], height)))
    overlay.paste(creator, (offset_x, offset_y), creator)

    base = Image.fromarray(cv2.cvtColor(background_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    base.alpha_composite(overlay)
    return cv2.cvtColor(np.array(base.convert("RGB")), cv2.COLOR_RGB2BGR)


def scale_x(value, width):
    return value * (width / PREVIEW_WIDTH)


def scale_y(value, height):
    return value * (height / PREVIEW_HEIGHT)


def mux_audio(ffmpeg, silent_video, original_video, output_video, fps):
    command = [
        ffmpeg,
        "-y",
        "-i",
        silent_video,
        "-i",
        original_video,
        "-map",
        "0:v:0",
        "-map",
        "1:a:0?",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-r",
        f"{fps:.6f}",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        "-movflags",
        "+faststart",
        output_video,
    ]
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr[-2000:])


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
