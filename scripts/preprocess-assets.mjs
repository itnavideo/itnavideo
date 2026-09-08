import {mkdir, readFile, rename, writeFile} from 'node:fs/promises';
import {existsSync, readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const assetsDir = path.join(root, 'public', 'assets');
const indexPath = path.join(assetsDir, 'assets.json');
const labelsPath = path.join(assetsDir, 'asset-labels.json');
const embeddingsPath = path.join(assetsDir, 'asset-embeddings.json');

loadLocalEnv();

const args = new Set(process.argv.slice(2));
const limit = readNumberArg('--limit', 50);
const useOpenAi = args.has('--with-openai');
const useEmbeddings = args.has('--with-embeddings');
const applyRenames = args.has('--apply-renames');
const onlyNeedsLabels = !args.has('--all');
const refreshIndexed = args.has('--refresh');
const saveEvery = readNumberArg('--save-every', 10);
const visionModel = readStringArg('--vision-model') ||
  process.env.OPENAI_ASSET_VISION_MODEL ||
  process.env.OPENAI_TIMELINE_MODEL ||
  process.env.OPENAI_JSON_MODEL ||
  'gpt-4o-mini';
const embeddingModel = readStringArg('--embedding-model') || process.env.OPENAI_ASSET_EMBEDDING_MODEL || 'text-embedding-3-small';

const IMAGE_KINDS = new Set(['image', 'icon', 'background']);
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif']);
const AUDIO_KINDS = new Set(['sound-effect', 'background-music']);
const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'm4a']);
const FONT_KINDS = new Set(['font']);
const FONT_EXTENSIONS = new Set(['ttf', 'otf', 'woff', 'woff2']);

