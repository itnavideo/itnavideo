export interface GoogleAiVoice {
  id: string;
  name: string;
  languageCode: string;
  gender: 'MALE' | 'FEMALE';
  category: 'Hindi' | 'Indian English' | 'Global English';
  tag: string;
  previewUrl: string;
  sampleText: string;
  avatarFlag: string;
}

export const GOOGLE_AI_VOICES: GoogleAiVoice[] = [
  {
    id: 'hi-IN-Neural2-B',
    name: 'Aarav',
    languageCode: 'hi-IN',
    gender: 'MALE',
    category: 'Hindi',
    tag: 'Deep Storyteller',
    previewUrl: '/audio/tts-previews/hi-IN-Neural2-B.mp3',
    sampleText: 'नमस्ते! इतनावीडियो के साथ अपनी कहानी को जीवंत बनाइये।',
    avatarFlag: '🇮🇳',
  },
  {
    id: 'hi-IN-Neural2-A',
    name: 'Ananya',
    languageCode: 'hi-IN',
    gender: 'FEMALE',
    category: 'Hindi',
    tag: 'Warm Narrator',
    previewUrl: '/audio/tts-previews/hi-IN-Neural2-A.mp3',
    sampleText: 'नमस्ते! अपनी वीडियो के लिए बेहतरीन आवाज़ चुनिए।',
    avatarFlag: '🇮🇳',
  },
  {
    id: 'hi-IN-Neural2-C',
    name: 'Kabir',
    languageCode: 'hi-IN',
    gender: 'MALE',
    category: 'Hindi',
    tag: 'Energetic / Viral',
    previewUrl: '/audio/tts-previews/hi-IN-Neural2-C.mp3',
    sampleText: 'क्या आप वायरल वीडियो बनाना चाहते हैं? चलिए शुरू करते हैं!',
    avatarFlag: '🇮🇳',
  },
  {
    id: 'hi-IN-Neural2-D',
    name: 'Pooja',
    languageCode: 'hi-IN',
    gender: 'FEMALE',
    category: 'Hindi',
    tag: 'Calm Explainer',
    previewUrl: '/audio/tts-previews/hi-IN-Neural2-D.mp3',
    sampleText: 'ज्ञान और जानकारी को अब और भी आसानी से शेयर करें।',
    avatarFlag: '🇮🇳',
  },
  {
    id: 'en-IN-Neural2-B',
    name: 'Rohan',
    languageCode: 'en-IN',
    gender: 'MALE',
    category: 'Indian English',
    tag: 'Tech & Business',
    previewUrl: '/audio/tts-previews/en-IN-Neural2-B.mp3',
    sampleText: 'Welcome to Itnavideo. Turn your thoughts into cinematic videos instantly.',
    avatarFlag: '🇮🇳',
  },
  {
    id: 'en-IN-Neural2-A',
    name: 'Diya',
    languageCode: 'en-IN',
    gender: 'FEMALE',
    category: 'Indian English',
    tag: 'Corporate & News',
    previewUrl: '/audio/tts-previews/en-IN-Neural2-A.mp3',
    sampleText: 'Engage your audience with high quality visuals and voiceovers.',
    avatarFlag: '🇮🇳',
  },
  {
    id: 'en-US-Journey-F',
    name: 'Nova',
    languageCode: 'en-US',
    gender: 'FEMALE',
    category: 'Global English',
    tag: 'DeepMind Ultra-Real',
    previewUrl: '/audio/tts-previews/en-US-Journey-F.mp3',
    sampleText: 'Hey there! Ready to create something extraordinary together today?',
    avatarFlag: '🇺🇸',
  },
  {
    id: 'en-US-Journey-D',
    name: 'Atlas',
    languageCode: 'en-US',
    gender: 'MALE',
    category: 'Global English',
    tag: 'DeepMind Ultra-Real',
    previewUrl: '/audio/tts-previews/en-US-Journey-D.mp3',
    sampleText: "Welcome! Let's bring your creative vision to life in minutes.",
    avatarFlag: '🇺🇸',
  },
  {
    id: 'en-US-Studio-O',
    name: 'Calliope',
    languageCode: 'en-US',
    gender: 'FEMALE',
    category: 'Global English',
    tag: 'Documentary Studio',
    previewUrl: '/audio/tts-previews/en-US-Studio-O.mp3',
    sampleText: 'In a world of constant change, powerful stories command attention.',
    avatarFlag: '🎙️',
  },
  {
    id: 'en-US-Studio-Q',
    name: 'Orion',
    languageCode: 'en-US',
    gender: 'MALE',
    category: 'Global English',
    tag: 'Cinematic Movie Trailer',
    previewUrl: '/audio/tts-previews/en-US-Studio-Q.mp3',
    sampleText: 'The future belongs to those who dare to create with conviction.',
    avatarFlag: '🎬',
  },
];
