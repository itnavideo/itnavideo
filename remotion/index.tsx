import {registerRoot} from 'remotion';
import {AutoCaptionReelComposition} from './templates/AUTO_CAPTION_REEL/template';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';
import {LongVideoPromoComposition} from './templates/LONG_VIDEO_PROMO/template';
import {WhiteboardVideoComposition} from './templates/WHITEBOARD_VIDEO/template';
import {TypographyVideoComposition} from './templates/TYPOGRAPHY_VIDEO/template';

const compositions = [
  AutoCaptionReelComposition,
  CompareExplainerComposition,
  LongVideoPromoComposition,
  WhiteboardVideoComposition,
  TypographyVideoComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component) => (
      <Component key={Component.name} />
    ))}
  </>
);

registerRoot(RemotionRoot);
