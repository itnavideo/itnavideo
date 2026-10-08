import {mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'public', 'assets', 'reusable', 'sound-effects');
const sourceRoot = ['https://', 'mix', 'kit', '.co'].join('');
const sourceAssetRoot = ['https://assets.', 'mix', 'kit', '.co'].join('');
const pages = [
  'whoosh',
  'swoosh',
  'sweep',
  'swipe',
  'pop',
  'alerts',
  'click',
  'keyboard',
  'notification',
  'ding',
  'countdown',
  'bleep',
  'high-tech',
  'impact',
  'hit',
  'boom',
  'alarm',
  'error',
  'coin',
  'money',
  'bell',
  'win',
  'page',
  'paper',
  'write',
  'office',
  'typewriter',
  'printer',
  'robot',
  'sci-fi',
  'heartbeat',
  'piano',
  'chimes',
  'interface',
  'technology',
  'transition',
];

const targets = [
  target(1, 'whoosh-short', 'Whoosh Short', 'transition', ['whoosh', 'short', 'fast']),
  target(2, 'whoosh-medium', 'Whoosh Medium', 'transition', ['whoosh', 'medium', 'transition']),
  target(3, 'whoosh-fast', 'Whoosh Fast', 'transition', ['whoosh', 'fast']),
  target(4, 'swipe-left', 'Swipe Left', 'transition', ['swipe', 'slide', 'left']),
  target(5, 'swipe-right', 'Swipe Right', 'transition', ['swipe', 'slide', 'right']),
  target(6, 'air-rush', 'Air Rush', 'transition', ['air', 'woosh', 'wind']),
  target(7, 'transition-sweep', 'Transition Sweep', 'transition', ['sweep', 'swoosh', 'transition']),
  target(8, 'pop-soft', 'Pop Soft', 'text-pop', ['pop', 'soft', 'notification']),
  target(9, 'pop-medium', 'Pop Medium', 'text-pop', ['pop', 'medium', 'message']),
  target(10, 'pop-strong', 'Pop Strong', 'text-pop', ['pop', 'strong', 'impact']),
  target(11, 'bubble-pop', 'Bubble Pop', 'text-pop', ['bubble', 'pop']),
  target(12, 'ui-click-pop', 'UI Click Pop', 'text-pop', ['ui', 'click', 'pop', 'interface']),
  target(13, 'mouse-click', 'Mouse Click', 'ui', ['mouse', 'click']),
  target(14, 'soft-click', 'Soft Click', 'ui', ['soft', 'click', 'interface']),
  target(15, 'keyboard-tap', 'Keyboard Tap', 'ui', ['keyboard', 'tap', 'typing']),
  target(16, 'notification-ding', 'Notification Ding', 'ui', ['notification', 'ding']),
  target(17, 'success-chime', 'Success Chime', 'ui', ['success', 'chime', 'win']),
  target(18, 'toggle-switch', 'Toggle Switch', 'ui', ['switch', 'click', 'interface']),
  target(19, 'digital-beep', 'Digital Beep', 'ui', ['digital', 'beep', 'bleep']),
  target(20, 'counter-tick', 'Counter Tick', 'statistic', ['counter', 'tick', 'countdown']),
  target(21, 'count-up-beep', 'Count Up Beep', 'statistic', ['count', 'beep', 'bleep']),
  target(22, 'data-pulse', 'Data Pulse', 'statistic', ['data', 'pulse', 'technology']),
  target(23, 'score-reveal', 'Score Reveal', 'statistic', ['score', 'reveal', 'win']),
  target(24, 'digital-tick', 'Digital Tick', 'statistic', ['digital', 'tick', 'click']),
  target(25, 'hit-soft', 'Hit Soft', 'impact', ['hit', 'soft']),
  target(26, 'hit-medium', 'Hit Medium', 'impact', ['hit', 'impact']),
  target(27, 'hit-strong', 'Hit Strong', 'impact', ['hit', 'strong', 'impact']),
  target(28, 'bass-drop-light', 'Bass Drop Light', 'impact', ['bass', 'drop']),
  target(29, 'cinematic-boom', 'Cinematic Boom', 'impact', ['cinematic', 'boom', 'impact']),
  target(30, 'warning-beep', 'Warning Beep', 'warning', ['warning', 'beep', 'alarm']),
  target(31, 'alarm-tick', 'Alarm Tick', 'warning', ['alarm', 'tick', 'countdown']),
  target(32, 'negative-buzz', 'Negative Buzz', 'warning', ['negative', 'buzz', 'error']),
  target(33, 'error-sound', 'Error Sound', 'warning', ['error', 'wrong']),
  target(34, 'achievement-unlock', 'Achievement Unlock', 'success', ['unlock', 'win', 'achievement']),
  target(35, 'trophy-sound', 'Trophy Sound', 'success', ['trophy', 'win', 'success']),
  target(36, 'cash-register', 'Cash Register', 'success', ['cash', 'register', 'money']),
  target(37, 'coin-drop', 'Coin Drop', 'success', ['coin', 'drop']),
  target(38, 'success-bell', 'Success Bell', 'success', ['success', 'bell']),
  target(39, 'coin-stack', 'Coin Stack', 'finance', ['coin', 'stack', 'money']),
  target(40, 'coin-drop-finance', 'Coin Drop', 'finance', ['coin', 'drop', 'money']),
  target(41, 'cash-count', 'Cash Count', 'finance', ['cash', 'count', 'money']),
  target(42, 'wallet-open', 'Wallet Open', 'finance', ['wallet', 'open', 'money']),
  target(43, 'payment-success', 'Payment Success', 'finance', ['payment', 'success', 'cash']),
  target(44, 'pen-writing', 'Pen Writing', 'education', ['pen', 'writing', 'write']),
  target(45, 'page-flip', 'Page Flip', 'education', ['page', 'flip']),
  target(46, 'paper-turn', 'Paper Turn', 'education', ['paper', 'turn']),
  target(47, 'exam-bell', 'Exam Bell', 'education', ['exam', 'bell', 'school']),
  target(48, 'stamp-approved', 'Stamp Approved', 'education', ['stamp', 'approved', 'document']),
  target(49, 'office-ambience', 'Office Ambience', 'office', ['office', 'ambience']),
  target(50, 'typing-fast', 'Typing Fast', 'office', ['typing', 'keyboard', 'fast']),
  target(51, 'meeting-notification', 'Meeting Notification', 'office', ['meeting', 'notification']),
  target(52, 'printer-sound', 'Printer Sound', 'office', ['printer', 'office']),
  target(53, 'document-slide', 'Document Slide', 'office', ['document', 'paper', 'slide']),
  target(54, 'robot-beep', 'Robot Beep', 'tech-ai', ['robot', 'beep']),
  target(55, 'data-scan', 'Data Scan', 'tech-ai', ['data', 'scan', 'high', 'tech']),
  target(56, 'digital-loading', 'Digital Loading', 'tech-ai', ['digital', 'loading', 'technology']),
  target(57, 'ai-processing', 'AI Processing', 'tech-ai', ['ai', 'processing', 'technology']),
  target(58, 'hologram-activate', 'Hologram Activate', 'tech-ai', ['hologram', 'activate', 'sci-fi']),
  target(59, 'heartbeat-soft', 'Heartbeat Soft', 'motivation', ['heartbeat', 'soft']),
  target(60, 'rise-sweep', 'Rise Sweep', 'motivation', ['rise', 'sweep', 'transition']),
  target(61, 'emotional-piano-hit', 'Emotional Piano Hit', 'motivation', ['piano', 'emotional', 'hit']),
  target(62, 'hope-chime', 'Hope Chime', 'motivation', ['hope', 'chime', 'bell']),
  target(63, 'victory-rise', 'Victory Rise', 'motivation', ['victory', 'win', 'rise']),
  target(64, 'bell-ding', 'Bell Ding', 'cta', ['bell', 'ding']),
  target(65, 'subscribe-pop', 'Subscribe Pop', 'cta', ['subscribe', 'pop']),
  target(66, 'click-confirm', 'Click Confirm', 'cta', ['click', 'confirm']),
  target(67, 'notification-bell', 'Notification Bell', 'cta', ['notification', 'bell']),
  target(68, 'end-stinger', 'End Stinger', 'cta', ['end', 'stinger', 'intro']),
];

