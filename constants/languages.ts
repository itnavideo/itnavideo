export interface SupportedLanguage {
  value: string;
  label: string;
  nativeLabel?: string;
  flag?: string;
}

export const SPOKEN_LANGUAGES: SupportedLanguage[] = [
  { value: 'auto', label: 'Auto Detect (Recognize automatically)' },
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'hinglish', label: 'Hinglish', nativeLabel: 'Hindi in Roman script' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { value: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { value: 'fr', label: 'French', nativeLabel: 'Français' },
  { value: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { value: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { value: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { value: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { value: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { value: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { value: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { value: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { value: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];

export const CAPTION_LANGUAGES: SupportedLanguage[] = [
  { value: 'auto', label: 'Same as Audio Spoken (Original)' },
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'hinglish', label: 'Hinglish', nativeLabel: 'Roman script' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { value: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { value: 'fr', label: 'French', nativeLabel: 'Français' },
  { value: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { value: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { value: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { value: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { value: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { value: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { value: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { value: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { value: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];

// Backwards compatibility
export const LANGUAGES = SPOKEN_LANGUAGES;
export type LanguageValue = string;
