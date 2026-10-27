// scripts/run-image-to-video-cycle.mjs
const API_BASE = 'https://www.itnavideo.com';
const AUDIO_URL = process.argv[2] || 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';
const TITLE = process.argv[3] || 'The Journey to Financial Independence';

async function runImageToVideoCycle() {
  console.log('================================================================');
  console.log('🎬 [IMAGE TO VIDEO AI ENGINE] DISPATCHING CLOUD RENDER JOB');
  console.log('Audio URL:', AUDIO_URL);
  console.log('Title:', TITLE);
  console.log('================================================================');

  const payload = {
    mode: 'imageToVideoAi',
    mediaKey: AUDIO_URL,
    mediaUrl: AUDIO_URL,
    mediaType: 'audio',
    userId: 'founder-test-admin',
    userEmail: 'rohi@itnavideo.com',
    topicTitle: TITLE,
    aspectRatio: '16:9',
    assetMode: 'library',
    visualStyle: 'cinematic',
    subtitleStyle: 'cinematic-glow',
    showCaptions: true,
  };

  const response = await fetch(`${API_BASE}/api/reels/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Job submission failed (${response.status}): ${errorText}`);
  }

  const jobData = await response.json();
  console.log('✅ Job accepted by AWS Lambda Dispatcher:');
  console.log('   Render ID:', jobData.renderId);
  console.log('   Bucket:', jobData.bucketName);

  const renderId = jobData.renderId;
  const bucketName = jobData.bucketName || 'remotionlambda-useast1-2zq6twaok1';

  console.log('\n⏳ Polling AWS Lambda render status...');
  const startTime = Date.now();
  let completedVideoUrl = null;

  while (true) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const statusRes = await fetch(`${API_BASE}/api/reels/jobs/status?renderId=${renderId}&bucketName=${bucketName}`);
    
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      const pct = (statusData.overallProgress * 100 || statusData.progress * 100 || 0).toFixed(1);
      console.log(`   [${elapsed}s] Progress: ${pct}% | Done: ${statusData.done} | State: ${statusData.state || 'rendering'}`);

      if (statusData.done) {
        completedVideoUrl = statusData.outputFile;
        console.log('\n🎉 IMAGE TO VIDEO AI RENDER FINISHED SUCCESSFULLY ON AWS LAMBDA!');
        console.log('🎬 1080p MP4 URL:', completedVideoUrl);
        break;
      }

      if (statusData.fatalErrorEncountered || statusData.state === 'error' || statusData.state === 'failed') {
        console.error('❌ Render failed on AWS Lambda:');
        console.error(JSON.stringify(statusData.errors || statusData.diagnostics, null, 2));
        throw new Error('AWS Lambda render failed.');
      }
    } else {
      console.warn(`   [${elapsed}s] Status poll HTTP ${statusRes.status}`);
    }

    await new Promise((r) => setTimeout(r, 6000));
  }

  return {
    renderId,
    videoUrl: completedVideoUrl,
  };
}

runImageToVideoCycle().catch((err) => {
  console.error('Fatal cycle error:', err.message);
  process.exit(1);
});
