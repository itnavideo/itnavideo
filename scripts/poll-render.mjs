// scripts/poll-render.mjs
const API_BASE = 'https://www.itnavideo.com';
const renderId = '3-days-q9hnnchzsi';
const bucketName = 'remotionlambda-useast1-2zq6twaok1';

async function poll() {
  const startTime = Date.now();
  console.log(`Polling render progress for ${renderId}...`);
  while (true) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const res = await fetch(`${API_BASE}/api/reels/jobs/status?renderId=${renderId}&bucketName=${bucketName}`);
    if (!res.ok) {
      console.log(`[${elapsed}s] HTTP ${res.status}:`, await res.text());
    } else {
      const data = await res.json();
      console.log(`[${elapsed}s] Progress: ${(data.overallProgress * 100 || 0).toFixed(1)}% | Done: ${data.done} | FatalError: ${data.fatalErrorEncountered}`);
      if (data.done) {
        console.log('\n🎉 Render completed!');
        console.log('Output Video URL:', data.outputFile);
        console.log(JSON.stringify(data, null, 2));
        break;
      }
      if (data.fatalErrorEncountered) {
        console.error('❌ Render fatal error:', JSON.stringify(data.errors, null, 2));
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

poll().catch(console.error);
