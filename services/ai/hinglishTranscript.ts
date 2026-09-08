export type HinglishTimedWord = {
  word: string;
  start: number;
  end: number;
};

export type HinglishTranscriptSegment = {
  id?: string | number;
  start: number;
  end: number;
  text: string;
};

const DEVANAGARI_RANGE = /[\u0900-\u097F]/;
const URDU_ARABIC_RANGE = /[\u0600-\u06FF]/;
const DEVANAGARI_TOKEN = /[\u0900-\u097F]+/g;
const URDU_ARABIC_TOKEN = /[\u0600-\u06FF]+/g;
const ROMAN_HINGLISH_HINT = /\b(kya|hai|hain|nahi|nahin|naheen|kaise|kaisa|kyun|karna|karo|karte|karoge|kehte|paise|paisa|bhai|aap|apko|tum|ye|yeh|woh|jo|bhi|aur|lekin|chahiye|zaroori|samjho|dekho|form bhar|apply kar|download kar)\b/i;

const DEVANAGARI_WORDS: Record<string, string> = {
  'लोग': 'log',
  'कहते': 'kehte',
  'कहता': 'kehta',
  'कहती': 'kehti',
  'हैं': 'hain',
  'है': 'hai',
  'सही': 'sahi',
  'बात': 'baat',
  'पर': 'par',
  'भाई': 'bhai',
  'बिना': 'bina',
  'पैसे': 'paise',
  'पैसा': 'paisa',
  'के': 'ke',
  'की': 'ki',
  'का': 'ka',
  'खुशी': 'khushi',
  'ढूंढना': 'dhoondhna',
  'धूंधना': 'dhoondhna',
  'दूंधना': 'dhoondhna',
  'और': 'aur',
  'भी': 'bhi',
  'मुश्किल': 'mushkil',
  'सुबह': 'subah',
  'सुबा': 'subah',
  'उठने': 'uthne',
  'उतने': 'uthne',
  'से': 'se',
  'लेके': 'leke',
  'लिए': 'liye',
  'लिये': 'liye',
};

const URDU_WORDS: Record<string, string> = {
  'لوگ': 'log',
  'کہتے': 'kehte',
  'کہتا': 'kehta',
  'کہتی': 'kehti',
  'ہیں': 'hain',
  'ہے': 'hai',
  'صحیح': 'sahi',
  'بات': 'baat',
  'پر': 'par',
  'بھائی': 'bhai',
  'بغیر': 'baghair',
  'پیسے': 'paise',
  'پیسہ': 'paisa',
  'کے': 'ke',
  'کی': 'ki',
  'کا': 'ka',
  'خوشی': 'khushi',
  'ڈھونڈنا': 'dhoondhna',
  'اور': 'aur',
  'بھی': 'bhi',
  'مشکل': 'mushkil',
  'صبح': 'subah',
  'اٹھنے': 'uthne',
  'سے': 'se',
  'لیے': 'liye',
};

const DEVANAGARI_CONSONANTS: Record<string, string> = {
  क: 'k',
  ख: 'kh',
  ग: 'g',
  घ: 'gh',
  ङ: 'ng',
  च: 'ch',
  छ: 'chh',
  ज: 'j',
  झ: 'jh',
  ञ: 'ny',
  ट: 't',
  ठ: 'th',
  ड: 'd',
  ढ: 'dh',
  ण: 'n',
  त: 't',
  थ: 'th',
  द: 'd',
  ध: 'dh',
  न: 'n',
  प: 'p',
  फ: 'ph',
  ब: 'b',
  भ: 'bh',
  म: 'm',
  य: 'y',
  र: 'r',
  ल: 'l',
  व: 'v',
  श: 'sh',
  ष: 'sh',
  स: 's',
  ह: 'h',
  क्ष: 'ksh',
  त्र: 'tr',
  ज्ञ: 'gy',
};

const DEVANAGARI_VOWELS: Record<string, string> = {
  अ: 'a',
  आ: 'aa',
  इ: 'i',
  ई: 'ee',
  उ: 'u',
  ऊ: 'oo',
  ऋ: 'ri',
  ए: 'e',
  ऐ: 'ai',
  ओ: 'o',
  औ: 'au',
};

const DEVANAGARI_MATRAS: Record<string, string> = {
  'ा': 'aa',
  'ि': 'i',
  'ी': 'ee',
  'ु': 'u',
  'ू': 'oo',
  'ृ': 'ri',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
  'ं': 'n',
  'ँ': 'n',
  'ः': 'h',
};

const URDU_CHARS: Record<string, string> = {
  ا: 'a',
  آ: 'aa',
  ب: 'b',
  پ: 'p',
  ت: 't',
  ٹ: 't',
  ث: 's',
  ج: 'j',
  چ: 'ch',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ڈ: 'd',
  ذ: 'z',
  ر: 'r',
  ڑ: 'r',
  ز: 'z',
  ژ: 'zh',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'z',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  غ: 'gh',
  ف: 'f',
  ق: 'q',
  ک: 'k',
  گ: 'g',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ں: 'n',
  و: 'o',
  ہ: 'h',
  ھ: 'h',
  ء: '',
  ی: 'i',
  ے: 'e',
};

export function hasHindiUrduScript(value: string) {
  return DEVANAGARI_RANGE.test(value) || URDU_ARABIC_RANGE.test(value);
}

export function hasRomanHinglish(value: string) {
  return ROMAN_HINGLISH_HINT.test(value);
}

