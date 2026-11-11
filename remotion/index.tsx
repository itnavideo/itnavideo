import { Composition, registerRoot } from 'remotion';
import { ContactSheetGrid } from './components/ContactSheetGrid';
// RM3 Fix: AutoCaptionGeneratorComposition registers TWO compositions:
//   1. 'AUTO-CAPTION-GENERATOR'          — 9:16 Vertical Reel (autoCaption mode)
//   2. 'AUTO-CAPTION-GENERATOR-LANDSCAPE' — 16:9 YouTube Subtitles (youtubeSubtitleGenerator mode)
import { AutoCaptionGeneratorComposition } from './templates/AUTO_CAPTION_GENERATOR/template';
import { CompareExplainerComposition } from './templates/COMPARE_EXPLAINER/template';
import { LongVideoPromoComposition } from './templates/LONG_VIDEO_PROMO/template';
import { WhiteboardVideoComposition } from './templates/WHITEBOARD_VIDEO/template';
import { LongVideoClipsComposition } from './templates/LONG_VIDEO_CLIPS/template';
// RT5 Fix: LongVideoComposition (LONG-VIDEO) removed — this composition was never dispatched
// by the jobs route. The longVideoPro mode was merged into facelessVideo. Removing it shrinks
// the Lambda bundle and cold-start time. Template kept on disk if needed in future.
import { FacelessVideoComposition, FacelessVideoTemplate } from './templates/FACELESS_VIDEO/template';
import { FacelessShortsComposition } from './templates/FACELESS_SHORTS/template';
import { ImageToVideoAiComposition } from './templates/IMAGE_TO_VIDEO_AI/template';
import { BookSummaryComposition } from './templates/BOOK_SUMMARY/template';
import { SplitScreenExplainerComposition } from './templates/SPLIT_SCREEN_EXPLAINER/template';
import { AiVideoPolisherComposition } from './templates/AI_VIDEO_POLISHER/template';
import { AiShortsPolisherComposition } from './templates/AI_SHORTS_POLISHER/template';
import { AiVideoGeneratorComposition } from './templates/AI_VIDEO_GENERATOR/template';

// RO2 Fix: Dev-only preview compositions wrapped in NODE_ENV check to exclude from
// production Lambda bundle — reduces cold-start time and bundle size.
const IS_DEV = process.env.NODE_ENV !== 'production';
// LibraryPreview only needed in Remotion Studio
const LibraryPreview = IS_DEV ? require('./motion-graphics/previews/LibraryPreview').LibraryPreview : null;

// Self-contained default sample blueprint for Remotion Studio preview only
const DEFAULT_PREVIEW_BLUEPRINT = IS_DEV ? [
  {
    sceneNumber: 1,
    sceneType: 'hook' as const,
    heading: 'THE ARCHITECTURE OF AUTOMATION',
    duration: 5,
    supportingText: 'Decoupling heavy compute from local devices enables instant 1080p generation.',
    visualAssetRequirement: 'none' as const,
    background: 'solid-white',
    narrationSegment: {
      text: 'Decoupling heavy compute from local devices enables instant 1080p generation.',
      startSeconds: 0,
      endSeconds: 5,
    },
    highlightedWords: ['architecture', 'automation', 'instant', '1080p'],
    layoutType: 'big_typography' as const,
    fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
    animation: 'pop_in' as const,
    SFX: 'whoosh',
    transition: 'cut' as const,
  },
] : [];

// Production compositions — dispatched by jobs route
const compositions = [
  AutoCaptionGeneratorComposition, // registers AUTO-CAPTION-GENERATOR + AUTO-CAPTION-GENERATOR-LANDSCAPE
  CompareExplainerComposition,
  LongVideoPromoComposition,
  WhiteboardVideoComposition,
  LongVideoClipsComposition,
  FacelessVideoComposition,
  FacelessShortsComposition,
  ImageToVideoAiComposition,
  BookSummaryComposition,
  SplitScreenExplainerComposition,
  AiVideoPolisherComposition,
  AiShortsPolisherComposition,
  AiVideoGeneratorComposition,
];

const RemotionRoot = () => (
  <>
    <Composition
      id="CONTACT-SHEET"
      component={ContactSheetGrid}
      durationInFrames={1}
      fps={30}
      width={1920}
      height={1080}
    />
    {/* RO2 Fix: Dev-only compositions excluded from production Lambda bundle */}
    {IS_DEV && LibraryPreview && (
      <Composition
        id="MOTION-GRAPHICS-LIBRARY"
        component={LibraryPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    )}
    {IS_DEV && DEFAULT_PREVIEW_BLUEPRINT.length > 0 && (
      <Composition
        id="WIDESCREEN-QUALITY-PREVIEW"
        component={FacelessVideoTemplate}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: '16:9 Widescreen Quality Preview',
          durationSeconds: 20,
          backgroundTheme: 'solid-white',
          headingFont: 'Montserrat',
          subheadingFont: 'Plus Jakarta Sans',
          typographyFont: 'Plus Jakarta Sans',
          sceneBlueprint: DEFAULT_PREVIEW_BLUEPRINT,
          showCaptions: false,
          aspectRatio: '16:9' as const,
        }}
      />
    )}
    {compositions.map((Component, index) => (
      Component ? <Component key={Component?.name || `comp-${index}`} /> : null
    ))}
  </>
);

registerRoot(RemotionRoot);
