// scripts/submit-test-job.mjs
const API_BASE = 'https://www.itnavideo.com';
const AUDIO_URL = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';

async function testSubmit() {
  console.log('Submitting Audio 1 job to', API_BASE);
  const payload = {
    mode: 'facelessVideo',
    mediaKey: AUDIO_URL,
    mediaUrl: AUDIO_URL,
    mediaType: 'audio',
    userId: 'founder-test-admin',
    userEmail: 'rohi@itnavideo.com',
    topicTitle: 'Master Your Money & Financial Freedom',
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

  console.log('HTTP Status:', response.status);
  const data = await response.json();
  console.log('Response body:', JSON.stringify(data, null, 2));
  return data;
}

testSubmit().catch(console.error);