async function main() {
  const index = await readJson(indexPath, {assets: []});
  const labels = await readJson(labelsPath, {});
  const embeddings = await readJson(embeddingsPath, {version: 1, model: embeddingModel, items: {}});
  const candidates = (index.assets || [])
    .filter((asset) => isPreprocessableAsset(asset))
    .filter((asset) => existsSync(path.join(assetsDir, asset.file)))
    .filter((asset) => refreshIndexed || !labels[asset.file]?.indexedAt)
    .filter((asset) => !onlyNeedsLabels || asset.needsLabel)
    .slice(0, limit);

  if (!candidates.length) {
    console.log('No image/icon assets need preprocessing.');
    return;
  }

  console.log(`${applyRenames ? 'APPLY' : 'DRY RUN'} preprocessing ${candidates.length} asset(s).`);
  if (useOpenAi && !process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for --with-openai.');
  }

  const renamePlan = [];
  const failures = [];
  for (const asset of candidates) {
    try {
      const filePath = path.join(assetsDir, asset.file);
      const metadata = useOpenAi && asset.type === 'image'
        ? await describeWithOpenAi(asset, filePath)
        : asset.type === 'audio'
          ? asset.kind === 'background-music'
            ? describeBackgroundMusicHeuristically(asset)
            : describeAudioHeuristically(asset)
          : asset.type === 'font'
            ? describeFontHeuristically(asset)
          : describeHeuristically(asset);

      const suggestedFilename = uniqueFilename({
        directory: path.dirname(filePath),
        preferredName: metadata.suggested_filename,
        extension: asset.extension,
        currentFile: filePath,
      });
      const nextRelative = path.relative(assetsDir, path.join(path.dirname(filePath), suggestedFilename)).replaceAll(path.sep, '/');
      const embeddingText = [
        metadata.detailed_description,
        ...(metadata.keywords || []),
        metadata.visual_difference,
      ].filter(Boolean).join('\n');
      const embeddingRef = useEmbeddings
        ? await writeEmbedding({asset, text: embeddingText, embeddings, model: embeddingModel})
        : labels[asset.file]?.embeddingRef || null;

      const label = {
        ...(labels[asset.file] || {}),
        title: titleFromFilename(suggestedFilename),
        suggestedFilename,
        detailedDescription: metadata.detailed_description,
        visualDifference: metadata.visual_difference || '',
        tags: sanitizeTags([...(metadata.keywords || []), ...(labels[asset.file]?.tags || [])]).slice(0, 32),
        category: metadata.category || labels[asset.file]?.category || asset.category || 'general',
        orientation: metadata.orientation || asset.orientation,
        style: metadata.style || labels[asset.file]?.style || inferStyle(metadata.keywords || []),
        useCase: metadata.use_case || labels[asset.file]?.useCase || inferUseCase(metadata, asset),
        use_case: metadata.use_case || labels[asset.file]?.use_case || inferUseCase(metadata, asset),
        qualityScore: Number(metadata.quality_score || labels[asset.file]?.qualityScore || asset.qualityScore || 75),
        needsLabel: false,
        safeToUse: true,
        embeddingRef,
        indexedBy: useOpenAi && asset.type === 'image' ? 'openai-vision' : asset.type === 'audio' ? 'audio-filename-taxonomy' : asset.type === 'font' ? 'font-taxonomy' : 'heuristic',
        indexedAt: new Date().toISOString(),
      };

      if (applyRenames && nextRelative !== asset.file) {
        await rename(filePath, path.join(assetsDir, nextRelative));
        delete labels[asset.file];
        labels[nextRelative] = label;
      } else {
        labels[asset.file] = label;
      }

      renamePlan.push({
        from: asset.file,
        to: nextRelative,
        title: label.title,
        category: label.category,
        style: label.style,
        useCase: label.useCase,
        tags: label.tags.slice(0, 10),
        applied: applyRenames && nextRelative !== asset.file,
      });

      if (renamePlan.length % saveEvery === 0) {
        await persistProgress({labels, embeddings, useEmbeddings});
        console.log(`Saved progress after ${renamePlan.length} successful asset(s).`);
      }
    } catch (error) {
      failures.push({
        file: asset.file,
        error: error instanceof Error ? error.message : String(error),
      });
      console.warn(`Skipped ${asset.file}: ${failures.at(-1).error}`);
    }
  }

  await writeFile(labelsPath, `${JSON.stringify(sortObject(labels), null, 2)}\n`, 'utf8');
  if (useEmbeddings) await writeFile(embeddingsPath, `${JSON.stringify(embeddings, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    processed: candidates.length,
    succeeded: renamePlan.length,
    failed: failures.length,
    labelsPath: path.relative(root, labelsPath),
    embeddingsPath: useEmbeddings ? path.relative(root, embeddingsPath) : null,
    renameMode: applyRenames ? 'applied' : 'dry-run',
    sample: renamePlan.slice(0, 8),
    failures: failures.slice(0, 8),
  }, null, 2));
}

async function persistProgress({labels, embeddings, useEmbeddings}) {
  await writeFile(labelsPath, `${JSON.stringify(sortObject(labels), null, 2)}\n`, 'utf8');
  if (useEmbeddings) await writeFile(embeddingsPath, `${JSON.stringify(embeddings, null, 2)}\n`, 'utf8');
}

function isPreprocessableAsset(asset) {
  if (asset.type === 'image') return IMAGE_KINDS.has(asset.kind) && IMAGE_EXTENSIONS.has(asset.extension);
  if (asset.type === 'audio') return AUDIO_KINDS.has(asset.kind) && AUDIO_EXTENSIONS.has(asset.extension);
  if (asset.type === 'font') return FONT_KINDS.has(asset.kind) && FONT_EXTENSIONS.has(asset.extension);
  return false;
}

async function describeWithOpenAi(asset, filePath) {
  const dataUrl = await imageDataUrl(filePath, asset.extension);
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: visionModel,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                'Describe this asset for an AI video asset library.',
                'Return strict JSON only with keys:',
                'suggested_filename, detailed_description, visual_difference, keywords, category, style, use_case, quality_score.',
                'suggested_filename must be lowercase kebab-case or snake_case, unique, content-specific, no generic file/hash words.',
                'keywords must include specific visual differences, objects, style, color, mood, and use cases.',
                'category must be one short domain label like finance, career, education, technology, government, lifestyle, warning, cta, background, or icon.',
                'style must describe the visual style such as photorealistic, 3d-render, flat-icon, line-icon, illustration, ui-card, screenshot, or texture.',
                'use_case must explain where this asset fits in a short reel shot.',
                `Current path: ${asset.file}`,
                `Current kind: ${asset.kind}`,
              ].join('\n'),
            },
            {type: 'input_image', image_url: dataUrl},
          ],
        },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI vision request failed: ${response.status} ${await response.text()}`);
  }
  const json = await response.json();
  return normalizeMetadata(parseJsonFromModel(readOutputText(json)), asset);
}

