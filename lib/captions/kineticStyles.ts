// lib/captions/kineticStyles.ts
// Master registry of all 50 Kinetic Caption Styles from Claude AI (Single-word, Line, Stacks, Typewriter, Editorial)

export type KineticLayoutType = "o" | "l" | "s" | "t" | "e"; // o=one word, l=line, s=stack, t=typewriter, e=editorial

export interface KineticCaptionWord {
  word: string;
  start: number;
  end: number;
  isKeyword?: boolean;
}

export interface KineticStyleDefinition {
  index: number;
  id: string;
  name: string;
  layout: KineticLayoutType;
  chunk: number;
  flags: string; // u=upper, l=lower, r=reveal
  wordCss: string;
  activeCss: string;
  pastCss: string;
  futureCss: string;
  animation: string;
  extraCss: string;
  category: "Single Word" | "Line Captions" | "Stacks" | "Typewriter" | "Editorial";
}

const K = "-webkit-text-stroke:.07em #000;paint-order:stroke fill;";
const AN = "Anton,Impact,sans-serif";
const MO = "Montserrat,sans-serif";
const SH = "text-shadow:0 .05em .15em #000";

const RAW_CF: Array<[string, KineticLayoutType, number, string, string, string, string, string, string, string]> = [
  ["Pop Word", "o", 1, "u", "font:1.35em/1 " + AN + ";" + K + "text-shadow:0 .06em 0 #000", "", "", "", "pop", ""],
  ["Slam Headline", "o", 1, "u", "font:1.55em/1 " + AN + ";" + K + "text-shadow:0 .07em 0 #000", "", "", "", "slam", ""],
  ["Zoom Punch", "o", 1, "u", 'font:1.9em/1 "Bebas Neue",' + AN + ";text-shadow:0 .05em .12em #000", "", "", "", "zoom", ""],
  ["Drop Bounce", "o", 1, "u", "font:1.4em/1 Bangers," + AN + ";color:#ffe14d;" + K + "letter-spacing:.03em", "", "", "", "drop", ""],
  ["Marker Tag", "o", 1, "", 'font:1.15em/1 "Permanent Marker",cursive;color:#111;background:var(--a);padding:.05em .3em;transform:rotate(-3deg)', "", "", "", "pop", ""],
  ["Glitch", "o", 1, "u", "font:1.4em/1 " + AN + ";text-shadow:.04em 0 #f0f,-.04em 0 #0ff", "", "", "", "glitch", ""],
  ["Flip Card", "o", 1, "u", "font:900 1.15em/1 " + MO + ";" + SH, "", "", "", "flip", ""],
  ["Blur Reveal", "o", 1, "l", "font:800 1.1em/1 " + MO + ";" + SH, "", "", "", "bi", ""],
  ["Spin In", "o", 1, "u", "font:1.4em/1 " + AN + ";" + K, "", "", "", "spin", ""],
  ["Outline Only", "o", 1, "u", "font:1.5em/1 " + AN + ";color:transparent;-webkit-text-stroke:.04em #fff", "", "", "", "pop", "& .k{color:var(--a);-webkit-text-stroke:0}"],
  ["Gradient Word", "o", 1, "u", "font:900 1.3em/1 " + MO + ";background:linear-gradient(90deg,#ff5ea8,#ffb347);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .04em .06em #0008)", "", "", "", "pop", "& .k{background:none;color:var(--a)}"],
  ["Serif Italic", "o", 1, "l", 'font:italic 800 1.3em/1 "Playfair Display",serif;' + SH, "", "", "", "bi", ""],
  ["Retro Shadow", "o", 1, "u", "font:1.4em/1 " + AN + ";color:var(--a);text-shadow:.05em .05em 0 #ff4d6d,.1em .1em 0 #000", "", "", "", "pop", "& .k{color:#fff}"],
  ["Sticker", "o", 1, "u", "font:1.2em/1 Bangers," + AN + ";color:#111;background:#fff;border:.08em solid #111;border-radius:.3em;padding:.05em .3em;box-shadow:.08em .08em 0 #000;transform:rotate(-2deg)", "", "", "", "pop", "& .k{color:#d91b5c}"],
  ["3D Extrude", "o", 1, "u", "font:1.5em/1 " + AN + ";text-shadow:0 .02em 0 #ccc,0 .04em 0 #aaa,0 .06em 0 #888,0 .08em 0 #666,0 .12em .15em #000", "", "", "", "zoom", ""],
  ["Terminal Tag", "o", 1, "l", "font:700 .9em/1 ui-monospace,Menlo,monospace;color:var(--a);background:#000;padding:.15em .45em;border-left:.2em solid var(--a)", "", "", "", "up", ""],
  ["Wipe Reveal", "o", 1, "u", "font:900 1.2em/1 " + MO + ";" + SH, "", "", "", "wipe", ""],
  ["Whisper", "o", 1, "l", "font:500 .8em/1 " + MO + ";letter-spacing:.25em;" + SH, "", "", "", "bi", ""],
  ["Heartbeat", "o", 1, "u", "font:1.4em/1 " + AN + ";" + K, "", "", "", "beat", "& .on{animation:beat .5s infinite}"],
  ["Underline Swipe", "o", 1, "u", "font:900 1.2em/1 " + MO + ";padding-bottom:.05em;border-bottom:.14em solid var(--a);" + SH, "", "", "", "wipe", ""],
  ["Karaoke Line", "l", 4, "", "font:800 .75em " + MO + ";opacity:.6;" + SH, "color:var(--a);opacity:1;transform:scale(1.15)", "opacity:1", "", "", ""],
  ["Box Highlight", "l", 3, "u", "font:800 .72em " + MO + ";padding:.06em .3em;border-radius:.25em;background:rgba(0,0,0,.55);margin:.08em", "background:var(--a);color:#000;transform:scale(1.08)", "", "", "", ""],
  ["Neon Glow", "l", 3, "l", "font:700 .85em " + MO + ";color:#fff5", "color:#fff;text-shadow:0 0 .1em #fff,0 0 .3em var(--a),0 0 .7em var(--a),0 0 1.2em var(--a)", "color:#fffc", "", "", ""],
  ["Pill Highlight", "l", 4, "", "font:800 .72em " + MO + ";padding:.05em .4em;border-radius:2em;" + SH, "background:#fff;color:#111;text-shadow:none", "", "", "", ""],
  ["Underline Track", "l", 4, "", "font:800 .75em " + MO + ";opacity:.65;" + SH + ";border-bottom:.12em solid transparent", "border-bottom-color:var(--a);opacity:1", "opacity:1", "", "", ""],
  ["Color Fill", "l", 4, "u", "font:900 .8em " + MO + ";" + SH, "color:#fff", "color:var(--a)", "", "", ""],
  ["Bold Pop Caption", "l", 3, "u", "font:.95em/1 " + AN + ";" + K, "color:var(--a);transform:scale(1.25)", "", "", "pop", ""],
  ["Subtitle Classic", "l", 6, "", "font:500 .55em " + MO, "font-weight:800", "", "opacity:.7", "", "&{background:rgba(0,0,0,.65);padding:.4em .6em;border-radius:.3em}"],
  ["Highlighter", "l", 4, "", "font:800 .75em " + MO + ";padding:0 .15em;" + SH, "background:linear-gradient(transparent 50%,var(--a) 50%)", "", "", "", ""],
  ["Build Up", "l", 5, "r", "font:800 .8em " + MO + ";" + SH, "", "", "", "pop", ""],
  ["Slide Words", "l", 3, "ur", "font:.95em/1 " + AN + ";" + K, "color:var(--a)", "", "", "up", ""],
  ["Rainbow", "l", 4, "", "font:900 .8em " + MO + ";" + SH + ";opacity:.7", "color:#f33;opacity:1;animation:hue .8s linear infinite;transform:scale(1.12)", "opacity:1", "", "", ""],
  ["Shadow Lift", "l", 3, "u", "font:900 .75em " + MO + ";text-shadow:0 .05em .1em #000", "transform:translateY(-.15em) scale(1.1);text-shadow:0 .25em .3em #000;color:var(--a)", "", "", "", ""],
  ["Blur Focus", "l", 4, "", "font:800 .8em " + MO + ";" + SH, "transform:scale(1.1)", "filter:blur(.05em);opacity:.5", "filter:blur(.05em);opacity:.5", "", ""],
  ["Strike Past", "l", 4, "", "font:800 .75em " + MO + ";" + SH, "color:var(--a)", "text-decoration:line-through;opacity:.5", "", "", ""],
  ["Outline Fill", "l", 3, "u", "font:.95em/1 " + AN, "color:var(--a)", "color:#fff", "color:transparent;-webkit-text-stroke:.03em #fff", "", ""],
  ["Bounce Active", "l", 4, "", "font:800 .75em " + MO + ";" + SH, "color:var(--a);animation:bnc .35s ease-out", "", "", "", ""],
  ["Gold Luxe", "l", 4, "l", 'font:italic 800 .8em "Playfair Display",serif;' + SH + ";opacity:.7", "background:linear-gradient(#fff2a8,#d4a017);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:1;text-shadow:none;filter:drop-shadow(0 .04em .06em #000)", "opacity:1", "", "", ""],
  ["Arcade", "l", 3, "u", "font:800 .7em ui-monospace,Menlo,monospace;color:#2f2;text-shadow:0 0 .3em #2f2;padding:.05em .3em", "background:#2f2;color:#000;text-shadow:none", "", "", "", ""],
  ["Handwritten", "l", 3, "", 'font:.85em "Permanent Marker",cursive;' + SH, "color:var(--a);transform:rotate(-3deg) scale(1.15)", "", "", "", ""],
  ["Cinema", "l", 5, "u", "font:500 .5em " + MO + ";letter-spacing:.25em;opacity:.55", "opacity:1;font-weight:800", "", "", "", "&{border-top:2px solid var(--a);border-bottom:2px solid var(--a);padding:.4em 0}"],
  ["Bubbles", "l", 3, "", "font:800 .65em " + MO + ";background:#fff;color:#111;border-radius:1em;padding:.2em .6em;margin:.1em", "background:var(--a)", "", "", "", ""],
  ["Tilt Words", "l", 3, "u", "font:.95em/1 " + AN + ";" + K, "color:var(--a)", "", "", "", "& .w:nth-child(odd){transform:rotate(-4deg)}& .w:nth-child(even){transform:rotate(3deg) translateY(.08em)}"],
  ["Word Stack", "s", 3, "u", "font:900 .9em " + MO + ";" + SH, "color:var(--a);font-size:1.45em;animation:up .2s ease-out", "opacity:.55", "", "", "&{text-align:left}"],
  ["Stack Big Left", "s", 4, "u", "font:1em/.95 " + AN + ";" + K, "color:var(--a);font-size:1.5em;animation:up .2s ease-out", "opacity:.45", "", "", "&{text-align:left}"],
  ["Stack Center", "s", 3, "l", "font:800 .8em " + MO + ";" + SH, "font-size:1.6em;color:var(--a);animation:zoom .2s ease-out", "opacity:.55", "", "", ""],
  ["Terminal Typewriter", "t", 6, "", "background:rgba(0,0,0,.72);font:600 .58em ui-monospace,Menlo,Consolas,monospace;padding:.55em .75em;border-radius:.3em;text-align:left", "", "", "", "", ""],
  ["Paper Typewriter", "t", 6, "", 'background:#f7f3e8;color:#222;font:600 .58em "Courier New",ui-monospace,monospace;padding:.55em .75em;border-radius:.15em;text-align:left;box-shadow:.1em .1em 0 #000', "", "", "", "", ""],
  ["Editorial Mix", "e", 5, "l", "font:500 .5em " + MO + ";" + SH + ";opacity:.8", "font-weight:800;opacity:1", "", "", "", "& .eh{font:900 1.7em/1 " + MO + ";background:linear-gradient(90deg,#fff59a 62%,#e9b81c);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .04em .06em #0008);margin-bottom:.25em}"],
  ["Editorial Dark Gold", "e", 5, "l", "font:500 .5em " + MO + ";" + SH + ";opacity:.8", "font-weight:800;opacity:1", "", "", "", "& .eh{font:900 1.7em/1 " + MO + ";background:linear-gradient(90deg,#4d3b22 68%,#ffe35a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .03em .05em #fff6);margin-bottom:.25em}"],
];

