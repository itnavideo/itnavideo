import {registerRoot} from 'remotion';
import {AutoCaptionReelComposition} from './templates/AUTO_CAPTION_REEL/template';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';
import {LongVideoPromoComposition} from './templates/LONG_VIDEO_PROMO/template';
import {WhiteboardVideoComposition} from './templates/WHITEBOARD_VIDEO/template';
import {TypographyVideoComposition} from './templates/TYPOGRAPHY_VIDEO/template';
import {MultiImagesVideoComposition} from './templates/MULTI_IMAGES_VIDEO/template';
import {LongVideoClipsComposition} from './templates/LONG_VIDEO_CLIPS/template';
import {LongFormCaptionedVideoComposition} from './templates/LONG_FORM_CAPTIONED_VIDEO/template';
import {LongVideoComposition} from './templates/LONG_VIDEO/template';
import {CaptionStudioComposition} from './templates/CAPTION_STUDIO/template';

const compositions = [
  AutoCaptionReelComposition,
  CompareExplainerComposition,
  LongVideoPromoComposition,
  WhiteboardVideoComposition,
  TypographyVideoComposition,
  MultiImagesVideoComposition,
  LongVideoClipsComposition,
  LongFormCaptionedVideoComposition,
  LongVideoComposition,
  CaptionStudioComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component) => (
      <Component key={Component.name} />
    ))}
  </>
);

registerRoot(RemotionRoot);