async function writeEmbedding({asset, text, embeddings, model}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for --with-embeddings.');
  }
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({model, input: text.slice(0, 8000)}),
  });
  if (!response.ok) {
    throw new Error(`OpenAI embedding request failed: ${response.status} ${await response.text()}`);
  }
  const json = await response.json();
  const key = `${asset.file}#${shortHash(text)}`;
  embeddings.model = model;
  embeddings.items[key] = {
    assetFile: asset.file,
    text,
    embedding: json.data?.[0]?.embedding || [],
  };
  return key;
}

function describeHeuristically(asset) {
  const tokens = tokenize([asset.file, asset.title, ...(asset.tags || [])].join(' '));
  const clean = unique(tokens)
    .filter((token) => !/^[a-f0-9]{8,}$/i.test(token) && !/^\d+$/.test(token))
    .filter((token) => token.length > 1);
  const specific = clean.length ? clean : [asset.category, asset.kind, asset.orientation].filter(Boolean);
  const nameTokens = buildFallbackNameTokens(asset, specific);
  return normalizeMetadata({
    suggested_filename: `${nameTokens.join('-')}.${asset.extension}`,
    detailed_description: `${asset.kind} asset inferred from folder and filename: ${specific.join(', ')}.`,
    visual_difference: `Distinctive filename/folder tokens: ${specific.slice(0, 12).join(', ')}.`,
    keywords: specific,
    category: asset.category,
    quality_score: asset.qualityScore || 60,
  }, asset);
}

function describeAudioHeuristically(asset) {
  const tokens = tokenize([asset.file, asset.title, ...(asset.tags || [])].join(' '));
  const clean = unique(tokens)
    .filter((token) => !/^[a-f0-9]{8,}$/i.test(token) && !/^\d+$/.test(token))
    .filter((token) => token.length > 1);
  const category = detectAudioCategory(clean);
  const mood = detectAudioMood(clean, category);
  const action = detectAudioAction(clean, category);
  const name = unique([action, category, 'sound-effect']).filter(Boolean).slice(0, 6).join('-');

  return normalizeMetadata({
    suggested_filename: `${name || 'sound-effect'}.${asset.extension}`,
    detailed_description: `Short ${category} sound effect inferred from filename and folder metadata. Best used as a ${action || category} cue in reel transitions, alerts, UI feedback, or emphasis moments.`,
    visual_difference: `Audio cue tokens: ${clean.slice(0, 16).join(', ')}. Mood: ${mood}.`,
    keywords: unique([
      ...clean,
      category,
      mood,
      action,
      'sound-effect',
      'audio-cue',
      'reel-sfx',
    ]),
    category,
    style: mood,
    use_case: audioUseCase(category, action),
    quality_score: asset.qualityScore || 78,
  }, asset);
}

