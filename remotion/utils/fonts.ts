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
import {loadFont as loadPlayfairDisplay} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadCinzel} from '@remotion/google-fonts/Cinzel';
import {loadFont as loadMarcellus} from '@remotion/google-fonts/Marcellus';
import {loadFont as loadTenorSans} from '@remotion/google-fonts/TenorSans';
import {loadFont as loadBodoniModa} from '@remotion/google-fonts/BodoniModa';
// Caption Studio manual font choices — self-hosted via @remotion/google-fonts (Lambda-safe)
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadManrope} from '@remotion/google-fonts/Manrope';
import {loadFont as loadSpaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadBebasNeue} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';
import {loadFont as loadDMSerifDisplay} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as loadVollkorn} from '@remotion/google-fonts/Vollkorn';

const {fontFamily: interFamily} = loadInter();
const {fontFamily: antonFamily} = loadAnton();
const {fontFamily: playfairFamily} = loadPlayfair();
const {fontFamily: jetbrainsFamily} = loadJetBrainsMono();
const {fontFamily: fredokaFamily} = loadFredoka();
const {fontFamily: devanagariFamily} = loadNotoDevanagari();
const {fontFamily: kannadaFamily} = loadNotoKannada();
const {fontFamily: tamilFamily} = loadNotoTamil();
// Premium/luxury display fonts — used by Typography Video for corporate/real-estate/luxury styles
const {fontFamily: playfairDisplayFamily} = loadPlayfairDisplay();
const {fontFamily: cinzelFamily} = loadCinzel();
const {fontFamily: marcellusFamily} = loadMarcellus();
const {fontFamily: tenorSansFamily} = loadTenorSans();
const {fontFamily: bodoniModaFamily} = loadBodoniModa();
const {fontFamily: poppinsFamily} = loadPoppins();
const {fontFamily: montserratFamily} = loadMontserrat();
const {fontFamily: manropeFamily} = loadManrope();
const {fontFamily: spaceGroteskFamily} = loadSpaceGrotesk();
const {fontFamily: bebasNeueFamily} = loadBebasNeue();
const {fontFamily: oswaldFamily} = loadOswald();
const {fontFamily: dmSerifDisplayFamily} = loadDMSerifDisplay();
const {fontFamily: vollkornFamily} = loadVollkorn();

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
  'Playfair Display': playfairDisplayFamily,
  'Cinzel': cinzelFamily,
  'Marcellus': marcellusFamily,
  'Tenor Sans': tenorSansFamily,
  'Bodoni Moda': bodoniModaFamily,
  // Caption Studio manual font choices
  'Anton': antonFamily,
  'Poppins': poppinsFamily,
  'Montserrat': montserratFamily,
  'Manrope': manropeFamily,
  'Space Grotesk': spaceGroteskFamily,
  'Bebas Neue': bebasNeueFamily,
  'Oswald': oswaldFamily,
  'DM Serif Display': dmSerifDisplayFamily,
  'Vollkorn': vollkornFamily,
  'JetBrains Mono': jetbrainsFamily,
};

// Direct exports for templates that need a specific premium font without going through resolveFont()
export const PREMIUM_FONTS = {
  inter: interFamily,
  playfairDisplay: playfairDisplayFamily,
  cinzel: cinzelFamily,
  marcellus: marcellusFamily,
  tenorSans: tenorSansFamily,
  bodoniModa: bodoniModaFamily,
  anton: antonFamily,
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
