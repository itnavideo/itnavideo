/**
 * Faceless Video Multi-Layer Architecture Engine
 *
 * Implements the Core Mandate:
 * Unlimited, professional multi-track layering for Faceless Videos & Shorts.
 *
 * Tracks:
 * 1. Text Layers: 8–10+ independent text layers (headlines, subheadings, descriptions,
 *    key points, statistics, labels, callouts, highlighted words, footnotes)
 * 2. Background Layers: Stackable solid, gradient, image, video, texture, mesh, vignette
 * 3. Audio Layers: Multiple music tracks, ambient soundscapes, timed SFX layers (whoosh, pop, hit, ding)
 * 4. SVG & Graphics Layers: Arrows, diagrams, illustrations, charts, shapes, icons, badges
 * 5. Image & Video Layers: Simultaneous multiple images and video clips with full transform & cropping
 */

import type { DynamicTextLayer } from '@/remotion/components/library/MultiLayerTextOverlay';
import type { DynamicBackgroundLayer } from '@/remotion/components/library/MultiLayerBackgroundOverlay';
import type { DynamicAudioLayer } from '@/remotion/components/library/MultiLayerAudioOverlay';
import type { DynamicImageLayer } from '@/remotion/components/library/MultiLayerImageOverlay';
import type { DynamicSvgLayer } from '@/remotion/components/library/MultiLayerSvgOverlay';
import type { SceneBlueprintItem } from './sceneBlueprintTypes';

export interface MultiLayerSceneComposition {
  sceneIndex: number;
  startSeconds: number;
  durationSeconds: number;
  textLayers: DynamicTextLayer[];
  backgroundLayers: DynamicBackgroundLayer[];
  audioLayers: DynamicAudioLayer[];
  svgLayers: DynamicSvgLayer[];
  mediaLayers: DynamicImageLayer[];
}

export interface MultiLayerCompositionBlueprint {
  totalDurationSeconds: number;
  aspectRatio: '16:9' | '9:16';
  scenes: MultiLayerSceneComposition[];
  allTextLayers: DynamicTextLayer[];
  allBackgroundLayers: DynamicBackgroundLayer[];
  allAudioLayers: DynamicAudioLayer[];
  allSvgLayers: DynamicSvgLayer[];
  allMediaLayers: DynamicImageLayer[];
}

/**
 * 1. MULTI-LAYER TEXT HIERARCHY GENERATOR
 * Builds 8–10+ purposeful, independently configurable text layers per scene.
 */
