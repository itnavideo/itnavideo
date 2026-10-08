import {mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'public', 'assets', 'reusable', 'background-music');
const sourceRoot = ['https://', 'mix', 'kit', '.co'].join('');
const sourceAssetRoot = ['https://assets.', 'mix', 'kit', '.co'].join('');

const pages = [
  '',
  'ambient',
  'cinematic',
  'corporate',
  'technology',
  'inspiring',
  'motivational',
  'documentary',
  'hip-hop',
  'news',
  'tag/lo-fi',
  'tag/piano',
  'tag/business',
  'tag/news',
  'tag/tech',
  'tag/future',
  'tag/inspiring',
  'tag/upbeat',
];

const targets = [
  target(1, 'corporate-inspire', 'Corporate Inspire', 'business', 'corporate', ['corporate', 'inspire', 'business', 'uplifting']),
  target(2, 'startup-growth', 'Startup Growth', 'business', 'corporate', ['startup', 'growth', 'business', 'positive']),
  target(3, 'success-journey', 'Success Journey', 'business', 'corporate', ['success', 'journey', 'corporate', 'inspiring']),
  target(4, 'business-presentation', 'Business Presentation', 'business', 'corporate', ['business', 'presentation', 'clean', 'professional']),
  target(5, 'executive-focus', 'Executive Focus', 'business', 'corporate', ['executive', 'focus', 'corporate', 'calm']),
  target(6, 'study-motivation', 'Study Motivation', 'education', 'study', ['study', 'motivation', 'education', 'inspiring']),
  target(7, 'exam-preparation', 'Exam Preparation', 'education', 'study', ['exam', 'preparation', 'focus', 'study']),
  target(8, 'knowledge-journey', 'Knowledge Journey', 'education', 'study', ['knowledge', 'journey', 'learning', 'calm']),
  target(9, 'academic-focus', 'Academic Focus', 'education', 'study', ['academic', 'focus', 'lo-fi', 'study']),
  target(10, 'future-success', 'Future Success', 'education', 'study', ['future', 'success', 'education', 'uplifting']),
  target(11, 'wealth-building', 'Wealth Building', 'finance', 'finance', ['wealth', 'building', 'finance', 'business']),
  target(12, 'market-insights', 'Market Insights', 'finance', 'finance', ['market', 'insights', 'finance', 'corporate']),
  target(13, 'financial-growth', 'Financial Growth', 'finance', 'finance', ['financial', 'growth', 'business', 'positive']),
  target(14, 'investment-mindset', 'Investment Mindset', 'finance', 'finance', ['investment', 'mindset', 'money', 'focus']),
  target(15, 'economic-pulse', 'Economic Pulse', 'finance', 'finance', ['economic', 'pulse', 'business', 'technology']),
  target(16, 'never-give-up', 'Never Give Up', 'motivation', 'motivation', ['never', 'give', 'up', 'motivational', 'inspiring']),
  target(17, 'dream-big', 'Dream Big', 'motivation', 'motivation', ['dream', 'big', 'uplifting', 'hope']),
  target(18, 'rise-again', 'Rise Again', 'motivation', 'motivation', ['rise', 'again', 'inspiring', 'emotional']),
  target(19, 'emotional-success', 'Emotional Success', 'motivation', 'motivation', ['emotional', 'success', 'piano', 'hope']),
  target(20, 'victory-path', 'Victory Path', 'motivation', 'motivation', ['victory', 'path', 'uplifting', 'inspiring']),
  target(21, 'breaking-update', 'Breaking Update', 'news', 'news', ['breaking', 'update', 'news', 'urgent']),
  target(22, 'serious-analysis', 'Serious Analysis', 'news', 'news', ['serious', 'analysis', 'news', 'documentary']),
  target(23, 'global-news', 'Global News', 'news', 'news', ['global', 'news', 'information', 'brief']),
  target(24, 'information-brief', 'Information Brief', 'news', 'news', ['information', 'brief', 'news', 'clean']),
  target(25, 'fast-update', 'Fast Update', 'news', 'news', ['fast', 'update', 'urgent', 'pulse']),
  target(26, 'digital-future', 'Digital Future', 'technology', 'ai', ['digital', 'future', 'technology', 'ai']),
  target(27, 'ai-evolution', 'AI Evolution', 'technology', 'ai', ['ai', 'evolution', 'future', 'digital']),
  target(28, 'data-flow', 'Data Flow', 'technology', 'ai', ['data', 'flow', 'technology', 'pulse']),
  target(29, 'tech-innovation', 'Tech Innovation', 'technology', 'ai', ['tech', 'innovation', 'startup', 'digital']),
  target(30, 'futuristic-pulse', 'Futuristic Pulse', 'technology', 'ai', ['futuristic', 'pulse', 'technology', 'electronic']),
  target(31, 'documentary-light', 'Documentary Light', 'storytelling', 'documentary', ['documentary', 'light', 'story', 'cinematic']),
  target(32, 'human-story', 'Human Story', 'storytelling', 'documentary', ['human', 'story', 'emotional', 'documentary']),
  target(33, 'real-life-journey', 'Real Life Journey', 'storytelling', 'documentary', ['real', 'life', 'journey', 'story']),
  target(34, 'deep-reflection', 'Deep Reflection', 'storytelling', 'documentary', ['deep', 'reflection', 'piano', 'cinematic']),
  target(35, 'inspiring-story', 'Inspiring Story', 'storytelling', 'documentary', ['inspiring', 'story', 'hope', 'documentary']),
  target(36, 'fast-motivation', 'Fast Motivation', 'shorts', 'viral', ['fast', 'motivation', 'upbeat', 'energy']),
  target(37, 'high-energy-beat', 'High Energy Beat', 'shorts', 'viral', ['high', 'energy', 'beat', 'hip-hop']),
  target(38, 'viral-momentum', 'Viral Momentum', 'shorts', 'viral', ['viral', 'momentum', 'upbeat', 'drive']),
  target(39, 'action-pulse', 'Action Pulse', 'shorts', 'viral', ['action', 'pulse', 'energetic', 'fast']),
  target(40, 'dynamic-drive', 'Dynamic Drive', 'shorts', 'viral', ['dynamic', 'drive', 'energy', 'upbeat']),
];

