import {registerRoot} from 'remotion';
import {AutoCaptionReelComposition} from './templates/AUTO_CAPTION_REEL/template';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';
import {AutoDrawExplainerComposition} from './templates/AUTO_DRAW_EXPLAINER/template';
import {LongVideoPromoComposition} from './templates/LONG_VIDEO_PROMO/template';
import {DynamicCreatorReelComposition} from './templates/DYNAMIC_CREATOR_REEL/template';
import {CreatorBackgroundReplaceComposition} from './templates/CREATOR_BACKGROUND_REPLACE/template';

const compositions = [
  AutoCaptionReelComposition,
  CompareExplainerComposition,
  AutoDrawExplainerComposition,
  LongVideoPromoComposition,
  DynamicCreatorReelComposition,
  CreatorBackgroundReplaceComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component) => (
      <Component key={Component.name} />
    ))}
  </>
);

registerRoot(RemotionRoot);