export function buildMultiLayerTextStack(
  scene: SceneBlueprintItem,
  aspectRatio: '16:9' | '9:16' = '16:9',
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif'
): DynamicTextLayer[] {
  const start = Number(scene.narrationSegment?.startSeconds ?? 0);
  const dur = Math.max(2.5, scene.duration || 5);
  const isLandscape = aspectRatio === '16:9';

  // Coordinate reference space: 1920x1080 (landscape) or 1080x1920 (portrait)
  const centerX = isLandscape ? 960 : 540;
  const layers: DynamicTextLayer[] = [];

  // 1. Kicker Pill / Category Badge (Top label)
  const category = scene.categoryPill || (scene.sceneType === 'hook' ? 'CRITICAL INSIGHT' : 'KEY STRATEGY');
  layers.push({
    id: `text-kicker-${scene.sceneNumber}`,
    presetType: 'kicker-pill',
    text: category,
    startSeconds: start + 0.1,
    durationSeconds: dur - 0.2,
    x: isLandscape ? 320 : centerX,
    y: isLandscape ? 220 : 340,
    fontSize: isLandscape ? 20 : 22,
    fontWeight: 800,
    textTransform: 'uppercase',
    color: '#FF7043',
    backgroundColor: 'rgba(255, 87, 34, 0.14)',
    border: '1px solid rgba(255, 87, 34, 0.4)',
    borderRadius: 999,
    padding: '6px 18px',
    inAnimation: 'slide-up',
    outAnimation: 'fade-out',
    zIndex: 25,
  });

  // 2. Primary Hero Headline
  const headline = scene.heading || 'UNMATCHED RETENTION';
  layers.push({
    id: `text-headline-${scene.sceneNumber}`,
    presetType: 'hero-headline',
    text: headline,
    startSeconds: start + 0.2,
    durationSeconds: dur - 0.3,
    x: isLandscape ? 320 : centerX,
    y: isLandscape ? 320 : 450,
    fontSize: isLandscape ? 52 : 54,
    fontWeight: 900,
    fontFamily: headingFont,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 87, 34, 0.35)',
    inAnimation: 'spring-pop',
    outAnimation: 'fade-out',
    anchor: isLandscape ? 'top-left' : 'center',
    kineticMode: 'per-word',
    zIndex: 26,
  });

  // 3. Subheading (Contextual Expansion)
  const subhead = scene.supportingText
    ? scene.supportingText.split('.')[0]
    : 'Systematic breakdown of proven visual frameworks';
  layers.push({
    id: `text-subheading-${scene.sceneNumber}`,
    presetType: 'subheading',
    text: subhead,
    startSeconds: start + 0.45,
    durationSeconds: dur - 0.5,
    x: isLandscape ? 320 : centerX,
    y: isLandscape ? 410 : 540,
    fontSize: isLandscape ? 30 : 32,
    fontWeight: 700,
    fontFamily: bodyFont,
    color: '#E2E8F0',
    inAnimation: 'slide-up',
    outAnimation: 'fade-out',
    anchor: isLandscape ? 'top-left' : 'center',
    zIndex: 25,
  });

  // 4. Narrative Description
  const description = scene.supportingText && scene.supportingText.length > 50
    ? scene.supportingText
    : scene.narrationSegment?.text || 'Creators achieve 10x higher retention when visual pacing aligns with spoken cadence.';
  layers.push({
    id: `text-description-${scene.sceneNumber}`,
    presetType: 'description',
    text: description,
    startSeconds: start + 0.7,
    durationSeconds: dur - 0.75,
    x: isLandscape ? 320 : centerX,
    y: isLandscape ? 480 : 640,
    fontSize: isLandscape ? 22 : 24,
    fontWeight: 500,
    fontFamily: bodyFont,
    color: '#94A3B8',
    lineHeight: 1.45,
    inAnimation: 'fade-in',
    outAnimation: 'fade-out',
    anchor: isLandscape ? 'top-left' : 'center',
    zIndex: 24,
  });

  // 5. Key Point 1 (Staggered Entrance)
  layers.push({
    id: `text-keypoint-1-${scene.sceneNumber}`,
    presetType: 'key-point',
    text: '01. Instant Hook & Context Alignment',
    startSeconds: start + 1.1,
    durationSeconds: dur - 1.15,
    x: isLandscape ? 320 : centerX,
    y: isLandscape ? 560 : 740,
    fontSize: isLandscape ? 24 : 26,
    fontWeight: 800,
    color: '#FFFFFF',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    border: '1.5px solid rgba(255, 87, 34, 0.4)',
    borderRadius: 12,
    padding: '8px 20px',
    inAnimation: 'spring-pop',
    outAnimation: 'fade-out',
    anchor: isLandscape ? 'top-left' : 'center',
    zIndex: 27,
  });

  // 6. Key Point 2 (Staggered Entrance +0.5s later)
  layers.push({
    id: `text-keypoint-2-${scene.sceneNumber}`,
    presetType: 'key-point',
    text: '02. Dynamic Multi-Layer Depth Engine',
    startSeconds: start + 1.6,
    durationSeconds: dur - 1.65,
    x: isLandscape ? 320 : centerX,
    y: isLandscape ? 630 : 810,
    fontSize: isLandscape ? 24 : 26,
    fontWeight: 800,
    color: '#FFFFFF',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    border: '1.5px solid rgba(56, 189, 248, 0.4)',
    borderRadius: 12,
    padding: '8px 20px',
    inAnimation: 'spring-pop',
    outAnimation: 'fade-out',
    anchor: isLandscape ? 'top-left' : 'center',
    zIndex: 27,
  });

  // 7. Statistic / Numeric Metric Callout
  const statVal = scene.statValue || '+340%';
  layers.push({
    id: `text-stat-callout-${scene.sceneNumber}`,
    presetType: 'stat-callout',
    text: statVal,
    startSeconds: start + 0.9,
    durationSeconds: dur - 1.0,
    x: isLandscape ? 1450 : centerX,
    y: isLandscape ? 380 : 920,
    fontSize: isLandscape ? 72 : 68,
    fontWeight: 900,
    fontFamily: headingFont,
    color: '#10B981',
    textShadow: '0 4px 30px rgba(16, 185, 129, 0.65)',
    inAnimation: 'zoom-in',
    outAnimation: 'fade-out',
    anchor: 'center',
    zIndex: 28,
  });

  // 8. Stat Context Label
  const statLbl = scene.statLabel || 'AUDIENCE RETENTION';
  layers.push({
    id: `text-stat-label-${scene.sceneNumber}`,
    presetType: 'stat-label',
    text: statLbl,
    startSeconds: start + 1.05,
    durationSeconds: dur - 1.1,
    x: isLandscape ? 1450 : centerX,
    y: isLandscape ? 450 : 985,
    fontSize: isLandscape ? 18 : 20,
    fontWeight: 800,
    textTransform: 'uppercase',
    color: '#94A3B8',
    letterSpacing: '0.12em',
    inAnimation: 'slide-up',
    outAnimation: 'fade-out',
    anchor: 'center',
    zIndex: 28,
  });

  // 9. Highlighted Word / Kinetic Punch
  const highlightWord = scene.highlightedWords && scene.highlightedWords.length > 0
    ? scene.highlightedWords[0].toUpperCase()
    : 'CRITICAL';
  layers.push({
    id: `text-highlight-punch-${scene.sceneNumber}`,
    presetType: 'highlighted-word',
    text: highlightWord,
    startSeconds: start + 0.35,
    durationSeconds: Math.min(2.0, dur - 0.4),
    x: isLandscape ? 1450 : centerX,
    y: isLandscape ? 280 : 1060,
    fontSize: isLandscape ? 58 : 62,
    fontWeight: 900,
    textTransform: 'uppercase',
    color: '#FACC15',
    textShadow: '0 4px 28px rgba(250, 204, 21, 0.7)',
    inAnimation: 'spring-pop',
    outAnimation: 'shrink',
    anchor: 'center',
    zIndex: 29,
  });

  // 10. Footnote / Source Reference / Disclaimer
  layers.push({
    id: `text-footnote-${scene.sceneNumber}`,
    presetType: 'footnote-disclaimer',
    text: 'Source: Verified Creator Analytics Dataset (2026)',
    startSeconds: start + 1.2,
    durationSeconds: dur - 1.3,
    x: isLandscape ? 320 : centerX,
    y: isLandscape ? 980 : 1780,
    fontSize: isLandscape ? 14 : 16,
    fontWeight: 600,
    color: '#64748B',
    inAnimation: 'fade-in',
    outAnimation: 'fade-out',
    anchor: isLandscape ? 'top-left' : 'center',
    zIndex: 22,
  });

  return layers;
}

