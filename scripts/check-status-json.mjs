// scripts/check-status-json.mjs
const API_BASE = 'https://www.itnavideo.com';
const renderId = '3-days-q9hnnchzsi';
const bucketName = 'remotionlambda-useast1-2zq6twaok1';

async function check() {
  const res = await fetch(`${API_BASE}/api/reels/jobs/status?renderId=${renderId}&bucketName=${bucketName}`);
  console.log('HTTP Status:', res.status);
  const data = await res.json();
  console.log('Full Status Response:');
  console.log(JSON.stringify(data, null, 2));
}

check().catch(console.error);
