import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const transcriptPath = path.join(
  rootDir,
  'public',
  'renders',
  'transcripts',
  'inshot-20260607-221729955.transcript.json',
);
const outputPath = path.join(rootDir, 'public', 'renders', 'plans', 'inshot-20260607-221729955-plan.json');
const mediaSrc = 'renders/input/InShot_20260607_221729955.mp4';

const topicTitle = 'RBI Plastic Note Update';
const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'this',
  'that',
  'from',
  'into',
  'your',
  'video',
  'reel',
  'scene',
  'visual',
  'preview',
  'explainer',
  'news',
]);
const transcript = JSON.parse(await readFile(transcriptPath, 'utf8'));
const indexedAssets = await readIndexedAssets();
const durationSeconds = Math.min(60, Math.max(1, Number(transcript.duration) || 59.9));
const captionChunks = buildCaptionChunks(transcript.segments || [], durationSeconds);
const overlays = buildSceneOverlays(captionChunks, durationSeconds);
const assetTimeline = buildAssetTimeline(overlays);
const backgroundMusic = selectBackgroundMusic({
  topicTitle,
  transcript: transcript.text || captionChunks.map((chunk) => chunk.text).join(' '),
});

const renderProps = {
  brand: 'itnavideo',
  templateName: 'VIDEO_EXPLAINER',
  design: 'imageCollage',
  mediaType: 'video',
  mediaSrc,
  mediaFit: 'videoExplainer',
  durationSeconds,
  backgroundMusic: true,
  backgroundMusicMood: backgroundMusic.mood,
  backgroundMusicSrc: backgroundMusic.src,
  backgroundMusicVolume: backgroundMusic.volume,
  backgroundMusicCategory: backgroundMusic.category,
  topicTitle,
  captions: captionChunks,
  overlayTimeline: overlays,
  assetTimeline,
};

await mkdir(path.dirname(outputPath), {recursive: true});
await writeFile(outputPath, `${JSON.stringify({renderProps}, null, 2)}\n`);
process.stdout.write(`Created ${path.relative(rootDir, outputPath)}\n`);
process.stdout.write(`Captions: ${captionChunks.length}\n`);
process.stdout.write(`Scenes: ${overlays.length}\n`);
process.stdout.write(`Assets: ${assetTimeline.length}\n`);
process.stdout.write(`Music: ${backgroundMusic.category} (${backgroundMusic.src})\n`);

function selectBackgroundMusic({topicTitle, transcript}) {
  const text = `${topicTitle} ${transcript}`.toLowerCase();
  const rules = [
    {
      category: 'finance',
      mood: 'finance',
      src: 'assets/reusable/background-music/economic-pulse.mp3',
      volume: 0.052,
      pattern: /\b(rbi|reserve bank|banking|currency|rupee|note|notes|cash|money|finance|financial|salary|market|investment|loan|tax|budget|economy|economic)\b/,
    },
    {
      category: 'government-exam',
      mood: 'study',
      src: 'assets/reusable/background-music/exam-preparation.mp3',
      volume: 0.05,
      pattern: /\b(exam|ssc|upsc|ibps|railway|result|admit card|syllabus|vacancy|recruitment|government job|student|study)\b/,
    },
    {
      category: 'tech-ai',
      mood: 'ai',
      src: 'assets/reusable/background-music/digital-future.mp3',
      volume: 0.048,
      pattern: /\b(ai|artificial intelligence|software|coding|app|automation|chatgpt|startup|tech|tool|saas)\b/,
    },
    {
      category: 'breaking-news',
      mood: 'news',
      src: 'assets/reusable/background-music/serious-analysis.mp3',
      volume: 0.048,
      pattern: /\b(breaking|alert|warning|latest|update|minister|court|policy|notice|official|government)\b/,
    },
    {
      category: 'motivation',
      mood: 'motivation',
      src: 'assets/reusable/background-music/rise-again.mp3',
      volume: 0.05,
      pattern: /\b(success|motivation|life|mindset|dream|struggle|comeback|discipline|habit)\b/,
    },
    {
      category: 'story',
      mood: 'documentary',
      src: 'assets/reusable/background-music/documentary-light.mp3',
      volume: 0.046,
      pattern: /\b(story|journey|history|case study|real life|documentary|explained)\b/,
    },
  ];
  return rules.find((rule) => rule.pattern.test(text)) || {
    category: 'general-explainer',
    mood: 'corporate',
    src: 'assets/reusable/background-music/corporate-inspire.mp3',
    volume: 0.048,
  };
}