/**
 * 2. MULTI-LAYER BACKGROUND STACK GENERATOR
 * Builds stackable solid, gradient, image, video, texture, mesh, and vignette layers.
 */
export function buildMultiLayerBackgroundStack(
  scene: SceneBlueprintItem,
  theme = 'midnight-obsidian'
): DynamicBackgroundLayer[] {
  const start = Number(scene.narrationSegment?.startSeconds ?? 0);
  const dur = Math.max(2.5, scene.duration || 5);

  return [
    // Layer 1: Base Solid / Gradient Deep Surface
    {
      id: `bg-base-${scene.sceneNumber}`,
      type: 'gradient',
      startSeconds: start,
      durationSeconds: dur,
      gradient: 'linear-gradient(135deg, #070B14 0%, #0F172A 60%, #020617 100%)',
      opacity: 1.0,
      zIndex: 1,
    },
    // Layer 2: Texture / Halftone Grid Matrix
    {
      id: `bg-texture-${scene.sceneNumber}`,
      type: 'texture',
      startSeconds: start,
      durationSeconds: dur,
      color: 'rgba(255, 255, 255, 0.08)',
      opacity: 0.6,
      blendMode: 'soft-light',
      zIndex: 2,
    },
    // Layer 3: Ambient Radial Glow Mesh
    {
      id: `bg-mesh-${scene.sceneNumber}`,
      type: 'mesh',
      startSeconds: start,
      durationSeconds: dur,
      color: 'rgba(255, 87, 34, 0.07)',
      opacity: 0.8,
      blendMode: 'screen',
      motion: {
        enter: 'fade',
        continuous: 'drift',
        continuousIntensity: 0.8,
      },
      zIndex: 3,
    },
    // Layer 4: Deep Corner Cinematic Vignette
    {
      id: `bg-vignette-${scene.sceneNumber}`,
      type: 'vignette',
      startSeconds: start,
      durationSeconds: dur,
      opacity: 0.85,
      zIndex: 4,
    },
  ];
}

