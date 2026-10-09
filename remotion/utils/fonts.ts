import { loadFont as loadInterFont } from '@remotion/google-fonts/Inter';
import { loadFont as loadPoppinsFont } from '@remotion/google-fonts/Poppins';
import { loadFont as loadMontserratFont } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPlayfairDisplayFont } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadSpaceGroteskFont } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadCaveatFont } from '@remotion/google-fonts/Caveat';
import { loadFont as loadOrbitronFont } from '@remotion/google-fonts/Orbitron';
import { loadFont as loadFredokaFont } from '@remotion/google-fonts/Fredoka';
import { loadFont as loadPlusJakartaSansFont } from '@remotion/google-fonts/PlusJakartaSans';

// Pre-load & resolve Google fonts for Remotion canvas rendering
const inter = loadInterFont();
const poppins = loadPoppinsFont();
const montserrat = loadMontserratFont();
const playfair = loadPlayfairDisplayFont();
const spaceGrotesk = loadSpaceGroteskFont();
const caveat = loadCaveatFont();
const orbitron = loadOrbitronFont();
const fredoka = loadFredokaFont();
const plusJakarta = loadPlusJakartaSansFont();

export const LOADED_FONTS = {
  Inter: inter.fontFamily,
  Poppins: poppins.fontFamily,
  Montserrat: montserrat.fontFamily,
  'Playfair Display': playfair.fontFamily,
  'Space Grotesk': spaceGrotesk.fontFamily,
  Caveat: caveat.fontFamily,
  Orbitron: orbitron.fontFamily,
  Fredoka: fredoka.fontFamily,
  'Plus Jakarta Sans': plusJakarta.fontFamily,
};

export function resolveFont(fontFamilyName?: string): string {
  if (!fontFamilyName) return inter.fontFamily;

  const lower = fontFamilyName.toLowerCase();
  if (lower.includes('inter')) return inter.fontFamily;
  if (lower.includes('poppins')) return poppins.fontFamily;
  if (lower.includes('montserrat')) return montserrat.fontFamily;
  if (lower.includes('playfair')) return playfair.fontFamily;
  if (lower.includes('space grotesk')) return spaceGrotesk.fontFamily;
  if (lower.includes('caveat')) return caveat.fontFamily;
  if (lower.includes('orbitron')) return orbitron.fontFamily;
  if (lower.includes('fredoka')) return fredoka.fontFamily;
  if (lower.includes('plus jakarta')) return plusJakarta.fontFamily;
  if (lower.includes('impact')) return 'Impact, Montserrat, sans-serif';
  if (lower.includes('courier')) return 'Courier New, monospace';
  if (lower.includes('arial black')) return 'Arial Black, sans-serif';

  return fontFamilyName;
}

export function getFontForLanguage(language?: string): string {
  const lang = (language || '').toLowerCase();
  if (lang === 'hi' || lang === 'hinglish') {
    return `${plusJakarta.fontFamily}, ${inter.fontFamily}`;
  }
  return inter.fontFamily;
}

export function loadFont(fontName: string): string {
  return resolveFont(fontName);
}