export const KINETIC_STYLES: KineticStyleDefinition[] = RAW_CF.map((item, idx) => {
  const [name, layout, chunk, flags, wordCss, activeCss, pastCss, futureCss, animation, extraCss] = item;
  let category: KineticStyleDefinition["category"] = "Single Word";
  if (idx >= 0 && idx < 20) category = "Single Word";
  else if (idx >= 20 && idx < 43) category = "Line Captions";
  else if (idx >= 43 && idx < 46) category = "Stacks";
  else if (idx >= 46 && idx < 48) category = "Typewriter";
  else category = "Editorial";

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return {
    index: idx,
    id,
    name,
    layout,
    chunk,
    flags,
    wordCss,
    activeCss,
    pastCss,
    futureCss,
    animation,
    extraCss,
    category,
  };
});

const KINETIC_MAP = new Map<string, KineticStyleDefinition>();

KINETIC_STYLES.forEach((s) => {
  KINETIC_MAP.set(s.name.toLowerCase(), s);
  KINETIC_MAP.set(s.id.toLowerCase(), s);
  KINETIC_MAP.set(`s${s.index}`, s);
  KINETIC_MAP.set(String(s.index + 1), s);
});

// Aliases for Editorial reference template (Video-78706)
const style50 = KINETIC_STYLES[49];
if (style50) {
  KINETIC_MAP.set("kinetic editorial gold", style50);
  KINETIC_MAP.set("editorial gold", style50);
  KINETIC_MAP.set("video-78706", style50);
}

