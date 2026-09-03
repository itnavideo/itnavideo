import './styles.css';
import {registerRoot} from 'remotion';
import {AutoCaptionGeneratorComposition} from './templates/AUTO_CAPTION_GENERATOR/template';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';
import {LongVideoPromoComposition} from './templates/LONG_VIDEO_PROMO/template';
import {WhiteboardVideoComposition} from './templates/WHITEBOARD_VIDEO/template';
import {TypographyVideoComposition} from './templates/TYPOGRAPHY_VIDEO/template';
import {MultiImagesVideoComposition} from './templates/MULTI_IMAGES_VIDEO/template';
import {LongVideoClipsComposition} from './templates/LONG_VIDEO_CLIPS/template';
import {LongVideoComposition} from './templates/LONG_VIDEO/template';
import {FacelessLongVideoComposition} from './templates/FACELESS_LONG_VIDEO/template';
import {AiVideoGeneratorComposition} from './templates/AI_VIDEO_GENERATOR/template';

const compositions = [
  AutoCaptionGeneratorComposition,
  CompareExplainerComposition,
  LongVideoPromoComposition,
  WhiteboardVideoComposition,
  TypographyVideoComposition,
  MultiImagesVideoComposition,
  LongVideoClipsComposition,
  LongVideoComposition,
  FacelessLongVideoComposition,
  AiVideoGeneratorComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component, index) => (
      <Component key={Component?.name || `comp-${index}`} />
    ))}
  </>
);

registerRoot(RemotionRoot);
