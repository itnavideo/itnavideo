import { Composition, registerRoot } from 'remotion';
import { ContactSheetGrid } from './components/ContactSheetGrid';
import { AutoCaptionGeneratorComposition } from './templates/AUTO_CAPTION_GENERATOR/template';
import { CompareExplainerComposition } from './templates/COMPARE_EXPLAINER/template';
import { LongVideoPromoComposition } from './templates/LONG_VIDEO_PROMO/template';
import { WhiteboardVideoComposition } from './templates/WHITEBOARD_VIDEO/template';
import { LongVideoClipsComposition } from './templates/LONG_VIDEO_CLIPS/template';
import { LongVideoComposition } from './templates/LONG_VIDEO/template';
import { FacelessVideoComposition, FacelessVideoTemplate } from './templates/FACELESS_VIDEO/template';
import { FacelessShortsComposition } from './templates/FACELESS_SHORTS/template';
import { ImageToVideoAiComposition } from './templates/IMAGE_TO_VIDEO_AI/template';
import { BookSummaryComposition } from './templates/BOOK_SUMMARY/template';
import { SaasProductDemoComposition } from './templates/SAAS_PRODUCT_DEMO/template';
import { LibraryPreview } from './motion-graphics/previews/LibraryPreview';
// Self-contained default sample blueprint for remotion studio preview
const DEFAULT_PREVIEW_BLUEPRINT = [
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
];

const compositions = [
  AutoCaptionGeneratorComposition,
  CompareExplainerComposition,
  LongVideoPromoComposition,
  WhiteboardVideoComposition,
  LongVideoClipsComposition,
  LongVideoComposition,
  FacelessVideoComposition,
  FacelessShortsComposition,
  ImageToVideoAiComposition,
  BookSummaryComposition,
  SaasProductDemoComposition,
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
    <Composition
      id="MOTION-GRAPHICS-LIBRARY"
      component={LibraryPreview}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
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
    {compositions.map((Component, index) => (
      Component ? <Component key={Component?.name || `comp-${index}`} /> : null
    ))}
  </>
);

registerRoot(RemotionRoot);
