import {registerRoot} from 'remotion';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';
import {VideoSimpleExplainerComposition} from './templates/VIDEO_SIMPLE_EXPLAINER/template';

const compositions = [
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
