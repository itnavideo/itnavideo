import {registerRoot} from 'remotion';
import {CompareExplainerComposition,
  VoiceSyncedNotesComposition, Compare2DPreviewComposition, CompareCartoonPreviewComposition, CompareExplainerPreviewComposition} from './templates/COMPARE_EXPLAINER/template';
import {VideoSimpleExplainerComposition} from './templates/VIDEO_SIMPLE_EXPLAINER/template';
import {VoiceSyncedNotesComposition} from './templates/VOICE_SYNCED_NOTES/template';

const compositions = [
  VideoSimpleExplainerComposition,
  CompareExplainerComposition,
  VoiceSyncedNotesComposition,
];

const RemotionRoot = () => (
  <>
    {compositions.map((Component) => (
      <Component key={Component.name} />
    ))}
  </>
);

registerRoot(RemotionRoot);



