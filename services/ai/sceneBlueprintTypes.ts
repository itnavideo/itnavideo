export type NarrativeSceneType =
  | 'hook'
  | 'context'
  | 'main_point'
  | 'explanation'
  | 'example_stat'
  | 'emphasis'
  | 'transition'
  | 'next_point';

export type VisualLayoutType =
  | 'big_typography'
  | 'stat_card'
  | 'split_screen'
  | 'image_text'
  | 'screenshot_highlight'
  | 'comparison'
  | 'timeline'
  | 'checklist'
  | 'quote'
  | 'numbered_point'
  | 'fullscreen_statement'
  | 'data_visualization'
  | 'broll_overlay';

export type MotionAnimationPreset =
  | 'slow_zoom_in'
  | 'slow_zoom_out'
  | 'pan_right'
  | 'scale_pop'
  | 'number_count_up'
  | 'pop_in'
  | 'slide'
  | 'fade'
  | 'spring';

export type SceneBlueprintItem = {
  sceneNumber: number;
  sceneType: NarrativeSceneType;
  layoutType: VisualLayoutType;
  duration: number; // in seconds
  narrationSegment: {
    text: string;
    startSeconds: number;
    endSeconds?: number;
  };
  heading: string;
  supportingText: string;
  highlightedWords: string[];
  visualAssetRequirement: string;
  visualIntent?: string;
  brollSearchQuery?: string;
  background: string; // background gradient theme ID
  fontHierarchy: {
    headingFont: string;
    bodyFont: string;
  };
  animation: MotionAnimationPreset;
  SFX: 'pop' | 'woosh' | 'whoosh' | 'chime' | 'rise' | 'none';
  transition: 'cut' | 'dissolve' | 'zoom' | 'wipe';

  // Extra metadata for specialized layouts
  statValue?: string;
  statLabel?: string;
  statTrend?: 'up' | 'down' | 'neutral';
  quoteAuthor?: string;
  numberBadge?: string | number;
  comparisonItems?: { left: string; right: string };
  timelineSteps?: string[];
  checklistItems?: string[];
  chartValuePercent?: number;
};

export type FullVideoSceneBlueprint = {
  title: string;
  overallNarrativeMood: string;
  totalDurationSeconds: number;
  totalScenes: number;
  scenes: SceneBlueprintItem[];
};
