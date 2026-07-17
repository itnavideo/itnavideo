// remotion/utils/captionStyleMap.ts
// Shared caption-style-name → SubtitleRenderer style mapping used by every
// template that renders speech captions via <SubtitleRenderer />.

import type {SubtitleConfig} from '../types/subtitles';
import {SUBTITLE_PRESETS} from '../types/subtitles';
import {resolveFont} from './fonts';

const CAPTION_STYLE_MAP: Record<string, SubtitleConfig['style']> = {
  yellowPop: 'highlight',
  clean: 'normal',
  cleanSubtitle: 'normal',
  blackBox: 'box',
  bold: 'big-bold',
  minimal: 'normal',
  classic: 'box',
  highlight: 'highlight',
  normal: 'normal',
  neon: 'neon',
  box: 'box',
  'big-bold': 'big-bold',
  'word-pop': 'word-pop',
  'split-color': 'split-color',
  typewriter: 'typewriter',
  'bold-outline': 'bold-outline',
  'one-word': 'one-word',
  'gold-pill': 'gold-pill',
  stacked: 'stacked',
  'inline-bg': 'inline-bg',
  vollkorn: 'vollkorn',
  Eclipse: 'highlight',
  Hustle: 'bold-outline',
  Marigold: 'normal',
  'Gold Pill': 'gold-pill',
  Midnight: 'inline-bg',
  'Arctic Glow': 'neon',
  'Studio Clean': 'stacked',
  'One Word': 'one-word',
  Vollkorn: 'vollkorn',
  'Pop Candy': 'box',
  Typewriter: 'typewriter',
  'Bold Fire': 'big-bold',
  'Karaoke Fill': 'karaoke',
  'Shorts Karaoke': 'shorts-karaoke',
  'Reels Clean': 'reels-clean',
  'Bold Highlight Strip': 'bold-highlight-strip',
  'Shatter Drop': 'shatter',
  'Pill Bounce': 'pill-bounce',
  Cinematic: 'cinematic',
  'Hacker Type': 'typewriter-code',
  'Marker Highlight': 'marker-highlight',
  'Floating Serif': 'floating-serif',
  'Metallic Gradient': 'metallic-gradient',
  'Neon Pulse': 'neon-pulse',
  'Minimal Fade': 'minimal-fade',
  'Gradient Wave': 'gradient-wave',
  'Retro VHS': 'retro-vhs',
  'Handwritten': 'handwritten',
  'Glass Blur': 'glass-blur',
  'Sharp Yellow': 'highlight',
  'Ocean Blue': 'highlight',
  'Screamer': 'bold-outline',
  'Netflix Bar': 'cinematic',
  'Black Card': 'floating-serif',
  'Stock Green': 'stacked',
  'Boardroom': 'vollkorn',
  'Podcast Hype': 'stacked',
  karaoke: 'karaoke',
  'shorts-karaoke': 'shorts-karaoke',
  'reels-clean': 'reels-clean',
  'bold-highlight-strip': 'bold-highlight-strip',
  shatter: 'shatter',
  'pill-bounce': 'pill-bounce',
  cinematic: 'cinematic',
  'typewriter-code': 'typewriter-code',
  'marker-highlight': 'marker-highlight',
  'floating-serif': 'floating-serif',
  'metallic-gradient': 'metallic-gradient',
  'neon-pulse': 'neon-pulse',
  'minimal-fade': 'minimal-fade',
  'gradient-wave': 'gradient-wave',
  'retro-vhs': 'retro-vhs',
  'handwritten': 'handwritten',
  'glass-blur': 'glass-blur',
};

/** Maps a caption style name/preset key (from dashboard or API body) to a SubtitleRenderer style. */
export function mapCaptionStyle(style?: string): SubtitleConfig['style'] {
  return CAPTION_STYLE_MAP[style || ''] || 'stacked';
}

/** Resolves the font family for a caption style/preset, honoring an explicit override if provided. */
export function getCaptionFont(styleOrPreset?: string, selectedFont?: string): string {
  if (selectedFont) return resolveFont(selectedFont);
  const preset = styleOrPreset ? SUBTITLE_PRESETS[styleOrPreset] : undefined;
  return resolveFont(preset?.fontFamily || 'Inter, sans-serif');
}
