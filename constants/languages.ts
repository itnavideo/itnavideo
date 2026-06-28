export const LANGUAGES = [
  {value: 'hinglish', label: 'Hinglish'},
  {value: 'english', label: 'English'},
] as const;

export type LanguageValue = (typeof LANGUAGES)[number]['value'];
