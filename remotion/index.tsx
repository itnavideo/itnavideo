import {registerRoot} from 'remotion';
import {ComparisonImagesComposition} from './templates/comparisonImages/template';
import {VideoExplainerComposition} from './templates/VIDEO_EXPLAINER/template';

const compositions = [
  VideoExplainerComposition,
  ComparisonImagesComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component) => (
      <Component key={Component.name} />
    ))}
  </>
);

registerRoot(RemotionRoot);