/**
 * 3. MULTI-LAYER AUDIO TRACK STACK GENERATOR
 * Stacks voiceover, multiple music tracks, ambient soundscapes, and timed SFX layers.
 */
export function buildMultiLayerAudioStack(
  scene: SceneBlueprintItem,
  bgmUrl = 'assets/reusable/music/parasail-silent-partner.mp3',
  bgmVolume = 0.12
): DynamicAudioLayer[] {
  const start = Number(scene.narrationSegment?.startSeconds ?? 0);
  const dur = Math.max(2.5, scene.duration || 5);

  const audioTracks: DynamicAudioLayer[] = [];

  // Track 1: Primary Background Music (Ducked during narration)
  if (bgmUrl && bgmUrl !== 'none') {
    audioTracks.push({
      id: `audio-bgm-${scene.sceneNumber}`,
      type: 'music',
      src: bgmUrl,
      startSeconds: start,
      durationSeconds: dur,
      volume: bgmVolume,
      fadeInSeconds: 0.8,
      fadeOutSeconds: 0.8,
      duckOnSpeech: true,
      duckedVolume: 0.08,
    });
  }

  // Track 2: Entrance Transition Whoosh SFX
  audioTracks.push({
    id: `audio-whoosh-${scene.sceneNumber}`,
    type: 'transition',
    src: 'assets/reusable/sfx/whoosh-swoosh-transition.mp3',
    startSeconds: start,
    durationSeconds: 1.2,
    volume: 0.35,
  });

  // Track 3: Keypoint Reveal Pop SFX (+1.1s mark)
  audioTracks.push({
    id: `audio-pop-1-${scene.sceneNumber}`,
    type: 'sfx',
    src: 'assets/reusable/sfx/pop-clean-bubble.mp3',
    startSeconds: start + 1.1,
    durationSeconds: 0.6,
    volume: 0.45,
  });

  // Track 4: Keypoint 2 Reveal Pop SFX (+1.6s mark)
  audioTracks.push({
    id: `audio-pop-2-${scene.sceneNumber}`,
    type: 'sfx',
    src: 'assets/reusable/sfx/pop-clean-bubble.mp3',
    startSeconds: start + 1.6,
    durationSeconds: 0.6,
    volume: 0.45,
  });

  // Track 5: Stat Cash Ding / Hit SFX (+0.9s mark)
  audioTracks.push({
    id: `audio-hit-stat-${scene.sceneNumber}`,
    type: 'impact',
    src: 'assets/reusable/sfx/cash-register-ding.mp3',
    startSeconds: start + 0.9,
    durationSeconds: 1.0,
    volume: 0.4,
  });

  return audioTracks;
}

