export * from './blueprintSchema';

export type TypographyStyleId =
  | 'dynamic-punch'
  | 'depth-3d-text'
  | 'dubai-gold'
  | 'neon-kinetic'
  | 'prism-pro'
  | 'paper-ii'
  | 'elevate-script'
  | 'platinum-penthouse'
  | 'royal-emerald'
  | 'silver-chrome'
  | 'velvet-crimson'
  | 'tokyo-cyber'
  | 'miami-sunset'
  | 'swiss-minimal'
  | 'monarch-violet'
  | 'obsidian-gold'
  | 'hormozi-bold'
  | 'beast-impact'
  | 'viral-redline'
  | 'creator-highlight'
  | 'gadzhi-documentary'
  | 'vogue-editorial'
  | 'keynote-executive'
  | 'vox-explainer'
  | 'nordic-clean'
  | 'spatial-glass'
  | 'isometric-cube'
  | 'synthwave-80s'
  | 'hud-telemetry'
  | 'prime-neon'
  | 'agent-tour'
  | 'purple-chrome';

export type TypographyHighlightType = 'emphasis' | 'box' | 'pill' | 'pill-badge' | 'ui-card' | 'metric' | 'sparkle' | 'glitch' | 'underline' | 'tape-badge' | 'question' | 'cta';

export type TypographyAnimationPreset = 'slam' | 'rise' | 'pop' | 'typewriter' | 'glow-pulse' | 'smooth-fade';

export type TypographyWord = {
  word: string;
  start: number;
  end: number;
  highlight?: boolean;
};

export type KineticPhrase = {
  id?: string;
  word?: string;
  leadText?: string;
  heroText?: string;
  subText?: string;
  extraText?: string;
  hookWord?: string;
  subtitleText?: string;
  stepWords?: string[];
  start: number;
  end: number;
  highlightType?: TypographyHighlightType;
  animationPreset?: TypographyAnimationPreset;
  position?: 'top' | 'center' | 'bottom-mid' | 'bottom' | 'left' | 'right' | 'auto';
  emphasisWords?: string[];
  styleVariant?: string;
  variant?: string;
  badgeLabel?: string;
  size?: 'compact' | 'large' | 'oversized';
  icon?: 'speedometer' | 'star' | 'checkmark' | 'sparkle' | 'none';
  emphasis?: 'headline' | 'subtle' | 'accent';
};

export type StyleBlueprint = import('./styleRegistry').StyleBlueprint;