function buildCaptionChunks(segments, duration) {
  const chunks = [];
  for (const segment of segments) {
    const start = clampTime(segment.start, duration);
    const end = clampTime(segment.end, duration);
    const words = String(segment.text || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length || end <= start) continue;

    const targetWords = 7;
    const parts = [];
    for (let index = 0; index < words.length; index += targetWords) {
      parts.push(words.slice(index, index + targetWords));
    }

    const span = end - start;
    parts.forEach((part, index) => {
      const partStart = start + (span * index) / parts.length;
      const partEnd = index === parts.length - 1 ? end : start + (span * (index + 1)) / parts.length;
      const text = part.join(' ');
      chunks.push({
        start: roundTime(partStart),
        end: roundTime(partEnd),
        text,
        lines: splitLines(text),
        mode: 'wordHighlight',
      });
    });
  }

  return chunks
    .filter((caption) => caption.end > caption.start && caption.text)
    .map((caption, index, list) => ({
      ...caption,
      id: `caption-${String(index + 1).padStart(2, '0')}`,
      end: roundTime(Math.min(caption.end, list[index + 1]?.start ?? caption.end)),
    }));
}

function buildSceneOverlays(captions, duration) {
  const sceneLength = 6;
  const scenes = [];
  const usedAssets = new Set();
  const usedFamilies = new Set();
  for (let start = 0; start < duration - 0.1; start += sceneLength) {
    const end = Math.min(duration, start + sceneLength);
    const sceneCaptions = captions.filter((caption) => caption.start < end && caption.end > start);
    const text = sceneCaptions.map((caption) => caption.text).join(' ').trim() || topicTitle;
    const role = sceneRole(text, scenes.length, usedAssets, usedFamilies);
    usedAssets.add(role.asset);
    usedFamilies.add(role.family);
    scenes.push({
      id: `scene-${String(scenes.length + 1).padStart(2, '0')}`,
      start: roundTime(start),
      end: roundTime(end),
      type: scenes.length === 0 ? 'hook' : end >= duration - 0.2 ? 'cta' : role.type,
      layout: role.layout,
      text: limitWords(text, 12),
      body: limitWords(text, 18),
      visualRole: 'assetInsert',
      visual: role.visual,
      assetBrief: role.visual,
      sfx: role.sfx,
      primaryVisual: {
        type: 'image',
        assetId: role.asset,
        label: role.label,
        prompt: role.visual,
        motion: role.motion,
      },
    });
  }
  return scenes;
}

function buildAssetTimeline(overlays) {
  return overlays.map((overlay, index) => ({
    id: `asset-${String(index + 1).padStart(2, '0')}`,
    start: overlay.start,
    end: overlay.end,
    src: overlay.primaryVisual.assetId,
    role: 'primary',
    kind: 'image',
    label: overlay.primaryVisual.label,
    motion: overlay.primaryVisual.motion,
  }));
}

function sceneRole(text, index, usedAssets, usedFamilies) {
  const brief = sceneBrief(text, index);
  const picked = pickIndexedImage(brief, usedAssets, usedFamilies, index);
  return {
    asset: picked.src.replace(/^\/+/, ''),
    family: assetFamily(picked),
    label: picked.title,
    visual: brief,
    motion: index % 2 === 0 ? 'slowZoom' : 'panLeft',
    sfx: sceneSfx(brief, text, index),
    layout: index === 0 || brief.includes('denomination') ? 'statCard' : brief.includes('official statement') ? 'warningCard' : 'explainer',
    type: index === 0 || brief.includes('denomination') ? 'stat' : brief.includes('official statement') ? 'warning' : 'point',
  };
}

