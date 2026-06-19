// remotion/utils/fonts.ts
// Load Google Fonts for Lambda render — without this, fonts fallback to system defaults

import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/Playfair';
import {loadFont as loadJetBrainsMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadFredoka} from '@remotion/google-fonts/Fredoka';
import {loadFont as loadNotoDevanagari} from '@remotion/google-fonts/NotoSansDevanagari';
import {loadFont as loadNotoKannada} from '@remotion/google-fonts/NotoSansKannada';
import {loadFont as loadNotoTamil} from '@remotion/google-fonts/NotoSansTamil';

const {fontFamily: interFamily} = loadInter();
const {fontFamily: antonFamily} = loadAnton();
const {fontFamily: playfairFamily} = loadPlayfair();
const {fontFamily: jetbrainsFamily} = loadJetBrainsMono();
const {fontFamily: fredokaFamily} = loadFredoka();
const {fontFamily: devanagariFamily} = loadNotoDevanagari();
const {fontFamily: kannadaFamily} = loadNotoKannada();
const {fontFamily: tamilFamily} = loadNotoTamil();

// Map preset font names to loaded font families
export const LOADED_FONTS: Record<string, string> = {
  'Inter': interFamily,
  'Inter, sans-serif': interFamily,
  'sans-serif': interFamily,
  'Impact': antonFamily,
  'Impact, sans-serif': antonFamily,
  'Arial Black': antonFamily,
  'Arial Black, sans-serif': antonFamily,
  'Georgia': playfairFamily,
  'Georgia, serif': playfairFamily,
  'Courier New': jetbrainsFamily,
  'Courier New, monospace': jetbrainsFamily,
  'monospace': jetbrainsFamily,
  'Fredoka': fredokaFamily,
  'NotoSansDevanagari': devanagariFamily,
  'NotoSansKannada': kannadaFamily,
  'NotoSansTamil': tamilFamily,
};

/** Resolve font family — returns loaded Google Font or fallback */
export function resolveFont(fontFamily?: string): string {
  if (!fontFamily) return interFamily;
  return LOADED_FONTS[fontFamily]
    || LOADED_FONTS[fontFamily.split(',')[0]?.trim()]
    || interFamily;
}

// Export for language-based font selection
export const LANGUAGE_FONTS: Record<string, string> = {
  hindi: devanagariFamily,
  kannada: kannadaFamily,
  tamil: tamilFamily,
  en: interFamily,
  english: interFamily,
  hinglish: interFamily,
};

export function getFontForLanguage(lang?: string): string {
  if (!lang) return interFamily;
  return LANGUAGE_FONTS[lang.toLowerCase()] || interFamily;
}
