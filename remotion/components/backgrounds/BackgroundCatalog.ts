export type BackgroundCategory =
  | 'all'
  | 'gradient'
  | 'minimal'
  | 'tech'
  | 'cinematic'
  | 'nature'
  | 'particles'
  | 'custom';

export type BackgroundMoodTag =
  | 'Dark'
  | 'Warm'
  | 'Tech'
  | 'Vibrant'
  | 'Subtle'
  | 'Minimal'
  | 'Cinema'
  | 'Cosmic';

export interface BackgroundItem {
  id: string;
  name: string;
  category: 'gradient' | 'minimal' | 'tech' | 'cinematic' | 'nature' | 'particles' | 'custom';
  tag: BackgroundMoodTag;
  description: string;
  isDark: boolean;
  accentColor: string;
}

export const BACKGROUND_CATEGORIES: Array<{ id: BackgroundCategory; label: string; icon?: string }> = [
  { id: 'all', label: 'All Styles' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'tech', label: 'Tech' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'nature', label: 'Nature / Calm' },
  { id: 'particles', label: 'Particles' },
  { id: 'custom', label: 'Custom Upload' },
];

export const BACKGROUND_CATALOG: BackgroundItem[] = [
  // ── 1. GRADIENT (Animated Mesh & Auroras) ──
  {
    id: 'midnight-mesh',
    name: 'Midnight Mesh',
    category: 'gradient',
    tag: 'Dark',
    description: 'Deep obsidian and indigo mesh gradient with gentle warm ember glow.',
    isDark: true,
    accentColor: '#FF5722',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'gradient',
    tag: 'Vibrant',
    description: 'Ethereal cyber emerald and electric cyan drifting auroral bands.',
    isDark: true,
    accentColor: '#10B981',
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon',
    category: 'gradient',
    tag: 'Warm',
    description: 'Rich dusk amber to flame crimson radial horizon glow.',
    isDark: true,
    accentColor: '#FFA000',
  },
  {
    id: 'neon-twilight',
    name: 'Neon Twilight',
    category: 'gradient',
    tag: 'Tech',
    description: 'Deep royal violet to ultramarine blue evening gradient.',
    isDark: true,
    accentColor: '#8B5CF6',
  },

  // ── 2. MINIMAL (Solid, Paper, Soft Textures) ──
  {
    id: 'studio-dark',
    name: 'Studio Obsidian',
    category: 'minimal',
    tag: 'Minimal',
    description: 'Pure high-contrast obsidian black (#070B14) with subtle circular falloff.',
    isDark: true,
    accentColor: '#64748B',
  },
  {
    id: 'deep-slate',
    name: 'Deep Slate',
    category: 'minimal',
    tag: 'Subtle',
    description: 'Minimal slate-950 foundation with calm, neutral studio lighting.',
    isDark: true,
    accentColor: '#94A3B8',
  },
  {
    id: 'dark-paper',
    name: 'Editorial Texture',
    category: 'minimal',
    tag: 'Minimal',
    description: 'Sophisticated matte concrete and dark paper texture for documentaries.',
    isDark: true,
    accentColor: '#A1A1AA',
  },
  {
    id: 'studio-white',
    name: 'Studio Pure Light',
    category: 'minimal',
    tag: 'Subtle',
    description: 'Crisp editorial white studio surface with soft ambient illumination.',
    isDark: false,
    accentColor: '#0F172A',
  },

  // ── 3. TECH (Grid, Dots, Neon Scanlines) ──
  {
    id: 'cyber-grid',
    name: 'Cyber Grid',
    category: 'tech',
    tag: 'Tech',
    description: 'Dynamic perspective digital grid with animated pulse and telemetry coordinates.',
    isDark: true,
    accentColor: '#38BDF8',
  },
  {
    id: 'matrix-dots',
    name: 'Matrix Dots',
    category: 'tech',
    tag: 'Tech',
    description: 'Precision hexagonal dot matrix with traveling luminosity waves.',
    isDark: true,
    accentColor: '#06B6D4',
  },
  {
    id: 'neon-scanlines',
    name: 'Neon Scanlines',
    category: 'tech',
    tag: 'Tech',
    description: 'CRT HUD horizontal scanlines with subtle cyan telemetry pulses.',
    isDark: true,
    accentColor: '#0EA5E9',
  },
  {
    id: 'circuit-flow',
    name: 'Circuit Nodes',
    category: 'tech',
    tag: 'Tech',
    description: 'Minimalist tech circuitry pathways with subtle pulsing energy nodes.',
    isDark: true,
    accentColor: '#F59E0B',
  },

  // ── 4. CINEMATIC (Vignette, Film Grain, Spotlight) ──
  {
    id: 'dark-vignette',
    name: 'Cinema Vignette',
    category: 'cinematic',
    tag: 'Cinema',
    description: 'Deep anamorphic focal vignette focusing attention directly on center stage.',
    isDark: true,
    accentColor: '#F8FAFC',
  },
  {
    id: 'film-grain',
    name: 'Moody Film Grain',
    category: 'cinematic',
    tag: 'Cinema',
    description: 'Subtle 35mm film grain texture over deep charcoal contrast.',
    isDark: true,
    accentColor: '#D4D4D8',
  },
  {
    id: 'spotlight-drama',
    name: 'Dramatic Spotlight',
    category: 'cinematic',
    tag: 'Cinema',
    description: 'Cinematic overhead spotlight beam with breathing radial intensity.',
    isDark: true,
    accentColor: '#FBBF24',
  },
  {
    id: 'noir-monochrome',
    name: 'Noir Contrast',
    category: 'cinematic',
    tag: 'Cinema',
    description: 'High-contrast black and titanium gray for investigative topics.',
    isDark: true,
    accentColor: '#E2E8F0',
  },

  // ── 5. NATURE / CALM (Waves, Blobs, Soft Dusk) ──
  {
    id: 'flowing-waves',
    name: 'Flowing Waves',
    category: 'nature',
    tag: 'Subtle',
    description: 'Smooth harmonic SVG wave layers drifting in gentle fluid motion.',
    isDark: true,
    accentColor: '#38BDF8',
  },
  {
    id: 'organic-blobs',
    name: 'Organic Dusk',
    category: 'nature',
    tag: 'Warm',
    description: 'Gentle organic morphing blobs with warm dusk amber and violet hues.',
    isDark: true,
    accentColor: '#FB923C',
  },
  {
    id: 'calm-ocean',
    name: 'Calm Ocean',
    category: 'nature',
    tag: 'Subtle',
    description: 'Deep oceanic blue gradient with subtle undulating ocean swells.',
    isDark: true,
    accentColor: '#0284C7',
  },
  {
    id: 'zen-ripples',
    name: 'Zen Ripples',
    category: 'nature',
    tag: 'Subtle',
    description: 'Minimalist expanding circular ripple rings radiating outward.',
    isDark: true,
    accentColor: '#A7F3D0',
  },

  // ── 6. PARTICLES (Floating Dots, Bokeh, Stars) ──
  {
    id: 'floating-dots',
    name: 'Amber Embers',
    category: 'particles',
    tag: 'Warm',
    description: 'Golden ember particles drifting upward with deterministic motion.',
    isDark: true,
    accentColor: '#FF5722',
  },
  {
    id: 'bokeh-orbs',
    name: 'Golden Bokeh',
    category: 'particles',
    tag: 'Cinema',
    description: 'Soft out-of-focus bokeh light orbs floating peacefully in the background.',
    isDark: true,
    accentColor: '#F59E0B',
  },
  {
    id: 'starry-cosmos',
    name: 'Starry Cosmos',
    category: 'particles',
    tag: 'Cosmic',
    description: 'Deep space starfield with twinkling stars and subtle cosmic nebula dust.',
    isDark: true,
    accentColor: '#818CF8',
  },
  {
    id: 'cyber-sparks',
    name: 'Cyber Sparks',
    category: 'particles',
    tag: 'Tech',
    description: 'Electric cyan and neon orange sparks rising against obsidian dark canvas.',
    isDark: true,
    accentColor: '#06B6D4',
  },

  // ── 7. CUSTOM ──
  {
    id: 'custom-upload',
    name: 'Custom Upload',
    category: 'custom',
    tag: 'Subtle',
    description: 'Your own uploaded image or video backdrop conforming to 16:9.',
    isDark: true,
    accentColor: '#FF5722',
  },
];
