import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'outputs', 'investor-deck');
const slideDir = path.join(outDir, 'slides');
const pptxDir = path.join(outDir, 'pptx-package');
const finalPdf = path.join(outDir, 'Itnavideo-Investor-Deck.pdf');
const finalPptx = path.join(outDir, 'Itnavideo-Investor-Deck.pptx');
const w = 1920;
const h = 1080;
const cx = 12192000;
const cy = 6858000;

const colors = {
  bg: '#050708',
  panel: '#0D1114',
  panel2: '#11171B',
  mint: '#56F4D2',
  cyan: '#4DD9FF',
  gold: '#FFD84D',
  amber: '#FFC857',
  red: '#FF6B5B',
  ink: '#F7FAFC',
  muted: '#98A2B3',
  quiet: '#667085',
};

const assets = {
  video: await dataUri(path.join(root, 'public', 'visuals', 'video-explainer-preview.png')),
  notes: await dataUri(path.join(root, 'public', 'visuals', 'notes-preview.png')),
  creator: await dataUri(path.join(root, 'public', 'visuals', 'creator-remix-preview.png')),
  full: await dataUri(path.join(root, 'public', 'visuals', 'full-screen-reel-preview.png')),
};

const slides = [
  {
    kicker: 'Investor deck / 2026',
    title: 'Itnavideo',
    subtitle: 'AI-powered short-form video studio for creators, educators, finance pages, career pages, and small businesses.',
    type: 'cover',
  },
  {
    kicker: 'Problem',
    title: 'Short-form video demand is exploding. Editing has not caught up.',
    bullets: [
      'Creators and businesses need frequent reels to stay visible.',
      'Professional editing is slow, expensive, and skill-heavy.',
      'Most AI tools still produce captions, slideshows, or generic outputs.',
      'The pain is consistency: making one reel is easy; making 30 good reels is hard.',
    ],
    quote: 'The bottleneck is no longer ideas. It is turning raw content into post-worthy video.',
  },
  {
    kicker: 'Market gap',
    title: 'Existing tools solve pieces of the workflow, not the finished reel.',
    type: 'matrix',
    columns: ['Tool category', 'What they do well', 'What creators still do manually'],
    rows: [
      ['Canva / CapCut', 'Design and editing control', 'Script structure, pacing, layout choices'],
      ['Subtitle tools', 'Captions and basic formatting', 'Visual hierarchy and scene design'],
      ['AI video generators', 'Fast generation', 'Creator-grade quality and repeatability'],
      ['Freelance editors', 'High-quality custom work', 'Cost, speed, and scale'],
    ],
  },
  {
    kicker: 'Solution',
    title: 'Upload raw media. Get a structured vertical reel.',
    type: 'workflow',
    steps: [
      ['1', 'Upload', 'Video or voiceover'],
      ['2', 'Understand', 'Transcription + script details'],
      ['3', 'Plan', 'Template and scene decisions'],
      ['4', 'Render', '9:16 MP4 output'],
    ],
    footer: 'Itnavideo is not just a subtitle tool. It is a template-driven AI video engine.',
  },
  {
    kicker: 'Product wedge',
    title: 'Two focused templates before many mediocre ones.',
    type: 'templates',
  },
  {
    kicker: 'Template 01',
    title: 'Video Explainer',
    subtitle: 'Designed for users who already have a talking-head video, screen recording, product clip, or educational visual.',
    type: 'template-detail',
    image: assets.video,
    bullets: [
      'Top: 16:9 visual container for video, clips, charts, UI, or screenshots.',
      'Bottom: strong hook text and short explanation with high contrast.',
      'Best for finance, jobs, banking, education, and business explainers.',
    ],
  },
  {
    kicker: 'Template 02',
    title: 'Notes',
    subtitle: 'Turns voiceover into clean notebook-style educational scenes, without using one repeated poster.',
    type: 'template-detail',
    image: assets.notes,
    bullets: [
      'Audio-first workflow for study notes, career updates, finance education, and process explainers.',
      'AI breaks the script into topic, steps, details, warnings, amounts, and key notes.',
      'Readable mobile-first layouts with handwritten styling and clean body text.',
    ],
  },
  {
    kicker: 'Why this wins',
    title: 'The product is built around output quality, not feature quantity.',
    type: 'pillars',
    pillars: [
      ['Script understanding', 'Clean Hinglish/English, spelling repair, no phonetic garbage.'],
      ['Template constraints', 'Fewer layouts, stronger execution, less random output.'],
      ['Render reliability', 'A deterministic media pipeline for repeatable MP4 generation.'],
      ['Creator workflow', 'Upload, choose template, render, download. No editing timeline required.'],
    ],
  },
  {
    kicker: 'Technology',
    title: 'A private video pipeline that turns content into designed output.',
    type: 'architecture',
    layers: [
      ['Input layer', 'User video or voiceover, file validation, 60-second working window'],
      ['Understanding layer', 'Transcription, script details, topic extraction, clean Hinglish'],
      ['Director layer', 'Template selection, overlay timeline, title/body decisions'],
      ['Renderer layer', 'React/CSS video templates, media composition, final MP4'],
      ['Product layer', 'Dashboard, recent renders, preview, download, expiry'],
    ],
  },
  {
    kicker: 'Market',
    title: 'A creator economy wedge with business use cases behind it.',
    type: 'market',
    segments: [
      ['Creators', 'Shorts, Reels, educational pages, explainers'],
      ['Education', 'Coaching pages, study notes, exam updates'],
      ['Finance & jobs', 'Banking, career, government job, personal finance content'],
      ['Small businesses', 'Product demos, founder videos, service explainers'],
    ],
    note: 'Initial focus: high-volume informational creators who need clarity, speed, and repeatability.',
  },
  {
    kicker: 'Business model',
    title: 'Subscription-first, with usage-based video credits.',
    type: 'business',
    items: [
      ['Free trial', 'Limited renders to prove output quality'],
      ['Creator plan', 'Monthly credits for regular reel production'],
      ['Pro plan', 'More renders, premium templates, faster queue'],
      ['Team / business', 'Brand presets, higher limits, shared workspace'],
    ],
    note: 'Exact pricing will be tested after early creator feedback and render-cost benchmarking.',
  },
  {
    kicker: 'Go-to-market',
    title: 'Start with creators who already feel the editing pain every week.',
    type: 'gtm',
    loops: [
      ['Creator demos', 'Before/after videos from real raw uploads'],
      ['Niche landing pages', 'Finance reels, job update reels, study notes reels'],
      ['Social proof loop', 'Outputs carry visible product quality and drive referrals'],
      ['Partner creators', 'Coaching, finance, and career pages as early channels'],
    ],
  },
  {
    kicker: 'Roadmap',
    title: 'From two strong templates to an AI video studio.',
    type: 'timeline',
    milestones: [
      ['Now', 'Video Explainer + Notes live, render flow working'],
      ['Next', 'Quality iteration from real user videos and voiceovers'],
      ['Beta', 'Pricing tests, render-cost controls, onboarding funnel'],
      ['Scale', 'More vertical templates, brand presets, team workflows'],
    ],
  },
  {
    kicker: 'Ask',
    title: 'We are looking for strategic support to turn working technology into a loved product.',
    type: 'ask',
    bullets: [
      'Improve output quality until creators repeatedly post the generated videos.',
      'Build a focused beta with finance, education, jobs, and business creators.',
      'Add template depth, render reliability, and product-led growth loops.',
      'Update fundraising ask, traction, and use-of-funds after early beta metrics.',
    ],
    footer: 'Itnavideo: raw content in, post-worthy reel out.',
  },
];

