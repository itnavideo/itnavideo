export type CustomAiReelMediaAsset = {
  id: string;
  kind: 'image' | 'logo' | 'video' | 'audio';
  src: string;
  fileName?: string;
  durationSeconds?: number;
};

export type CustomAiReelMotion = 'fade' | 'slideUp' | 'zoomIn' | 'zoomOut' | 'slowPan' | 'cardReveal' | 'pulse';
export type CustomAiReelSceneType = 'title' | 'text' | 'image' | 'video' | 'logoEnd' | 'ctaEnd';

export type CustomAiReelScene = {
  id: string;
  start: number;
  end: number;
  type: CustomAiReelSceneType;
  title?: string;
  body?: string;
  label?: string;
  mediaId?: string;
  motion: CustomAiReelMotion;
  layout: 'heroText' | 'imageFeature' | 'screenshotFeature' | 'logoEnd' | 'cta';
};

export type CustomAiReelPlan = {
  durationSeconds: number;
  prompt: string;
  scenes: CustomAiReelScene[];
  media: CustomAiReelMediaAsset[];
  subtitlesEnabled: boolean;
  audioSrc?: string;
  plannerVersion: 'custom-ai-reel-m1';
};

const MAX_DURATION_SECONDS = 60;
const DEFAULT_DURATION_SECONDS = 60;

export function validateCustomAiPrompt(value: string) {
  const prompt = value.replace(/\s+/g, ' ').trim();
  if (prompt.length < 12) {
    return 'Please describe your video in simple English for best results.';
  }

  const latinLetters = (prompt.match(/[A-Za-z]/g) || []).length;
  const allLetters = (prompt.match(/\p{L}/gu) || []).length;
  const nonLatinLetters = Math.max(0, allLetters - latinLetters);
  const englishishWords = (prompt.match(/\b(create|show|make|start|end|text|title|image|screenshot|logo|website|zoom|pan|fade|reel|video|seconds?|sec|motion|bold|clean|premium|subtitles?|no|with|my|the|and|then|from|to)\b/gi) || []).length;

  if (latinLetters < 8 || (nonLatinLetters > latinLetters * 1.2 && englishishWords < 2)) {
    return 'Please describe your video in simple English for best results.';
  }

  return '';
}

export function createCustomAiReelPlan({
  media,
  prompt,
  subtitlesEnabled = false,
}: {
  media: CustomAiReelMediaAsset[];
  prompt: string;
  subtitlesEnabled?: boolean;
}): CustomAiReelPlan {
  const cleanPrompt = prompt.replace(/\s+/g, ' ').trim();

  // Audio/video assets drive duration when present
  const audioAsset = media.find((a) => a.kind === 'audio');
  const videoAssets = media.filter((a) => a.kind === 'video');
  const images = media.filter((asset) => asset.kind === 'image');
  const logo = media.find((asset) => asset.kind === 'logo');

  // Duration: prefer prompt-specified → audio/video duration → default
  const mediaDuration = audioAsset?.durationSeconds || videoAssets[0]?.durationSeconds;
  const promptDuration = readRequestedDuration(cleanPrompt);
  const durationSeconds = clampDuration(
    promptDuration || (mediaDuration ? Math.min(MAX_DURATION_SECONDS, mediaDuration) : DEFAULT_DURATION_SECONDS),
  );

  const timedScenes = buildTimedScenes(cleanPrompt, images, videoAssets, logo);
  const scenes = timedScenes.length
    ? normalizeTimedScenes(timedScenes, durationSeconds)
    : buildAutomaticScenes(cleanPrompt, images, videoAssets, logo, durationSeconds);

  return {
    durationSeconds: Math.max(...scenes.map((scene) => scene.end), durationSeconds),
    prompt: cleanPrompt,
    scenes: repairSceneBounds(scenes).slice(0, 12),
    media,
    subtitlesEnabled,
    audioSrc: audioAsset?.src,
    plannerVersion: 'custom-ai-reel-m1',
  };
}

