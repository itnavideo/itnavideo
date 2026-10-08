const fs = require('fs');

async function test() {
  console.log('Sending job...');
  const res = await fetch('http://localhost:3000/api/reels/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'autoCaption',
      mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      fileName: 'test.mp3',
      mediaType: 'audio',
      templateName: 'AUTO_CAPTION_GENERATOR',
      compositionId: 'AUTO-CAPTION-GENERATOR'
    })
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

test().catch(console.error);