await rm(outDir, {recursive: true, force: true});
await mkdir(slideDir, {recursive: true});

const jpgs = [];
for (let i = 0; i < slides.length; i += 1) {
  const svg = renderSlide(slides[i], i);
  const pngPath = path.join(slideDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
  const jpgPath = path.join(slideDir, `slide-${String(i + 1).padStart(2, '0')}.jpg`);
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
  await sharp(pngPath).jpeg({quality: 92}).toFile(jpgPath);
  jpgs.push(jpgPath);
}

await writePdf(finalPdf, jpgs);
await createPptxPackage(jpgs);

console.log(`PDF: ${finalPdf}`);
console.log(`PPTX package dir: ${pptxDir}`);
console.log(`PPTX output path: ${finalPptx}`);

function renderSlide(slide, index) {
  const bg = background(index);
  const logo = wordmark(92, 68);
  const footer = `<text x="92" y="1016" fill="${colors.quiet}" font-family="Inter, Arial" font-size="22" font-weight="700">CONFIDENTIAL · ITNAVIDEO · INVESTOR DECK</text><text x="1780" y="1016" fill="${colors.quiet}" font-family="Inter, Arial" font-size="22" font-weight="700" text-anchor="end">${String(index + 1).padStart(2, '0')}</text>`;
  const inner = byType(slide, index);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="mintGrad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${colors.mint}"/>
        <stop offset="56%" stop-color="${colors.cyan}"/>
        <stop offset="100%" stop-color="${colors.gold}"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" x2="1">
        <stop offset="0%" stop-color="#FFE88A"/>
        <stop offset="100%" stop-color="#F8A820"/>
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#000000" flood-opacity="0.42"/>
      </filter>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${bg}
    ${logo}
    ${inner}
    ${footer}
  </svg>`;
}

function byType(slide, index) {
  if (slide.type === 'cover') return cover(slide);
  if (slide.type === 'matrix') return matrix(slide);
  if (slide.type === 'workflow') return workflow(slide);
  if (slide.type === 'templates') return templates();
  if (slide.type === 'template-detail') return templateDetail(slide);
  if (slide.type === 'pillars') return pillars(slide);
  if (slide.type === 'architecture') return architecture(slide);
  if (slide.type === 'market') return market(slide);
  if (slide.type === 'business') return business(slide);
  if (slide.type === 'gtm') return gtm(slide);
  if (slide.type === 'timeline') return timeline(slide);
  if (slide.type === 'ask') return ask(slide);
  return standard(slide, index);
}

function background(index) {
  return `<rect width="${w}" height="${h}" fill="${colors.bg}"/>
    <rect width="${w}" height="${h}" fill="url(#grid)" opacity="0"/>
    <circle cx="${1550 - (index % 3) * 190}" cy="${150 + (index % 4) * 24}" r="430" fill="${colors.mint}" opacity="0.09"/>
    <circle cx="${260 + (index % 5) * 34}" cy="${850 - (index % 3) * 60}" r="470" fill="${index % 2 ? colors.gold : colors.cyan}" opacity="0.06"/>
    <path d="M0 908 C380 760 640 1030 1030 850 C1390 684 1590 750 1920 650 L1920 1080 L0 1080 Z" fill="#0A0F12" opacity="0.68"/>
    ${Array.from({length: 18}).map((_, i) => `<line x1="${i * 128}" y1="0" x2="${i * 128}" y2="1080" stroke="#FFFFFF" stroke-opacity="0.025"/>`).join('')}
    ${Array.from({length: 10}).map((_, i) => `<line x1="0" y1="${i * 120}" x2="1920" y2="${i * 120}" stroke="#FFFFFF" stroke-opacity="0.025"/>`).join('')}`;
}

function wordmark(x, y) {
  return `<g transform="translate(${x},${y})">
    <rect x="0" y="-32" width="50" height="50" rx="13" fill="url(#mintGrad)"/>
    <rect x="10" y="-22" width="30" height="26" rx="7" fill="#071016" opacity="0.92"/>
    <path d="M22 -16 L22 -2 L34 -9 Z" fill="#FFFFFF"/>
    <text x="66" y="6" font-family="Inter, Arial" font-size="36" font-weight="900" fill="#FFFFFF">Itna</text>
    <text x="137" y="6" font-family="Inter, Arial" font-size="36" font-weight="900" fill="${colors.mint}">video</text>
  </g>`;
}

function header(slide) {
  return `<text x="92" y="172" fill="${colors.mint}" font-family="Inter, Arial" font-size="22" font-weight="900" letter-spacing="4">${escape(slide.kicker).toUpperCase()}</text>
    ${multiline(slide.title, 92, 238, 58, 78, '#FFFFFF', 1280, 900)}`;
}

function cover(slide) {
  return `<g>
    <text x="92" y="234" fill="${colors.mint}" font-family="Inter, Arial" font-size="24" font-weight="900" letter-spacing="5">${escape(slide.kicker).toUpperCase()}</text>
    <text x="92" y="420" font-family="Inter, Arial" font-size="142" font-weight="950" fill="#FFFFFF">Itna</text>
    <text x="440" y="420" font-family="Inter, Arial" font-size="142" font-weight="950" fill="${colors.mint}">video</text>
    ${multiline(slide.subtitle, 100, 510, 46, 62, colors.muted, 980, 700)}
    <g filter="url(#softShadow)">
      <rect x="1240" y="198" width="500" height="640" rx="34" fill="${colors.panel}" stroke="#FFFFFF" stroke-opacity="0.12"/>
      <rect x="1284" y="244" width="412" height="232" rx="26" fill="#0A0D10" stroke="${colors.mint}" stroke-opacity="0.24"/>
      <image href="${assets.video}" x="1298" y="258" width="384" height="204" preserveAspectRatio="xMidYMid slice"/>
      <text x="1288" y="556" font-family="Inter, Arial" font-size="66" font-weight="950" fill="#FFFFFF">AI video</text>
      <text x="1288" y="632" font-family="Inter, Arial" font-size="66" font-weight="950" fill="url(#goldGrad)">studio</text>
      <text x="1288" y="712" font-family="Inter, Arial" font-size="30" font-weight="700" fill="${colors.muted}">Raw content in → post-worthy reel out</text>
    </g>
  </g>`;
}

function standard(slide) {
  return `${header(slide)}
    <g transform="translate(92,420)">
      ${slide.bullets.map((b, i) => bullet(b, 0, i * 92)).join('')}
    </g>
    ${slide.quote ? `<rect x="1120" y="490" width="610" height="230" rx="26" fill="${colors.panel2}" stroke="${colors.gold}" stroke-opacity="0.24" filter="url(#softShadow)"/>
    ${multiline(slide.quote, 1162, 560, 34, 46, '#FFFFFF', 520, 600)}` : ''}`;
}

function matrix(slide) {
  const x = 92, y = 330;
  const widths = [410, 520, 690];
  return `${header(slide)}
    <g transform="translate(${x},${y})">
      <rect width="1736" height="560" rx="28" fill="${colors.panel}" stroke="#FFFFFF" stroke-opacity="0.11"/>
      ${slide.columns.map((c, i) => `<text x="${20 + widths.slice(0, i).reduce((a, b) => a + b, 0)}" y="64" fill="${i === 0 ? colors.mint : colors.gold}" font-family="Inter, Arial" font-size="24" font-weight="900" letter-spacing="2">${escape(c).toUpperCase()}</text>`).join('')}
      ${slide.rows.map((row, r) => {
        const yy = 112 + r * 108;
        return `<line x1="0" y1="${yy - 34}" x2="1736" y2="${yy - 34}" stroke="#FFFFFF" stroke-opacity="0.07"/>
          ${row.map((cell, c) => multiline(cell, 20 + widths.slice(0, c).reduce((a, b) => a + b, 0), yy, c === 0 ? 30 : 27, 36, c === 0 ? '#FFFFFF' : colors.muted, widths[c] - 50, 300)).join('')}`;
      }).join('')}
    </g>`;
}

function workflow(slide) {
  return `${header(slide)}
    <g transform="translate(104,430)">
      ${slide.steps.map((s, i) => {
        const x = i * 430;
        return `<g transform="translate(${x},0)" filter="url(#softShadow)">
          <rect width="350" height="300" rx="30" fill="${colors.panel}" stroke="${i === 0 ? colors.mint : i === 1 ? colors.cyan : i === 2 ? colors.gold : colors.mint}" stroke-opacity="0.28"/>
          <circle cx="56" cy="64" r="30" fill="${i === 2 ? colors.gold : colors.mint}" opacity="0.95"/>
          <text x="56" y="75" text-anchor="middle" font-family="Inter, Arial" font-size="28" font-weight="950" fill="#071016">${s[0]}</text>
          <text x="34" y="150" font-family="Inter, Arial" font-size="38" font-weight="950" fill="#FFFFFF">${escape(s[1])}</text>
          ${multiline(s[2], 34, 206, 28, 38, colors.muted, 280, 400)}
        </g>
        ${i < slide.steps.length - 1 ? `<path d="M${x + 366} 145 L${x + 404} 145" stroke="${colors.mint}" stroke-width="5" stroke-linecap="round"/><path d="M${x + 392} 130 L${x + 410} 145 L${x + 392} 160" fill="none" stroke="${colors.mint}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}`;
      }).join('')}
    </g>
    <text x="92" y="894" fill="${colors.gold}" font-family="Inter, Arial" font-size="34" font-weight="900">${escape(slide.footer)}</text>`;
}

function templates() {
  const cards = [
    ['Video Explainer', 'Video on top. Smart text below.', assets.video, colors.cyan],
    ['Notes', 'Voiceover becomes clean study notes.', assets.notes, colors.gold],
    ['Creator Remix', 'Future: creator video + viral clip.', assets.creator, colors.mint],
    ['Full Screen Reel', 'Future: immersive cinematic visual story.', assets.full, '#A78BFA'],
  ];
  return `${header({kicker: 'Product wedge', title: 'Two focused templates before many mediocre ones.'})}
    <g transform="translate(92,324)">
    ${cards.map((c, i) => {
      const x = i * 448;
      return `<g transform="translate(${x},0)" filter="url(#softShadow)">
        <rect width="394" height="540" rx="30" fill="${colors.panel}" stroke="${c[3]}" stroke-opacity="${i < 2 ? 0.4 : 0.18}"/>
        <image href="${c[2]}" x="18" y="18" width="358" height="314" preserveAspectRatio="xMidYMin slice"/>
        <rect x="18" y="18" width="358" height="314" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" rx="20"/>
        <text x="30" y="410" font-family="Inter, Arial" font-size="34" font-weight="950" fill="#FFFFFF">${escape(c[0])}</text>
        ${multiline(c[1], 30, 462, 24, 34, colors.muted, 330, 300)}
        <text x="30" y="510" font-family="Inter, Arial" font-size="18" font-weight="900" fill="${c[3]}" letter-spacing="2">${i < 2 ? 'LIVE TEMPLATE' : 'ROADMAP'}</text>
      </g>`;
    }).join('')}
    </g>`;
}

function templateDetail(slide) {
  return `${header(slide)}
    <g filter="url(#softShadow)">
      <rect x="1010" y="232" width="650" height="718" rx="34" fill="${colors.panel}" stroke="#FFFFFF" stroke-opacity="0.11"/>
      <image href="${slide.image}" x="1040" y="262" width="590" height="655" preserveAspectRatio="xMidYMin slice"/>
    </g>
    ${multiline(slide.subtitle, 92, 410, 34, 48, colors.muted, 800, 700)}
    <g transform="translate(92,590)">
      ${slide.bullets.map((b, i) => bullet(b, 0, i * 94)).join('')}
    </g>`;
}

function pillars(slide) {
  return `${header(slide)}
    <g transform="translate(92,344)">
      ${slide.pillars.map((p, i) => {
        const x = (i % 2) * 840;
        const y = Math.floor(i / 2) * 240;
        return `<g transform="translate(${x},${y})" filter="url(#softShadow)">
          <rect width="780" height="190" rx="28" fill="${colors.panel}" stroke="${i % 2 ? colors.gold : colors.mint}" stroke-opacity="0.22"/>
          <text x="34" y="60" font-family="Inter, Arial" font-size="34" font-weight="950" fill="#FFFFFF">${escape(p[0])}</text>
          ${multiline(p[1], 34, 112, 26, 36, colors.muted, 700, 240)}
        </g>`;
      }).join('')}
    </g>`;
}

function architecture(slide) {
  return `${header(slide)}
    <g transform="translate(130,328)">
      ${slide.layers.map((l, i) => {
        const y = i * 112;
        const col = [colors.mint, colors.cyan, colors.gold, '#A78BFA', colors.mint][i];
        return `<g transform="translate(0,${y})">
          <rect width="1660" height="84" rx="22" fill="${colors.panel}" stroke="${col}" stroke-opacity="0.24"/>
          <circle cx="44" cy="42" r="14" fill="${col}"/>
          <text x="84" y="36" font-family="Inter, Arial" font-size="28" font-weight="950" fill="#FFFFFF">${escape(l[0])}</text>
          <text x="84" y="66" font-family="Inter, Arial" font-size="22" font-weight="650" fill="${colors.muted}">${escape(l[1])}</text>
        </g>`;
      }).join('')}
    </g>`;
}

function market(slide) {
  return `${header(slide)}
    <g transform="translate(92,355)">
      ${slide.segments.map((s, i) => {
        const x = (i % 2) * 860;
        const y = Math.floor(i / 2) * 205;
        return `<g transform="translate(${x},${y})">
          <rect width="790" height="160" rx="26" fill="${colors.panel}" stroke="#FFFFFF" stroke-opacity="0.11"/>
          <text x="30" y="58" font-family="Inter, Arial" font-size="36" font-weight="950" fill="${i % 2 ? colors.gold : colors.mint}">${escape(s[0])}</text>
          ${multiline(s[1], 30, 104, 25, 34, colors.muted, 700, 300)}
        </g>`;
      }).join('')}
    </g>
    <text x="92" y="918" fill="${colors.gold}" font-family="Inter, Arial" font-size="30" font-weight="850">${escape(slide.note)}</text>`;
}

function business(slide) {
  return `${header(slide)}
    <g transform="translate(92,340)">
      ${slide.items.map((it, i) => {
        const x = i * 430;
        return `<g transform="translate(${x},0)" filter="url(#softShadow)">
          <rect width="382" height="360" rx="28" fill="${colors.panel}" stroke="${i === 0 ? colors.mint : colors.gold}" stroke-opacity="0.2"/>
          <text x="30" y="64" font-family="Inter, Arial" font-size="32" font-weight="950" fill="#FFFFFF">${escape(it[0])}</text>
          ${multiline(it[1], 30, 126, 27, 38, colors.muted, 310, 500)}
        </g>`;
      }).join('')}
    </g>
    <rect x="92" y="824" width="1540" height="84" rx="20" fill="${colors.panel2}" stroke="${colors.gold}" stroke-opacity="0.18"/>
    <text x="128" y="876" fill="${colors.muted}" font-family="Inter, Arial" font-size="28" font-weight="750">${escape(slide.note)}</text>`;
}

function gtm(slide) {
  return `${header(slide)}
    <g transform="translate(136,392)">
      <circle cx="760" cy="238" r="196" fill="${colors.panel}" stroke="${colors.mint}" stroke-opacity="0.3" stroke-width="3"/>
      <text x="760" y="225" text-anchor="middle" font-family="Inter, Arial" font-size="42" font-weight="950" fill="#FFFFFF">Output</text>
      <text x="760" y="272" text-anchor="middle" font-family="Inter, Arial" font-size="42" font-weight="950" fill="${colors.mint}">quality loop</text>
      ${slide.loops.map((l, i) => {
        const positions = [[0,0], [1110,0], [0,405], [1110,405]];
        const [x, y] = positions[i];
        return `<g transform="translate(${x},${y})">
          <rect width="560" height="168" rx="26" fill="${colors.panel}" stroke="${i % 2 ? colors.gold : colors.cyan}" stroke-opacity="0.22"/>
          <text x="28" y="58" font-family="Inter, Arial" font-size="32" font-weight="950" fill="#FFFFFF">${escape(l[0])}</text>
          ${multiline(l[1], 28, 108, 24, 34, colors.muted, 500, 300)}
        </g>`;
      }).join('')}
    </g>`;
}

function timeline(slide) {
  return `${header(slide)}
    <line x1="190" y1="560" x2="1690" y2="560" stroke="${colors.mint}" stroke-width="6" stroke-linecap="round" opacity="0.72"/>
    ${slide.milestones.map((m, i) => {
      const x = 220 + i * 480;
      return `<g transform="translate(${x},0)">
        <circle cx="0" cy="560" r="24" fill="${i < 2 ? colors.mint : colors.gold}"/>
        <rect x="-132" y="640" width="330" height="180" rx="28" fill="${colors.panel}" stroke="#FFFFFF" stroke-opacity="0.1"/>
        <text x="-100" y="700" font-family="Inter, Arial" font-size="34" font-weight="950" fill="#FFFFFF">${escape(m[0])}</text>
        ${multiline(m[1], -100, 752, 24, 32, colors.muted, 280, 300)}
      </g>`;
    }).join('')}`;
}

function ask(slide) {
  return `${header(slide)}
    <g transform="translate(92,420)">
      ${slide.bullets.map((b, i) => bullet(b, 0, i * 88)).join('')}
    </g>
    <rect x="92" y="846" width="1440" height="92" rx="26" fill="url(#mintGrad)" opacity="0.95"/>
    <text x="134" y="904" fill="#071016" font-family="Inter, Arial" font-size="34" font-weight="950">${escape(slide.footer)}</text>`;
}

function bullet(text, x, y) {
  return `<g transform="translate(${x},${y})">
    <circle cx="17" cy="17" r="13" fill="${colors.mint}"/>
    <path d="M10 18 L16 24 L27 10" fill="none" stroke="#061014" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${multiline(text, 52, 28, 30, 42, colors.ink, 950, 280)}
  </g>`;
}

function multiline(text, x, y, size, lineHeight, fill, maxWidth, weight = 700) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const approx = Math.max(8, Math.floor(maxWidth / (size * 0.56)));
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > approx && current) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Inter, Arial" font-size="${size}" font-weight="${weight}">
    ${lines.slice(0, 6).map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escape(line)}</tspan>`).join('')}
  </text>`;
}

function escape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function dataUri(file) {
  if (!existsSync(file)) return '';
  const bytes = await readFile(file);
  const ext = path.extname(file).slice(1).toLowerCase().replace('jpg', 'jpeg');
  return `data:image/${ext};base64,${bytes.toString('base64')}`;
}

async function writePdf(file, imagePaths) {
  const objects = [];
  const add = (body) => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = add('<< /Type /Catalog /Pages 2 0 R >>');
  const pagesIndex = objects.length;
  add('');
  const pageIds = [];

  for (const imgPath of imagePaths) {
    const img = await readFile(imgPath);
    const imageId = add(`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n${img.toString('binary')}\nendstream`);
    const content = `q\n${w} 0 0 ${h} 0 0 cm\n/Im0 Do\nQ`;
    const contentId = add(`<< /Length ${Buffer.byteLength(content, 'binary')} >>\nstream\n${content}\nendstream`);
    const pageId = add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  }

  objects[pagesIndex] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

  const chunks = ['%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'];
  const offsets = [0];
  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(chunks.join(''), 'binary'));
    chunks.push(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`);
  }
  const xrefOffset = Buffer.byteLength(chunks.join(''), 'binary');
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= objects.length; i += 1) {
    chunks.push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  await writeFile(file, Buffer.from(chunks.join(''), 'binary'));
}

