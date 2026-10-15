/**
 * Kinetic Motion Presets — Phase 1 & 2 Config
 *
 * 36 numbered presets (#KM-01 → #KM-36) with:
 * - Pure CSS/SVG micro-preview spec (60 FPS, ultra-fast, zero background video decoders)
 * - Distinct, viral sample hook phrases ("STOP SCROLLING NOW", "MAKE 10X MORE", etc.)
 * - Backend bridge: maps each KM preset to existing TypographyStyleId for Lambda renders
 *
 * Safe baseline fallback: 'apple-keynote-punch'
 */

export type KineticMotionPresetId =
  | 'km-01-slam'
  | 'km-02-elastic-bounce'
  | 'km-03-word-cascade'
  | 'km-04-cinematic-flip'
  | 'km-05-masked-slide'
  | 'km-06-glitch-scramble'
  | 'km-07-typewriter-cursor'
  | 'km-08-particle-burst'
  | 'km-09-highlighter-sweep'
  | 'km-10-zoom-through'
  | 'km-11-fluid-wave'
  | 'km-12-vox-stagger'
  | 'km-13-block-slam'
  | 'km-14-hormozi-pop'
  | 'km-15-redline-box'
  | 'km-16-marquee-flow'
  | 'km-17-apple-punch'
  | 'km-18-editorial-manifesto'
  | 'km-19-swiss-grid'
  | 'km-20-podcast-quote'
  | 'km-21-cursive-script'
  | 'km-22-chalk-notes'
  | 'km-23-perspective-tunnel'
  | 'km-24-retro-synthwave'
  | 'km-25-cinematic-trailer'
  | 'km-26-dubai-gold'
  | 'km-27-listing-stats'
  | 'km-28-monogram-elegance'
  | 'km-29-stat-numbers'
  | 'km-30-depth-behind'
  | 'km-31-parallax-layers'
  | 'km-32-chrome-extrude'
  | 'km-33-mask-slab'
  | 'km-34-blue-muse'
  | 'km-35-action-cuts'
  | 'km-36-boxing-punch';

export interface KineticMotionPreset {
  id: KineticMotionPresetId;
  /** Badge label shown on card — #KM-01, #KM-02, … */
  badge: string;
  /** Short display name */
  name: string;
  /** One-line vibe description */
  vibe: string;
  /** Visual category tag */
  tag: string;
  /** Accent color used in micro-preview & card highlight */
  accentColor: string;
  /** Font used in micro-preview */
  previewFont: string;
  /** Unique sample hook words for this preset */
  sampleWords: string[];
  /** CSS animation class applied to micro-preview */
  previewAnimation: string;
  /**
   * Phase 1 bridge: existing TypographyStyleId to use on Lambda.
   * SAFE BASELINE fallback: 'apple-keynote-punch'
   */
  bridgeStyleId: string;
  /** Human-readable description of the animation */
  animationSpec: string;
}

