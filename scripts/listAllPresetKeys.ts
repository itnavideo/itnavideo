import { CAPTION_PRESET_CONFIGS } from '../remotion/captions/registry/captionPresets';

console.log('Registered Preset IDs in CAPTION_PRESET_CONFIGS:');
Object.keys(CAPTION_PRESET_CONFIGS).forEach((id) => {
  console.log(`- "${id}": ${CAPTION_PRESET_CONFIGS[id].name}`);
});