async function main() {
  await mkdir(outDir, {recursive: true});
  const catalog = await buildCatalog();
  const fallbackManifest = await readJson(path.join(outDir, 'sound-effects-manifest.json'), {items: []});
  const fallbackBySlug = new Map((fallbackManifest.items || []).map((item) => [item.id, item]));
  const manifestItems = [];
  const usedIds = new Set();

  for (const item of targets) {
    const picked = pickBest(catalog, item, usedIds);
    const download = picked ? await resolveDownload(picked) : null;
    const extension = download?.extension || 'wav';
    const fileName = `${item.slug}.${extension}`;
    const filePath = path.join(outDir, fileName);
    let source = null;

    if (picked && download) {
      source = {
        provider: 'Downloaded SFX Library',
        title: picked.title,
        id: picked.id,
        page: picked.pageUrl,
        downloadUrl: download.url,
        license: 'Downloaded sound effects license',
      };
      usedIds.add(picked.id);
      await downloadFile(download.url, filePath, picked.pageUrl);
    } else if (fallbackBySlug.has(item.slug) && existsSync(path.join(root, 'public', 'assets', fallbackBySlug.get(item.slug).file))) {
      await writeFile(filePath, await readFile(path.join(root, 'public', 'assets', fallbackBySlug.get(item.slug).file)));
      source = {
        provider: 'Generated fallback',
        title: fallbackBySlug.get(item.slug).title || item.title,
        id: item.slug,
        page: '',
        downloadUrl: '',
        license: 'generated in-repo',
      };
    } else {
      throw new Error(`No source found for ${item.slug}`);
    }

    manifestItems.push({
      id: item.slug,
      order: item.order,
      title: item.title,
      category: item.category,
      style: source.provider === 'Downloaded SFX Library' ? 'downloaded-sfx' : 'synthetic-video-safe',
      use_case: useCase(item.category),
      file: `reusable/sound-effects/${fileName}`,
      src: `/assets/reusable/sound-effects/${fileName}`,
      tags: [...new Set([item.category, ...item.keywords, 'sfx', 'short-reel', 'reusable'])],
      source,
    });
  }

  await writeFile(path.join(outDir, 'sound-effects-manifest.json'), `${JSON.stringify({
    version: 2,
    generatedAt: new Date().toISOString(),
    purpose: 'Downloaded reusable SFX library for Itnavideo reels.',
    sourcePolicy: 'Prefer downloaded WAV files; generated fallback only if no reasonable downloaded match exists.',
    requestedCount: targets.length,
    count: manifestItems.length,
    items: manifestItems,
  }, null, 2)}\n`);
  await removeUnlistedAudioFiles(new Set(manifestItems.map((item) => path.basename(item.file))));
  console.log(`Downloaded/mapped ${manifestItems.length} SFX from ${catalog.length} source candidates.`);
}