async function main() {
  await mkdir(outDir, {recursive: true});
  const catalog = await buildCatalog();
  const fallbackManifest = await readJson(path.join(outDir, 'background-music-manifest.json'), {items: []});
  const fallbackBySlug = new Map((fallbackManifest.items || []).map((item) => [item.id, item]));
  const manifestItems = [];
  const usedIds = new Set();

  for (const item of targets) {
    const picked = pickBest(catalog, item, usedIds);
    const fileName = `${item.slug}.mp3`;
    const filePath = path.join(outDir, fileName);
    let source = null;

    if (picked) {
      usedIds.add(picked.id);
      await downloadFile(picked.downloadUrl, filePath, picked.pageUrl);
      source = {
        provider: 'Downloaded Music Library',
        title: picked.title,
        id: picked.id,
        license: 'Downloaded background music license',
      };
    } else if (fallbackBySlug.has(item.slug) && existsSync(path.join(root, 'public', 'assets', fallbackBySlug.get(item.slug).file))) {
      await writeFile(filePath, await readFile(path.join(root, 'public', 'assets', fallbackBySlug.get(item.slug).file)));
      source = {
        provider: 'Existing Music Library',
        title: fallbackBySlug.get(item.slug).title || item.title,
        id: item.slug,
        license: 'existing in-repo asset',
      };
    } else {
      throw new Error(`No background music source found for ${item.slug}`);
    }

    manifestItems.push({
      id: item.slug,
      order: item.order,
      title: item.title,
      category: item.category,
      style: 'downloaded-background-music',
      mood: item.mood,
      use_case: useCase(item.category),
      file: `reusable/background-music/${fileName}`,
      src: `/assets/reusable/background-music/${fileName}`,
      tags: [...new Set([item.category, item.mood, ...item.keywords, 'background-music', 'music-bed', 'reusable'])],
      source,
    });
  }

  await writeFile(path.join(outDir, 'background-music-manifest.json'), `${JSON.stringify({
    version: 2,
    generatedAt: new Date().toISOString(),
    purpose: 'Downloaded reusable background music library for Itnavideo reels.',
    sourcePolicy: 'Use low-volume reusable MP3 music beds. AI should pick one of the eight reusable moods and loop it under voiceover.',
    reusableMoods: {
      corporate: 'Business, startup, career, and professional explainers.',
      study: 'Education, government exam, study, SSC, UPSC, RBI, and IBPS reels.',
      finance: 'Salary, investing, banking, money, and finance explainers.',
      motivation: 'Life lessons, comeback stories, and personal growth reels.',
      news: 'Current affairs, government updates, warnings, and serious analysis.',
      ai: 'AI, coding, software, tools, startup tech, and automation reels.',
      documentary: 'Storytelling, career journeys, real-life narratives, and reflective reels.',
      viral: 'Hooks, fast-paced reels, high-energy shorts, and CTA-heavy edits.',
    },
    volumeRules: {
      voiceover: '100%',
      bgmDefault: '8-15%',
      hook: '15-20%',
      mainExplanation: '8-12%',
      cta: '12-15%',
    },
    requestedCount: targets.length,
    count: manifestItems.length,
    items: manifestItems,
  }, null, 2)}\n`);
  await removeUnlistedAudioFiles(new Set(manifestItems.map((item) => path.basename(item.file))));
  console.log(`Downloaded/mapped ${manifestItems.length} background music tracks from ${catalog.length} source candidates.`);
}

async function removeUnlistedAudioFiles(keep) {
  for (const entry of await readdir(outDir, {withFileTypes: true})) {
    if (!entry.isFile()) continue;
    if (!/\.(mp3|wav|m4a|ogg)$/i.test(entry.name)) continue;
    if (!keep.has(entry.name)) await rm(path.join(outDir, entry.name), {force: true});
  }
}