function buildTimedScenes(prompt: string, images: CustomAiReelMediaAsset[], videos: CustomAiReelMediaAsset[], logo?: CustomAiReelMediaAsset) {
  const matches = Array.from(prompt.matchAll(/(?:^|[\n.;])\s*(\d{1,2})\s*(?:-|–|to)\s*(\d{1,2})\s*(?:sec|secs|second|seconds|s)?\s*:?\s*([^.;\n]+)/gi));
  let imageIndex = 0;
  let videoIndex = 0;
  return matches.map((match, index) => {
    const start = Number(match[1]);
    const end = Number(match[2]);
    const instruction = normalizeInstruction(match[3] || '');
    const wantsLogo = /\blogo|end screen\b/i.test(instruction) && logo;
    const wantsVideo = /\bvideo clip|clip|footage|my video\b/i.test(instruction) && videos.length;
    const wantsImage = !wantsVideo && /\bimage|screenshot|photo|picture|website|screen\b/i.test(instruction) && images.length;
    const mediaAsset = wantsLogo ? logo : wantsVideo ? videos[Math.min(videoIndex, videos.length - 1)] : wantsImage ? images[Math.min(imageIndex, images.length - 1)] : undefined;
    if (wantsImage) imageIndex += 1;
    if (wantsVideo) videoIndex += 1;
    return makeScene({
      index,
      start,
      end,
      instruction,
      mediaAsset,
      logo: Boolean(wantsLogo),
      isVideo: Boolean(wantsVideo),
      final: index === matches.length - 1,
    });
  });
}

function normalizeTimedScenes(scenes: CustomAiReelScene[], requestedDuration: number) {
  return scenes
    .map((scene) => ({
      ...scene,
      start: round(Math.max(0, Math.min(MAX_DURATION_SECONDS - 0.5, scene.start))),
      end: round(Math.max(scene.start + 1.5, Math.min(MAX_DURATION_SECONDS, scene.end))),
    }))
    .filter((scene) => scene.end > scene.start)
    .sort((a, b) => a.start - b.start)
    .map((scene, index, all) => ({
      ...scene,
      id: `custom-scene-${index + 1}`,
      end: round(Math.min(scene.end, all[index + 1]?.start ?? Math.max(scene.end, requestedDuration))),
    }));
}

function buildAutomaticScenes(prompt: string, images: CustomAiReelMediaAsset[], videos: CustomAiReelMediaAsset[], logo: CustomAiReelMediaAsset | undefined, durationSeconds: number) {
  const allVisuals = [...videos, ...images];
  const quoted = extractQuotedText(prompt);
  const openingTitle = quoted[0] || titleFromPrompt(prompt);
  const supportText = supportLineFromPrompt(prompt) || 'Powered by Itnavideo.';

  // Audio-only or text-only: build a rich multi-card structure
  if (allVisuals.length === 0) {
    return buildVoiceoverScenes(prompt, openingTitle, supportText, logo, durationSeconds);
  }

  // Has visuals: interleave text + visual scenes
  const sceneCount = Math.max(3, Math.min(6, allVisuals.length + (logo ? 2 : 1)));
  const slot = durationSeconds / sceneCount;
  const scenes: CustomAiReelScene[] = [
    {
      id: 'custom-scene-1',
      start: 0,
      end: round(slot),
      type: 'title',
      title: openingTitle,
      body: supportText,
      label: 'Custom AI Reel',
      motion: 'slideUp',
      layout: 'heroText',
    },
  ];

  allVisuals.forEach((asset, index) => {
    const start = round((index + 1) * slot);
    const end = round(Math.min(durationSeconds - (logo ? slot : 0), start + slot));
    if (end <= start) return;
    const isVideo = asset.kind === 'video';
    scenes.push({
      id: `custom-scene-${scenes.length + 1}`,
      start,
      end,
      type: isVideo ? 'video' : 'image',
      title: isVideo ? 'Your Video' : imageTitle(prompt, index),
      body: isVideo ? undefined : imageBody(prompt),
      label: isVideo ? 'Clip' : (index === 0 && /\bscreenshot|website|screen\b/i.test(prompt) ? 'Website showcase' : 'Visual beat'),
      mediaId: asset.id,
      motion: isVideo ? 'fade' : (index % 2 === 0 ? 'zoomIn' : 'slowPan'),
      layout: isVideo ? 'imageFeature' : (/\bscreenshot|website|screen\b/i.test(prompt) ? 'screenshotFeature' : 'imageFeature'),
    });
  });

  const finalStart = round(Math.max(slot, scenes[scenes.length - 1]?.end || durationSeconds - slot));
  scenes.push({
    id: `custom-scene-${scenes.length + 1}`,
    start: Math.min(finalStart, durationSeconds - slot),
    end: durationSeconds,
    type: logo ? 'logoEnd' : 'ctaEnd',
    title: logo ? finalLine(prompt) : openingTitle,
    body: websiteLine(prompt) || 'Made with Itnavideo',
    label: logo ? 'Brand finish' : 'Final frame',
    mediaId: logo?.id,
    motion: logo ? 'pulse' : 'cardReveal',
    layout: logo ? 'logoEnd' : 'cta',
  });

  return repairSceneBounds(scenes);
}

