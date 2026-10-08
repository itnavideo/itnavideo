export function resolveFont(fontFamilyName?: string): string {
  if (!fontFamilyName) return 'Inter, system-ui, sans-serif';

  const lower = fontFamilyName.toLowerCase();
  if (lower.includes('impact')) return 'Impact, Montserrat, sans-serif';
  if (lower.includes('playfair')) return 'Playfair Display, Georgia, serif';
  if (lower.includes('georgia')) return 'Georgia, serif';
  if (lower.includes('courier')) return 'Courier New, monospace';
  if (lower.includes('arial black')) return 'Arial Black, sans-serif';
  if (lower.includes('montserrat')) return 'Montserrat, sans-serif';
  if (lower.includes('poppins')) return 'Poppins, sans-serif';
  if (lower.includes('plus jakarta')) return 'Plus Jakarta Sans, sans-serif';

  return `${fontFamilyName}, Inter, system-ui, sans-serif`;
}

export function getFontForLanguage(language?: string): string {
  const lang = (language || '').toLowerCase();
  if (lang === 'hi' || lang === 'hinglish') {
    return 'Inter, Plus Jakarta Sans, sans-serif';
  }
  return 'Inter, system-ui, sans-serif';
}

export function loadFont(fontName: string): void {
  // Safe browser/Remotion font loader fallback
  if (typeof window !== 'undefined' && window.document) {
    // Font loaded via CSS imports or Next.js layout font variables
  }
}
