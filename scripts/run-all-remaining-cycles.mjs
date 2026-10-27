// scripts/run-all-remaining-cycles.mjs
import fs from 'fs';

const API_BASE = 'https://www.itnavideo.com';
const SHORT_AUDIO = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';
const LONG_AUDIO = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260458/koyal-speech_ciclnq.wav';

const COMPARE_IMG_LEFT = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792056190/3D_Faceless_Video_Creation_Canvas_HeroExplainer_Visual_qjndsg.png';
const COMPARE_IMG_RIGHT = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792056190/Hero_Section_Feature_Illustration_3D_AI_Video_Engine_Visual_simsct.png';

const JOBS = [
  // --- Auto Caption Reel (9:16) ---
  {
    mode: 'autoCaption',
    suite: 'Auto Caption Reel',
    cycle: 1,
    audioUrl: SHORT_AUDIO,
    title: 'Daily Discipline Over Motivation',
    payload: {
      mode: 'autoCaption',
      mediaKey: SHORT_AUDIO,
      mediaUrl: SHORT_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'Daily Discipline Over Motivation',
      aspectRatio: '9:16',
      captionsTheme: 'glow-viral',
      subtitleStyle: 'glow-viral',
      showCaptions: true,
    },
  },
  {
    mode: 'autoCaption',
    suite: 'Auto Caption Reel',
    cycle: 2,
    audioUrl: SHORT_AUDIO,
    title: 'The Silent Grind',
    payload: {
      mode: 'autoCaption',
      mediaKey: SHORT_AUDIO,
      mediaUrl: SHORT_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'The Silent Grind',
      aspectRatio: '9:16',
      captionsTheme: 'bold-punch',
      subtitleStyle: 'bold-punch',
      showCaptions: true,
    },
  },
  {
    mode: 'autoCaption',
    suite: 'Auto Caption Reel',
    cycle: 3,
    audioUrl: LONG_AUDIO,
    title: 'Why Giving Up Is Never An Option',
    payload: {
      mode: 'autoCaption',
      mediaKey: LONG_AUDIO,
      mediaUrl: LONG_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'Why Giving Up Is Never An Option',
      aspectRatio: '9:16',
      captionsTheme: 'glow-viral',
      subtitleStyle: 'glow-viral',
      showCaptions: true,
    },
  },
  {
    mode: 'autoCaption',
    suite: 'Auto Caption Reel',
    cycle: 4,
    audioUrl: LONG_AUDIO,
    title: 'Mastering Emotional Resilience',
    payload: {
      mode: 'autoCaption',
      mediaKey: LONG_AUDIO,
      mediaUrl: LONG_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'Mastering Emotional Resilience',
      aspectRatio: '9:16',
      captionsTheme: 'karaoke-glow',
      subtitleStyle: 'karaoke-glow',
      showCaptions: true,
    },
  },

  // --- Compare Explainer (9:16) ---
  {
    mode: 'compare',
    suite: 'Compare Explainer',
    cycle: 1,
    audioUrl: SHORT_AUDIO,
    title: 'Saving vs Investing',
    payload: {
      mode: 'compare',
      mediaKey: SHORT_AUDIO,
      mediaUrl: SHORT_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'Saving vs Investing',
      compareLeftTitle: 'Saving',
      compareRightTitle: 'Investing',
      comparisonImageKeys: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      comparisonImageUrls: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      aspectRatio: '9:16',
      stickerStyle: '3d-presenter-man',
      themeId: 'cyber-dark',
      tone: 'versus',
      showCaptions: true,
      premiumEditing: false,
    },
  },
  {
    mode: 'compare',
    suite: 'Compare Explainer',
    cycle: 2,
    audioUrl: SHORT_AUDIO,
    title: 'Assets vs Liabilities',
    payload: {
      mode: 'compare',
      mediaKey: SHORT_AUDIO,
      mediaUrl: SHORT_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'Assets vs Liabilities',
      compareLeftTitle: 'Assets',
      compareRightTitle: 'Liabilities',
      comparisonImageKeys: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      comparisonImageUrls: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      aspectRatio: '9:16',
      stickerStyle: '3d-presenter-man',
      themeId: 'cyber-dark',
      tone: 'versus',
      showCaptions: true,
      premiumEditing: false,
    },
  },
  {
    mode: 'compare',
    suite: 'Compare Explainer',
    cycle: 3,
    audioUrl: LONG_AUDIO,
    title: 'Giving Up vs Perseverance',
    payload: {
      mode: 'compare',
      mediaKey: LONG_AUDIO,
      mediaUrl: LONG_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'Giving Up vs Perseverance',
      compareLeftTitle: 'Giving Up',
      compareRightTitle: 'Perseverance',
      comparisonImageKeys: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      comparisonImageUrls: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      aspectRatio: '9:16',
      stickerStyle: '3d-presenter-man',
      themeId: 'cyber-dark',
      tone: 'versus',
      showCaptions: true,
      premiumEditing: false,
    },
  },
  {
    mode: 'compare',
    suite: 'Compare Explainer',
    cycle: 4,
    audioUrl: LONG_AUDIO,
    title: 'Fear vs Relentless Focus',
    payload: {
      mode: 'compare',
      mediaKey: LONG_AUDIO,
      mediaUrl: LONG_AUDIO,
      mediaType: 'audio',
      userId: 'founder-test-admin',
      userEmail: 'rohi@itnavideo.com',
      topicTitle: 'Fear vs Relentless Focus',
      compareLeftTitle: 'Fear',
      compareRightTitle: 'Relentless Focus',
      comparisonImageKeys: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      comparisonImageUrls: [COMPARE_IMG_LEFT, COMPARE_IMG_RIGHT],
      aspectRatio: '9:16',
      stickerStyle: '3d-presenter-man',
      themeId: 'cyber-dark',
      tone: 'versus',
      showCaptions: true,
      premiumEditing: false,
    },
  },
];