function describeBackgroundMusicHeuristically(asset) {
  const tokens = tokenize([asset.file, asset.title, ...(asset.tags || [])].join(' '));
  const mood = detectBgmMood(tokens, asset.category);
  const category = cleanText(asset.category || mood || 'background-music').toLowerCase();
  const name = unique([mood, category, 'background-music']).filter(Boolean).slice(0, 5).join('-');

  return normalizeMetadata({
    suggested_filename: `${name || 'background-music'}.${asset.extension}`,
    detailed_description: `Reusable ${mood} background music bed for short-form reels. Designed to sit quietly under voiceover and support ${category} scenes without distracting from narration.`,
    visual_difference: `BGM tokens: ${tokens.slice(0, 16).join(', ')}. Mood bucket: ${mood}.`,
    keywords: unique([
      ...tokens,
      mood,
      category,
      'background-music',
      'music-bed',
      'voiceover-bed',
      'loopable',
      'reel-bgm',
    ]),
    category,
    style: `${mood}-background-music`,
    use_case: bgmUseCase(mood),
    quality_score: asset.qualityScore || 84,
  }, asset);
}

function describeFontHeuristically(asset) {
  const tokens = tokenize([asset.file, asset.title, ...(asset.tags || [])].join(' '));
  const family = detectFontFamily(tokens, asset);
  const role = detectFontRole(tokens);
  const style = detectFontStyle(tokens, role);
  const weight = detectFontWeight(tokens);
  const category = role === 'code' ? 'coding' : role === 'handwriting' ? 'handwriting' : role === 'headline' ? 'headline' : 'typography';
  const useCase = fontUseCase(role, family);

  return normalizeMetadata({
    suggested_filename: `${slugify([family, weight, role].filter(Boolean).join('-'))}.${asset.extension}`,
    detailed_description: `${family} ${weight || ''} ${role} font for Itnavideo templates. Best used for ${useCase}.`.replace(/\s+/g, ' ').trim(),
    visual_difference: `Font taxonomy tokens: ${tokens.slice(0, 16).join(', ')}. Role: ${role}. Weight: ${weight || 'regular'}.`,
    keywords: unique([
      ...tokens,
      family,
      role,
      weight,
      style,
      category,
      'font',
      'typography',
      'reel-text',
    ]),
    category,
    style,
    use_case: useCase,
    quality_score: asset.qualityScore || 82,
  }, asset);
}

function detectFontFamily(tokens, asset) {
  const joined = tokens.join(' ');
  const known = [
    ['bebas-neue', ['bebas', 'neue']],
    ['anton', ['anton']],
    ['montserrat', ['montserrat']],
    ['inter', ['inter']],
    ['oswald', ['oswald']],
    ['barlow-condensed', ['barlow', 'condensed']],
    ['poppins', ['poppins']],
    ['space-grotesk', ['space', 'grotesk']],
    ['archivo-black', ['archivo', 'black']],
    ['league-spartan', ['league', 'spartan']],
    ['teko', ['teko']],
    ['rubik', ['rubik']],
    ['kalam', ['kalam']],
    ['caveat', ['caveat']],
    ['patrick-hand', ['patrick', 'hand']],
    ['jetbrains-mono', ['jetbrains', 'mono']],
    ['fira-code', ['fira', 'code']],
    ['ibm-plex-mono', ['ibm', 'plex', 'mono']],
  ];
  for (const [family, words] of known) {
    if (words.every((word) => joined.includes(word))) return family;
  }
  return slugify(path.basename(asset.file, path.extname(asset.file))).slice(0, 48) || 'font';
}

function detectFontRole(tokens) {
  const source = new Set(tokens);
  if (hasToken(source, ['mono', 'code', 'jetbrains', 'fira', 'plex'])) return 'code';
  if (hasToken(source, ['kalam', 'caveat', 'patrick', 'hand', 'handwritten'])) return 'handwriting';
  if (hasToken(source, ['anton', 'bebas', 'archivo', 'black', 'teko', 'condensed', 'oswald', 'spartan'])) return 'headline';
  if (hasToken(source, ['inter', 'montserrat', 'poppins', 'rubik', 'grotesk'])) return 'ui-body';
  return 'template';
}

