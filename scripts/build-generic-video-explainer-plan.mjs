import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const transcriptPath = path.resolve(rootDir, process.env.TRANSCRIPT_JSON || '');
const outputPath = path.resolve(rootDir, process.env.REEL_PLAN_OUTPUT || 'public/renders/plans/generic-video-explainer-plan.json');
const mediaSrc = process.env.REEL_MEDIA_SRC || '';
const topicTitle = process.env.REEL_TOPIC_TITLE || 'Explainer Video';
const maxDurationSeconds = Number(process.env.REEL_MAX_SECONDS || 60);
const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'into', 'your', 'video', 'reel', 'scene', 'visual', 'preview', 'explainer']);

if (!transcriptPath || transcriptPath === rootDir) throw new Error('Set TRANSCRIPT_JSON to a transcript JSON file.');
if (!mediaSrc) throw new Error('Set REEL_MEDIA_SRC to the uploaded media path inside public/.');

const transcript = JSON.parse(await readFile(transcriptPath, 'utf8'));
const indexedAssets = await readIndexedAssets();
const sourceDurationSeconds = Number(transcript.duration) || maxDurationSeconds;
const durationSeconds = Math.min(maxDurationSeconds, Math.max(1, sourceDurationSeconds));
const sourceSegments = normalizeSegments(transcript.segments || [], durationSeconds);
const captionChunks = buildCaptionChunks(sourceSegments, durationSeconds);
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
  mediaTrimStartSeconds: 0,
  sourceDurationSeconds,
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

function normalizeSegments(segments, duration) {
  return segments
    .map((segment) => ({
      start: clampTime(segment.start, duration),
      end: clampTime(segment.end, duration),
      text: String(segment.text || '').trim(),
    }))
    .filter((segment) => segment.end > segment.start && segment.text && segment.start < duration);
}

function selectBackgroundMusic({topicTitle, transcript}) {
  const text = `${topicTitle} ${transcript}`.toLowerCase();
  const rules = [
    {category: 'finance', mood: 'finance', src: 'assets/reusable/background-music/economic-pulse.mp3', volume: 0.052, pattern: /\b(rbi|reserve bank|banking|currency|rupee|cash|money|finance|financial|salary|market|investment|loan|tax|budget|economy|economic)\b/},
    {category: 'study', mood: 'study', src: 'assets/reusable/background-music/study-motivation.mp3', volume: 0.05, pattern: /\b(exam|student|study|learn|lesson|class|school|college|teacher|education)\b/},
    {category: 'tech-ai', mood: 'ai', src: 'assets/reusable/background-music/digital-future.mp3', volume: 0.048, pattern: /\b(ai|artificial intelligence|software|coding|app|automation|chatgpt|startup|tech|tool|saas)\b/},
    {category: 'motivation', mood: 'motivation', src: 'assets/reusable/background-music/emotional-success.mp3', volume: 0.05, pattern: /\b(confidence|emotion|body language|self|awareness|habit|control|success|motivation|life|mindset|dream|struggle|discipline|present moment|observe)\b/},
    {category: 'documentary', mood: 'documentary', src: 'assets/reusable/background-music/human-story.mp3', volume: 0.046, pattern: /\b(story|journey|history|case study|real life|relationship|date|conversation)\b/},
    {category: 'news', mood: 'news', src: 'assets/reusable/background-music/serious-analysis.mp3', volume: 0.048, pattern: /\b(breaking|alert|warning|latest|update|minister|court|policy|notice|official|government)\b/},
  ];
  return rules.find((rule) => rule.pattern.test(text)) || {category: 'general-explainer', mood: 'corporate', src: 'assets/reusable/background-music/corporate-inspire.mp3', volume: 0.048};
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
      chunks.push({start: roundTime(partStart), end: roundTime(partEnd), text, lines: splitLines(text), mode: 'wordHighlight'});
    });
  }
  return chunks
    .filter((caption) => caption.start < duration)
    .slice(0, 34)
    .map((caption, index, list) => ({...caption, id: `caption-${String(index + 1).padStart(2, '0')}`, end: roundTime(Math.min(caption.end, list[index + 1]?.start ?? caption.end, duration))}));
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
      primaryVisual: {type: 'image', assetId: role.asset, label: role.label, prompt: role.visual, motion: role.motion},
    });
  }
  return scenes;
}