async function executeSingleJob(jobDef) {
  console.log(`\n================================================================`);
  console.log(`🚀 [${jobDef.suite.toUpperCase()} | CYCLE ${jobDef.cycle}/4] DISPATCHING`);
  console.log(`Title: "${jobDef.title}"`);
  console.log(`Audio: ${jobDef.audioUrl.includes('1_w4wthb') ? 'Short 23.6s' : 'Long 81.5s'}`);
  console.log(`================================================================`);

  const response = await fetch(`${API_BASE}/api/reels/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobDef.payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[${jobDef.mode}] HTTP ${response.status}: ${errorText}`);
  }

  const jobData = await response.json();
  const renderId = jobData.renderId;
  const bucketName = jobData.bucketName || 'remotionlambda-useast1-2zq6twaok1';

  console.log(`✅ Accepted on AWS Lambda -> Render ID: ${renderId}`);
  console.log(`⏳ Monitoring render progress...`);

  const startTime = Date.now();
  while (true) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const statusRes = await fetch(`${API_BASE}/api/reels/jobs/status?renderId=${renderId}&bucketName=${bucketName}`);
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      const pct = (statusData.overallProgress * 100 || statusData.progress * 100 || 0).toFixed(1);
      console.log(`   [${elapsed}s] Progress: ${pct}% | Done: ${statusData.done} | State: ${statusData.state || 'rendering'}`);

      if (statusData.done) {
        console.log(`🎉 COMPLETED: ${statusData.outputFile}`);
        return {
          suite: jobDef.suite,
          mode: jobDef.mode,
          cycle: jobDef.cycle,
          title: jobDef.title,
          renderId,
          videoUrl: statusData.outputFile,
          durationSeconds: elapsed,
          status: 'SUCCESS',
        };
      }

      if (statusData.fatalErrorEncountered || statusData.state === 'error' || statusData.state === 'failed') {
        throw new Error(`AWS Lambda Render Error: ${JSON.stringify(statusData.errors || statusData.diagnostics)}`);
      }
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
}

async function main() {
  const results = [];
  for (const job of JOBS) {
    try {
      const res = await executeSingleJob(job);
      results.push(res);
      fs.writeFileSync('remaining_cycles_results.json', JSON.stringify(results, null, 2));
    } catch (err) {
      console.error(`❌ Cycle failed:`, err.message);
      results.push({
        suite: job.suite,
        mode: job.mode,
        cycle: job.cycle,
        title: job.title,
        status: 'FAILED',
        error: err.message,
      });
      fs.writeFileSync('remaining_cycles_results.json', JSON.stringify(results, null, 2));
    }
  }
  console.log('\n================================================================');
  console.log('🏁 ALL REMAINING CYCLES EXECUTED!');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
