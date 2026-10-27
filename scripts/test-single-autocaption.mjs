// scripts/test-single-autocaption.mjs
import { transcribeWithGroq, groupWordsIntoCaptions, renderOnLambda } from './render-direct-lambda.mjs';

async function runTest() {
  const audioUrl = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';
  const title = 'Daily Discipline Over Motivation';

  console.log('================================================================');
  console.log('📱 [AUTO CAPTION REEL] CYCLE 1 — DIRECT AWS LAMBDA CLOUD RENDER');
  console.log('Topic:', title);
  console.log('Audio:', audioUrl);
  console.log('================================================================');

  const transcription = await transcribeWithGroq(audioUrl);
  const captions = groupWordsIntoCaptions(transcription.words, 3);
  const durationSec = Math.ceil(transcription.duration || 24);
  const totalFrames = durationSec * 30;

  const inputProps = {
    mediaSrc: audioUrl,
    mediaType: 'audio',
    sourceAudioVolume: 1,
    aspectRatio: '9:16',
    durationSeconds: durationSec,
    sourceDurationSeconds: durationSec,
    renderWindowSeconds: durationSec,
    captions,
    subtitleChunks: captions,
    captionStyle: 'glow-viral',
    captionPosition: 'bottom',
    textColor: '#ffffff',
    highlightColor: '#ff5722',
    backgroundColor: '#070b14',
    fontSize: 'large',
    showBackground: true,
  };

  const result = await renderOnLambda({
    composition: 'AUTO-CAPTION-GENERATOR',
    inputProps,
    totalFrames,
  });

  console.log('\n================================================================');
  console.log('✅ CYCLE 1 AUTO CAPTION SUCCESSFUL!');
  console.log('Video URL:', result.videoUrl);
  console.log('Render ID:', result.renderId);
  console.log('Render Time:', result.durationSeconds + 's');
  console.log('================================================================');
}

runTest().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
