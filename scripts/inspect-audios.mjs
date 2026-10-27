// scripts/inspect-audios.mjs
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const AUDIO_1 = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';
const AUDIO_2 = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260458/koyal-speech_ciclnq.wav';

async function transcribe(audioUrl, label) {
  console.log(`\n🎧 Downloading & Transcribing ${label}...`);
  console.log(`URL: ${audioUrl}`);
  
  // 1. Fetch audio buffer
  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) {
    throw new Error(`Failed to fetch audio: ${audioRes.status}`);
  }
  const arrayBuffer = await audioRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log(`Downloaded ${buffer.length} bytes.`);

  // 2. Prepare FormData for Groq Whisper
  const formData = new FormData();
  const blob = new Blob([buffer], { type: audioUrl.endsWith('.wav') ? 'audio/wav' : 'audio/mp3' });
  formData.append('file', blob, audioUrl.split('/').pop());
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('response_format', 'verbose_json');

  const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: formData,
  });

  if (!groqRes.ok) {
    throw new Error(`Groq transcription failed: ${groqRes.status} ${await groqRes.text()}`);
  }

  const groqData = await groqRes.json();
  console.log(`✅ Transcription complete for ${label}:`);
  console.log(`Duration: ${groqData.duration}s`);
  console.log(`Transcript: "${groqData.text}"`);
  console.log(`Segments count: ${groqData.segments ? groqData.segments.length : 0}`);
  if (groqData.segments) {
    groqData.segments.forEach((s, idx) => {
      console.log(`  [Scene/Beat ${idx + 1}] (${s.start.toFixed(2)}s - ${s.end.toFixed(2)}s): "${s.text.trim()}"`);
    });
  }
  return groqData;
}

async function run() {
  try {
    const t1 = await transcribe(AUDIO_1, 'Audio 1 (1_w4wthb.mp3)');
    const t2 = await transcribe(AUDIO_2, 'Audio 2 (koyal-speech_ciclnq.wav)');
  } catch (err) {
    console.error('Error during audio inspection:', err);
  }
}

run();
