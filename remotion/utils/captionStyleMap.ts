import { SubtitleConfig, SUBTITLE_PRESETS, DEFAULT_SUBTITLE_CONFIG, SubtitleStyle } from '../types/subtitles';

export const CAPTION_STYLE_MAP = SUBTITLE_PRESETS;

export function mapCaptionStyle(styleName?: string): SubtitleConfig {
  if (!styleName) return DEFAULT_SUBTITLE_CONFIG;

  const preset = SUBTITLE_PRESETS[styleName] || Object.values(SUBTITLE_PRESETS).find(p => p.style === styleName);
  if (preset) {
    return {
      style: preset.style,
      fontFamily: preset.fontFamily,
      textColor: preset.textColor,
      highlightColor: preset.highlightColor,
      backgroundColor: preset.backgroundColor,
      fontSize: preset.fontSize || 'medium',
      position: 'bottom',
      language: 'en',
    };
  }

  return {
    ...DEFAULT_SUBTITLE_CONFIG,
    style: (styleName as SubtitleStyle) || 'highlight',
  };
}

export function getCaptionFont(styleName?: string, overrideFont?: string): string {
  if (overrideFont) return overrideFont;
  const cfg = mapCaptionStyle(styleName);
  return cfg.fontFamily || 'Inter, sans-serif';
}

export function getCaptionStyleConfig(styleName?: string): Partial<SubtitleConfig> {
  return mapCaptionStyle(styleName);
}
