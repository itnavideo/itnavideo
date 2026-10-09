import { Composition, registerRoot } from 'remotion';
import { ContactSheetGrid } from './components/ContactSheetGrid';
import { AutoCaptionGeneratorComposition } from './templates/AUTO_CAPTION_GENERATOR/template';
import { TypographyVideoComposition } from './templates/TYPOGRAPHY_VIDEO/template';
import { CompareExplainerComposition } from './templates/COMPARE_EXPLAINER/template';
import { LongVideoPromoComposition } from './templates/LONG_VIDEO_PROMO/template';
import { WhiteboardVideoComposition } from './templates/WHITEBOARD_VIDEO/template';
import { LongVideoClipsComposition } from './templates/LONG_VIDEO_CLIPS/template';
import { LongVideoComposition } from './templates/LONG_VIDEO/template';
import { FacelessVideoComposition } from './templates/FACELESS_VIDEO/template';
import { ImageToVideoAiComposition } from './templates/IMAGE_TO_VIDEO_AI/template';
import { BookSummaryComposition } from './templates/BOOK_SUMMARY/template';

const compositions = [
  AutoCaptionGeneratorComposition,
  TypographyVideoComposition,
  CompareExplainerComposition,
  LongVideoPromoComposition,
  WhiteboardVideoComposition,
  LongVideoClipsComposition,
  LongVideoComposition,
  FacelessVideoComposition,
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
    {compositions.map((Component, index) => (
      Component ? <Component key={Component?.name || `comp-${index}`} /> : null
    ))}
  </>
);

registerRoot(RemotionRoot);
