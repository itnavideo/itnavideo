import {registerRoot} from 'remotion';
import {AutoCaptionReelComposition} from './templates/AUTO_CAPTION_REEL/template';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';
import {VideoSimpleExplainerComposition} from './templates/VIDEO_SIMPLE_EXPLAINER/template';
import {ImageStoryCollageComposition} from './templates/IMAGE_STORY_COLLAGE/template';
import {AutoDrawExplainerComposition} from './templates/AUTO_DRAW_EXPLAINER/template';
import {LongVideoPromoComposition} from './templates/LONG_VIDEO_PROMO/template';

const compositions = [
  AutoCaptionReelComposition,
  VideoSimpleExplainerComposition,
  CompareExplainerComposition,
  ImageStoryCollageComposition,
  AutoDrawExplainerComposition,
  LongVideoPromoComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component) => (
      <Component key={Component.name} />
    ))}
  </>
);

registerRoot(RemotionRoot);
