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
  | 'curved_roadmap'
  | 'circular_org_chart'
  | 'horizontal_shelves'
  | 'scorecard_dashboard'
  | 'table_of_contents'
  | 'mission_vision'
  | 'medical_infographic'
  | 'rough_notation'
  | 'lottie_motion'
  | 'code_diff'
  | 'three_globe'
  | 'map_flyover'
  | 'kinetic_kit'
  | 'library_overlay'
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

export type CanvasLayoutMode =
  | 'split_screen_left_media'
  | 'split_screen_right_media'
  | 'full_bleed_cinematic'
  | 'card_hero_center'
  | 'typography_dominant'
  | 'data_dashboard'
  | 'process_horizontal_flow'
  | 'comparison_versus';

export interface SpatialPlacement {
  /** Where on the 1920x1080 canvas the element sits: x, y coordinates */
  x: number | string;
  y: number | string;
  anchor?: 'top-left' | 'top-center' | 'center' | 'bottom-left' | 'bottom-center';
  quadrant?: 'left-split' | 'right-split' | 'center-stage' | 'full-canvas' | 'floating-overlay';
}

export interface SpatialSize {
  /** In what exact size/dimensions the element renders */
  width: number | string;
  height: number | string;
  scale?: number;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  maxWidth?: number | string;
  maxHeight?: number | string;
}

export interface SceneMediaSlot {
  region: 'full' | 'left-half' | 'right-half' | 'center-third' | 'floating-card';
  cameraMotion: 'slow_zoom_in' | 'slow_zoom_out' | 'pan_left' | 'pan_right' | 'ambient_drift' | 'static_focused';
  aspectFraming: 'contain' | 'cover' | 'padded_card' | 'device_mockup';
  overlayScrim: 'none' | 'subtle_dark_gradient' | 'soft_vignette' | 'frosted_glass';
  /** Exact canvas placement coordinates (WHERE: layout decides position, not timestamp) */
  placement?: SpatialPlacement;
  /** Exact canvas dimensions & scale (SIZE: layout decides size) */
  size?: SpatialSize;
}

export interface SceneTypographySlot {
  region: 'top-band' | 'left-half' | 'right-half' | 'middle-band' | 'center';
  alignment: 'left' | 'center' | 'right';
  badgePosition?: 'above-title' | 'corner' | 'inline';
  /** Exact canvas placement coordinates (WHERE: layout decides position) */
  placement?: SpatialPlacement;
  /** Exact canvas dimensions (SIZE: layout decides size) */
  size?: SpatialSize;
}

export interface SceneChoreographySlot {
  heroEntrance: 'popIn' | 'bouncePop' | 'slideUp' | 'slideLeft' | 'slideRight' | 'maskReveal' | 'drawOn' | 'countUp';
  staggerDelayMs: number;
  leadTimeMs: number;
}

export interface SceneCompositionPlan {
  canvasLayout: CanvasLayoutMode;
  mediaSlot: SceneMediaSlot;
  typographySlot: SceneTypographySlot;
  choreography: SceneChoreographySlot;
  visualBalance: '85_vector_dominant' | 'photographic_realism' | 'balanced_editorial';
}

export type SceneBlueprintItem = {
  sceneNumber: number;
  sceneType: NarrativeSceneType;
  layoutType: VisualLayoutType;
  rhetoricalPurpose?: string;
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

  // S3 Curated Asset Assignment Metadata
  assignedAssetId?: string;
  assetUrl?: string;
  assetTitle?: string;
  assetStyle?: string;
  brollUrl?: string;
  accentColor?: string;
  secondaryColor?: string;

  // Complete 16:9 Screen Composition Recipe
  composition?: SceneCompositionPlan;

  // Responsive Typography Engine metadata (16:9 widescreen layout intelligence)
  typographyTreatment?: 'stat' | 'quote' | 'list' | 'headline' | 'short_sentence' | 'paragraph' | 'split';
  listItems?: string[];
  layoutMode?: string;

  // Autonomous Motion Graphic Library Component Overlay
  overlayComponent?: {
    componentId: string;
    name?: string;
    category?: string;
    props?: Record<string, any>;
    cinematic?: boolean;
    scale?: number;
    placement?: 'center' | 'lower-third' | 'split-right' | 'split-left';
  };
};

export type FullVideoSceneBlueprint = {
  title: string;
  overallNarrativeMood: string;
  totalDurationSeconds: number;
  totalScenes: number;
  scenes: SceneBlueprintItem[];
};
