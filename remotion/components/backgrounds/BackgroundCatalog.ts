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
  { id: 'minimal', label: 'Minimal / Colors' },
  { id: 'tech', label: 'Tech' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'nature', label: 'Nature / Calm' },
  { id: 'particles', label: 'Particles' },
  { id: 'custom', label: 'Custom Upload' },
];

export interface CreatorCoreColor {
  id: string;
  name: string;
  shortName: string;
  hex: string;
  textColor: string;
  isDark: boolean;
  description: string;
  group: 'core' | 'pastel' | 'vibrant' | 'earth' | 'deep';
}

export const CREATOR_CORE_COLORS: CreatorCoreColor[] = [
  // ── 1. CORE CANVA CREATOR CANVASES (12) ──
  { id: 'solid-black', name: 'Studio Obsidian Black', shortName: 'Black', hex: '#070B14', textColor: '#FFFFFF', isDark: true, description: 'Classic high-contrast dark canvas for documentaries and explainers.', group: 'core' },
  { id: 'solid-white', name: 'Crisp Studio White', shortName: 'White', hex: '#FFFFFF', textColor: '#0F172A', isDark: false, description: 'Clean modern paper-white background for bright, high-retention explainers.', group: 'core' },
  { id: 'solid-orange', name: 'Flame Brand Orange', shortName: 'Orange', hex: '#FF5722', textColor: '#FFFFFF', isDark: true, description: 'High-energy signature flame orange for punchy marketing and growth videos.', group: 'core' },
  { id: 'solid-slate', name: 'Deep Midnight Slate', shortName: 'Slate', hex: '#0F172A', textColor: '#FFFFFF', isDark: true, description: 'Calm corporate slate-900 surface for business, SaaS and tech analysis.', group: 'core' },
  { id: 'solid-cream', name: 'Warm Vintage Cream', shortName: 'Cream', hex: '#FAF8F5', textColor: '#1E293B', isDark: false, description: 'Warm editorial cream page look favored by book summaries and essayists.', group: 'core' },
  { id: 'solid-emerald', name: 'Emerald Money Green', shortName: 'Emerald', hex: '#064E3B', textColor: '#FFFFFF', isDark: true, description: 'Rich deep emerald for finance, investing, wealth and crypto topics.', group: 'core' },
  { id: 'solid-navy', name: 'Royal Wall St Navy', shortName: 'Navy', hex: '#0A192F', textColor: '#FFFFFF', isDark: true, description: 'Authoritative deep navy for investigative journalism and historical breakdowns.', group: 'core' },
  { id: 'solid-cyan', name: 'Cyber Electric Cyan', shortName: 'Cyan', hex: '#082F49', textColor: '#FFFFFF', isDark: true, description: 'Futuristic deep electric cyan for AI, software and futurism videos.', group: 'core' },
  { id: 'solid-purple', name: 'Regal Royal Purple', shortName: 'Purple', hex: '#2E1065', textColor: '#FFFFFF', isDark: true, description: 'Luxurious royal purple for psychology, philosophy and creative topics.', group: 'core' },
  { id: 'solid-crimson', name: 'Deep Warning Crimson', shortName: 'Crimson', hex: '#450A0A', textColor: '#FFFFFF', isDark: true, description: 'Deep dramatic crimson for breaking news, true crime and urgent warnings.', group: 'core' },
  { id: 'solid-amber', name: 'Sunset Golden Amber', shortName: 'Amber', hex: '#78350F', textColor: '#FFFFFF', isDark: true, description: 'Warm golden amber for motivational and historical storytelling.', group: 'core' },
  { id: 'solid-zinc', name: 'Studio Neutral Gray', shortName: 'Gray', hex: '#18181B', textColor: '#FFFFFF', isDark: true, description: 'Neutral matte studio dark gray that lets on-screen graphics shine.', group: 'core' },

  // ── 2. SOFT PASTEL COLLECTION (8) ──
  { id: 'pastel-lavender', name: 'Soft Pastel Lavender', shortName: 'Lavender', hex: '#E9D5FF', textColor: '#581C87', isDark: false, description: 'Gentle, modern pastel lavender favored by lifestyle & creative creators.', group: 'pastel' },
  { id: 'pastel-mint', name: 'Fresh Pastel Mint', shortName: 'Mint', hex: '#D1FAE5', textColor: '#065F46', isDark: false, description: 'Refreshing pastel mint for wellness, productivity, and calm insights.', group: 'pastel' },
  { id: 'pastel-sky', name: 'Calm Baby Sky Blue', shortName: 'Sky', hex: '#BAE6FD', textColor: '#0369A1', isDark: false, description: 'Clean airy baby blue for thoughtful, open educational videos.', group: 'pastel' },
  { id: 'pastel-lemon', name: 'Soft Pastel Lemon', shortName: 'Lemon', hex: '#FEF08A', textColor: '#854D0E', isDark: false, description: 'Sunny, cheerful pastel yellow for fun facts and positive breakdowns.', group: 'pastel' },
  { id: 'pastel-peach', name: 'Warm Pastel Peach', shortName: 'Peach', hex: '#FFEDD5', textColor: '#9A3412', isDark: false, description: 'Inviting, organic pastel peach for storytelling and personal essays.', group: 'pastel' },
  { id: 'pastel-rose', name: 'Blush Pastel Rose', shortName: 'Rose', hex: '#FCE7F3', textColor: '#9D174D', isDark: false, description: 'Elegant blush rose pink for beauty, health, and relationship essays.', group: 'pastel' },
  { id: 'pastel-oat', name: 'Neutral Oat Cream', shortName: 'Oat', hex: '#F5F5F0', textColor: '#292524', isDark: false, description: 'Subtle high-end editorial off-white paper canvas.', group: 'pastel' },
  { id: 'pastel-sage', name: 'Muted Pastel Sage', shortName: 'Sage', hex: '#E2E8F0', textColor: '#334155', isDark: false, description: 'Modern architectural light slate-gray for minimalist typography.', group: 'pastel' },

  // ── 3. VIBRANT & HIGH-ENERGY POP (8) ──
  { id: 'vibrant-lime', name: 'Electric Viral Lime', shortName: 'Lime', hex: '#84CC16', textColor: '#1A2E05', isDark: false, description: 'High-contrast electric lime for Hormozi-style retention shorts.', group: 'vibrant' },
  { id: 'vibrant-aqua', name: 'Neon Cyber Aqua', shortName: 'Aqua', hex: '#06B6D4', textColor: '#083344', isDark: false, description: 'Bright glowing cyan for tech headlines, software demos and crypto news.', group: 'vibrant' },
  { id: 'vibrant-violet', name: 'Hyper Ultra Violet', shortName: 'Violet', hex: '#8B5CF6', textColor: '#FFFFFF', isDark: true, description: 'High-energy creator purple for tech and design storytelling.', group: 'vibrant' },
  { id: 'vibrant-pink', name: 'Hot Bubblegum Pink', shortName: 'Hot Pink', hex: '#EC4899', textColor: '#FFFFFF', isDark: true, description: 'Eye-catching hot pink for pop culture, trends, and viral hooks.', group: 'vibrant' },
  { id: 'vibrant-yellow', name: 'Bold Sunflower Yellow', shortName: 'Sunflower', hex: '#EAB308', textColor: '#000000', isDark: false, description: 'High-visibility energetic yellow for warning hooks and fast tips.', group: 'vibrant' },
  { id: 'vibrant-coral', name: 'Vibrant Sunset Coral', shortName: 'Coral', hex: '#F97316', textColor: '#FFFFFF', isDark: true, description: 'Warm punchy orange-coral for fitness, motivation and life hacks.', group: 'vibrant' },
  { id: 'vibrant-ruby', name: 'Crimson Ruby Pop', shortName: 'Ruby', hex: '#E11D48', textColor: '#FFFFFF', isDark: true, description: 'Dramatic crimson pop for controversial questions and shocking facts.', group: 'vibrant' },
  { id: 'vibrant-blue', name: 'Vivid Electric Blue', shortName: 'Blue', hex: '#2563EB', textColor: '#FFFFFF', isDark: true, description: 'Punchy cobalt blue for technology, apps, and SaaS feature reveals.', group: 'vibrant' },

  // ── 4. EARTH TONES & EDITORIAL (8) ──
  { id: 'earth-sand', name: 'Warm Sahara Sand', shortName: 'Sand', hex: '#E7E5E4', textColor: '#1C1917', isDark: false, description: 'Textured desert sand beige for documentary journeys and history.', group: 'earth' },
  { id: 'earth-terracotta', name: 'Earthy Terracotta', shortName: 'Terracotta', hex: '#C2410C', textColor: '#FFFFFF', isDark: true, description: 'Warm clay terracotta for travel, culture and human interest stories.', group: 'earth' },
  { id: 'earth-forest', name: 'Deep Forest Pine', shortName: 'Pine', hex: '#14532D', textColor: '#FFFFFF', isDark: true, description: 'Rich natural forest green for ecology, outdoors and geography essays.', group: 'earth' },
  { id: 'earth-ochre', name: 'Golden Earth Ochre', shortName: 'Ochre', hex: '#B45309', textColor: '#FFFFFF', isDark: true, description: 'Warm mineral ochre for ancient history, craftsmanship and books.', group: 'earth' },
  { id: 'earth-espresso', name: 'Dark Roast Espresso', shortName: 'Espresso', hex: '#38220F', textColor: '#FFFFFF', isDark: true, description: 'Luxurious dark coffee brown for deep discussions and classic essays.', group: 'earth' },
  { id: 'earth-olive', name: 'Vintage Olive Drab', shortName: 'Olive', hex: '#3F6212', textColor: '#FFFFFF', isDark: true, description: 'Understated military/vintage olive for geopolitical and tactical breakdowns.', group: 'earth' },
  { id: 'earth-taupe', name: 'Warm Slate Taupe', shortName: 'Taupe', hex: '#78716C', textColor: '#FFFFFF', isDark: true, description: 'Sophisticated neutral taupe for architecture and premium products.', group: 'earth' },
  { id: 'earth-stone', name: 'Solid Slate Stone', shortName: 'Stone', hex: '#334155', textColor: '#FFFFFF', isDark: true, description: 'Grounding slate blue-gray for corporate essays and market analysis.', group: 'earth' },

  // ── 5. DEEP STUDIO & MOODY (8) ──
  { id: 'deep-carbon', name: 'Ultra Deep Carbon', shortName: 'Carbon', hex: '#111827', textColor: '#FFFFFF', isDark: true, description: 'Sleek carbon dark canvas with maximum modern contrast.', group: 'deep' },
  { id: 'deep-plum', name: 'Dark Velvet Plum', shortName: 'Plum', hex: '#3B0764', textColor: '#FFFFFF', isDark: true, description: 'Deep enigmatic plum for psychological and true mystery breakdowns.', group: 'deep' },
  { id: 'deep-teal', name: 'Cyberpunk Dark Teal', shortName: 'Teal', hex: '#042F2E', textColor: '#FFFFFF', isDark: true, description: 'Moody dark ocean teal for cybersecurity and deep tech exposés.', group: 'deep' },
  { id: 'deep-burgundy', name: 'Dark Vintage Burgundy', shortName: 'Burgundy', hex: '#500724', textColor: '#FFFFFF', isDark: true, description: 'Regal dark wine burgundy for historical drama and high-stakes drama.', group: 'deep' },
  { id: 'deep-cocoa', name: 'Deep Cocoa Night', shortName: 'Cocoa', hex: '#29180E', textColor: '#FFFFFF', isDark: true, description: 'Rich dark chocolate background for evening study and calm essays.', group: 'deep' },
  { id: 'deep-petroleum', name: 'Petroleum Midnight', shortName: 'Petroleum', hex: '#0F2942', textColor: '#FFFFFF', isDark: true, description: 'Deep industrial dark petroleum blue for market and trade exposés.', group: 'deep' },
  { id: 'deep-charcoal', name: 'Gunmetal Charcoal', shortName: 'Charcoal', hex: '#1F2937', textColor: '#FFFFFF', isDark: true, description: 'Clean engineering gunmetal slate for technical tutorials.', group: 'deep' },
  { id: 'deep-pitch', name: 'Pure Pitch Black', shortName: 'Pitch', hex: '#000000', textColor: '#FFFFFF', isDark: true, description: 'Absolute true black (#000000) for OLED screens and extreme contrast.', group: 'deep' },
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

  // ── 2. MINIMAL / 12 CREATOR CORE COLORS (Solid & Studio Textures) ──
  {
    id: 'solid-black',
    name: 'Studio Obsidian Black',
    category: 'minimal',
    tag: 'Minimal',
    description: 'Pure high-contrast obsidian black (#070B14) with subtle circular falloff.',
    isDark: true,
    accentColor: '#64748B',
  },
  {
    id: 'solid-white',
    name: 'Crisp Studio White',
    category: 'minimal',
    tag: 'Subtle',
    description: 'Clean modern paper-white background for bright, high-retention explainers.',
    isDark: false,
    accentColor: '#0F172A',
  },
  {
    id: 'solid-orange',
    name: 'Flame Brand Orange',
    category: 'minimal',
    tag: 'Vibrant',
    description: 'High-energy signature flame orange for punchy marketing and growth videos.',
    isDark: true,
    accentColor: '#FF5722',
  },
  {
    id: 'solid-slate',
    name: 'Deep Midnight Slate',
    category: 'minimal',
    tag: 'Subtle',
    description: 'Calm corporate slate-900 surface for business, SaaS and tech analysis.',
    isDark: true,
    accentColor: '#94A3B8',
  },
  {
    id: 'solid-cream',
    name: 'Warm Vintage Cream',
    category: 'minimal',
    tag: 'Warm',
    description: 'Warm editorial cream page look favored by book summaries and essayists.',
    isDark: false,
    accentColor: '#1E293B',
  },
  {
    id: 'solid-emerald',
    name: 'Emerald Money Green',
    category: 'minimal',
    tag: 'Vibrant',
    description: 'Rich deep emerald for finance, investing, wealth and crypto topics.',
    isDark: true,
    accentColor: '#10B981',
  },
  {
    id: 'solid-navy',
    name: 'Royal Wall St Navy',
    category: 'minimal',
    tag: 'Dark',
    description: 'Authoritative deep navy for investigative journalism and historical breakdowns.',
    isDark: true,
    accentColor: '#38BDF8',
  },
  {
    id: 'solid-cyan',
    name: 'Cyber Electric Cyan',
    category: 'minimal',
    tag: 'Tech',
    description: 'Futuristic deep electric cyan for AI, software and futurism videos.',
    isDark: true,
    accentColor: '#06B6D4',
  },
  {
    id: 'solid-purple',
    name: 'Regal Royal Purple',
    category: 'minimal',
    tag: 'Cinema',
    description: 'Luxurious royal purple for psychology, philosophy and creative topics.',
    isDark: true,
    accentColor: '#8B5CF6',
  },
  {
    id: 'solid-crimson',
    name: 'Deep Warning Crimson',
    category: 'minimal',
    tag: 'Dark',
    description: 'Deep dramatic crimson for breaking news, true crime and urgent warnings.',
    isDark: true,
    accentColor: '#EF4444',
  },
  {
    id: 'solid-amber',
    name: 'Sunset Golden Amber',
    category: 'minimal',
    tag: 'Warm',
    description: 'Warm golden amber for motivational and historical storytelling.',
    isDark: true,
    accentColor: '#FFA000',
  },
  {
    id: 'solid-zinc',
    name: 'Studio Neutral Gray',
    category: 'minimal',
    tag: 'Minimal',
    description: 'Neutral matte studio dark gray that lets on-screen graphics shine.',
    isDark: true,
    accentColor: '#71717A',
  },
  {
    id: 'studio-dark',
    name: 'Studio Obsidian (Classic)',
    category: 'minimal',
    tag: 'Minimal',
    description: 'Pure high-contrast obsidian black (#070B14) with subtle circular falloff.',
    isDark: true,
    accentColor: '#64748B',
  },
  {
    id: 'deep-slate',
    name: 'Deep Slate (Classic)',
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
    name: 'Studio Pure Light (Classic)',
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
    id: 'decoding-grid',
    name: 'DecodingYT Dotted Grid',
    category: 'tech',
    tag: 'Tech',
    description: 'Signature dark halftone dotted grid with subtle Flame Orange center ambient spotlight.',
    isDark: true,
    accentColor: '#FF5722',
  },
  {
    id: 'youtube-dark',
    name: 'YouTube Studio Dark',
    category: 'tech',
    tag: 'Tech',
    description: 'Authentic YouTube Studio slate-950 canvas with emerald/cyan metric growth aura.',
    isDark: true,
    accentColor: '#10B981',
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

// ─────────────────────────────────────────────────────────────────────────────
// 8. ADAPTIVE SEMANTIC COLOR PALETTES (Every Background Has 6 Predefined Colors)
// ─────────────────────────────────────────────────────────────────────────────

export interface BackgroundColorPalette {
  id: string;
  name: string;
  bg: string;             // Canvas surface color or base gradient tone
  textPrimary: string;    // Main headlines & titles (100% contrast)
  textSecondary: string;  // Timestamps, subtitles, meta text, muted labels
  cardBg: string;         // Foreground cards, stat boxes, diagram nodes
  cardBorder: string;     // Border around cards (with appropriate opacity)
  accent: string;         // Primary action / key metric pop (Flame orange, cyan, gold)
  accentSecondary: string;// Secondary badge, tag, or progress bar fill
  highlightBg: string;    // Kinetic marker box behind key spoken words
  highlightText: string;  // Text color inside the kinetic marker box
  isDark: boolean;        // Whether the canvas is dark or light
}

export const DEFAULT_BACKGROUND_PALETTE: BackgroundColorPalette = {
  id: 'midnight-mesh',
  name: 'Studio Midnight Mesh',
  bg: '#070B14',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  cardBg: '#0E1526',
  cardBorder: 'rgba(255, 255, 255, 0.12)',
  accent: '#FF5722',
  accentSecondary: '#FFA000',
  highlightBg: '#FFE600',
  highlightText: '#070B14',
  isDark: true,
};

export const BACKGROUND_PALETTES: Record<string, BackgroundColorPalette> = {
  // 1. Crisp Studio White (Light Mode)
  'solid-white': {
    id: 'solid-white',
    name: 'Crisp Studio White',
    bg: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    cardBg: '#F8FAFC',
    cardBorder: 'rgba(15, 23, 42, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#2563EB',
    highlightBg: '#FFE600',
    highlightText: '#0F172A',
    isDark: false,
  },
  'studio-white': {
    id: 'studio-white',
    name: 'Crisp Studio White',
    bg: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    cardBg: '#F8FAFC',
    cardBorder: 'rgba(15, 23, 42, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#2563EB',
    highlightBg: '#FFE600',
    highlightText: '#0F172A',
    isDark: false,
  },

  // 2. Warm Vintage Cream (Light Mode)
  'solid-cream': {
    id: 'solid-cream',
    name: 'Warm Vintage Cream',
    bg: '#FAF8F5',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(30, 41, 59, 0.10)',
    accent: '#D97706',
    accentSecondary: '#0D9488',
    highlightBg: '#FDE68A',
    highlightText: '#1E293B',
    isDark: false,
  },

  // 3. Studio Obsidian Black (Dark Mode)
  'solid-black': {
    id: 'solid-black',
    name: 'Studio Obsidian Black',
    bg: '#070B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    cardBg: '#0E1526',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#FFA000',
    highlightBg: '#FFE600',
    highlightText: '#070B14',
    isDark: true,
  },
  'studio-dark': {
    id: 'studio-dark',
    name: 'Studio Obsidian Black',
    bg: '#070B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    cardBg: '#0E1526',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#FFA000',
    highlightBg: '#FFE600',
    highlightText: '#070B14',
    isDark: true,
  },

  // 4. Flame Brand Orange (Vibrant Warm Mode)
  'solid-orange': {
    id: 'solid-orange',
    name: 'Flame Brand Orange',
    bg: '#FF5722',
    textPrimary: '#FFFFFF',
    textSecondary: '#FFE4D6',
    cardBg: '#C2410C',
    cardBorder: 'rgba(255, 255, 255, 0.25)',
    accent: '#070B14',
    accentSecondary: '#FFD54F',
    highlightBg: '#070B14',
    highlightText: '#FFFFFF',
    isDark: true,
  },

  // 5. Deep Midnight Slate
  'solid-slate': {
    id: 'solid-slate',
    name: 'Deep Midnight Slate',
    bg: '#0F172A',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    cardBg: '#1E293B',
    cardBorder: 'rgba(255, 255, 255, 0.10)',
    accent: '#38BDF8',
    accentSecondary: '#FF5722',
    highlightBg: '#38BDF8',
    highlightText: '#070B14',
    isDark: true,
  },
  'deep-slate': {
    id: 'deep-slate',
    name: 'Deep Midnight Slate',
    bg: '#0F172A',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    cardBg: '#1E293B',
    cardBorder: 'rgba(255, 255, 255, 0.10)',
    accent: '#38BDF8',
    accentSecondary: '#FF5722',
    highlightBg: '#38BDF8',
    highlightText: '#070B14',
    isDark: true,
  },

  // 6. Emerald Money Green & Forest Calm
  'solid-emerald': {
    id: 'solid-emerald',
    name: 'Emerald Money Green',
    bg: '#064E3B',
    textPrimary: '#FFFFFF',
    textSecondary: '#A7F3D0',
    cardBg: '#022C22',
    cardBorder: 'rgba(52, 211, 153, 0.25)',
    accent: '#34D399',
    accentSecondary: '#FBBF24',
    highlightBg: '#34D399',
    highlightText: '#022C22',
    isDark: true,
  },
  'forest-calm': {
    id: 'forest-calm',
    name: 'Forest Calm',
    bg: '#064E3B',
    textPrimary: '#FFFFFF',
    textSecondary: '#A7F3D0',
    cardBg: '#022C22',
    cardBorder: 'rgba(52, 211, 153, 0.25)',
    accent: '#34D399',
    accentSecondary: '#FBBF24',
    highlightBg: '#34D399',
    highlightText: '#022C22',
    isDark: true,
  },

  // 7. Royal Wall St Navy & Deep Ocean
  'solid-navy': {
    id: 'solid-navy',
    name: 'Royal Wall St Navy',
    bg: '#0A192F',
    textPrimary: '#FFFFFF',
    textSecondary: '#8892B0',
    cardBg: '#112240',
    cardBorder: 'rgba(100, 255, 218, 0.20)',
    accent: '#64FFDA',
    accentSecondary: '#FF5722',
    highlightBg: '#64FFDA',
    highlightText: '#0A192F',
    isDark: true,
  },
  'deep-ocean': {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    bg: '#0A192F',
    textPrimary: '#FFFFFF',
    textSecondary: '#8892B0',
    cardBg: '#112240',
    cardBorder: 'rgba(100, 255, 218, 0.20)',
    accent: '#64FFDA',
    accentSecondary: '#FF5722',
    highlightBg: '#64FFDA',
    highlightText: '#0A192F',
    isDark: true,
  },

  // 8. Cyber Electric Cyan, Cyber Grid & Tech Blueprint
  'solid-cyan': {
    id: 'solid-cyan',
    name: 'Cyber Electric Cyan',
    bg: '#082F49',
    textPrimary: '#F0FDF4',
    textSecondary: '#7DD3FC',
    cardBg: '#0C4A6E',
    cardBorder: 'rgba(56, 189, 248, 0.25)',
    accent: '#38BDF8',
    accentSecondary: '#A855F7',
    highlightBg: '#38BDF8',
    highlightText: '#082F49',
    isDark: true,
  },
  'cyber-grid': {
    id: 'cyber-grid',
    name: 'Cyber Grid',
    bg: '#082F49',
    textPrimary: '#F0FDF4',
    textSecondary: '#7DD3FC',
    cardBg: '#0C4A6E',
    cardBorder: 'rgba(56, 189, 248, 0.25)',
    accent: '#38BDF8',
    accentSecondary: '#A855F7',
    highlightBg: '#38BDF8',
    highlightText: '#082F49',
    isDark: true,
  },
  'blueprint': {
    id: 'blueprint',
    name: 'Blueprint Grid',
    bg: '#082F49',
    textPrimary: '#F0FDF4',
    textSecondary: '#7DD3FC',
    cardBg: '#0C4A6E',
    cardBorder: 'rgba(56, 189, 248, 0.25)',
    accent: '#38BDF8',
    accentSecondary: '#A855F7',
    highlightBg: '#38BDF8',
    highlightText: '#082F49',
    isDark: true,
  },
  'circuit-board': {
    id: 'circuit-board',
    name: 'Circuit Board',
    bg: '#082F49',
    textPrimary: '#F0FDF4',
    textSecondary: '#7DD3FC',
    cardBg: '#0C4A6E',
    cardBorder: 'rgba(56, 189, 248, 0.25)',
    accent: '#38BDF8',
    accentSecondary: '#A855F7',
    highlightBg: '#38BDF8',
    highlightText: '#082F49',
    isDark: true,
  },
  'hud-matrix': {
    id: 'hud-matrix',
    name: 'HUD Matrix',
    bg: '#070B14',
    textPrimary: '#22C55E',
    textSecondary: '#86EFAC',
    cardBg: '#052E16',
    cardBorder: 'rgba(34, 197, 94, 0.25)',
    accent: '#22C55E',
    accentSecondary: '#4ADE80',
    highlightBg: '#22C55E',
    highlightText: '#052E16',
    isDark: true,
  },

  // 9. Regal Royal Purple & Neon Twilight
  'solid-purple': {
    id: 'solid-purple',
    name: 'Regal Royal Purple',
    bg: '#2E1065',
    textPrimary: '#FFFFFF',
    textSecondary: '#DDD6FE',
    cardBg: '#3B0764',
    cardBorder: 'rgba(192, 132, 252, 0.25)',
    accent: '#C084FC',
    accentSecondary: '#FF5722',
    highlightBg: '#C084FC',
    highlightText: '#2E1065',
    isDark: true,
  },
  'neon-twilight': {
    id: 'neon-twilight',
    name: 'Neon Twilight',
    bg: '#2E1065',
    textPrimary: '#FFFFFF',
    textSecondary: '#DDD6FE',
    cardBg: '#3B0764',
    cardBorder: 'rgba(192, 132, 252, 0.25)',
    accent: '#C084FC',
    accentSecondary: '#FF5722',
    highlightBg: '#C084FC',
    highlightText: '#2E1065',
    isDark: true,
  },

  // 10. Deep Warning Crimson
  'solid-crimson': {
    id: 'solid-crimson',
    name: 'Deep Warning Crimson',
    bg: '#450A0A',
    textPrimary: '#FFFFFF',
    textSecondary: '#FECACA',
    cardBg: '#2F0505',
    cardBorder: 'rgba(248, 113, 113, 0.25)',
    accent: '#F87171',
    accentSecondary: '#FBBF24',
    highlightBg: '#EF4444',
    highlightText: '#FFFFFF',
    isDark: true,
  },

  // 11. Sunset Golden Amber & Desert Dune
  'solid-amber': {
    id: 'solid-amber',
    name: 'Sunset Golden Amber',
    bg: '#78350F',
    textPrimary: '#FFFFFF',
    textSecondary: '#FDE68A',
    cardBg: '#451A03',
    cardBorder: 'rgba(251, 191, 36, 0.25)',
    accent: '#FBBF24',
    accentSecondary: '#FF5722',
    highlightBg: '#FBBF24',
    highlightText: '#451A03',
    isDark: true,
  },
  'sunset-horizon': {
    id: 'sunset-horizon',
    name: 'Sunset Horizon',
    bg: '#78350F',
    textPrimary: '#FFFFFF',
    textSecondary: '#FDE68A',
    cardBg: '#451A03',
    cardBorder: 'rgba(251, 191, 36, 0.25)',
    accent: '#FFA000',
    accentSecondary: '#FF5722',
    highlightBg: '#FFA000',
    highlightText: '#451A03',
    isDark: true,
  },
  'desert-dune': {
    id: 'desert-dune',
    name: 'Desert Dune',
    bg: '#78350F',
    textPrimary: '#FFFFFF',
    textSecondary: '#FDE68A',
    cardBg: '#451A03',
    cardBorder: 'rgba(251, 191, 36, 0.25)',
    accent: '#FBBF24',
    accentSecondary: '#FF5722',
    highlightBg: '#FBBF24',
    highlightText: '#451A03',
    isDark: true,
  },

  // 12. Studio Neutral Gray, Dark Paper & Film Grain
  'solid-zinc': {
    id: 'solid-zinc',
    name: 'Studio Neutral Gray',
    bg: '#18181B',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    cardBg: '#27272A',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#06B6D4',
    highlightBg: '#FFE600',
    highlightText: '#18181B',
    isDark: true,
  },
  'dark-paper': {
    id: 'dark-paper',
    name: 'Editorial Texture',
    bg: '#18181B',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    cardBg: '#27272A',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#06B6D4',
    highlightBg: '#FFE600',
    highlightText: '#18181B',
    isDark: true,
  },
  'film-grain': {
    id: 'film-grain',
    name: 'Film Grain Vintage',
    bg: '#18181B',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    cardBg: '#27272A',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#06B6D4',
    highlightBg: '#FFE600',
    highlightText: '#18181B',
    isDark: true,
  },

  // 13. Aurora Borealis
  'aurora-borealis': {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    bg: '#020B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#6EE7B7',
    cardBg: '#06202A',
    cardBorder: 'rgba(16, 185, 129, 0.25)',
    accent: '#10B981',
    accentSecondary: '#06B6D4',
    highlightBg: '#10B981',
    highlightText: '#020B14',
    isDark: true,
  },

  // 14. Cinematic Fog & Anamorphic Streak
  'cinematic-fog': {
    id: 'cinematic-fog',
    name: 'Cinematic Fog',
    bg: '#070B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    cardBg: '#0E1526',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#FF5722',
    accentSecondary: '#FFA000',
    highlightBg: '#FFE600',
    highlightText: '#070B14',
    isDark: true,
  },
  'anamorphic-streak': {
    id: 'anamorphic-streak',
    name: 'Anamorphic Streak',
    bg: '#070B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    cardBg: '#0E1526',
    cardBorder: 'rgba(56, 189, 248, 0.20)',
    accent: '#38BDF8',
    accentSecondary: '#FF5722',
    highlightBg: '#38BDF8',
    highlightText: '#070B14',
    isDark: true,
  },

  // 15. Mountain Dusk
  'mountain-dusk': {
    id: 'mountain-dusk',
    name: 'Mountain Dusk',
    bg: '#111827',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    cardBg: '#1F2937',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#F59E0B',
    accentSecondary: '#EC4899',
    highlightBg: '#F59E0B',
    highlightText: '#111827',
    isDark: true,
  },

  // 16. Particle Styles
  'floating-dots': {
    id: 'floating-dots',
    name: 'Amber Embers',
    bg: '#0A0503',
    textPrimary: '#FFFFFF',
    textSecondary: '#FED7AA',
    cardBg: '#1C0D08',
    cardBorder: 'rgba(255, 87, 34, 0.25)',
    accent: '#FF5722',
    accentSecondary: '#FFA000',
    highlightBg: '#FFA000',
    highlightText: '#0A0503',
    isDark: true,
  },
  'bokeh-orbs': {
    id: 'bokeh-orbs',
    name: 'Golden Bokeh',
    bg: '#0A0802',
    textPrimary: '#FFFFFF',
    textSecondary: '#FEF08A',
    cardBg: '#1C1504',
    cardBorder: 'rgba(245, 158, 11, 0.25)',
    accent: '#F59E0B',
    accentSecondary: '#FFA000',
    highlightBg: '#F59E0B',
    highlightText: '#0A0802',
    isDark: true,
  },
  'starry-cosmos': {
    id: 'starry-cosmos',
    name: 'Starry Cosmos',
    bg: '#030712',
    textPrimary: '#FFFFFF',
    textSecondary: '#C7D2FE',
    cardBg: '#0B0F2A',
    cardBorder: 'rgba(129, 140, 248, 0.25)',
    accent: '#818CF8',
    accentSecondary: '#C084FC',
    highlightBg: '#818CF8',
    highlightText: '#030712',
    isDark: true,
  },
  'cyber-sparks': {
    id: 'cyber-sparks',
    name: 'Cyber Sparks',
    bg: '#050B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#7DD3FC',
    cardBg: '#0B1728',
    cardBorder: 'rgba(6, 182, 212, 0.25)',
    accent: '#06B6D4',
    accentSecondary: '#FF5722',
    highlightBg: '#06B6D4',
    highlightText: '#050B14',
    isDark: true,
  },

  // 17. Custom Upload
  'custom-upload': {
    id: 'custom-upload',
    name: 'Custom Backdrop',
    bg: '#070B14',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    cardBg: 'rgba(14, 21, 38, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    accent: '#FF5722',
    accentSecondary: '#FFA000',
    highlightBg: '#FFE600',
    highlightText: '#070B14',
    isDark: true,
  },
};

function parseHexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let c = hex.replace(/^#/, '').replace(/^hex-/, '').trim();
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  if (c.length !== 6) return null;
  const num = parseInt(c, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

/**
 * Returns the exact matching color tokens for any background theme ID or custom hex code.
 * Supports all 44 Canva-style presets plus arbitrary custom hex colors dynamically.
 */
export function getBackgroundPalette(themeId?: string): BackgroundColorPalette {
  if (!themeId) return DEFAULT_BACKGROUND_PALETTE;
  const key = themeId.toLowerCase().trim();

  // 1. Explicit entry in predefined catalog
  if (BACKGROUND_PALETTES[key]) {
    return BACKGROUND_PALETTES[key];
  }

  // 2. Check 44 Canva Creator Core Colors
  const coreMatch = CREATOR_CORE_COLORS.find((c) => c.id === key);
  if (coreMatch) {
    return {
      id: coreMatch.id,
      name: coreMatch.name,
      bg: coreMatch.hex,
      textPrimary: coreMatch.textColor,
      textSecondary: coreMatch.isDark ? '#94A3B8' : '#475569',
      cardBg: coreMatch.isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
      cardBorder: coreMatch.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)',
      accent: '#FF5722',
      accentSecondary: coreMatch.isDark ? '#38BDF8' : '#2563EB',
      highlightBg: '#FFE600',
      highlightText: '#0F172A',
      isDark: coreMatch.isDark,
    };
  }

  // 3. Dynamic Hex Color Resolver (like Canva custom color picker)
  const rgb = parseHexToRgb(key);
  if (rgb) {
    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    const isLight = luminance > 160;
    const hex = '#' + key.replace(/^#/, '').replace(/^hex-/, '');
    return {
      id: key,
      name: `Custom Hex (${hex})`,
      bg: hex,
      textPrimary: isLight ? '#0F172A' : '#FFFFFF',
      textSecondary: isLight ? '#475569' : '#94A3B8',
      cardBg: isLight ? '#FFFFFF' : 'rgba(15, 23, 42, 0.88)',
      cardBorder: isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.15)',
      accent: '#FF5722',
      accentSecondary: isLight ? '#2563EB' : '#38BDF8',
      highlightBg: '#FFE600',
      highlightText: '#0F172A',
      isDark: !isLight,
    };
  }

  return DEFAULT_BACKGROUND_PALETTE;
}