function buildAssetTimeline(overlays) {
  return overlays.map((overlay, index) => ({id: `asset-${String(index + 1).padStart(2, '0')}`, start: overlay.start, end: overlay.end, src: overlay.primaryVisual.assetId, role: 'primary', kind: 'image', label: overlay.primaryVisual.label, motion: overlay.primaryVisual.motion}));
}

function sceneRole(text, index, usedAssets, usedFamilies) {
  const brief = sceneBrief(text, index);
  const picked = pickPreferredAsset(index) || pickIndexedImage(brief, usedAssets, usedFamilies, index);
  return {
    asset: picked.src.replace(/^\/+/, ''),
    family: assetFamily(picked),
    label: picked.title || picked.id || 'Selected visual',
    visual: brief,
    motion: index % 3 === 0 ? 'slowZoom' : index % 3 === 1 ? 'panLeft' : 'float',
    sfx: sceneSfx(brief, text, index),
    layout: index === 0 ? 'statCard' : /pause|observe|control|awareness/.test(brief.toLowerCase()) ? 'explainer' : 'split',
    type: index === 0 ? 'stat' : /warning|stop|pause/.test(brief.toLowerCase()) ? 'warning' : 'point',
  };
}

function pickPreferredAsset(index) {
  const preferred = [
    '/assets/reusable/images/executive-walking-sunlit-lobby.png',
    '/assets/reusable/images/woman-silhouette-office-sunset-view.png',
    '/assets/reusable/images/content-creator-whiteboard-sticky-grid-vertical.png',
    '/assets/reusable/images/minimalist-beige-notebook-headphones-zen-desk.png',
    '/assets/direct/images/business-lunch-two-women-restaurant-portrait.png',
    '/assets/reusable/images/person-writing-notebook-desk-charts.png',
    '/assets/direct/images/woman-working-laptop-focus-mug.png',
    '/assets/reusable/images/student-night-study-desk-notebook.png',
    '/assets/direct/images/monthly-planner-workstation-goal-planning.png',
    '/assets/reusable/images/team-brainstorm-postit-workshop-vertical.png',
  ];
  const src = preferred[index % preferred.length];
  const match = indexedAssets.find((asset) => asset.src === src || asset.src?.replace(/^\/+/, '') === src.replace(/^\/+/, ''));
  return match || {src, title: src.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') || 'Selected visual', category: 'self-improvement'};
}

function sceneBrief(text, index) {
  const normalized = text.toLowerCase();
  const base = 'self awareness psychology trick, confidence, body language, emotions, present moment, personal growth';
  if (/stand out|crowd|aura|confidence|body language/.test(normalized)) return `${base}, confident person entering room, strong body language, self improvement hook`;
  if (/psychological trick|awareness|actions in life|remember this/.test(normalized)) return `${base}, mindfulness awareness concept, person thinking calmly, mental clarity`;
  if (/date|talking|question|person/.test(normalized)) return `${base}, conversation on a date, listening versus talking too much, social awareness`;
  if (/talking too much|stop and analyze|stories/.test(normalized)) return `${base}, pause and reflect, person catching themselves mid conversation, awareness moment`;
  if (/present|control|decision|split second/.test(normalized)) return `${base}, present moment control, calm decision, emotional regulation`;
  if (/robot|words|mouth|actions/.test(normalized)) return `${base}, mindful speech, controlled words, expressive conversation`;
  if (/thoughts|mind|roti|household|direction/.test(normalized)) return `${base}, person doing household work while thinking, thoughts awareness, daily mindfulness`;
  if (/month|two months|change|better control/.test(normalized)) return `${base}, personal transformation, habit tracking, self improvement progress`;
  if (/habit|shaking|leg|stop/.test(normalized)) return `${base}, breaking small habits, self correction, awareness of body movement`;
  return `${base}, ${limitWords(text, 12)}`;
}

function sceneSfx(brief, text, index) {
  const source = `${brief} ${text}`.toLowerCase();
  if (index === 0) return 'softPop';
  if (/pause|stop|observe|awareness|present/.test(source)) return 'bell';
  if (/thought|mind|thinking|clarity/.test(source)) return 'softChime';
  if (/date|talking|conversation|question/.test(source)) return 'whoosh';
  if (/habit|control|change|decision/.test(source)) return 'stamp';
  return index % 2 === 0 ? 'softTick' : 'whoosh';
}

function pickIndexedImage(query, usedAssets, usedFamilies, index) {
  const queryTokens = new Set(tokenize(query));
  const ranked = indexedAssets
    .map((asset) => ({asset, score: scoreIndexedAsset(asset, queryTokens, query.toLowerCase(), usedAssets, usedFamilies, index)}))
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score || quality(b.asset) - quality(a.asset));
  return (ranked[0]?.asset || fallbackIndexedAssets[index % fallbackIndexedAssets.length]);
}