// Convenient aliases for Tab 1 buttons
const typewriterStyle = KINETIC_STYLES.find((s) => s.name === "Terminal Typewriter");
if (typewriterStyle) {
  KINETIC_MAP.set("typewriter", typewriterStyle);
}
const wordStackStyle = KINETIC_STYLES.find((s) => s.name === "Stack Center");
if (wordStackStyle) {
  KINETIC_MAP.set("word stack", wordStackStyle);
  KINETIC_MAP.set("stack", wordStackStyle);
}

export function isKineticCaptionStyle(name?: string): boolean {
  if (!name) return false;
  return KINETIC_MAP.has(name.trim().toLowerCase());
}

export function getKineticStyle(name?: string): KineticStyleDefinition | undefined {
  if (!name) return undefined;
  return KINETIC_MAP.get(name.trim().toLowerCase());
}

export function generateAllKineticCss(): string {
  let css = "";
  KINETIC_STYLES.forEach((s) => {
    const p = `.s${s.index}`;
    css += `${p} .w{${s.wordCss}}`;
    css += `${p} .on{${s.activeCss}${s.animation ? `;animation:${s.animation} .22s ease-out` : ""}}`;
    css += `${p} .pv{${s.pastCss}}`;
    css += `${p} .nx{${s.futureCss}}`;
    css += `${p} .k{color:var(--a)}`;
    if (s.extraCss) {
      css += s.extraCss.replace(/&/g, p);
    }
  });
  return css;
}