/**
 * Voiceover/text-only reel structure.
 * Splits duration into 5-7 content cards so the video is never blank.
 * Each card shows a meaningful text segment from the prompt.
 */
function buildVoiceoverScenes(
  prompt: string,
  openingTitle: string,
  supportText: string,
  logo: CustomAiReelMediaAsset | undefined,
  durationSeconds: number,
): CustomAiReelScene[] {
  // Extract sentences / key phrases from prompt
  const sentences = prompt
    .replace(/\n+/g, '. ')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 6 && !/^\d+$/.test(s));

  // Reserve last slot for logo/CTA
  const contentDuration = durationSeconds - (logo ? Math.min(8, durationSeconds * 0.15) : Math.min(7, durationSeconds * 0.12));
  const targetCount = Math.max(3, Math.min(7, Math.ceil(durationSeconds / 9)));
  const contentCount = logo ? targetCount - 1 : targetCount;
  const slot = contentDuration / contentCount;

  const scenes: CustomAiReelScene[] = [];

  // Scene 1: Big hook / opening title
  scenes.push({
    id: 'custom-scene-1',
    start: 0,
    end: round(Math.min(slot, 8)),
    type: 'title',
    title: openingTitle,
    body: supportText,
    label: 'Opening',
    motion: 'slideUp',
    layout: 'heroText',
  });

  // Content cards — use prompt sentences or generic key points
  const contentLabels = ['Key Point', 'Why It Matters', 'How It Works', 'The Result', 'Next Step', 'The Benefit'];
  const contentTitles = [
    cleanSentenceForTitle(sentences[0]) || openingTitle,
    cleanSentenceForTitle(sentences[1]) || 'Why This Works',
    cleanSentenceForTitle(sentences[2]) || 'How It Works',
    cleanSentenceForTitle(sentences[3]) || 'The Result',
    cleanSentenceForTitle(sentences[4]) || 'Take Action',
  ];

  for (let i = 1; i < contentCount; i++) {
    const start = round(i * slot);
    const end = round(Math.min(contentDuration, start + slot));
    if (end <= start) break;
    scenes.push({
      id: `custom-scene-${i + 1}`,
      start,
      end,
      type: i === contentCount - 1 && !logo ? 'ctaEnd' : 'text',
      title: contentTitles[i - 1] || `Point ${i}`,
      body: sentences[i] ? sentences[i].slice(0, 100) : undefined,
      label: contentLabels[(i - 1) % contentLabels.length],
      motion: i % 2 === 0 ? 'slideUp' : 'cardReveal',
      layout: i === contentCount - 1 && !logo ? 'cta' : 'heroText',
    });
  }

  // Logo end screen
  if (logo) {
    scenes.push({
      id: `custom-scene-${scenes.length + 1}`,
      start: round(contentDuration),
      end: durationSeconds,
      type: 'logoEnd',
      title: finalLine(prompt),
      body: websiteLine(prompt) || 'Made with Itnavideo',
      label: 'Brand finish',
      mediaId: logo.id,
      motion: 'pulse',
      layout: 'logoEnd',
    });
  }

  return repairSceneBounds(scenes);
}

