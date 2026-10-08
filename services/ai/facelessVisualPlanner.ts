import type {
  NarrativeSceneType,
  VisualLayoutType,
  MotionAnimationPreset,
  SceneBlueprintItem,
} from './sceneBlueprintTypes';

export type SceneDensityLevel = 'high' | 'medium' | 'low';

export interface VisualCompositionPlan {
  sceneType: NarrativeSceneType;
  layoutType: VisualLayoutType;
  position: 'left' | 'right' | 'center';
  textAlignment: 'left' | 'right' | 'center';
  density: SceneDensityLevel;
  primaryVisual: {
    type: 'metric' | 'broll' | 'thumbnail_mockup' | 'diagram' | 'info_card' | 'none';
    value?: string;
    label?: string;
  };
  emphasisWords: string[];
  animation: {
    entrance: MotionAnimationPreset;
    metric?: 'countUp' | 'pop' | 'none';
  };
  sfx: 'pop' | 'woosh' | 'chime' | 'rise' | 'none';
  backgroundIdentity: string;
  importance: 'high' | 'medium' | 'low';
}

const SECTION_THEMES = [
  'midnight-obsidian',
  'purple-vignette',
  'royal-indigo',
  'emerald-studio',
  'pure-dark',
];

/**
 * AI Visual Director service that determines scene composition, visual density,
 * dynamic story section background identity, and precise asset alignment.
 */
export function planFacelessVisualComposition(
  text: string,
  sceneIndex: number,
  totalScenes: number,
  narrativeStage: NarrativeSceneType
): VisualCompositionPlan {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // 1. Determine Visual Density based on narrative pacing
  let density: SceneDensityLevel = 'medium';
  if (narrativeStage === 'hook' || narrativeStage === 'example_stat' || narrativeStage === 'emphasis') {
    density = 'high';
  } else if (narrativeStage === 'explanation' && cleanText.length > 80) {
    density = 'low';
  }

  // 2. Importance Filter for Callouts & Badges
  const isNumericOrMetric = /(\d+[\d,.]*%?|\$\d+|\b[0-9]{1,3}[kKMmB]?\b)/i.test(cleanText);
  const isKeyEmphasis = /\b(never|must|secret|first|always|stop|quit|blow up|viral|growth|ctr)\b/i.test(lowerText);
  const importance: 'high' | 'medium' | 'low' = (isNumericOrMetric || isKeyEmphasis || narrativeStage === 'hook') ? 'high' : 'medium';

  // 3. Primary Visual Selection
  let visualType: VisualCompositionPlan['primaryVisual']['type'] = 'none';
  let metricValue: string | undefined;
  let metricLabel: string | undefined;

  const metricMatch = cleanText.match(/(\d+[\d,.]*%?|\$\d+|\b[0-9]{1,3}[kKMmB]?\b)/i);
  if (metricMatch && importance === 'high') {
    visualType = 'metric';
    metricValue = metricMatch[0];
    metricLabel = cleanText.replace(metricMatch[0], '').trim().slice(0, 30);
  } else if (/\b(channel|youtube|video|thumbnail|analytics|views)\b/i.test(lowerText)) {
    visualType = 'thumbnail_mockup';
  } else if (/\b(step|process|how to|architecture|system)\b/i.test(lowerText)) {
    visualType = 'diagram';
  } else if (/\b(broll|stock|visual|footage|watch)\b/i.test(lowerText)) {
    visualType = 'broll';
  }

  // 4. Story Section Background Identity
  // Group scenes into sections (e.g. 4 sections across total duration)
  const sectionCount = Math.max(1, Math.min(5, Math.ceil(totalScenes / 4)));
  const sectionIndex = Math.min(sectionCount - 1, Math.floor((sceneIndex / Math.max(1, totalScenes)) * sectionCount));
  const backgroundIdentity = SECTION_THEMES[sectionIndex % SECTION_THEMES.length];

  // 5. Layout Alignment & Text Position
  const positions: Array<'left' | 'right' | 'center'> = ['center', 'left', 'right'];
  const position = narrativeStage === 'hook' || narrativeStage === 'emphasis' ? 'center' : positions[sceneIndex % positions.length];
  const textAlignment = position === 'center' ? 'center' : position === 'left' ? 'left' : 'right';

  // 6. Keyword Extraction for Emphasis
  const words = cleanText.split(/\s+/);
  const emphasisWords = words
    .map((w) => w.replace(/[^a-zA-Z0-9₹$%]/g, ''))
    .filter((w) => w.length > 3 && !/^(the|and|for|with|that|this|your|from|have|been)$/i.test(w))
    .slice(0, 3);

  // 7. Entrance Animations & SFX Timing
  let entrance: MotionAnimationPreset = 'pop_in';
  if (narrativeStage === 'hook') entrance = 'scale_pop';
  else if (narrativeStage === 'transition') entrance = 'slide';
  else if (narrativeStage === 'explanation') entrance = 'fade';

  let sfx: VisualCompositionPlan['sfx'] = 'none';
  if (narrativeStage === 'hook') sfx = 'rise';
  else if (visualType === 'metric' || importance === 'high') sfx = 'pop';
  else if (narrativeStage === 'transition') sfx = 'woosh';
  else if (narrativeStage === 'main_point') sfx = 'chime';

  // Map to VisualLayoutType
  let layoutType: VisualLayoutType = 'big_typography';
  if (visualType === 'metric') layoutType = 'stat_card';
  else if (narrativeStage === 'comparison' as any) layoutType = 'comparison';
  else if (position !== 'center') layoutType = 'split_screen';
  else if (narrativeStage === 'emphasis') layoutType = 'fullscreen_statement';

  return {
    sceneType: narrativeStage,
    layoutType,
    position,
    textAlignment,
    density,
    primaryVisual: {
      type: visualType,
      value: metricValue,
      label: metricLabel,
    },
    emphasisWords,
    animation: {
      entrance,
      metric: visualType === 'metric' ? 'countUp' : 'none',
    },
    sfx,
    backgroundIdentity,
    importance,
  };
}