export const KINETIC_DEMO_WORDS = [
  { word: "I", start: 0.0, end: 0.3 },
  { word: "stopped", start: 0.3, end: 0.7 },
  { word: "waiting", start: 0.7, end: 1.1 },
  { word: "for", start: 1.1, end: 1.3 },
  { word: "perfect", start: 1.3, end: 1.8, isKeyword: true },
  { word: "conditions", start: 1.8, end: 2.4 },
  { word: "and", start: 2.4, end: 2.6 },
  { word: "just", start: 2.6, end: 2.9 },
  { word: "started.", start: 2.9, end: 3.4 },
  { word: "In", start: 3.5, end: 3.7 },
  { word: "the", start: 3.7, end: 3.9 },
  { word: "first", start: 3.9, end: 4.3 },
  { word: "week", start: 4.3, end: 4.7 },
  { word: "I", start: 4.7, end: 4.9 },
  { word: "made", start: 4.9, end: 5.2 },
  { word: "zero", start: 5.2, end: 5.7, isKeyword: true },
  { word: "sales.", start: 5.7, end: 6.3 },
  { word: "By", start: 6.4, end: 6.7 },
  { word: "day", start: 6.7, end: 7.0 },
  { word: "ninety", start: 7.0, end: 7.5 },
  { word: "I", start: 7.5, end: 7.7 },
  { word: "had", start: 7.7, end: 8.0 },
  { word: "one", start: 8.0, end: 8.3, isKeyword: true },
  { word: "hundred", start: 8.3, end: 8.8, isKeyword: true },
  { word: "customers.", start: 8.8, end: 9.6 },
  { word: "The", start: 9.7, end: 9.9 },
  { word: "secret", start: 9.9, end: 10.3 },
  { word: "is", start: 10.3, end: 10.5 },
  { word: "simple:", start: 10.5, end: 11.0 },
  { word: "show", start: 11.1, end: 11.5, isKeyword: true },
  { word: "up", start: 11.5, end: 11.9, isKeyword: true },
  { word: "every", start: 11.9, end: 12.3 },
  { word: "single", start: 12.3, end: 12.7 },
  { word: "day", start: 12.7, end: 13.1 },
  { word: "and", start: 13.1, end: 13.3 },
  { word: "let", start: 13.3, end: 13.6 },
  { word: "the", start: 13.6, end: 13.8 },
  { word: "work", start: 13.8, end: 14.2 },
  { word: "speak.", start: 14.2, end: 14.8 },
];