function detectFontStyle(tokens, role) {
  const source = new Set(tokens);
  if (role === 'code') return 'monospace-code';
  if (role === 'handwriting') return 'handwritten';
  if (role === 'headline') return hasToken(source, ['condensed', 'narrow']) ? 'bold-condensed-display' : 'bold-display';
  if (hasToken(source, ['italic'])) return 'clean-sans-italic';
  return 'clean-sans';
}

function detectFontWeight(tokens) {
  const source = new Set(tokens);
  if (hasToken(source, ['black'])) return 'black';
  if (hasToken(source, ['extrabold'])) return 'extra-bold';
  if (hasToken(source, ['bold'])) return 'bold';
  if (hasToken(source, ['semibold'])) return 'semi-bold';
  if (hasToken(source, ['medium'])) return 'medium';
  if (hasToken(source, ['light'])) return 'light';
  if (hasToken(source, ['italic'])) return 'italic';
  if (hasToken(source, ['variable'])) return 'variable';
  return 'regular';
}

function fontUseCase(role, family) {
  if (role === 'code') return `${family} coding, database, terminal, AI prompt, and developer tutorial scenes`;
  if (role === 'handwriting') return `${family} handwritten notes, study, explanation, and teacher-style annotation scenes`;
  if (role === 'headline') return `${family} big hook words, stat emphasis, CTA punches, and one-two word reel typography`;
  if (role === 'ui-body') return `${family} subtitles, body copy, cards, badges, and clean UI-style explainer text`;
  return `${family} reusable reel typography`;
}

function detectAudioCategory(tokens) {
  const source = new Set(tokens);
  if (hasToken(source, ['whoosh', 'swoosh', 'riser', 'rising', 'transition', 'transision'])) return 'transition';
  if (hasToken(source, ['notification', 'bell', 'ding', 'unlocked'])) return 'notification';
  if (hasToken(source, ['cash', 'register', 'money', 'counting', 'purchase'])) return 'finance';
  if (hasToken(source, ['censor', 'warning', 'alert'])) return 'warning';
  if (hasToken(source, ['typing', 'keyboard'])) return 'typing';
  if (hasToken(source, ['shutter', 'click', 'camera'])) return 'camera';
  if (hasToken(source, ['heartbeat', 'thud', 'impact'])) return 'tension';
  if (hasToken(source, ['success', 'great'])) return 'success';
  if (hasToken(source, ['pop', 'bubble'])) return 'pop';
  return 'general';
}

function detectAudioMood(tokens, category) {
  const source = new Set(tokens);
  if (hasToken(source, ['epic', 'cinematic', 'wildfire'])) return 'cinematic';
  if (hasToken(source, ['simple', 'soft', 'bubble'])) return 'soft';
  if (category === 'warning' || category === 'tension') return 'urgent';
  if (category === 'success' || category === 'notification') return 'positive';
  if (category === 'transition') return 'energetic';
  return 'clean';
}

function detectAudioAction(tokens, category) {
  const source = new Set(tokens);
  if (hasToken(source, ['whoosh', 'swoosh'])) return 'whoosh';
  if (hasToken(source, ['riser', 'rising'])) return 'riser';
  if (hasToken(source, ['notification', 'bell', 'ding'])) return 'notification';
  if (hasToken(source, ['cash', 'register'])) return 'cash-register';
  if (hasToken(source, ['money', 'counting'])) return 'money-counting';
  if (hasToken(source, ['censor'])) return 'censor-beep';
  if (hasToken(source, ['typing'])) return 'typing';
  if (hasToken(source, ['shutter', 'click'])) return 'camera-click';
  if (hasToken(source, ['heartbeat'])) return 'heartbeat';
  if (hasToken(source, ['thud'])) return 'impact';
  if (hasToken(source, ['success', 'purchase', 'unlocked'])) return 'success';
  if (hasToken(source, ['pop', 'bubble'])) return 'pop';
  return category;
}

