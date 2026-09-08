from pathlib import Path
from rembg import remove, new_session
from PIL import Image

ROOT = Path("public/assets/stickman")
OUT_ROOT = Path("public/assets/stickman-transparent")

FOLDERS = [
    "2d-teacher",
    "cartoon-teacher",
    "stickman-explainer",
]

session = new_session("u2netp")

for folder in FOLDERS:
    src_dir = ROOT / folder
    out_dir = OUT_ROOT / folder
    out_dir.mkdir(parents=True, exist_ok=True)

    for src in src_dir.glob("*.png"):
        out = out_dir / src.name
        print(f"Processing: {src} -> {out}")

        img = Image.open(src).convert("RGBA")
        result = remove(img, session=session)
        result.save(out)

print("Done. Transparent stickers saved in:", OUT_ROOT)
