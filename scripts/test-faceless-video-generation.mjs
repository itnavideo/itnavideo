// scripts/test-faceless-video-generation.mjs
// Live end-to-end user simulation test: triggers render on cloud, polls status, prints final video URL.

const API_BASE = 'https://www.itnavideo.com';
const AUDIO_URL = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260458/koyal-speech_ciclnq.wav';

async function runLiveTest() {
  console.log('🚀 [LIVE TEST] Step 1: Submitting Faceless Video generation job to', API_BASE);
  
  const payload = {
    mode: 'facelessVideo',
    mediaUrl: AUDIO_URL,
    topicTitle: 'The Power of Never Giving Up',
    aspectRatio: '16:9',
    assetMode: 'library',
    headingFont: 'Montserrat',
    backgroundTheme: 'midnight-mesh',
    subtitleStyle: 'netflix-yellow',
    captionAnimationStyle: 'bouncy',
    showCaptions: true,
  };

  const response = await fetch(`${API_BASE}/api/reels/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Job creation failed:', response.status, errorText);
    process.exit(1);
  }

  const jobData = await response.json();
  console.log('✅ [LIVE TEST] Step 2: Job created successfully!');
  console.log('   Job ID:', jobData.jobId);
  console.log('   Render ID:', jobData.renderId);

  const jobId = jobData.jobId;
  const startTime = Date.now();

  console.log('⏳ [LIVE TEST] Step 3: Polling AWS Lambda render status...');
  while (true) {
    await new Promise((r) => setTimeout(r, 6000));
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);

    try {
      const statusRes = await fetch(`${API_BASE}/api/reels/jobs/status?jobId=${jobId}`);
      if (!statusRes.ok) {
        console.warn(`   [${elapsedSec}s] Status poll HTTP ${statusRes.status}, retrying...`);
        continue;
      }

      const statusData = await statusRes.json();
      const progress = statusData.overallProgressPercent || statusData.progress || 0;
      const status = statusData.status;

      console.log(`   [${elapsedSec}s] Status: ${status} | Progress: ${progress}%`);

      if (status === 'done' || status === 'completed') {
        const finalUrl = statusData.downloadUrl || statusData.outputUrl || statusData.videoUrl;
        console.log('🎉 [LIVE TEST] Step 4: Render COMPLETE on AWS Lambda!');
        console.log('AWS S3 MP4 URL:', finalUrl);

        console.log('☁️ [LIVE TEST] Step 5: Uploading rendered video to Cloudinary...');
        try {
          const { v2: cloudinary } = await import('cloudinary');
          const dotenv = (await import('dotenv')).default;
          dotenv.config({ path: '.env.local' });

          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dhouh9idx',
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
          });

          const uploadResult = await cloudinary.uploader.upload(finalUrl, {
            resource_type: 'video',
            folder: 'itnavideo-assets/faceless-testing',
            public_id: `koyal-faceless-test-${Date.now()}`,
          });

          console.log('======================================================');
          console.log('🎉 CLOUDINARY VIDEO URL:');
          console.log(uploadResult.secure_url);
          console.log('======================================================');
        } catch (uploadErr) {
          console.warn('⚠️ Cloudinary upload note:', uploadErr.message);
          console.log('Direct 1080p Video URL is available at:', finalUrl);
        }

        break;
      }

      if (status === 'error' || status === 'failed') {
        console.error('❌ Render failed on AWS Lambda:', statusData.error || statusData.message);
        process.exit(1);
      }
    } catch (pollErr) {
      console.warn(`   [${elapsedSec}s] Poll network warning:`, pollErr.message);
    }
  }
}

runLiveTest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