function sceneSfx(brief, text, index) {
  const source = `${brief} ${text}`.toLowerCase();
  if (index === 0) return 'boom';
  if (/official|statement|proposal|policy|consideration|decision/.test(source)) return 'stamp';
  if (/cash|currency|rupee|note|notes|banknote|500|200|100|50|20|10/.test(source)) return 'cash';
  if (/document|paper|report|decoding|question/.test(source)) return 'typing';
  if (/benefit|durable|countries|world|global|comparison/.test(source)) return 'whoosh';
  if (/warning|no decision|truth|initial stage/.test(source)) return 'warning';
  return index % 2 === 0 ? 'softPop' : 'softTick';
}

function sceneBrief(text, index) {
  const normalized = text.toLowerCase();
  const base = 'RBI plastic polymer note news explainer, Reserve Bank of India, Indian currency, rupee notes, banking policy';
  const stageBriefs = [
    `${base}, opening breaking news, 140 crore people, close-up Indian rupee notes in hand, currency update`,
    `Indian currency note changing soon, plastic banknote proposal, rupee cash notes on office desk, banknote update`,
    `${base}, official RBI statement, Reserve Bank of India entrance plaque, central bank building, policy announcement`,
    `RBI considering proposal, bank counter, cash counting teller, customer documents, banking policy`,
    `benefits of polymer notes, durable currency, financial advisor explaining report, professional banking consultation`,
    `countries already using plastic notes, global currency comparison, financial report, advisor meeting, currency analysis`,
    `denominations 10 20 50 100 200 500, rupee coins, calculator, currency denominations, stacked rupee coins`,
    `will all notes change question, document inspection, magnifying glass, policy details, paperwork review`,
    `what RBI said, official document, Reserve Bank policy statement, paperwork review, bank documents`,
    `recap and conclusion, bank cash counter, SBI teller, currency exchange, cash counting`,
  ];
  if (stageBriefs[index]) return stageBriefs[index];
  if (index === 0) return `${base}, breaking news, 140 crore people, India currency update, close view of Indian rupee notes`;
  if (normalized.includes('जल्द') || normalized.includes('बदलने') || normalized.includes('plastic') || normalized.includes('प्लास्टिक')) {
    return `${base}, plastic polymer notes proposal, Indian banknotes may change, rupee cash in hand`;
  }
  if (normalized.includes('reserve bank') || normalized.includes('rbi') || normalized.includes('آدھیکارک')) {
    return `${base}, official RBI statement, Reserve Bank of India building, central bank policy announcement`;
  }
  if (normalized.includes('فائد') || normalized.includes('فائدے') || normalized.includes('फायदे')) {
    return `${base}, benefits of polymer notes, durable currency, bank advisor explaining financial report`;
  }
  if (normalized.includes('10') || normalized.includes('20') || normalized.includes('50') || normalized.includes('100') || normalized.includes('200') || normalized.includes('500')) {
    return `${base}, denominations 10 20 50 100 200 500, rupee coins and calculator, currency denominations`;
  }
  if (normalized.includes('سوال') || normalized.includes('decode') || normalized.includes('ڈیکوٹ') || normalized.includes('کہا')) {
    return `${base}, questions answered, official document inspection, RBI policy details`;
  }
  return `${base}, bank counter, cash counting, customer documents, financial explainer scene`;
}

function pickIndexedImage(query, usedAssets, usedFamilies, index) {
  const preferred = preferredAssetForStage(index, usedAssets);
  if (preferred) return preferred;

  const queryTokens = tokenize(query);
  const allRanked = indexedAssets
    .map((asset) => {
      const score = scoreIndexedAsset(asset, queryTokens, query, usedAssets, usedFamilies, index);
      return {asset, score};
    })
    .filter((item) => item.score >= 4)
    .sort((a, b) => b.score - a.score || quality(b.asset) - quality(a.asset));

  const uniqueRanked = allRanked.filter(({asset}) => {
    const src = asset.src.replace(/^\/+/, '');
    return !usedAssets.has(src) && !usedAssets.has(asset.src) && !usedFamilies.has(assetFamily(asset));
  });

  return (uniqueRanked[0] || allRanked[0])?.asset || fallbackIndexedAssets[index % fallbackIndexedAssets.length];
}

