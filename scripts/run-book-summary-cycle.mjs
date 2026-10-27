// scripts/run-book-summary-cycle.mjs
const API_BASE = 'https://www.itnavideo.com';
const AUDIO_URL = process.argv[2] || 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';
const BOOK_TITLE = process.argv[3] || 'The Psychology of Money';
const AUTHOR_NAME = process.argv[4] || 'Morgan Housel';

async function runBookSummaryCycle() {
  console.log('================================================================');
  console.log('📖 [BOOK SUMMARY ENGINE] STEP 1: GENERATING STORYBOARD PLAN');
  console.log('Audio URL:', AUDIO_URL);
  console.log('Book Title:', BOOK_TITLE);
  console.log('Author:', AUTHOR_NAME);
  console.log('================================================================');

  const planRes = await fetch(`${API_BASE}/api/reels/plan-book-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioUrl: AUDIO_URL,
      bookTitle: BOOK_TITLE,
      authorName: AUTHOR_NAME,
    }),
  });

  if (!planRes.ok) {
    const err = await planRes.text();
    throw new Error(`Book summary planning failed (${planRes.status}): ${err}`);
  }

  const planData = await planRes.json();
  const plan = planData.plan;
  console.log('✅ AI Storyboard Generated:');
  console.log('   Suggested Title:', plan.metadata?.suggestedTitle);
  console.log('   Total Scenes:', plan.scenes?.length);
  console.log('   Duration:', planData.durationSeconds, 'seconds');

  console.log('================================================================');
  console.log('🚀 [BOOK SUMMARY ENGINE] STEP 2: DISPATCHING CLOUD RENDER JOB');
  console.log('================================================================');

  const payload = {
    mode: 'bookSummary',
    mediaKey: AUDIO_URL,
    mediaUrl: AUDIO_URL,
    mediaType: 'audio',
    userId: 'founder-test-admin',
    userEmail: 'rohi@itnavideo.com',
    bookTitle: BOOK_TITLE,
    authorName: AUTHOR_NAME,
    durationSeconds: planData.durationSeconds || 24,
    scenes: plan.scenes,
    transcript: planData.transcript,
    timestampSegments: planData.timestampSegments,
    words: planData.words,
    aspectRatio: '16:9',
    captionsTheme: 'glow-viral',
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
        console.log('\n🎉 BOOK SUMMARY RENDER FINISHED SUCCESSFULLY ON AWS LAMBDA!');
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
    scenes: plan.scenes,
    durationSeconds: planData.durationSeconds,
  };
}

runBookSummaryCycle().catch((err) => {
  console.error('Fatal cycle error:', err.message);
  process.exit(1);
});
