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
  | 'donut_breakdown'
  | 'sticky_note'
  | 'numbered_steps'
  | 'social_post'
  | 'chat_dialogue'
  | 'vector_concept'
  | 'search_discovery'
  | 'full_bleed_visual'
  | 'chapter_title'
  | 'card_concept'
  | 'broll_overlay'
  | 'prompt_window'
  | 'calendar_grid'
  | 'milestone_ladder'
  | 'script_bubble'
  | 'roadmap'
  | 'vertical_roadmap'
  | 'workflow'
  | 'goal_target'
  | 'ecosystem'
  | 'vs_battle'
  | 'metric_pill'
  | 'newspaper_headline'
  | 'stamp_badge'
  | 'supporting_note'
  | 'horizontal_process'
  | 'process_steps'
  | 'story_character_desk'
  | 'product_mockup_flow'
  | 'before_after_transformation'
  | 'creator_celebration'
  | 'drawing_story'
  | 'hook';

export type FacelessGraphicKind = 'allocation' | 'comparison' | 'sequence' | 'metric' | 'concept' | 'growth';

export type FacelessGraphicItem = {
  label: string;
  displayValue?: string;
  value?: number;
};

export type FacelessGraphicPlan = {
  kind: FacelessGraphicKind;
  title: string;
  sourceText: string;
  items: FacelessGraphicItem[];
};
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
  englishMeaning?: string;
  brollSearchQuery?: string;
  background: string; // background gradient theme ID
  fontHierarchy: {
    headingFont: string;
    bodyFont: string;
  };
  animation: MotionAnimationPreset;
  SFX: 'pop' | 'woosh' | 'whoosh' | 'chime' | 'rise' | 'hit' | 'ding' | 'none';
  transition: 'cut' | 'dissolve' | 'crossfade' | 'zoom' | 'wipe' | 'slide' | 'whip' | 'fade_to_black';

  // Extra metadata for specialized layouts
  statValue?: string;
  statLabel?: string;
  statTrend?: 'up' | 'down' | 'neutral';
  quoteAuthor?: string;
  numberBadge?: string | number;
  categoryPill?: string;
  comparisonItems?: { left: string; right: string };
  timelineSteps?: string[];
  checklistItems?: string[];
  chartValuePercent?: number;

  // Visual Graphics Metadata
  chartItems?: Array<{ label: string; value: number; formattedValue?: string; color?: string }>;
  donutSlices?: Array<{ label: string; value: number; color?: string }>;
  chatMessages?: Array<{ sender: 'left' | 'right'; text: string }>;
  searchQuery?: string;
  vectorDrawingId?: string;
  graphicPlan?: FacelessGraphicPlan;

  // Responsive Typography Engine metadata (16:9 widescreen layout intelligence)
  typographyTreatment?: 'stat' | 'quote' | 'list' | 'headline' | 'short_sentence' | 'paragraph' | 'split';
  listItems?: string[];
  layoutMode?: string;
};

export type FullVideoSceneBlueprint = {
  title: string;
  overallNarrativeMood: string;
  totalDurationSeconds: number;
  totalScenes: number;
  scenes: SceneBlueprintItem[];
};