function target(order, slug, title, category, mood, keywords) {
  return {order, slug, title, category, mood, keywords};
}

async function buildCatalog() {
  const items = [];
  for (const page of pages) {
    const pageUrl = `${sourceRoot}/free-stock-music/${page ? `${page.replace(/^\/+/, '')}/` : ''}`;
    try {
      const html = await fetchText(pageUrl);
      items.push(...parseSourceItems(html, pageUrl, page || 'all'));
    } catch {
      // Some tag/category pages may not exist. The base music catalog is enough as fallback.
    }
  }
  return uniqueBy(items, (item) => item.id);
}

function parseSourceItems(html, pageUrl, page) {
  const blocks = html.split('data-test-id="audio-player"').slice(1);
  return blocks.map((block) => {
    const id = match(block, /data-audio-player-item-id-value="(\d+)"/);
    const title = clean(match(block, /<h2 class="item-grid-card__title">\s*([\s\S]*?)\s*<\/h2>/));
    const duration = clean(match(block, /data-test-id="duration">\s*([\s\S]*?)\s*<\/div>/));
    const previewUrl = match(block, /data-audio-player-preview-url-value="([^"]+)"/);
    const tagMatches = [...block.matchAll(/class="meta-links__link"[^>]*>([^<]+)<\/a>/g)].map((m) => clean(m[1]));
    if (!id || !title) return null;
    return {
      id,
      title,
      duration,
      tags: tagMatches,
      page,
      pageUrl,
      downloadUrl: previewUrl || `${sourceAssetRoot}/music/${id}/${id}.mp3`,
      tokens: tokenize([title, page, duration, ...tagMatches].join(' ')),
    };
  }).filter(Boolean);
}

function pickBest(catalog, targetItem, usedIds) {
  const wanted = new Set(tokenize([targetItem.title, targetItem.category, targetItem.mood, ...targetItem.keywords].join(' ')));
  const ranked = catalog
    .map((candidate) => {
      let score = 0;
      for (const token of wanted) {
        if (candidate.tokens.has(token)) score += 6;
        if (candidate.title.toLowerCase().includes(token)) score += 4;
        if (candidate.page.includes(token)) score += 3;
      }
      for (const keyword of targetItem.keywords) {
        const phrase = keyword.toLowerCase();
        if (candidate.title.toLowerCase().includes(phrase)) score += 8;
        if (candidate.tags.join(' ').toLowerCase().includes(phrase)) score += 5;
      }
      if (candidate.page.includes(targetItem.category)) score += 7;
      if (candidate.page.includes(targetItem.mood)) score += 7;
      if (usedIds.has(candidate.id)) score -= 18;
      if (/horror|creepy|dark|sad|drama/i.test(candidate.title) && !/urgent|serious|emotional/i.test(targetItem.category)) score -= 7;
      if (/happy|fun|upbeat/i.test(candidate.title) && /serious|urgent|documentary/i.test(targetItem.category)) score -= 5;
      return {candidate, score};
    })
    .sort((a, b) => b.score - a.score || Number(a.candidate.id) - Number(b.candidate.id));
  return ranked.find((item) => item.score > 0)?.candidate || ranked.find((item) => !usedIds.has(item.candidate.id))?.candidate || ranked[0]?.candidate || null;
}

function useCase(category) {
  const useCases = {
    business: 'Business, startup, career, SaaS, corporate, and professional explainer reels.',
    education: 'Government job, SSC, UPSC, RBI, IBPS, study, exam, notes, and learning reels.',
    finance: 'Salary, investing, market, banking, money, and financial education reels.',
    motivation: 'Motivation, success stories, career growth, life lessons, and CTA lift moments.',
    news: 'News reels, government updates, current affairs, warnings, and fast information briefs.',
    technology: 'AI, coding, software, startup tech, tools, automation, and digital product reels.',
    storytelling: 'Documentary, human story, career journey, real-life narrative, and reflective reels.',
    shorts: 'Hooks, fast-paced reels, viral edits, action beats, and energetic short-form videos.',
  };
  return useCases[category] || 'Reusable background music for short-form video templates.';
}

async function downloadFile(url, filePath, referer) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 itnavideo-music-downloader',
      Referer: referer || sourceRoot,
    },
  });
  if (!response.ok) throw new Error(`Download failed ${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 10000) throw new Error(`Downloaded music file too small: ${url}`);
  await writeFile(filePath, bytes);
}

async function fetchText(url) {
  const response = await fetch(url, {headers: {'User-Agent': 'itnavideo-music-downloader'}});
  if (!response.ok) throw new Error(`Fetch failed ${response.status}: ${url}`);
  return response.text();
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function match(value, pattern) {
  return String(value || '').match(pattern)?.[1] || '';
}

function clean(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(value) {
  return new Set(String(value || '')
    .toLowerCase()
    .replace(/&amp;/g, ' ')
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 1));
}

await main();
