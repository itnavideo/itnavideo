export * from './blueprintSchema';

export type TypographyStyleId =
  // 8 Signature True Full-Screen Kinetic Typography Systems
  | 'vox-giant-stagger'
  | 'apple-keynote-punch'
  | 'kinetic-marquee-diagonal'
  | 'editorial-magazine-manifesto'
  | 'glitch-cyber-rave'
  | 'split-color-invert'
  | 'isometric-3d-flythrough'
  | 'multi-line-block-slam'
  // 10 Moonshot Typography Presets
  | 'blue-muse'
  | 'headliner'
  | 'chalk'
  | 'cursive'
  | 'gold-centre'
  | 'floodlight'
  | 'storyline'
  | 'the-difference'
  | 'action'
  | 'stat-numbers'
  // Legacy styles (supported via alias mapping)
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
  | 'material-expressive'
  | 'm3-assist-chip'
  | 'm3-floating-dock'
  | 'realtor-behind-subject'
  | 'luxury-listing-stats'
  | 'architectural-tour'
  | 'realtor-punch-quotes'
  | 'prime-neon'
  | 'agent-tour'
  | 'purple-chrome'
  | 'neon-cyber-pulse'
  | 'matrix-terminal-code'
  | 'bold-ticker-news'
  | 'retro-synthwave'
  | 'minimal-swiss-clean'
  | 'podcast-quote-card'
  | 'boxing-punch-heavy'
  | 'glow-gradient-pill'
  | 'architectural-blueprint'
  | 'luxury-monogram'
  | 'cinematic-trailer';

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