async function removeUnlistedAudioFiles(keep) {
  for (const entry of await readdir(outDir, {withFileTypes: true})) {
    if (!entry.isFile()) continue;
    if (!/\.(wav|mp3|m4a|ogg)$/i.test(entry.name)) continue;
    if (!keep.has(entry.name)) await rm(path.join(outDir, entry.name), {force: true});
  }
}

function target(order, slug, title, category, keywords) {
  return {order, slug, title, category, keywords};
}

async function buildCatalog() {
  const items = [];
  for (const page of pages) {
    const pageUrl = `${sourceRoot}/free-sound-effects/${page}/`;
    const html = await fetchText(pageUrl);
    items.push(...parseSourceItems(html, pageUrl, page));
  }
  return uniqueBy(items, (item) => item.id);
}

function parseSourceItems(html, pageUrl, page) {
  const blocks = html.split('data-test-id="audio-player"').slice(1);
  return blocks.map((block) => {
    const id = match(block, /data-audio-player-item-id-value="(\d+)"/);
    const title = clean(match(block, /<h2 class="item-grid-card__title">\s*([\s\S]*?)\s*<\/h2>/));
    const duration = clean(match(block, /data-test-id="duration">\s*([\s\S]*?)\s*<\/div>/));
    const tagMatches = [...block.matchAll(/class="meta-links__link"[^>]*>([^<]+)<\/a>/g)].map((m) => clean(m[1]));
    if (!id || !title) return null;
    return {
      id,
      title,
      duration,
      tags: tagMatches,
      page,
      pageUrl,
      downloadUrl: `${sourceAssetRoot}/active_storage/sfx/${id}/${id}.wav`,
      previewUrl: `${sourceAssetRoot}/active_storage/sfx/${id}/${id}-preview.mp3`,
      tokens: tokenize([title, page, ...tagMatches].join(' ')),
    };
  }).filter(Boolean);
}

