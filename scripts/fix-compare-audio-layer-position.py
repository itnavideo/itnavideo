from pathlib import Path
import re

p = Path("remotion/templates/COMPARE_EXPLAINER/template.tsx")
c = p.read_text(encoding="utf-8")

backup = Path("backup/compare-template-before-fix-audio-layer-position.txt")
backup.parent.mkdir(exist_ok=True)
backup.write_text(c, encoding="utf-8")

fn_name = "function CompareAudioSfxLayer"
start = c.find(fn_name)

audio_fn = ""

if start != -1:
    brace_start = c.find("{", start)
    if brace_start == -1:
        raise SystemExit("CompareAudioSfxLayer opening brace not found")

    depth = 0
    end = None

    for i in range(brace_start, len(c)):
        ch = c[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break

    if end is None:
        raise SystemExit("CompareAudioSfxLayer closing brace not found")

    audio_fn = c[start:end].strip()
    c = c[:start] + c[end:]
else:
    audio_fn = r'''
function CompareAudioSfxLayer({audioUrl}: {audioUrl?: string}) {
  const {durationInFrames} = useVideoConfig();

  const sfx = [
    {src: "/assets/sfx/compare/compare-riser.mp3", from: 0, volume: 0.08},
    {src: "/assets/sfx/compare/compare-whoosh.mp3", from: 10, volume: 0.16},
    {src: "/assets/sfx/compare/compare-click.mp3", from: Math.floor(durationInFrames * 0.22), volume: 0.14},
    {src: "/assets/sfx/compare/compare-whoosh.mp3", from: Math.floor(durationInFrames * 0.46), volume: 0.12},
    {src: "/assets/sfx/compare/compare-click.mp3", from: Math.floor(durationInFrames * 0.68), volume: 0.12},
    {src: "/assets/sfx/compare/compare-ding.mp3", from: Math.max(0, durationInFrames - 28), volume: 0.12},
  ];

  return (
    <>
      {audioUrl ? <Audio src={audioUrl} volume={1} /> : null}

      {sfx.map((item, index) => {
        if (item.from >= durationInFrames) return null;

        return (
          <Sequence
            key={`${item.src}-${index}`}
            from={item.from}
            durationInFrames={Math.max(1, durationInFrames - item.from)}
          >
            <Audio src={staticFile(item.src)} volume={item.volume} />
          </Sequence>
        );
      })}
    </>
  );
}
'''.strip()

# Ensure Remotion import has all needed imports
m = re.search(r'import\s*\{([^}]*)\}\s*from\s*["\']remotion["\'];', c)
if not m:
    raise SystemExit("Remotion import not found")

items = [x.strip() for x in m.group(1).split(",") if x.strip()]
for needed in ["Audio", "Sequence", "staticFile", "useVideoConfig"]:
    if needed not in items:
        items.append(needed)

new_import = "import {" + ", ".join(items) + '} from "remotion";'
c = c[:m.start()] + new_import + c[m.end():]

# Insert function after Remotion import
m2 = re.search(r'import\s*\{[^}]*\}\s*from\s*["\']remotion["\'];', c)
insert_at = m2.end()
c = c[:insert_at] + "\n\n" + audio_fn + "\n" + c[insert_at:]

# Ensure layer exists before StickerPresenter
if "<CompareAudioSfxLayer" not in c:
    c = c.replace(
        "      <StickerPresenter",
        '      <CompareAudioSfxLayer audioUrl={(props as any).audioUrl || (props as any).sourceAudioUrl || (props as any).mediaUrl} />\n\n      <StickerPresenter',
        1,
    )

# Remove accidental duplicate blank function copies if any
c = re.sub(r'\n{3,}', '\n\n', c)

p.write_text(c, encoding="utf-8")
print("Fixed CompareAudioSfxLayer position and imports.")