function cleanSentenceForTitle(s: string | undefined): string {
  if (!s) return '';
  return toTitleCase(s
    .replace(/\b(please|kindly|just|very|really|create|make|reel|video)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 52));
}

function makeScene({
  final,
  index,
  instruction,
  isVideo,
  logo,
  mediaAsset,
  start,
  end,
}: {
  final: boolean;
  index: number;
  instruction: string;
  isVideo?: boolean;
  logo: boolean;
  mediaAsset?: CustomAiReelMediaAsset;
  start: number;
  end: number;
}): CustomAiReelScene {
  if (logo) {
    return {
      id: `custom-scene-${index + 1}`,
      start,
      end,
      type: 'logoEnd',
      title: finalLine(instruction),
      body: websiteLine(instruction) || 'Made with Itnavideo',
      label: 'Brand finish',
      mediaId: mediaAsset?.id,
      motion: 'pulse',
      layout: 'logoEnd',
    };
  }

  if (isVideo && mediaAsset) {
    return {
      id: `custom-scene-${index + 1}`,
      start,
      end,
      type: 'video',
      title: titleFromPrompt(instruction),
      body: undefined,
      label: 'Clip',
      mediaId: mediaAsset.id,
      motion: /fade/i.test(instruction) ? 'fade' : 'zoomIn',
      layout: 'imageFeature',
    };
  }

  if (mediaAsset) {
    const screenshot = /\bscreenshot|website|screen\b/i.test(instruction);
    return {
      id: `custom-scene-${index + 1}`,
      start,
      end,
      type: 'image',
      title: titleFromPrompt(instruction),
      body: instruction.replace(/\b(show|use|my|with|zoom|slowly|image|screenshot|website)\b/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 90),
      label: screenshot ? 'Screenshot focus' : 'Visual beat',
      mediaId: mediaAsset.id,
      motion: /zoom out/i.test(instruction) ? 'zoomOut' : /pan/i.test(instruction) ? 'slowPan' : 'zoomIn',
      layout: screenshot ? 'screenshotFeature' : 'imageFeature',
    };
  }

  return {
    id: `custom-scene-${index + 1}`,
    start,
    end,
    type: final ? 'ctaEnd' : index === 0 ? 'title' : 'text',
    title: extractQuotedText(instruction)[0] || titleFromPrompt(instruction),
    body: supportLineFromPrompt(instruction),
    label: index === 0 ? 'Opening' : 'Key point',
    motion: index === 0 ? 'slideUp' : 'cardReveal',
    layout: final ? 'cta' : 'heroText',
  };
}

function repairSceneBounds(scenes: CustomAiReelScene[]) {
  const sorted = scenes
    .filter((scene) => scene.end > scene.start)
    .sort((a, b) => a.start - b.start);
  return sorted.map((scene, index) => {
    const nextStart = sorted[index + 1]?.start;
    return {
      ...scene,
      start: round(Math.max(0, Math.min(MAX_DURATION_SECONDS - 0.5, scene.start))),
      end: round(Math.min(MAX_DURATION_SECONDS, nextStart && nextStart > scene.start ? Math.min(scene.end, nextStart) : scene.end)),
    };
  }).filter((scene) => scene.end > scene.start);
}

function readRequestedDuration(prompt: string) {
  const match = prompt.match(/\b(\d{1,2})\s*(?:sec|secs|second|seconds|s)\b/i);
  return match ? Number(match[1]) : 0;
}

function clampDuration(value: number) {
  return Math.max(8, Math.min(MAX_DURATION_SECONDS, Number.isFinite(value) ? value : DEFAULT_DURATION_SECONDS));
}

