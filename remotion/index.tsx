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
import { LibraryPreview } from './motion-graphics/previews/LibraryPreview';
import { SAMPLE_WIDESCREEN_BLUEPRINT } from '../components/preview/WidescreenQualityPreviewClient';

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
        sceneBlueprint: SAMPLE_WIDESCREEN_BLUEPRINT,
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