export const KINETIC_MOTION_PRESETS: KineticMotionPreset[] = [
  {
    id: 'km-01-slam',
    badge: '#KM-01',
    name: 'Slam Impact',
    vibe: 'High-energy hook, loud statements',
    tag: '🔥 Viral',
    accentColor: '#EF4444',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['STOP', 'SCROLLING', 'NOW'],
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'apple-keynote-punch',
    animationSpec: 'scale(2.5)→scale(1.0) + micro-shake on land. Instant snap on spoken beat.',
  },
  {
    id: 'km-02-elastic-bounce',
    badge: '#KM-02',
    name: 'Elastic Bounce',
    vibe: 'Playful, conversational podcast clips',
    tag: '⚡ Kinetic',
    accentColor: '#FF6D00',
    previewFont: 'Montserrat, sans-serif',
    sampleWords: ['WATCH', 'THIS', 'MOVE'],
    previewAnimation: 'animate-km-bounce',
    bridgeStyleId: 'multi-line-block-slam',
    animationSpec: 'Cubic-bezier overshoot spring. Words pop in with rubber-band retract.',
  },
  {
    id: 'km-03-word-cascade',
    badge: '#KM-03',
    name: 'Word Cascade',
    vibe: 'Fast speakers, rapid-fire talking heads',
    tag: '⚡ Kinetic',
    accentColor: '#FACC15',
    previewFont: 'Inter, sans-serif',
    sampleWords: ['SPEED', 'UP', 'GAME'],
    previewAnimation: 'animate-km-cascade',
    bridgeStyleId: 'vox-giant-stagger',
    animationSpec: 'New word enters from bottom-right, pushes previous word out of fixed focal box.',
  },
  {
    id: 'km-04-cinematic-flip',
    badge: '#KM-04',
    name: 'Cinematic 3D Flip',
    vibe: 'Tech reviews, luxury brands, documentary',
    tag: '🎬 Cinematic',
    accentColor: '#D9B76E',
    previewFont: 'Georgia, serif',
    sampleWords: ['FUTURE', 'IS', 'HERE'],
    previewAnimation: 'animate-km-flip',
    bridgeStyleId: 'isometric-3d-flythrough',
    animationSpec: 'perspective(600px) rotateX(-90deg)→rotateX(0deg) with motion blur.',
  },
  {
    id: 'km-05-masked-slide',
    badge: '#KM-05',
    name: 'Masked Slide',
    vibe: 'Clean, premium, Apple aesthetic storytelling',
    tag: '💎 Minimal',
    accentColor: '#FFFFFF',
    previewFont: 'Inter, sans-serif',
    sampleWords: ['PURE', 'ELEGANCE', 'FLOW'],
    previewAnimation: 'animate-km-slide',
    bridgeStyleId: 'editorial-magazine-manifesto',
    animationSpec: 'translateY(100%)→translateY(0) behind overflow:hidden clip-path.',
  },
  {
    id: 'km-06-glitch-scramble',
    badge: '#KM-06',
    name: 'Glitch Scramble',
    vibe: 'Coding, AI, crypto, futuristic themes',
    tag: '🤖 Cyber',
    accentColor: '#22C55E',
    previewFont: 'Courier New, monospace',
    sampleWords: ['NEURAL', 'LINK', 'ONLINE'],
    previewAnimation: 'animate-km-glitch',
    bridgeStyleId: 'glitch-cyber-rave',
    animationSpec: 'RGB channel split and ASCII glitch cycle before snapping to words.',
  },
  {
    id: 'km-07-typewriter-cursor',
    badge: '#KM-07',
    name: 'Typewriter Cursor',
    vibe: 'Storytelling, finance, journal reflections',
    tag: '📝 Minimal',
    accentColor: '#38BDF8',
    previewFont: 'Courier New, monospace',
    sampleWords: ['THE', 'SECRET', 'IS...'],
    previewAnimation: 'animate-km-typewriter',
    bridgeStyleId: 'minimal-swiss-clean',
    animationSpec: 'Character-by-character typed output with blinking terminal cursor.',
  },
  {
    id: 'km-08-particle-burst',
    badge: '#KM-08',
    name: 'Particle Burst',
    vibe: 'Emotional peaks, punchlines, revelation moments',
    tag: '🔥 Viral',
    accentColor: '#A855F7',
    previewFont: 'Montserrat, sans-serif',
    sampleWords: ['BIG', 'REVELATION', 'DROP'],
    previewAnimation: 'animate-km-burst',
    bridgeStyleId: 'split-color-invert',
    animationSpec: 'scale(0.5)→scale(1.3)→scale(1.0) with bright outline pulse.',
  },
  {
    id: 'km-09-highlighter-sweep',
    badge: '#KM-09',
    name: 'Highlighter Sweep',
    vibe: 'Educational, breakdown, tutorial reels',
    tag: '🎓 Educational',
    accentColor: '#FACC15',
    previewFont: 'Inter, sans-serif',
    sampleWords: ['IMPORTANT', 'LESSON', 'NOW'],
    previewAnimation: 'animate-km-highlight',
    bridgeStyleId: 'floodlight',
    animationSpec: 'Rectangular highlighter tape sweeps width(0)→width(100%) behind active word.',
  },
  {
    id: 'km-10-zoom-through',
    badge: '#KM-10',
    name: 'Zoom Through',
    vibe: 'Dramatic scene shifts, climax sentences',
    tag: '🎬 Cinematic',
    accentColor: '#FF6D00',
    previewFont: 'Impact, sans-serif',
    sampleWords: ["DON'T", 'MISS', 'THIS'],
    previewAnimation: 'animate-km-zoom',
    bridgeStyleId: 'kinetic-marquee-diagonal',
    animationSpec: 'scale(1.0)→scale(6.0) forward push through lens.',
  },
  {
    id: 'km-11-fluid-wave',
    badge: '#KM-11',
    name: 'Fluid Wave',
    vibe: 'Calm, lifestyle, travel, reflective reels',
    tag: '🌊 Lifestyle',
    accentColor: '#38BDF8',
    previewFont: 'Georgia, serif',
    sampleWords: ['CALM', 'MIND', 'FLOW'],
    previewAnimation: 'animate-km-wave',
    bridgeStyleId: 'minimal-swiss-clean',
    animationSpec: 'Continuous sinusoidal character-by-character liquid floating wave.',
  },
  {
    id: 'km-12-vox-stagger',
    badge: '#KM-12',
    name: 'Vox Giant Stagger',
    vibe: 'Explainer videos, YouTube essays, investigative',
    tag: '🔥 Viral',
    accentColor: '#FF5722',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['HOW', 'IT', 'HAPPENED'],
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'vox-giant-stagger',
    animationSpec: 'Staggered multi-line slam with orange highlighter tape overlays.',
  },
  {
    id: 'km-13-block-slam',
    badge: '#KM-13',
    name: 'Brutalist Block Slam',
    vibe: 'Hard truths, motivation, brutalist posters',
    tag: '⚡ Kinetic',
    accentColor: '#FFA000',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['HARD', 'TRUTH', 'BOMBS'],
    previewAnimation: 'animate-km-bounce',
    bridgeStyleId: 'multi-line-block-slam',
    animationSpec: 'Spring physics multi-row stacked brutalist block typography.',
  },
  {
    id: 'km-14-hormozi-pop',
    badge: '#KM-14',
    name: 'Hormozi Kinetic Pop',
    vibe: 'Viral business hooks, $100M offers, high CTR',
    tag: '🔥 Viral',
    accentColor: '#FFD600',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['MAKE', '10X', 'MORE'],
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'hormozi-bold',
    animationSpec: 'Bright yellow bounding box pop with bold black typography.',
  },
  {
    id: 'km-15-redline-box',
    badge: '#KM-15',
    name: 'Viral Redline Box',
    vibe: 'Urgent warnings, mistakes to avoid, alert hooks',
    tag: '🔥 Viral',
    accentColor: '#FF3D00',
    previewFont: 'Montserrat, sans-serif',
    sampleWords: ['WARNING', 'DANGER', 'ZONE'],
    previewAnimation: 'animate-km-bounce',
    bridgeStyleId: 'viral-redline',
    animationSpec: 'Spring snap box with thick crimson border and flashing alert.',
  },
  {
    id: 'km-16-marquee-flow',
    badge: '#KM-16',
    name: 'Diagonal Marquee Flow',
    vibe: 'Breaking news, live ticker, hype reels',
    tag: '⚡ Kinetic',
    accentColor: '#00E5FF',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['BREAKING', 'NEWS', 'ALERT'],
    previewAnimation: 'animate-km-cascade',
    bridgeStyleId: 'kinetic-marquee-diagonal',
    animationSpec: '12-degree tilted continuous horizontal marquee ticker stream.',
  },
  {
    id: 'km-17-apple-punch',
    badge: '#KM-17',
    name: 'Apple Keynote Punch',
    vibe: 'Product launches, Steve Jobs keynote style',
    tag: '💎 Minimal',
    accentColor: '#FFFFFF',
    previewFont: 'Inter, sans-serif',
    sampleWords: ['THINK', 'DIFFERENT', 'NOW'],
    previewAnimation: 'animate-km-slide',
    bridgeStyleId: 'apple-keynote-punch',
    animationSpec: 'Spotlight scale push on obsidian canvas with ultra-fine contrast.',
  },
  {
    id: 'km-18-editorial-manifesto',
    badge: '#KM-18',
    name: 'Editorial Manifesto',
    vibe: 'High fashion, luxury manifesto, Vogue aesthetics',
    tag: '💎 Minimal',
    accentColor: '#F8FAFC',
    previewFont: 'Georgia, serif',
    sampleWords: ['VOGUE', 'EDITORIAL', 'CHIC'],
    previewAnimation: 'animate-km-flip',
    bridgeStyleId: 'editorial-magazine-manifesto',
    animationSpec: 'Playfair Display serif reveal with luxury editorial spacing.',
  },
  {
    id: 'km-19-swiss-grid',
    badge: '#KM-19',
    name: 'Ultra Minimal Swiss Grid',
    vibe: 'Architecture, industrial design, Bauhaus purity',
    tag: '💎 Minimal',
    accentColor: '#E2E8F0',
    previewFont: 'Inter, sans-serif',
    sampleWords: ['SWISS', 'DESIGN', 'SYSTEM'],
    previewAnimation: 'animate-km-slide',
    bridgeStyleId: 'minimal-swiss-clean',
    animationSpec: 'Clean coordinate slide with fine Swiss hairline grid overlay.',
  },
  {
    id: 'km-20-podcast-quote',
    badge: '#KM-20',
    name: 'Podcast Quote Card',
    vibe: 'Diary of a CEO, Joe Rogan, deep wisdom quotes',
    tag: '🎙️ Podcast',
    accentColor: '#FFA000',
    previewFont: 'Inter, sans-serif',
    sampleWords: ['LISTEN', 'VERY', 'CLOSELY'],
    previewAnimation: 'animate-km-bounce',
    bridgeStyleId: 'podcast-quote-card',
    animationSpec: 'Frosted glass quote card with animated audio waveform glow.',
  },
  {
    id: 'km-21-cursive-script',
    badge: '#KM-21',
    name: 'Cursive Signature',
    vibe: 'Artisan craft, personal signature, elegance',
    tag: '💎 Minimal',
    accentColor: '#F59E0B',
    previewFont: 'Georgia, serif',
    sampleWords: ['HANDMADE', 'LUXURY', 'TOUCH'],
    previewAnimation: 'animate-km-wave',
    bridgeStyleId: 'cursive',
    animationSpec: 'Flowing handwritten cursive script reveal with organic stroke.',
  },
  {
    id: 'km-22-chalk-notes',
    badge: '#KM-22',
    name: 'Chalk Doodle Notes',
    vibe: 'Whiteboard notes, classroom doodles, casual tips',
    tag: '🎓 Educational',
    accentColor: '#FFFDD0',
    previewFont: 'Courier New, monospace',
    sampleWords: ['SIMPLE', 'IDEA', 'SKETCH'],
    previewAnimation: 'animate-km-bounce',
    bridgeStyleId: 'chalk',
    animationSpec: 'Hand-drawn chalkboard chalk card with irregular box outline.',
  },
  {
    id: 'km-23-perspective-tunnel',
    badge: '#KM-23',
    name: '3D Perspective Tunnel',
    vibe: 'Spatial audio, Metaverse, sci-fi flythrough',
    tag: '⚡ 3D Space',
    accentColor: '#00E5FF',
    previewFont: 'Montserrat, sans-serif',
    sampleWords: ['ENTER', 'THE', 'METAVERSE'],
    previewAnimation: 'animate-km-flip',
    bridgeStyleId: 'isometric-3d-flythrough',
    animationSpec: '3D perspective tunnel spatial camera flythrough on coordinate axes.',
  },
  {
    id: 'km-24-retro-synthwave',
    badge: '#KM-24',
    name: 'Retro 80s Synthwave',
    vibe: 'Outrun neon, cyberpunk vibes, 80s synth beats',
    tag: '⚡ 3D Space',
    accentColor: '#E040FB',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['NEON', 'NIGHTS', 'HORIZON'],
    previewAnimation: 'animate-km-burst',
    bridgeStyleId: 'retro-synthwave',
    animationSpec: 'Neon grid horizon sweep with magenta glow and chromatic trail.',
  },
  {
    id: 'km-25-cinematic-trailer',
    badge: '#KM-25',
    name: 'Cinematic 3D Trailer',
    vibe: 'Blockbuster trailer hooks, dramatic intros',
    tag: '🎬 Cinematic',
    accentColor: '#FFB300',
    previewFont: 'Georgia, serif',
    sampleWords: ['THE', 'FINAL', 'CHAPTER'],
    previewAnimation: 'animate-km-flip',
    bridgeStyleId: 'cinematic-trailer',
    animationSpec: 'Blockbuster volumetric smoke reveal with anamorphic lens flare.',
  },
  {
    id: 'km-26-dubai-gold',
    badge: '#KM-26',
    name: 'Dubai 24K Gold Foil',
    vibe: 'Real estate, luxury penthouses, 24K wealth',
    tag: '👑 Luxury',
    accentColor: '#FFD700',
    previewFont: 'Georgia, serif',
    sampleWords: ['24K', 'LUXURY', 'PENTHOUSE'],
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'dubai-gold',
    animationSpec: '24K metallic gold foil specular sweep with Cormorant serif.',
  },
  {
    id: 'km-27-listing-stats',
    badge: '#KM-27',
    name: 'Luxury Listing Stats',
    vibe: 'Property specs, million-dollar villas, features',
    tag: '👑 Luxury',
    accentColor: '#FFA000',
    previewFont: 'Inter, sans-serif',
    sampleWords: ['5 BEDS', '·', '$12.5M'],
    previewAnimation: 'animate-km-slide',
    bridgeStyleId: 'luxury-listing-stats',
    animationSpec: 'Architectural spec badge slide with amber highlights.',
  },
  {
    id: 'km-28-monogram-elegance',
    badge: '#KM-28',
    name: 'Monogram High Elegance',
    vibe: 'Private banking, bespoke tailoring, heritage',
    tag: '👑 Luxury',
    accentColor: '#F59E0B',
    previewFont: 'Georgia, serif',
    sampleWords: ['ROYAL', 'PRIVATE', 'ESTATE'],
    previewAnimation: 'animate-km-flip',
    bridgeStyleId: 'luxury-monogram',
    animationSpec: 'Bespoke monogram seal with gold hairline border reveal.',
  },
  {
    id: 'km-29-stat-numbers',
    badge: '#KM-29',
    name: 'Stat Numbers & ROI',
    vibe: 'Finance, revenue growth, metrics, crypto profits',
    tag: '📈 Finance',
    accentColor: '#10B981',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['+480%', 'NET', 'PROFIT'],
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'stat-numbers',
    animationSpec: 'Finance counter scale with emerald green (+% ROI) metric badge.',
  },
  {
    id: 'km-30-depth-behind',
    badge: '#KM-30',
    name: 'Depth Behind Subject',
    vibe: 'CapCut depth trend, text behind person',
    tag: '🎬 Cinematic',
    accentColor: '#FF5722',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['BEHIND', 'THE', 'HERO'],
    previewAnimation: 'animate-km-bounce',
    bridgeStyleId: 'depth-behind-subject',
    animationSpec: 'Kinetic typography placed behind foreground subject segmentation mask.',
  },
  {
    id: 'km-31-parallax-layers',
    badge: '#KM-31',
    name: 'Multi-Layer Parallax',
    vibe: '3D multi-plane camera pans, deep spatial layers',
    tag: '⚡ 3D Space',
    accentColor: '#818CF8',
    previewFont: 'Montserrat, sans-serif',
    sampleWords: ['3D', 'DEPTH', 'LAYERS'],
    previewAnimation: 'animate-km-cascade',
    bridgeStyleId: 'parallax-layers',
    animationSpec: '3-tier depth parallax camera planes with blurred background typography.',
  },
  {
    id: 'km-32-chrome-extrude',
    badge: '#KM-32',
    name: 'Chrome 3D Extrude',
    vibe: 'Heavy metal, chrome Y2K, 3D extruded lettering',
    tag: '⚡ 3D Space',
    accentColor: '#CBD5E1',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['HEAVY', 'CHROME', 'METAL'],
    previewAnimation: 'animate-km-flip',
    bridgeStyleId: 'chrome-3d-extrude',
    animationSpec: 'Multi-layer 3D metallic chrome extrude shadow with specular glints.',
  },
  {
    id: 'km-33-mask-slab',
    badge: '#KM-33',
    name: 'Mask Reveal Slab',
    vibe: 'Dynamic clipping masks, heavy punchy slabs',
    tag: '🔥 Viral',
    accentColor: '#10B981',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['UNMASK', 'THE', 'TRUTH'],
    previewAnimation: 'animate-km-slide',
    bridgeStyleId: 'mask-reveal-slab',
    animationSpec: 'Dynamic mask clip reveal with heavy slab typography.',
  },
  {
    id: 'km-34-blue-muse',
    badge: '#KM-34',
    name: 'Blue Muse Atmospheric',
    vibe: 'Calm nocturnal aura, deep ocean thoughts',
    tag: '🌊 Lifestyle',
    accentColor: '#3B82F6',
    previewFont: 'Georgia, serif',
    sampleWords: ['DEEP', 'BLUE', 'AURA'],
    previewAnimation: 'animate-km-wave',
    bridgeStyleId: 'blue-muse',
    animationSpec: 'Atmospheric blue glow with serif overlay and gentle float.',
  },
  {
    id: 'km-35-action-cuts',
    badge: '#KM-35',
    name: 'Action Magazine Cuts',
    vibe: 'High-octane action, magazine clippings, fast pace',
    tag: '🔥 Viral',
    accentColor: '#EF4444',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['HIGH', 'OCTANE', 'ACTION'],
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'action',
    animationSpec: 'High-energy magazine punch cuts and 15-degree rotations.',
  },
  {
    id: 'km-36-boxing-punch',
    badge: '#KM-36',
    name: 'Heavyweight Boxer Slam',
    vibe: 'Knockout statements, intense impact blows',
    tag: '🔥 Viral',
    accentColor: '#EF4444',
    previewFont: 'Impact, sans-serif',
    sampleWords: ['KNOCKOUT', 'PUNCH', 'HIT'],
    previewAnimation: 'animate-km-slam',
    bridgeStyleId: 'boxing-punch-heavy',
    animationSpec: 'Impact ripple slam with dark card overlay and camera shake.',
  },
];

