import {registerRoot} from 'remotion';
import {AutoCaptionReelComposition} from './templates/AUTO_CAPTION_REEL/template';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';
import {VideoSimpleExplainerComposition} from './templates/VIDEO_SIMPLE_EXPLAINER/template';

const compositions = [
  AutoCaptionReelComposition,
  VideoSimpleExplainerComposition,
  CompareExplainerComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component) => (
      <Component key={Component.name} />
    ))}
  </>
);

registerRoot(RemotionRoot);