async function createPptxPackage(imagePaths) {
  await rm(pptxDir, {recursive: true, force: true});
  await mkdir(path.join(pptxDir, '_rels'), {recursive: true});
  await mkdir(path.join(pptxDir, 'ppt', '_rels'), {recursive: true});
  await mkdir(path.join(pptxDir, 'ppt', 'slides', '_rels'), {recursive: true});
  await mkdir(path.join(pptxDir, 'ppt', 'media'), {recursive: true});
  await mkdir(path.join(pptxDir, 'ppt', 'theme'), {recursive: true});
  await mkdir(path.join(pptxDir, 'ppt', 'slideMasters', '_rels'), {recursive: true});
  await mkdir(path.join(pptxDir, 'ppt', 'slideLayouts', '_rels'), {recursive: true});

  for (let i = 0; i < imagePaths.length; i += 1) {
    const bytes = await readFile(imagePaths[i]);
    await writeFile(path.join(pptxDir, 'ppt', 'media', `slide${i + 1}.jpg`), bytes);
    await writeFile(path.join(pptxDir, 'ppt', 'slides', `slide${i + 1}.xml`), slideXml());
    await writeFile(path.join(pptxDir, 'ppt', 'slides', '_rels', `slide${i + 1}.xml.rels`), rels([
      [`rId1`, `../media/slide${i + 1}.jpg`, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image'],
      [`rId2`, `../slideLayouts/slideLayout1.xml`, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout'],
    ]));
  }

  await writeFile(path.join(pptxDir, '[Content_Types].xml'), contentTypes(imagePaths.length));
  await writeFile(path.join(pptxDir, '_rels', '.rels'), rels([['rId1', 'ppt/presentation.xml', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument']]));
  await writeFile(path.join(pptxDir, 'ppt', 'presentation.xml'), presentationXml(imagePaths.length));
  await writeFile(path.join(pptxDir, 'ppt', '_rels', 'presentation.xml.rels'), presentationRels(imagePaths.length));
  await writeFile(path.join(pptxDir, 'ppt', 'theme', 'theme1.xml'), themeXml());
  await writeFile(path.join(pptxDir, 'ppt', 'slideMasters', 'slideMaster1.xml'), slideMasterXml());
  await writeFile(path.join(pptxDir, 'ppt', 'slideMasters', '_rels', 'slideMaster1.xml.rels'), rels([
    ['rId1', '../slideLayouts/slideLayout1.xml', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout'],
    ['rId2', '../theme/theme1.xml', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme'],
  ]));
  await writeFile(path.join(pptxDir, 'ppt', 'slideLayouts', 'slideLayout1.xml'), slideLayoutXml());
  await writeFile(path.join(pptxDir, 'ppt', 'slideLayouts', '_rels', 'slideLayout1.xml.rels'), rels([
    ['rId1', '../slideMasters/slideMaster1.xml', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster'],
  ]));
}

function contentTypes(count) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="jpg" ContentType="image/jpeg"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
${Array.from({length: count}).map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('')}
</Types>`;
}

function presentationXml(count) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
<p:sldIdLst>${Array.from({length: count}).map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`).join('')}</p:sldIdLst>
<p:sldSz cx="${cx}" cy="${cy}" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/>
<p:defaultTextStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr></p:defaultTextStyle>
</p:presentation>`;
}

function presentationRels(count) {
  return rels([
    ['rId1', 'slideMasters/slideMaster1.xml', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster'],
    ...Array.from({length: count}).map((_, i) => [`rId${i + 2}`, `slides/slide${i + 1}.xml`, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide']),
  ]);
}

function slideXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
<p:pic><p:nvPicPr><p:cNvPr id="2" name="Slide image"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>
<p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
<p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
</p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

function slideMasterXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="050708"/></a:solidFill></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`;
}

function slideLayoutXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
<p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;
}

function themeXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Itnavideo"><a:themeElements><a:clrScheme name="Itnavideo"><a:dk1><a:srgbClr val="050708"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="0D1114"/></a:dk2><a:lt2><a:srgbClr val="F7FAFC"/></a:lt2><a:accent1><a:srgbClr val="56F4D2"/></a:accent1><a:accent2><a:srgbClr val="FFD84D"/></a:accent2><a:accent3><a:srgbClr val="4DD9FF"/></a:accent3><a:accent4><a:srgbClr val="A78BFA"/></a:accent4><a:accent5><a:srgbClr val="FF6B5B"/></a:accent5><a:accent6><a:srgbClr val="98A2B3"/></a:accent6><a:hlink><a:srgbClr val="56F4D2"/></a:hlink><a:folHlink><a:srgbClr val="FFD84D"/></a:folHlink></a:clrScheme><a:fontScheme name="Itnavideo"><a:majorFont><a:latin typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/></a:minorFont></a:fontScheme><a:fmtScheme name="Itnavideo"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;
}

function rels(items) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items.map(([id, target, type]) => `<Relationship Id="${id}" Type="${type}" Target="${target}"/>`).join('')}</Relationships>`;
}
