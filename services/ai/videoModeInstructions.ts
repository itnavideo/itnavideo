export type CreationMode = 'faceless' | 'face_camera';

export type VideoModeInstruction = {
  mode: CreationMode;
  label: string;
  planningFocus: string[];
  avoid: string[];
  prompt: string;
};

export const VIDEO_MODE_INSTRUCTIONS: Record<CreationMode, VideoModeInstruction> = {
  faceless: {
    mode: 'faceless',
    label: 'Faceless video',
    planningFocus: [
      'Use the uploaded voiceover as the source of truth for timing, emotion, captions, and scene pacing.',
      'Plan visual scenes from screenshots, images, video clips, stock footage, graphics, and text cards.',
      'Choose asset-library search queries for every major sentence or idea.',
      'Use dynamic text overlays, kinetic captions, icons, callouts, screenshots, and motion graphics to explain the narration.',
      'Prioritize visual variety because no face-camera footage is the main anchor.',
    ],
    avoid: [
      'Do not assume a visible speaker or talking-head footage exists.',
      'Do not create instructions about jump cuts on a face unless user video is explicitly supplied.',
      'Do not overuse icon-only scenes when a screenshot, clip, or text card would explain better.',
    ],
    prompt:
      'FACLESS_VIDEO_MODE: The user is creating a faceless short. Audio is mandatory and visuals are optional. Build a visual-first timeline using images, screenshots, clips, b-roll, graphics, icons, text cards, captions, transitions, and SFX around the voiceover. Treat the voiceover as the timeline spine.',
  },
  face_camera: {
    mode: 'face_camera',
    label: 'Face camera video',
    planningFocus: [
      'Keep the uploaded camera/talking-head video as the main visual anchor.',
      'Prioritize mistake cuts, dead-air removal, reframing, jump zooms, captions, text emphasis, icons, callouts, and SFX.',
      'Use overlays to support what the speaker says, not replace the speaker.',
      'Keep captions readable inside mobile safe zones and preserve face visibility.',
      'Use sound effects and transitions sparingly around keyword moments, not every sentence.',
    ],
    avoid: [
      'Do not plan full b-roll replacement unless the user asks for it.',
      'Do not cover the speaker face with large text cards or icons.',
      'Do not treat optional stock visuals as the main scene source.',
    ],
    prompt:
      'FACE_CAMERA_VIDEO_MODE: The user uploaded face-camera/talking-head footage. Keep the person on screen as the main asset. Focus on cutting mistakes, improving pacing, reframing for Shorts, adding captions, text emphasis, icons, callouts, subtle SFX, and audio polish. Do not replace the video with faceless b-roll.',
  },
};

export function getVideoModeInstruction(mode: unknown): VideoModeInstruction {
  return normalizeCreationMode(mode) === 'face_camera'
    ? VIDEO_MODE_INSTRUCTIONS.face_camera
    : VIDEO_MODE_INSTRUCTIONS.faceless;
}

export function normalizeCreationMode(mode: unknown): CreationMode {
  const normalized = String(mode || '').trim().toLowerCase().replace(/[-\s]/g, '_');
  if (normalized === 'face' || normalized === 'face_camera' || normalized === 'talking_head' || normalized === 'camera') {
    return 'face_camera';
  }

  return 'faceless';
}
