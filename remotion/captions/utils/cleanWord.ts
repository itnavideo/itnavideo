// remotion/captions/utils/cleanWord.ts
// Utility for stripping punctuation and lowercasing words for reliable caption active matching

export function cleanWord(word?: string | null): string {
  if (!word) return '';
  return word.toLowerCase().replace(/[^\w\s\u0900-\u097F]/gi, '').trim();
}

export function isWordActive(wordA?: string | null, wordB?: string | null): boolean {
  if (!wordA || !wordB) return false;
  return cleanWord(wordA) === cleanWord(wordB);
}
