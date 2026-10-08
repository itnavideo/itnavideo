import fetch from 'node-fetch';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const BASE_URL = process.argv[2] || 'https://www.itnavideo.com';
const TEST_VIDEO_URL = 'https://storage.googleapis.com/itnavideo-assets/homepage/auto-caption-generator-demovideo.mp4';

console.log(`${BOLD}${CYAN}======================================================================`);
console.log(`     ITNAVIDEO — Real User Multi-Video Type End-to-End Pipeline Test`);
console.log(`======================================================================${RESET}`);
console.log(`Target: ${BOLD}${BASE_URL}${RESET}`);
console.log(`Asset:  ${TEST_VIDEO_URL}\n`);

async function testVideoType(name, payload) {
  console.log(`\n${BOLD}▶ Testing Video Type: ${CYAN}${name}${RESET}`);
  const startTime = performance.now();
  try {
    const res = await fetch(`${BASE_URL}/api/reels/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const elapsed = Math.round(performance.now() - startTime);
    const contentType = res.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.log(`  [${RED}FAIL${RESET}] Expected JSON response, received: ${text.slice(0, 200)}`);
      return { ok: false, error: 'Non-JSON response' };
    }

    if (res.ok && data.ok) {
      console.log(`  [${GREEN}PASS${RESET}] HTTP ${res.status} (${elapsed}ms)`);
      console.log(`         ↳ Status: ${GREEN}${data.status}${RESET}`);
      console.log(`         ↳ Render ID: ${data.renderId}`);
      console.log(`         ↳ Bucket: ${data.bucketName || 'default'}`);
      console.log(`         ↳ OutName: ${data.outName}`);
      return { ok: true, data };
    } else {
      console.log(`  [${RED}FAIL${RESET}] HTTP ${res.status} (${elapsed}ms)`);
      console.log(`         ↳ Error: ${RED}${data.error || data.reasonCode || 'Unknown error'}${RESET}`);
      if (data.detail) console.log(`         ↳ Detail: ${YELLOW}${data.detail}${RESET}`);
      if (data._founderDiagnostics) console.log(`         ↳ Founder Diagnostics:`, data._founderDiagnostics);
      return { ok: false, data, status: res.status };
    }
  } catch (err) {
    const elapsed = Math.round(performance.now() - startTime);
    console.log(`  [${RED}EXCEPTION${RESET}] (${elapsed}ms): ${err.message}`);
    return { ok: false, error: err.message };
  }
}

async function run() {
  // Test 1: Auto Caption
  await testVideoType('Auto Caption Generator (autoCaption)', {
    mediaKey: TEST_VIDEO_URL,
    fileName: 'auto-caption-generator-demovideo.mp4',
    contentType: 'video/mp4',
    mediaType: 'video',
    mode: 'autoCaption',
    captionStyle: 'Hormozi Creator 3',
    captionPosition: 'bottom',
    userId: 'itnavideo@gmail.com',
    userEmail: 'itnavideo@gmail.com',
    durationSeconds: 15,
  });

  // Test 2: Long Video Promo
  await testVideoType('Long Video Promo (longVideoPromo)', {
    mediaKey: TEST_VIDEO_URL,
    thumbnailKey: 'https://storage.googleapis.com/itnavideo-assets/brand/itnavideo-og-cover.png',
    fileName: 'auto-caption-generator-demovideo.mp4',
    contentType: 'video/mp4',
    mediaType: 'video',
    mode: 'longVideoPromo',
    promoTitle: 'How Creators Go Viral in 2026',
    userId: 'itnavideo@gmail.com',
    userEmail: 'itnavideo@gmail.com',
    durationSeconds: 15,
  });

  // Test 3: Compare Explainer
  await testVideoType('Compare Explainer (compare)', {
    mediaKey: TEST_VIDEO_URL,
    fileName: 'compare_audio.mp3',
    contentType: 'audio/mpeg',
    mediaType: 'audio',
    mode: 'compare',
    comparisonImageKeys: [
      'https://storage.googleapis.com/itnavideo-assets/brand/itnavideo-og-cover.png',
      'https://storage.googleapis.com/itnavideo-assets/brand/itnavideo-og-cover.png',
    ],
    compareLeftTitle: 'Old Editing Flow',
    compareRightTitle: 'Itnavideo AI Flow',
    userId: 'itnavideo@gmail.com',
    userEmail: 'itnavideo@gmail.com',
    durationSeconds: 15,
  });

  // Test 4: YouTube Subtitles
  await testVideoType('YouTube Subtitles (youtubeSubtitleGenerator)', {
    mediaKey: TEST_VIDEO_URL,
    fileName: 'auto-caption-generator-demovideo.mp4',
    contentType: 'video/mp4',
    mediaType: 'video',
    mode: 'youtubeSubtitleGenerator',
    captionStyle: 'Warikoo Black Card',
    captionPosition: 'bottom',
    userId: 'itnavideo@gmail.com',
    userEmail: 'itnavideo@gmail.com',
    durationSeconds: 15,
  });

  // Test 5: Audio Cleaner Analyze
  console.log(`\n${BOLD}▶ Testing Video Type: ${CYAN}AI Audio Cleaner Analyze (/api/audio-clean/analyze)${RESET}`);
  const audioCleanAnalyzeStart = performance.now();
  try {
    const res = await fetch(`${BASE_URL}/api/audio-clean/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaKey: TEST_VIDEO_URL,
        userId: 'itnavideo@gmail.com',
        audioCleanOptions: {
          removeSilence: true,
          removeFillers: true,
          removeRepeats: true,
          removeFalseStarts: true,
          noiseReduction: true,
          volumeNormalize: true,
        },
      }),
    });
    const elapsed = Math.round(performance.now() - audioCleanAnalyzeStart);
    const data = await res.json();
    if (res.ok && data.ok) {
      console.log(`  [${GREEN}PASS${RESET}] HTTP ${res.status} (${elapsed}ms)`);
      console.log(`         ↳ Transcribed Segments: ${data.analysis?.segments?.length ?? 'OK'}`);
      console.log(`         ↳ Detected Mistake Segments: ${data.analysis?.mistakes?.length ?? 0}`);
    } else {
      console.log(`  [${RED}FAIL${RESET}] HTTP ${res.status} (${elapsed}ms)`);
      console.log(`         ↳ Error: ${RED}${data.error || 'Unknown error'}${RESET}`);
    }
  } catch (err) {
    console.log(`  [${RED}EXCEPTION${RESET}]: ${err.message}`);
  }

  // Test 6: Image to Video AI
  await testVideoType('Image to Video AI (imageToVideoAi)', {
    mediaKey: TEST_VIDEO_URL,
    fileName: 'audio.mp3',
    contentType: 'audio/mpeg',
    mediaType: 'audio',
    mode: 'imageToVideoAi',
    images: [
      { url: 'https://storage.googleapis.com/itnavideo-assets/brand/itnavideo-og-cover.png', label: 'Scene 1' },
      { url: 'https://storage.googleapis.com/itnavideo-assets/brand/itnavideo-og-cover.png', label: 'Scene 2' },
    ],
    userId: 'itnavideo@gmail.com',
    userEmail: 'itnavideo@gmail.com',
    durationSeconds: 15,
  });
}

run();