function scoreIndexedAsset(asset, queryTokens, query, usedAssets, usedFamilies) {
  const assetText = [asset.id, asset.title, asset.category, asset.kind, asset.scope, asset.detailedDescription, asset.useCase, asset.emotion, ...(asset.tags || []), ...(asset.keywords || [])].join(' ').toLowerCase();
  const assetTokens = new Set(tokenize(assetText));
  let score = 0;
  for (const token of queryTokens) {
    if (assetTokens.has(token)) score += token.length > 5 ? 3 : 1;
    if (assetText.includes(token)) score += 0.4;
  }
  if (/person|portrait|student|professional|conversation|meeting|thinking|mind|success|focus|confidence|coach|journal|notebook|silhouette|creator|whiteboard/.test(assetText)) score += 8;
  if (/finance|bank|cash|rupee|airport|delivery|gold|passport|shopping|ecommerce|server|cloud|gemstone|jewelry|traffic|rural/.test(assetText)) score -= 18;
  if (query.includes('conversation') && /meeting|consultation|talk|professional|portrait/.test(assetText)) score += 8;
  if (query.includes('thought') && /focused|thinking|desk|journal|notes|calm/.test(assetText)) score += 8;
  if (query.includes('habit') && /focused|student|professional|journey|success/.test(assetText)) score += 7;
  if (usedAssets.has(asset.src)) score -= 12;
  if (usedFamilies.has(assetFamily(asset))) score -= 8;
  return score + quality(asset) / 10;
}

async function readIndexedAssets() {
  const assetsRoot = JSON.parse(await readFile(path.join(rootDir, 'public', 'assets', 'assets.json'), 'utf8')).assets || [];
  const visualsRoot = JSON.parse(await readFile(path.join(rootDir, 'public', 'visuals', 'asset-index.json'), 'utf8')).assets || [];
  return [...assetsRoot, ...visualsRoot]
    .filter((asset) => asset.safeToUse !== false && asset.needsLabel !== true)
    .filter((asset) => asset.type === 'image')
    .filter((asset) => asset.kind !== 'background' && asset.kind !== 'icon')
    .filter((asset) => !['font', 'sound-effect', 'background-music'].includes(asset.kind || ''))
    .filter((asset) => asset.src);
}

const fallbackIndexedAssets = [
  {src: '/visuals/site-scenes/students-campus-walk.png', title: 'Students Campus Walk', category: 'education', orientation: 'portrait', scope: 'visuals'},
  {src: '/visuals/site-scenes/creator-recording-reel.png', title: 'Creator Recording Reel', category: 'creator', orientation: 'portrait', scope: 'visuals'},
  {src: '/visuals/site-scenes/ai-engineer-night-work.png', title: 'Focused Night Work', category: 'work', orientation: 'portrait', scope: 'visuals'},
  {src: '/visuals/founder/syed-mohammed-rohi.webp', title: 'Founder Portrait', category: 'portrait', orientation: 'portrait', scope: 'visuals'},
];

function quality(asset) {
  return Number(asset.qualityScore || 0);
}

function assetFamily(asset) {
  return tokenize(asset.title || asset.id || asset.src).filter((token) => !['image', 'portrait', 'vertical', 'person'].includes(token)).slice(0, 4).join('-') || String(asset.src || asset.id || '');
}

function tokenize(value) {
  return String(value || '').toLowerCase().split(/[^a-z0-9]+/g).filter((token) => token.length > 2).filter((token) => !STOP_WORDS.has(token));
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