/** Default preset ID used when localStorage is empty */
export const DEFAULT_KM_PRESET_ID: KineticMotionPresetId = 'km-01-slam';

/** localStorage key for last-used Kinetic Motion preset */
export const KM_LAST_PRESET_KEY = 'last_used_kinetic_motion_preset';

/**
 * Returns the Phase 1 bridge TypographyStyleId for a given KM preset.
 * Falls back to the safe baseline 'apple-keynote-punch' if preset not found.
 */
export function getBridgeStyleId(kmPresetId: string): string {
  const preset = KINETIC_MOTION_PRESETS.find((p) => p.id === kmPresetId);
  return preset?.bridgeStyleId ?? 'apple-keynote-punch';
}

/** Look up a preset by ID, returning undefined if not found */
export function getKineticMotionPreset(id: string): KineticMotionPreset | undefined {
  return KINETIC_MOTION_PRESETS.find((p) => p.id === id);
}

/** Resolve initial preset: URL param → localStorage → default */
export function resolveInitialKMPreset(urlParam: string | null): KineticMotionPresetId {
  if (urlParam) {
    const decoded = decodeURIComponent(urlParam) as KineticMotionPresetId;
    if (KINETIC_MOTION_PRESETS.some((p) => p.id === decoded)) return decoded;
  }
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(KM_LAST_PRESET_KEY) as KineticMotionPresetId | null;
      if (saved && KINETIC_MOTION_PRESETS.some((p) => p.id === saved)) return saved;
    } catch {}
  }
  return DEFAULT_KM_PRESET_ID;
}
