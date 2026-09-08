import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

const width = 2048;
const height = 1152;
const out = "public/brand/itnavideo-youtube-channel-banner.png";

const safe = {
  x: 406,
  y: 407,
  width: 1235,
  height: 338,
};

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="120" y1="50" x2="1960" y2="1110" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#020403"/>
      <stop offset="0.34" stop-color="#061411"/>
      <stop offset="0.64" stop-color="#05080c"/>
      <stop offset="1" stop-color="#151006"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5eead4"/>
      <stop offset="0.48" stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#fbbf24"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(602 374) rotate(32) scale(720 520)">
      <stop stop-color="#5eead4" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#5eead4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1560 760) rotate(142) scale(720 460)">
      <stop stop-color="#fbbf24" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#fbbf24" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="34" stdDeviation="42" flood-color="#000000" flood-opacity="0.50"/>
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#5eead4" flood-opacity="0.18"/>
    </filter>
    <filter id="textShadow" x="-20%" y="-40%" width="140%" height="180%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.58"/>
    </filter>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="#ffffff" stroke-opacity="0.055" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glowA)"/>
  <rect width="${width}" height="${height}" fill="url(#glowB)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>

  <g opacity="0.38">
    <path d="M-80 224L258 40H520L142 246L-80 224Z" fill="#ffffff" fill-opacity="0.08"/>
    <path d="M1608 1050L2066 782V1158H1590L1608 1050Z" fill="#ffffff" fill-opacity="0.08"/>
    <path d="M1228 120L2116 120" stroke="#5eead4" stroke-opacity="0.18" stroke-width="2"/>
    <path d="M-60 1010L762 1010" stroke="#fbbf24" stroke-opacity="0.14" stroke-width="2"/>
  </g>

  <g opacity="0.55" filter="url(#softShadow)">
    <g transform="translate(104 226) rotate(-8)">
      <rect width="424" height="238" rx="30" fill="#0c1110" stroke="#5eead4" stroke-opacity="0.34"/>
      <rect x="22" y="20" width="380" height="122" rx="20" fill="#171d1c"/>
      <rect x="38" y="162" width="170" height="22" rx="11" fill="#eef2f7" opacity="0.72"/>
      <rect x="38" y="198" width="236" height="18" rx="9" fill="#5eead4" opacity="0.84"/>
      <circle cx="354" cy="188" r="18" fill="#fbbf24"/>
    </g>
    <g transform="translate(1612 220) rotate(9)">
      <rect width="386" height="216" rx="28" fill="#0c1110" stroke="#38bdf8" stroke-opacity="0.30"/>
      <rect x="20" y="18" width="346" height="110" rx="19" fill="#171d1c"/>
      <rect x="36" y="150" width="202" height="20" rx="10" fill="#eef2f7" opacity="0.70"/>
      <rect x="36" y="184" width="142" height="16" rx="8" fill="#38bdf8" opacity="0.86"/>
    </g>
    <g transform="translate(1428 830) rotate(-6)">
      <rect width="474" height="146" rx="26" fill="#0c1110" stroke="#fbbf24" stroke-opacity="0.26"/>
      <rect x="28" y="30" width="300" height="24" rx="12" fill="#eef2f7" opacity="0.70"/>
      <rect x="28" y="78" width="210" height="22" rx="11" fill="#5eead4" opacity="0.86"/>
      <rect x="258" y="78" width="142" height="22" rx="11" fill="#38bdf8" opacity="0.74"/>
    </g>
  </g>

  <g filter="url(#softShadow)" transform="translate(${safe.x + 44} ${safe.y + 42})">
    <rect width="250" height="250" rx="58" fill="url(#brand)"/>
    <rect x="17" y="17" width="216" height="216" rx="44" fill="#07110f" opacity="0.18"/>
    <g transform="translate(38 34) scale(3.65)">
      <rect x="8" y="11" width="32" height="26" rx="7" fill="#020617" opacity="0.92"/>
      <path d="M19 18.5v11l10-5.5-10-5.5Z" fill="#ffffff"/>
      <path d="M10 25h4m20 0h4" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.94"/>
      <path d="M14 19v10M34 19v10" stroke="#5eead4" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M6 22v4M42 22v4" stroke="#fbbf24" stroke-width="2.4" stroke-linecap="round"/>
    </g>
  </g>

  <g filter="url(#textShadow)">
    <text x="${safe.x + 340}" y="${safe.y + 140}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="118" font-weight="900">Itna<tspan fill="#5eead4">video</tspan></text>
    <text x="${safe.x + 346}" y="${safe.y + 208}" fill="#d4d4d8" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" letter-spacing="7">AI EXPLAINER VIDEO GENERATOR</text>
    <text x="${safe.x + 346}" y="${safe.y + 272}" fill="#ffffff" fill-opacity="0.92" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800">Create polished Reels &amp; YouTube Shorts from your video</text>
  </g>

  <g transform="translate(${safe.x + 346} ${safe.y + 300})">
    <rect width="154" height="6" rx="3" fill="#5eead4"/>
    <rect x="170" width="92" height="6" rx="3" fill="#38bdf8" opacity="0.85"/>
    <rect x="278" width="62" height="6" rx="3" fill="#fbbf24" opacity="0.9"/>
  </g>
</svg>`;

await mkdir("public/brand", { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(out);

const info = await stat(out);
console.log(`${out} ${Math.round(info.size / 1024)}KB`);