function preferredAssetForStage(index, usedAssets) {
  const preferredSrcs = [
    '/assets/direct/images/hand-holding-500-inr-notes-office-desk.png',
    '/assets/reusable/images/hand-fanned-500-inr-notes-desk.png',
    '/assets/direct/images/reserve-bank-of-india-entrance-plaque-portrait.png',
    '/assets/direct/images/rbi-busy-cash-counter-teller.png',
    '/assets/reusable/images/financial-advisor-explaining-report-office-meeting.png',
    '/assets/direct/images/desk-financial-reports-pen-calculator-vertical.png',
    '/assets/reusable/images/rupee-coins-calculator-notebook-desk.png',
    '/assets/reusable/images/blank-letter-paper-magnifying-glass-wood-desk.png',
    '/assets/reusable/images/bank-advisor-explaining-documents-senior-client.png',
    '/assets/direct/images/sbi-bank-counter-cash-counting.png',
  ];
  const target = preferredSrcs[index];
  if (!target) return null;
  if (usedAssets.has(target) || usedAssets.has(target.replace(/^\/+/, ''))) return null;
  return indexedAssets.find((asset) => asset.src === target) || null;
}

function scoreIndexedAsset(asset, queryTokens, query, usedAssets, usedFamilies, index) {
  const assetText = [
    asset.id,
    asset.title,
    asset.category,
    asset.kind,
    asset.scope,
    asset.detailedDescription,
    asset.useCase,
    ...(asset.tags || []),
    ...(asset.keywords || []),
    ...(asset.useFor || []),
  ].join(' ').toLowerCase();
  const assetTokens = new Set(tokenize(assetText));
  let score = 0;
  for (const token of queryTokens) {
    if (assetTokens.has(token)) score += token.length > 5 ? 3 : 1;
    if (assetText.includes(token)) score += 0.35;
  }
  if (asset.category === 'finance') score += 5;
  if (asset.orientation === 'portrait') score += 3;
  if (asset.scope === 'reusable') score += 1.25;
  if (asset.scope === 'direct' && /\brbi\b|reserve bank|sbi|500|rupee|cash|currency/.test(assetText)) score += 2.5;
  if (/gold buyback|jewelry|jewellery|employees quarters|staff college|college|mortgage|home loan|passport|shopping|ecommerce|celebration/.test(assetText)) score -= 35;
  if (query.includes('Reserve Bank of India') && /reserve bank|rbi/.test(assetText)) score += 12;
  if (query.includes('official RBI statement') && /reserve bank|rbi|policy|document|plaque|entrance/.test(assetText)) score += 22;
  if (query.includes('central bank building') && /reserve bank|rbi|entrance|plaque|facade|professional exit/.test(assetText)) score += 26;
  if (query.includes('denominations') && /coin|calculator|denomination|rupee coin|stacked rupee|calendar/.test(assetText)) score += 24;
  if (query.includes('bank counter') && /bank counter|cash counting|teller|customer document|cash exchange|sbi/.test(assetText)) score += 22;
  if (query.includes('benefits of polymer') && /advisor|consultation|explaining|report|financial review|professional/.test(assetText)) score += 24;
  if (query.includes('countries already') && /advisor|report|analytics|finance|meeting|comparison|global/.test(assetText)) score += 18;
  if (query.includes('document inspection') && /document|letter|paper|magnifying|notebook|report|paperwork/.test(assetText)) score += 24;
  if (query.includes('document inspection') && /blank letter|magnifying|magnifier|paper/.test(assetText)) score += 34;
  if (query.includes('document inspection') && /advisor|consultation|client/.test(assetText)) score -= 18;
  if (query.includes('official document') && /document|letter|paper|magnifying|notebook|report|paperwork|customer document/.test(assetText)) score += 24;
  if (query.includes('official document') && /blank letter|magnifying|magnifier|paper|bank advisor explaining documents/.test(assetText)) score += 18;
  if (query.includes('cash notes on office desk') && /hand holding|hand fanned|500|inr|cash.*desk|rupee notes/.test(assetText)) score += 20;
  if (query.includes('cash notes on office desk') && /hand holding 500 rupee|hand fanned 500|hand holding 500 inr/.test(assetText)) score += 16;
  if (query.includes('financial advisor explaining report') && /financial advisor|advisor.*report|explaining.*report|client financial review/.test(assetText)) score += 28;
  if (query.includes('currency analysis') && /financial report|analytics|advisor|analyzing|report/.test(assetText)) score += 20;
  if (query.includes('rupee notes') && /500|inr|rupee notes|cash/.test(assetText)) score += index <= 1 ? 12 : 1;
  if (usedAssets.has(asset.src)) score -= 12;
  if (index > 0 && usedAssets.has(asset.src.replace(/^\/+/, ''))) score -= 12;
  if (usedFamilies.has(assetFamily(asset))) score -= 18;
  return score + quality(asset) / 10;
}

