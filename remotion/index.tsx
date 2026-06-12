import {registerRoot} from 'remotion';
import {VideoExplainerComposition} from './templates/VIDEO_EXPLAINER/template';
import {CompareExplainerComposition} from './templates/COMPARE_EXPLAINER/template';

const compositions = [
  VideoExplainerComposition,
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