function extractQuotedText(value: string) {
  return Array.from(value.matchAll(/[“"]([^”"]{3,80})[”"]/g)).map((match) => cleanText(match[1]));
}

function titleFromPrompt(value: string) {
  const quoted = extractQuotedText(value)[0];
  if (quoted) return quoted;
  const clean = normalizeInstruction(value)
    .replace(/\b(create|make|show|use|start|with|my|a|an|the|reel|video|seconds?|sec|slowly|zoom|pan|fade|image|screenshot|logo|end)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return toTitleCase((clean || 'Custom AI Reel').split(/\s+/).slice(0, 7).join(' '));
}

function supportLineFromPrompt(value: string) {
  // Use first meaningful sentence from prompt — don't over-strip
  const sentences = value
    .replace(/\n+/g, '. ')
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  const first = sentences[0] || value.trim();
  return first.slice(0, 110) || 'Clean motion, strong spacing, premium finish.';
}

function imageTitle(prompt: string, index: number) {
  if (/\bwebsite|screenshot|screen\b/i.test(prompt)) return index === 0 ? 'Website Showcase' : 'Key Visual';
  return index === 0 ? 'Visual Story' : `Visual ${index + 1}`;
}

function imageBody(prompt: string) {
  if (/\bzoom\b/i.test(prompt)) return 'Smooth zoom motion keeps the uploaded visual clear.';
  if (/\bone by one|sequence|multiple\b/i.test(prompt)) return 'Uploaded images appear one by one with clean transitions.';
  return 'Polished image motion with readable spacing.';
}

function finalLine(prompt: string) {
  const website = websiteLine(prompt);
  if (website) return 'Ready to Share';
  if (/\blogo\b/i.test(prompt)) return 'Your Brand, Center Stage';
  return 'Custom Reel Complete';
}

function websiteLine(prompt: string) {
  return prompt.match(/\b(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/\S*)?/i)?.[0] || '';
}

function normalizeInstruction(value: string) {
  return cleanText(value.replace(/\s+/g, ' ').trim());
}

function cleanText(value: string) {
  return value.replace(/[^\p{L}\p{N}\s.,:;!?'"“”@#%&/.-]/gu, '').replace(/\s+/g, ' ').trim();
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

/**
 * Build rich content scenes from a Groq transcript.
 * This is the primary scene builder for audio/voiceover reels.
 * Each transcript segment becomes a visible content card.
 */
export function buildScenesFromTranscript({
  transcript,
  segments,
  durationSeconds,
  prompt,
  logo,
  images,
  videos,
}: {
  transcript: string;
  segments: Array<{start: number; end: number; text: string}>;
  durationSeconds: number;
  prompt: string;
  logo?: CustomAiReelMediaAsset;
  images: CustomAiReelMediaAsset[];
  videos: CustomAiReelMediaAsset[];
}): CustomAiReelScene[] {
  const clampedDuration = Math.min(MAX_DURATION_SECONDS, Math.max(8, durationSeconds));
  const quoted = extractQuotedText(prompt);
  const openingTitle = quoted[0] || titleFromPrompt(prompt) || 'Your Story';

  // Filter segments to clamped duration, skip very short ones
  const validSegments = segments
    .filter((s) => s.start < clampedDuration && s.text.trim().length > 2)
    .map((s) => ({
      start: round(s.start),
      end: round(Math.min(clampedDuration, s.end)),
      text: s.text.trim(),
    }))
    .filter((s) => s.end > s.start);

  if (validSegments.length === 0) {
    // No segments — fall back to automatic scenes
    return buildAutomaticScenes(prompt, images, videos, logo, clampedDuration);
  }

  // Group segments into content blocks of ~8-12s each for readable cards
  const TARGET_CARD_DURATION = 9;
  const blocks: Array<{start: number; end: number; text: string}> = [];
  let currentBlock = {...validSegments[0]};

  for (let i = 1; i < validSegments.length; i++) {
    const seg = validSegments[i];
    const blockDuration = seg.end - currentBlock.start;
    if (blockDuration <= TARGET_CARD_DURATION) {
      currentBlock.end = seg.end;
      currentBlock.text += ' ' + seg.text;
    } else {
      blocks.push({...currentBlock});
      currentBlock = {...seg};
    }
  }
  blocks.push(currentBlock);

  const scenes: CustomAiReelScene[] = [];

  // Opening title card (first block, or before speech starts)
  const firstBlockStart = blocks[0]?.start || 0;
  if (firstBlockStart > 0.5) {
    // Pre-speech intro
    scenes.push({
      id: 'custom-scene-1',
      start: 0,
      end: round(firstBlockStart),
      type: 'title',
      title: openingTitle,
      body: undefined,
      label: 'Opening',
      motion: 'slideUp',
      layout: 'heroText',
    });
  }

  let imageIndex = 0;
  let videoIndex = 0;

  blocks.forEach((block, idx) => {
    const sceneId = `custom-scene-${scenes.length + 1}`;
    const isLast = idx === blocks.length - 1;

    // Use uploaded visuals if available — interleave every 2nd card
    const useVisual = (images.length > 0 || videos.length > 0) && idx % 2 === 1;
    let mediaAsset: CustomAiReelMediaAsset | undefined;
    let sceneType: CustomAiReelSceneType = idx === 0 && firstBlockStart <= 0.5 ? 'title' : 'text';

    if (useVisual && videos.length > videoIndex) {
      mediaAsset = videos[videoIndex++];
      sceneType = 'video';
    } else if (useVisual && images.length > imageIndex) {
      mediaAsset = images[imageIndex++];
      sceneType = 'image';
    }

    // Last block: use logo if available, else CTA
    if (isLast && idx > 0) {
      if (logo) {
        scenes.push({
          id: `custom-scene-${scenes.length + 1}`,
          start: block.start,
          end: round(Math.min(block.end, clampedDuration)),
          type: 'text',
          title: cleanSentenceForTitle(block.text),
          body: block.text.length > 52 ? block.text.slice(0, 100) : undefined,
          label: 'Key Point',
          motion: 'cardReveal',
          layout: 'heroText',
        });
        // Logo end after last speech block
        if (block.end < clampedDuration - 1) {
          scenes.push({
            id: `custom-scene-${scenes.length + 1}`,
            start: round(block.end),
            end: clampedDuration,
            type: 'logoEnd',
            title: finalLine(prompt),
            body: websiteLine(prompt) || 'Made with Itnavideo',
            label: 'Brand',
            mediaId: logo.id,
            motion: 'pulse',
            layout: 'logoEnd',
          });
        }
        return;
      }
    }

    const title = sceneType === 'text' || sceneType === 'title'
      ? (cleanSentenceForTitle(block.text) || openingTitle)
      : (mediaAsset?.kind === 'video' ? 'Your Clip' : imageTitle(prompt, imageIndex - 1));

    scenes.push({
      id: sceneId,
      start: block.start,
      end: round(Math.min(block.end, clampedDuration)),
      type: sceneType,
      title,
      body: sceneType === 'text' && block.text.length > 52 ? block.text.slice(0, 100) : undefined,
      label: idx === 0 ? 'Opening' : `Point ${idx}`,
      mediaId: mediaAsset?.id,
      motion: sceneType === 'video' ? 'fade' : sceneType === 'image' ? (idx % 2 === 0 ? 'zoomIn' : 'slowPan') : (idx % 2 === 0 ? 'slideUp' : 'cardReveal'),
      layout: sceneType === 'image' && /screenshot|website|screen/i.test(prompt) ? 'screenshotFeature' : sceneType === 'image' || sceneType === 'video' ? 'imageFeature' : idx === 0 ? 'heroText' : 'heroText',
    });
  });

  // If no logo was added at end and last scene ends before clampedDuration
  const lastScene = scenes[scenes.length - 1];
  if (lastScene && lastScene.end < clampedDuration - 1 && lastScene.type !== 'logoEnd' && lastScene.type !== 'ctaEnd') {
    scenes.push({
      id: `custom-scene-${scenes.length + 1}`,
      start: round(lastScene.end),
      end: clampedDuration,
      type: 'ctaEnd',
      title: openingTitle,
      body: 'Made with Itnavideo',
      label: 'End',
      motion: 'pulse',
      layout: 'cta',
    });
  }

  return repairSceneBounds(scenes.filter((s) => s.end > s.start));
}