export function cleanHinglishTranscriptText(value: string) {
  const source = String(value || '').trim();
  if (!source) return '';

  const romanized = source
    .replace(DEVANAGARI_TOKEN, (token) => transliterateDevanagariToken(token))
    .replace(URDU_ARABIC_TOKEN, (token) => transliterateUrduToken(token));

  return cleanRomanSpacing(applyHinglishPhraseFixes(romanized));
}

export function normalizeTranscriptForPlanner({
  transcript,
  words,
  segments,
}: {
  transcript: string;
  words?: HinglishTimedWord[];
  segments?: HinglishTranscriptSegment[];
}) {
  const combined = [
    transcript,
    ...(words || []).map((word) => word.word),
    ...(segments || []).map((segment) => segment.text),
  ].join(' ');
  const sourceHadHindiUrduScript = hasHindiUrduScript(combined);
  const cleanedTranscript = cleanHinglishTranscriptText(transcript);
  const cleanedWords = words
    ?.map((word) => ({
      ...word,
      word: cleanHinglishTranscriptText(word.word),
    }))
    .filter((word) => word.word);
  const cleanedSegments = segments
    ?.map((segment) => ({
      ...segment,
      text: cleanHinglishTranscriptText(segment.text),
    }))
    .filter((segment) => segment.text);
  const cleanedCombined = [
    cleanedTranscript,
    ...(cleanedWords || []).map((word) => word.word),
    ...(cleanedSegments || []).map((segment) => segment.text),
  ].join(' ');
  const sourceHadRomanHinglish = hasRomanHinglish(cleanedCombined);

  return {
    transcript: cleanedTranscript,
    words: cleanedWords,
    segments: cleanedSegments,
    languageHint: sourceHadHindiUrduScript || sourceHadRomanHinglish ? ('hinglish' as const) : undefined,
    sourceHadHindiUrduScript,
    sourceHadRomanHinglish,
  };
}

function transliterateDevanagariToken(token: string) {
  const direct = DEVANAGARI_WORDS[token];
  if (direct) return direct;

  const chars = Array.from(token.normalize('NFC'));
  let output = '';

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    const next = chars[index + 1];

    if (DEVANAGARI_VOWELS[char]) {
      output += DEVANAGARI_VOWELS[char];
      continue;
    }

    if (DEVANAGARI_CONSONANTS[char]) {
      output += DEVANAGARI_CONSONANTS[char];
      if (next === '्') {
        index += 1;
      } else if (next && DEVANAGARI_MATRAS[next]) {
        output += DEVANAGARI_MATRAS[next];
        index += 1;
      } else {
        output += 'a';
      }
      continue;
    }

    if (DEVANAGARI_MATRAS[char]) {
      output += DEVANAGARI_MATRAS[char];
    }
  }

  return postProcessHinglishToken(output);
}

function transliterateUrduToken(token: string) {
  const direct = URDU_WORDS[token];
  if (direct) return direct;
  return postProcessHinglishToken(Array.from(token).map((char) => URDU_CHARS[char] ?? '').join(''));
}

function postProcessHinglishToken(value: string) {
  let token = value.toLowerCase();
  token = applyHinglishPhraseFixes(token);
  if (token.length > 3 && /[bcdfghjklmnpqrstvwxyz]a$/.test(token)) {
    token = token.slice(0, -1);
  }
  return token;
}

function applyHinglishPhraseFixes(value: string) {
  return value
    .replace(/\b(?:paan|pan|pain)\s+(?:card|kaard|kard)\b/gi, 'PAN Card')
    .replace(/\bpancard\b/gi, 'PAN Card')
    .replace(/\bpaincard\b/gi, 'PAN Card')
    .replace(/\baadhaar\b/gi, 'Aadhaar')
    .replace(/\baadhar\b/gi, 'Aadhaar')
    .replace(/\badhar\b/gi, 'Aadhaar')
    .replace(/\b(?:apalaaee|aply|applye|apliye|applai)\b/gi, 'Apply')
    .replace(/\bapply\s+kar(?:na|ne|o|te)?\b/gi, 'Apply karna')
    .replace(/\bform\s+bar(?:na|ne)?\b/gi, 'form bharna')
    .replace(/\b(?:dokumaints|documents?|dakuments|documants)\b/gi, 'Documents')
    .replace(/\b(?:egjam|exjam|exam)\s+date\b/gi, 'Exam Date')
    .replace(/\bnaheen\b/gi, 'nahi')
    .replace(/\bnahin\b/gi, 'nahi')
    .replace(/\bkahete\b/gi, 'kehte')
    .replace(/\bkahate\b/gi, 'kehte')
    .replace(/\bkahte\b/gi, 'kehte')
    .replace(/\bbaata\b/gi, 'baat')
    .replace(/\bkhushee\b/gi, 'khushi')
    .replace(/\bdhoondhanaa\b/gi, 'dhoondhna')
    .replace(/\bdhoondhana\b/gi, 'dhoondhna')
    .replace(/\bdhoondhnaa\b/gi, 'dhoondhna')
    .replace(/\bmushkila\b/gi, 'mushkil')
    .replace(/\butane\b/gi, 'uthne')
    .replace(/\butna\b/gi, 'uthna')
    .replace(/\bsuba\b/gi, 'subah')
    .replace(/\bliye liye\b/gi, 'liye')
    .replace(/\bke khushi\b/gi, 'ke khushi');
}

function cleanRomanSpacing(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/([([{])\s+/g, '$1')
    .replace(/\s+([)\]}])/g, '$1')
    .trim();
}