function pickBest(catalog, targetItem, usedIds) {
  const wanted = new Set(tokenize([targetItem.title, targetItem.category, ...targetItem.keywords].join(' ')));
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
      if (usedIds.has(candidate.id)) score -= 4;
      if (/ambience|loop|suspense|music|rain|crowd/i.test(candidate.title) && !/ambience|piano|heartbeat/i.test(targetItem.title)) score -= 12;
      return {candidate, score};
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || Number(a.candidate.id) - Number(b.candidate.id));
  return ranked[0]?.candidate || null;
}

async function resolveDownload(candidate) {
  const modalUrl = `${sourceRoot}/free-sound-effects/download/${candidate.id}/?context=item+grid`;
  try {
    const html = await fetchText(modalUrl);
    const url = match(html, /data-download--modal-url-value="([^"]+)"/);
    if (url) {
      const extension = path.extname(new URL(url).pathname).replace('.', '').toLowerCase() || 'wav';
      return {url, extension};
    }
  } catch {
    // Fall through to direct/preview URLs.
  }

  if (await canDownload(candidate.downloadUrl, candidate.pageUrl)) return {url: candidate.downloadUrl, extension: 'wav'};
  return {url: candidate.previewUrl, extension: 'mp3'};
}

async function canDownload(url, referer) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 itnavideo-sfx-downloader',
        Referer: referer || sourceRoot,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function downloadFile(url, filePath, referer) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 itnavideo-sfx-downloader',
      Referer: referer || sourceRoot,
    },
  });
  if (!response.ok) throw new Error(`Download failed ${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1000) throw new Error(`Downloaded file too small: ${url}`);
  await writeFile(filePath, bytes);
}

async function fetchText(url) {
  const response = await fetch(url, {headers: {'User-Agent': 'itnavideo-sfx-downloader'}});
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
  return new Set(String(value || '').toLowerCase().split(/[^a-z0-9]+/g).filter((token) => token.length > 1));
}

function useCase(category) {
  const cases = {
    transition: 'Scene changes, card transitions, image changes.',
    'text-pop': 'Keywords, statistics, CTA text, and reveal moments.',
    ui: 'Finance, AI, tech, SaaS, forms, and interface actions.',
    statistic: 'Salary, revenue, vacancy, exam stats, and count-up moments.',
    impact: 'Hooks, shocking facts, and important revelations.',
    warning: 'Mistakes, risks, scams, errors, and warning cards.',
    success: 'Job selection, achievement, positive CTA, and income growth.',
    finance: 'Salary, banking, investment, payment, and business scenes.',
    education: 'SSC, UPSC, RBI, IBPS, notes, documents, and study scenes.',
    office: 'Corporate jobs, career videos, office workflows, and documents.',
    'tech-ai': 'AI, startup, technology, data, and software explainer scenes.',
    motivation: 'Motivation, life stories, career growth, and emotional beats.',
    cta: 'Like, comment, follow, subscribe, and ending moments.',
  };
  return cases[category] || 'General explainer reel sound cue.';
}

await main();