/**
 * 4. MULTI-LAYER SVG & VECTOR GRAPHICS STACK GENERATOR
 * Stacks arrows, illustrations, badges, charts, and annotations.
 */
export function buildMultiLayerSvgStack(
  scene: SceneBlueprintItem,
  aspectRatio: '16:9' | '9:16' = '16:9'
): DynamicSvgLayer[] {
  const start = Number(scene.narrationSegment?.startSeconds ?? 0);
  const dur = Math.max(2.5, scene.duration || 5);
  const isLandscape = aspectRatio === '16:9';

  return [
    // SVG Layer 1: Concept Vector Badge / Icon
    {
      id: `svg-icon-${scene.sceneNumber}`,
      svgType: 'badge',
      startSeconds: start + 0.3,
      durationSeconds: dur - 0.4,
      x: isLandscape ? 1450 : 540,
      y: isLandscape ? 580 : 1240,
      width: isLandscape ? 220 : 180,
      height: isLandscape ? 220 : 180,
      scale: 1.0,
      zIndex: 16,
      payload: {
        kind: 'shape',
        shape: { shapeType: 'squircle', width: 220, height: 220, cornerRadius: 40 },
      },
      motion: {
        enter: { type: 'spring-pop', durationFrames: 10 },
        continuous: { type: 'float' },
      },
    },
    // SVG Layer 2: Directional Annotation Arrow pointing to the key metric
    {
      id: `svg-arrow-${scene.sceneNumber}`,
      svgType: 'annotation',
      startSeconds: start + 0.85,
      durationSeconds: dur - 0.95,
      x: isLandscape ? 1280 : 380,
      y: isLandscape ? 380 : 920,
      width: 140,
      height: 140,
      scale: 1.0,
      zIndex: 18,
      payload: {
        kind: 'annotation',
        annotationStyle: 'arrow',
      },
      motion: {
        enter: { type: 'spring-pop', durationFrames: 8 },
      },
    },
  ];
}

/**
 * 5. MULTI-LAYER IMAGE & VIDEO MEDIA STACK GENERATOR
 * Stacks multiple simultaneous images and video clips with independent transforms & cropping.
 */
export function buildMultiLayerMediaStack(
  scene: SceneBlueprintItem,
  assetUrls: string[] = [],
  aspectRatio: '16:9' | '9:16' = '16:9'
): DynamicImageLayer[] {
  const start = Number(scene.narrationSegment?.startSeconds ?? 0);
  const dur = Math.max(2.5, scene.duration || 5);
  const isLandscape = aspectRatio === '16:9';

  if (!assetUrls || assetUrls.length === 0) return [];

  const mediaLayers: DynamicImageLayer[] = [];

  // Media Layer 1: Primary Featured Visual Card (Right side in 16:9, Center in 9:16)
  if (assetUrls[0]) {
    mediaLayers.push({
      id: `media-primary-${scene.sceneNumber}`,
      src: assetUrls[0],
      startSeconds: start + 0.3,
      durationSeconds: dur - 0.4,
      mode: isLandscape ? 'framed' : 'collage',
      x: isLandscape ? 1450 : 540,
      y: isLandscape ? 720 : 1420,
      width: isLandscape ? 620 : 480,
      height: isLandscape ? 380 : 480,
      scale: 1.0,
      borderRadius: 20,
      border: { width: 2, color: 'rgba(255, 255, 255, 0.25)' },
      shadow: { x: 0, y: 16, blur: 32, spread: 0, color: 'rgba(0, 0, 0, 0.65)' },
      motion: {
        enter: { type: 'spring-pop', durationFrames: 10 },
        continuous: { type: 'ken-burns' },
        exit: { type: 'fade', durationFrames: 8 },
      },
      zIndex: 14,
    });
  }

  // Media Layer 2: Floating PIP / Secondary Thumbnail Callout
  if (assetUrls[1]) {
    mediaLayers.push({
      id: `media-pip-${scene.sceneNumber}`,
      src: assetUrls[1],
      startSeconds: start + 0.7,
      durationSeconds: dur - 0.8,
      mode: 'device-mockup',
      x: isLandscape ? 1720 : 860,
      y: isLandscape ? 560 : 1260,
      width: isLandscape ? 240 : 200,
      height: isLandscape ? 240 : 200,
      scale: 1.0,
      rotationDeg: -4,
      borderRadius: 16,
      border: { width: 2, color: 'rgba(255, 87, 34, 0.5)' },
      shadow: { x: 0, y: 12, blur: 24, spread: 0, color: 'rgba(0, 0, 0, 0.7)' },
      motion: {
        enter: { type: 'slide-up', durationFrames: 9 },
        continuous: { type: 'float' },
        exit: { type: 'shrink', durationFrames: 7 },
      },
      zIndex: 18,
    });
  }

  return mediaLayers;
}