function audioUseCase(category, action) {
  if (category === 'transition') return `${action} cue for scene changes, stat reveals, and fast reel pacing`;
  if (category === 'finance') return `${action} cue for money, payment, salary, purchase, or finance explainer moments`;
  if (category === 'warning') return `${action} cue for risk, mistake, alert, or attention blocks`;
  if (category === 'typing') return 'typing cue for forms, documents, search, chat, and AI prompt moments';
  if (category === 'camera') return 'camera click cue for screenshots, before-after reveals, and captured proof moments';
  if (category === 'success') return `${action} cue for completion, unlock, approval, and positive CTA moments`;
  if (category === 'notification') return `${action} cue for UI feedback, app alerts, and new-step reveals`;
  return `${action || category} cue for short reel emphasis moments`;
}

function detectBgmMood(tokens, category) {
  const source = new Set(tokens);
  const categoryText = String(category || '').toLowerCase();
  if (categoryText.includes('finance') || hasToken(source, ['wealth', 'market', 'financial', 'investment', 'economic', 'finance'])) return 'finance';
  if (categoryText.includes('education') || hasToken(source, ['study', 'exam', 'academic', 'knowledge', 'education'])) return 'study';
  if (categoryText.includes('news') || hasToken(source, ['breaking', 'news', 'brief', 'update', 'analysis'])) return 'news';
  if (categoryText.includes('technology') || hasToken(source, ['ai', 'digital', 'data', 'tech', 'futuristic'])) return 'ai';
  if (categoryText.includes('motivation') || hasToken(source, ['dream', 'rise', 'victory', 'success', 'motivation'])) return 'motivation';
  if (categoryText.includes('story') || hasToken(source, ['documentary', 'human', 'story', 'journey', 'reflection'])) return 'documentary';
  if (categoryText.includes('short') || hasToken(source, ['viral', 'action', 'dynamic', 'energy', 'beat'])) return 'viral';
  if (categoryText.includes('business') || hasToken(source, ['corporate', 'startup', 'business', 'executive'])) return 'corporate';
  return 'corporate';
}

function bgmUseCase(mood) {
  const useCases = {
    corporate: 'business, startup, career, SaaS, and professional explainers at 8-15% volume',
    study: 'education, government exam, SSC, UPSC, RBI, IBPS, tutorial, and notes reels at 8-12% volume',
    finance: 'salary, investing, money, business, and finance explainers at 8-12% volume',
    motivation: 'motivation, growth, success story, and CTA lift sections at 12-15% volume',
    news: 'current affairs, government updates, warnings, and serious analysis at 8-12% volume',
    ai: 'AI, coding, technology, automation, and startup tech content at 8-12% volume',
    documentary: 'storytelling, career journey, human story, and reflective narration at 8-12% volume',
    viral: 'hooks, fast-paced shorts, transitions, and high-energy CTA edits at 12-20% volume',
  };
  return useCases[mood] || 'low-volume background music under voiceover';
}

function buildFallbackNameTokens(asset, tokens) {
  const base = tokens
    .filter((token) => token !== asset.kind && token !== asset.category && token !== asset.orientation)
    .slice(0, 5);
  const result = unique([
    ...base,
    asset.category && asset.category !== 'general' ? asset.category : '',
    asset.kind,
    asset.orientation && asset.orientation !== 'unknown' ? asset.orientation : '',
  ]).filter(Boolean);
  return result.length ? result.slice(0, 8) : [asset.kind || 'asset'];
}

function normalizeMetadata(value, asset) {
  const keywords = Array.isArray(value.keywords) ? value.keywords : [];
  return {
    suggested_filename: sanitizeFilename(value.suggested_filename || asset.title || asset.file, asset.extension),
    detailed_description: cleanText(value.detailed_description || value.description || ''),
    visual_difference: cleanText(value.visual_difference || ''),
    keywords: unique(keywords.flatMap((item) => tokenize(String(item)))).slice(0, 32),
    category: cleanText(value.category || asset.category || 'general').toLowerCase(),
    style: cleanText(value.style || inferStyle(keywords)).toLowerCase(),
    use_case: cleanText(value.use_case || inferUseCase(value, asset)),
    quality_score: clamp(Number(value.quality_score || asset.qualityScore || 75), 1, 100),
  };
}

