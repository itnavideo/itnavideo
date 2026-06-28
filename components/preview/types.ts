/**
 * Shared types for the universal preview editor system.
 * Used by PreviewEditor, CaptionEditor, timeline, and the /api/reels/preview response.
 */

export type PreviewCaption = {
  start: number;
  end: number;
  text: string;
  words?: Array<{ word: string; start: number; end: number }>;
};

export type PreviewScene = {
  type: 'creator_face' | 'typography' | 'key_point' | 'broll' | 'quote' | 'transition';
  start: number;
  end: number;
  text?: string;
  highlightWord?: string;
  zoom?: number;
};

export type PreviewSticker = {
  id: string;
  start: number;
  end: number;
  pose: string;
  character?: string;
  x?: number;
  y?: number;
  scale?: number;
};

export type PreviewAsset = {
  id: string;
  type: 'image' | 'video' | 'audio';
  role?: string;
  url: string;
  label?: string;
  fit?: 'contain' | 'cover';
  x?: number;
  y?: number;
  scale?: number;
};

export type PreviewLayout = {
  videoLayout: 'fullscreen' | 'blur-bg' | 'split';
  captionPosition: 'bottom' | 'center' | 'top';
  progressStyle: 'glow' | 'line' | 'none';
};

export type PreviewPlan = {
  templateId: string;
  compositionId: string;
  durationSeconds: number;
  mediaSrc: string;
  mediaTrimStartSeconds: number;
  captions: PreviewCaption[];
  scenes: PreviewScene[];
  stickers: PreviewSticker[];
  layout: PreviewLayout;
  assets: PreviewAsset[];
  userEdits: Record<string, unknown>;
  inputProps: Record<string, unknown>;
  transcript: string;
  transcriptWords: Array<{ word: string; start: number; end: number }>;
};

// What gets sent to /api/reels/jobs after user confirms preview
export type FinalRenderRequest = {
  // Original upload keys (already in S3 from preview step)
  mediaKey: string;
  fileName: string;
  contentType: string;
  mediaType: string;
  mode: string;
  userId: string;
  // User-edited preview plan props merged in
  previewInputProps: Record<string, unknown>;
  // Standard form fields
  topicTitle?: string;
  captionStyle?: string;
  captionPosition?: string;
  subtitleOutputLanguage?: string;
  captionTextColor?: string;
  captionHighlightColor?: string;
  videoLayout?: string;
  progressStyle?: string;
  wordClickSound?: boolean;
  accentColor?: string;
  // Compare fields
  comparisonImageKeys?: string[];
  compareLeftTitle?: string;
  compareRightTitle?: string;
  creatorHandle?: string;
  stickerStyle?: string;
};
