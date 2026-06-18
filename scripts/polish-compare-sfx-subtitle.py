from pathlib import Path
import re

p = Path("remotion/templates/COMPARE_EXPLAINER/template.tsx")
c = p.read_text(encoding="utf-8")

backup = Path("backup/compare-template-before-sfx-subtitle-polish.txt")
backup.parent.mkdir(exist_ok=True)
backup.write_text(c, encoding="utf-8")

# 1) Replace CompareSfxLayer safely
start = c.find("const CompareSfxLayer = () => {")
if start == -1:
    raise SystemExit("CompareSfxLayer not found")

end = c.find("\n};", start)
if end == -1:
    raise SystemExit("CompareSfxLayer end not found")
end = end + len("\n};")

new_sfx = r'''const CompareSfxLayer = () => {
  const whoosh = findSfx(/whoosh|woosh|swoosh|swish|riser|jet/i) || COMPARE_SFX[0] || '';
  const pop = findSfx(/pop|click|tap|snap|shutter|mouse/i) || COMPARE_SFX[1] || whoosh;
  const ding = findSfx(/ding|chime|bell|notification|kaching|cash/i) || COMPARE_SFX[2] || pop;

  return (
    <>
      {whoosh ? (
        <Sequence from={0} durationInFrames={26}>
          <Audio src={staticFile(whoosh)} volume={0.38} />
        </Sequence>
      ) : null}

      {pop ? (
        <Sequence from={12} durationInFrames={18}>
          <Audio src={staticFile(pop)} volume={0.32} />
        </Sequence>
      ) : null}

      {whoosh ? (
        <Sequence from={58} durationInFrames={24}>
          <Audio src={staticFile(whoosh)} volume={0.30} />
        </Sequence>
      ) : null}

      {pop ? (
        <Sequence from={96} durationInFrames={18}>
          <Audio src={staticFile(pop)} volume={0.28} />
        </Sequence>
      ) : null}

      {whoosh ? (
        <Sequence from={150} durationInFrames={24}>
          <Audio src={staticFile(whoosh)} volume={0.28} />
        </Sequence>
      ) : null}

      {ding ? (
        <Sequence from={220} durationInFrames={28}>
          <Audio src={staticFile(ding)} volume={0.30} />
        </Sequence>
      ) : null}
    </>
  );
};'''

c = c[:start] + new_sfx + c[end:]

# 2) Add short subtitle helper if missing
if "const makeShortSubtitle =" not in c:
    helper = r'''
const makeShortSubtitle = (value: string) => {
  const words = cleanText(value, 95).split(/\s+/).filter(Boolean);

  if (words.length <= 6) return words.join(' ');

  const maxWords = 7;
  const selected = words.slice(0, 14);
  const first = selected.slice(0, maxWords).join(' ');
  const second = selected.slice(maxWords, maxWords * 2).join(' ');

  return second ? `${first}\n${second}` : first;
};

'''
    marker = "const getCaptionText ="
    pos = c.find(marker)
    if pos == -1:
        raise SystemExit("getCaptionText marker not found")
    c = c[:pos] + helper + c[pos:]

# 3) Wrap getCaptionText return values with makeShortSubtitle safely
start = c.find("const getCaptionText =")
if start == -1:
    raise SystemExit("getCaptionText not found")

end = c.find("\n};", start)
if end == -1:
    raise SystemExit("getCaptionText end not found")
end = end + len("\n};")

fn = c[start:end]

# Only patch if not already using makeShortSubtitle inside function
if "makeShortSubtitle(" not in fn:
    fn = re.sub(r"return\s+cleanText\(([^;]+)\);", r"return makeShortSubtitle(\1);", fn)
    fn = re.sub(r"return\s+([^;\n]+\.join\([^;]+);", r"return makeShortSubtitle(\1", fn)

# stronger fallback: replace common final returns
fn = fn.replace("return cleanText(activeCaption.text || activeCaption.lines?.join(' ') || '');", "return makeShortSubtitle(activeCaption.text || activeCaption.lines?.join(' ') || '');")
fn = fn.replace("return cleanText(activeOverlay.text || activeOverlay.body || activeOverlay.title || '');", "return makeShortSubtitle(activeOverlay.text || activeOverlay.body || activeOverlay.title || '');")
fn = fn.replace("return cleanText(transcript || sourceScript || '');", "return makeShortSubtitle(transcript || sourceScript || '');")

c = c[:start] + fn + c[end:]

# 4) Slightly reduce subtitle font if still too big
c = c.replace("fontSize: 52,", "fontSize: 48,")
c = c.replace("fontWeight: 800,", "fontWeight: 750,")
c = c.replace("padding: '16px 28px',", "padding: '14px 24px',")

p.write_text(c, encoding="utf-8")
print("SFX + subtitle polish applied.")