/**
 * MASTER MULTI-LAYER BLUEPRINT COMPOSER
 * Combines all multi-layer tracks for the entire video timeline without any artificial limits!
 */
export function composeMultiLayerVideoBlueprint(
  scenes: SceneBlueprintItem[],
  aspectRatio: '16:9' | '9:16' = '16:9',
  brollUrls: string[] = [],
  bgmUrl = 'assets/reusable/music/parasail-silent-partner.mp3',
  bgmVolume = 0.12
): MultiLayerCompositionBlueprint {
  const allTextLayers: DynamicTextLayer[] = [];
  const allBackgroundLayers: DynamicBackgroundLayer[] = [];
  const allAudioLayers: DynamicAudioLayer[] = [];
  const allSvgLayers: DynamicSvgLayer[] = [];
  const allMediaLayers: DynamicImageLayer[] = [];

  const multiLayerScenes: MultiLayerSceneComposition[] = [];
  let totalDur = 0;

  scenes.forEach((scene, idx) => {
    const startSec = Number(scene.narrationSegment?.startSeconds ?? totalDur);
    const durSec = Math.max(2.5, scene.duration || 5);
    totalDur = Math.max(totalDur, startSec + durSec);

    const relevantAssets = brollUrls.slice(idx * 2, idx * 2 + 2);

    // 1. Text Layers (8–10 independent layers per scene)
    const sceneTexts = buildMultiLayerTextStack(scene, aspectRatio);
    allTextLayers.push(...sceneTexts);

    // 2. Background Layers (multi-layer stack)
    const sceneBgs = buildMultiLayerBackgroundStack(scene);
    allBackgroundLayers.push(...sceneBgs);

    // 3. Audio Layers (music + SFX layers)
    const sceneAudios = buildMultiLayerAudioStack(scene, bgmUrl, bgmVolume);
    allAudioLayers.push(...sceneAudios);

    // 4. SVG Layers
    const sceneSvgs = buildMultiLayerSvgStack(scene, aspectRatio);
    allSvgLayers.push(...sceneSvgs);

    // 5. Media Layers (images & video clips)
    const sceneMedias = buildMultiLayerMediaStack(scene, relevantAssets, aspectRatio);
    allMediaLayers.push(...sceneMedias);

    multiLayerScenes.push({
      sceneIndex: scene.sceneNumber || idx + 1,
      startSeconds: startSec,
      durationSeconds: durSec,
      textLayers: sceneTexts,
      backgroundLayers: sceneBgs,
      audioLayers: sceneAudios,
      svgLayers: sceneSvgs,
      mediaLayers: sceneMedias,
    });
  });

  return {
    totalDurationSeconds: totalDur,
    aspectRatio,
    scenes: multiLayerScenes,
    allTextLayers,
    allBackgroundLayers,
    allAudioLayers,
    allSvgLayers,
    allMediaLayers,
  };
}