async function readIndexedAssets() {
  const assetsRoot = JSON.parse(await readFile(path.join(rootDir, 'public', 'assets', 'assets.json'), 'utf8')).assets || [];
  const visualsRoot = JSON.parse(await readFile(path.join(rootDir, 'public', 'visuals', 'asset-index.json'), 'utf8')).assets || [];
  const merged = [...assetsRoot, ...visualsRoot]
    .filter((asset) => asset.safeToUse !== false && asset.needsLabel !== true)
    .filter((asset) => asset.type === 'image')
    .filter((asset) => asset.kind !== 'background' && asset.kind !== 'icon')
    .filter((asset) => !['font', 'sound-effect', 'background-music'].includes(asset.kind || ''))
    .filter((asset) => asset.src);
  return merged.length ? merged : fallbackIndexedAssets;
}

const fallbackIndexedAssets = [
  {src: '/assets/reusable/images/hand-fanned-500-inr-notes-desk.png', title: 'Hand Fanned 500 INR Notes Desk', category: 'finance', orientation: 'portrait', scope: 'reusable'},
  {src: '/assets/reusable/images/bank-counter-customer-document-coin-stack.png', title: 'Bank Counter Customer Document Coin Stack', category: 'finance', orientation: 'portrait', scope: 'reusable'},
  {src: '/assets/reusable/images/stacked-rupee-coins-calculator-calendar-desk.png', title: 'Stacked Rupee Coins Calculator Calendar Desk', category: 'finance', orientation: 'portrait', scope: 'reusable'},
  {src: '/assets/reusable/images/financial-advisor-explaining-report-office-meeting.png', title: 'Financial Advisor Explaining Report Office Meeting', category: 'finance', orientation: 'portrait', scope: 'reusable'},
  {src: '/assets/reusable/images/blank-letter-paper-magnifying-glass-wood-desk.png', title: 'Blank Letter Paper Magnifying Glass Wood Desk', category: 'document', orientation: 'portrait', scope: 'reusable'},
];

function quality(asset) {
  return Number(asset.qualityScore || 0);
}

function assetFamily(asset) {
  const tokens = tokenize(asset.title || asset.id || asset.src)
    .filter((token) => !['inr', 'rupee', 'notes', 'note', 'office', 'desk', 'portrait', 'vertical', 'image'].includes(token))
    .slice(0, 4);
  return tokens.join('-') || String(asset.src || asset.id || '').replace(/^\/+/, '');
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 2)
    .filter((token) => !STOP_WORDS.has(token));
}

function splitLines(text) {
  const words = text.split(/\s+/).filter(Boolean).slice(0, 11);
  if (words.length <= 5) return [words.join(' ')];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
}

function limitWords(text, count) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).slice(0, count).join(' ');
}

function clampTime(value, duration) {
  return Math.max(0, Math.min(duration, Number(value) || 0));
}

function roundTime(value) {
  return Math.round(value * 100) / 100;
}
