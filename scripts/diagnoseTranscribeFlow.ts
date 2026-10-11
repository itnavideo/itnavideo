import fs from 'fs';
import path from 'path';

async function diagnoseRealUpload() {
  console.log('=== TESTING REAL FILE UPLOAD & TRANSCRIBE ===');
  
  const testFilePath = path.join(process.cwd(), 'public', 'caption-tests', 'whiteboard', 'whiteboard-30s-test.mp4');
  if (!fs.existsSync(testFilePath)) {
    console.error('Test file not found:', testFilePath);
    return;
  }

  const fileBytes = fs.readFileSync(testFilePath);
  console.log('Test file size:', fileBytes.length, 'bytes');

  // 1. Get presigned URL
  const presignRes = await fetch('http://localhost:3000/api/media/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: '1-mp3-1080p.mp4',
      contentType: 'video/mp4',
      fileSize: fileBytes.length,
      mode: 'whiteboardVideo',
      userId: 'test-user-id',
    }),
  });

  const presign = await presignRes.json();
  console.log('Presign Status:', presignRes.status, 'Key:', presign.key);

  if (!presign.uploadUrl) {
    console.error('No uploadUrl returned');
    return;
  }

  // 2. Put file to S3
  const uploadRes = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'video/mp4' },
    body: fileBytes,
  });

  console.log('S3 Upload Status:', uploadRes.status);
  if (!uploadRes.ok) {
    console.error('S3 Upload failed:', await uploadRes.text());
    return;
  }

  // 3. Call Transcribe
  const transcribeRes = await fetch('http://localhost:3000/api/reels/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mediaKey: presign.key,
      fileName: '1-mp3-1080p.mp4',
      spokenLanguage: 'auto',
    }),
  });

  console.log('/api/reels/transcribe Status:', transcribeRes.status);
  const transcribeData = await transcribeRes.json().catch(() => ({}));
  console.log('/api/reels/transcribe Response:', JSON.stringify(transcribeData, null, 2));
}

diagnoseRealUpload();