async function imageDataUrl(filePath, extension) {
  const buffer = await readFile(filePath);
  const mime = extension === 'svg' ? 'image/svg+xml' : extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

function uniqueFilename({directory, preferredName, extension, currentFile}) {
  const parsed = path.parse(preferredName);
  const base = slugify(parsed.name || preferredName || 'asset').slice(0, 90) || 'asset';
  const ext = `.${extension.replace(/^\./, '')}`;
  let candidate = `${base}${ext}`;
  let counter = 1;
  while (existsSync(path.join(directory, candidate)) && path.resolve(directory, candidate) !== path.resolve(currentFile)) {
    counter += 1;
    candidate = `${base}-${String(counter).padStart(2, '0')}${ext}`;
  }
  return candidate;
}

function sanitizeFilename(value, extension) {
  const parsed = path.parse(String(value || 'asset'));
  return `${slugify(parsed.name || value)}.${extension.replace(/^\./, '')}`;
}

function readOutputText(response) {
  if (typeof response.output_text === 'string') return response.output_text;
  return (response.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || '')
    .join('\n');
}

function parseJsonFromModel(text) {
  const source = String(text || '').trim();
  try {
    return JSON.parse(source);
  } catch {
    const match = source.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Could not parse JSON from VLM response: ${source.slice(0, 200)}`);
    return JSON.parse(match[0]);
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function readStringArg(name) {
  const prefix = `${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length).trim() : '';
}

function readNumberArg(name, fallback) {
  const value = Number(readStringArg(name));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 1)
    .filter((token) => !STOP_WORDS.has(token));
}

function slugify(value) {
  return String(value || 'asset')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function titleFromFilename(value) {
  return path.parse(value).name
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function inferStyle(keywords) {
  const source = new Set((keywords || []).flatMap((item) => tokenize(String(item))));
  if (source.has('photorealistic') || source.has('photo') || source.has('realistic')) return 'photorealistic';
  if (source.has('3d') || source.has('render')) return '3d-render';
  if (source.has('line') || source.has('outline')) return 'line-icon';
  if (source.has('flat') || source.has('icon')) return 'flat-icon';
  if (source.has('screenshot') || source.has('ui')) return 'ui-card';
  if (source.has('illustration') || source.has('vector')) return 'illustration';
  if (source.has('monospace') || source.has('mono') || source.has('code')) return 'monospace-code';
  if (source.has('handwritten') || source.has('handwriting')) return 'handwritten';
  return 'general';
}

function inferUseCase(metadata, asset) {
  const category = cleanText(metadata.category || asset.category || 'general');
  if (asset.kind === 'icon') return `${category} reel badge, stat card, or callout icon`;
  if (asset.kind === 'background') return `${category} reel background or scene backdrop`;
  if (asset.kind === 'font') return `${category} reel typography and template text styling`;
  if (asset.kind === 'background-music') return `${category} low-volume background music bed under voiceover`;
  return `${category} explainer reel visual or shot support`;
}

function loadLocalEnv() {
  const envPath = path.join(root, '.env.local');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/g)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator <= 0) continue;
    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    if (!key || process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function unique(values) {
  return [...new Set(values.map((value) => cleanText(value)).filter(Boolean))];
}

function hasToken(source, values) {
  return values.some((value) => source.has(value));
}

function sanitizeTags(values) {
  return unique(values)
    .flatMap((value) => tokenize(value))
    .filter((token) => !STOP_WORDS.has(token));
}

function sortObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

function shortHash(value) {
  return createHash('sha1').update(String(value)).digest('hex').slice(0, 12);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const STOP_WORDS = new Set([
  'assets',
  'asset',
  'public',
  'direct',
  'reusable',
  'images',
  'image',
  'icons',
  'icon',
  'file',
  'bg',
  'backgrounds',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'svg',
  'avif',
]);

await main();
