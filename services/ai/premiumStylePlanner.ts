import type {ReelTemplateName} from './reelPlanner';

export type PremiumStyleId =
  | 'finance-corporate'
  | 'education-clean'
  | 'creator-energetic'
  | 'luxury-premium'
  | 'news-documentary'
  | 'tech-product';

export type PremiumMotionPreset =
  | 'corporate-smooth'
  | 'education-marker'
  | 'creator-pop'
  | 'luxury-cinematic'
  | 'news-editorial'
  | 'tech-ui';

export type PremiumSoundCueType =
  | 'soft-click'
  | 'soft-pop'
  | 'whoosh'
  | 'swipe'
  | 'ding'
  | 'cash'
  | 'typing'
  | 'paper'
  | 'warning'
  | 'rise';

export type PremiumStyleLock = {
  styleId: PremiumStyleId;
  label: string;
  palette: string[];
  fontFamily: string;
  captionStyle: string;
  iconStyle: 'line' | 'solid' | 'editorial' | 'minimal';
  stickerPack: 'corporate' | 'teacher' | 'creator' | 'documentary';
  backgroundPack: 'office' | 'paper' | 'media-blur' | 'dark-editorial' | 'premium-minimal';
  motionPreset: PremiumMotionPreset;
  transitionPreset: 'soft-slide' | 'marker-reveal' | 'snap-pop' | 'slow-fade' | 'editorial-cut' | 'ui-scan';
  soundPack: 'finance-office' | 'education-paper' | 'creator-ui' | 'luxury-soft' | 'news-room' | 'tech-ui';
  colorGrade: {
    name: 'cool-trust' | 'clean-paper' | 'creator-contrast' | 'premium-warm' | 'editorial-cool' | 'tech-cyan';
    filter: string;
    overlayColor: string;
    overlayOpacity: number;
    grainOpacity: number;
    vignetteOpacity: number;
  };
  camera: {
    kenBurnsIntensity: number;
    shakeIntensity: number;
    motionBlur: number;
  };
  depth: {
    shadow: string;
    foregroundOpacity: number;
    backgroundBlur: number;
  };
  pacing: {
    changeEverySeconds: number;
    breathSeconds: number;
    patternInterruptEverySeconds: number;
    patternInterruptIntensity: number;
  };
  audioMix: {
    ducking: boolean;
    duckToVolume: number;
    spatialPan: boolean;
    duckAttackMs: number;
    duckReleaseMs: number;
  };
  energyCurve: {
    hook: number;
    body: number;
    close: number;
  };
  attentionGuide: {
    safeZone: 'center' | 'thirds' | 'lower-third';
    keywordHighlight: boolean;
  };
  ambience?: {
    type: 'office' | 'paper' | 'newsroom' | 'tech';
    src: string;
    volume: number;
  };
};

export type PremiumSoundCue = {
  time: number;
  type: PremiumSoundCueType;
  volume: number;
  durationSeconds?: number;
  ducking?: boolean;
  pan?: -1 | -0.5 | 0 | 0.5 | 1;
};

type PremiumStyleInput = {
  transcript?: string;
  topicTitle?: string;
  templateName?: ReelTemplateName;
  mode?: string;
};

type TimedText = {
  start?: number;
  end?: number;
  text?: string;
  type?: string;
};

const SFX_PATHS: Record<PremiumSoundCueType, string> = {
  'soft-click': 'assets/reusable/sound-effects/soft-click.wav',
  'soft-pop': 'assets/reusable/sound-effects/pop-soft.wav',
  whoosh: 'assets/reusable/sound-effects/whoosh-short.wav',
  swipe: 'assets/reusable/sound-effects/swipe-right.wav',
  ding: 'assets/reusable/sound-effects/bell-ding.wav',
  cash: 'assets/reusable/sound-effects/cash-count.wav',
  typing: 'assets/reusable/sound-effects/typing-fast.wav',
  paper: 'assets/reusable/sound-effects/paper-turn.wav',
  warning: 'assets/reusable/sound-effects/warning-beep.wav',
  rise: 'assets/reusable/sound-effects/rise-sweep.wav',
};

export const PREMIUM_SFX_PATHS = SFX_PATHS;

export function createPremiumStyleLock(input: PremiumStyleInput): PremiumStyleLock {
  const text = normalizeText([input.topicTitle, input.transcript, input.templateName, input.mode].filter(Boolean).join(' '));
  const styleId = detectStyleId(text, input.templateName);
  return STYLE_LOCKS[styleId];
}

export function createPremiumSoundCues({
  styleLock,
  timeline = [],
  captions = [],
  durationSeconds,
  templateName,
}: {
  styleLock: PremiumStyleLock;
  timeline?: TimedText[];
  captions?: TimedText[];
  durationSeconds: number;
  templateName?: ReelTemplateName;
}): PremiumSoundCue[] {
  if (templateName === 'AUTO_CAPTION_REEL') return [];

  const source = timeline.length ? timeline : captions;
  const cues: PremiumSoundCue[] = [];
  const maxCues = 18;
  const patternCueReserve = durationSeconds > 12 ? Math.min(4, Math.floor(durationSeconds / Math.max(4.5, styleLock.pacing.patternInterruptEverySeconds || 6))) : 1;
  const sourceCueLimit = Math.max(5, maxCues - patternCueReserve - 1);

  for (let index = 0; index < source.length && cues.length < sourceCueLimit; index++) {
    const item = source[index];
    const start = roundTime(Number(item.start ?? 0));
    if (!Number.isFinite(start) || start < 0 || start > durationSeconds - 0.08) continue;
    if (cues.some((cue) => Math.abs(cue.time - start) < 0.38)) continue;

    cues.push({
      time: start,
      type: cueTypeForText(item.text || '', item.type || '', styleLock),
      volume: cueVolume(styleLock, index),
      ducking: styleLock.audioMix.ducking,
      pan: cuePanForText(item.text || '', index),
    });
  }

  addPatternInterruptCues({cues, styleLock, durationSeconds, maxCues});

  if (durationSeconds > 4 && cues.length < maxCues) {
    cues.push({
      time: roundTime(Math.max(0, durationSeconds - 0.55)),
      type: styleLock.styleId === 'finance-corporate' ? 'ding' : 'rise',
      volume: styleLock.styleId === 'creator-energetic' ? 0.16 : 0.11,
      ducking: styleLock.audioMix.ducking,
      pan: 0,
    });
  }

  return cues;
}

export function soundCueSrc(type: PremiumSoundCueType) {
  return SFX_PATHS[type] || SFX_PATHS['soft-click'];
}

function detectStyleId(text: string, templateName?: ReelTemplateName): PremiumStyleId {
  if (templateName === 'LONG_VIDEO_PROMO') return 'luxury-premium';

  if (/\b(rbi|sbi|bank|loan|credit|debit|card|atm|upi|money|finance|invest|stock|market|gold|price|tax|income|rupee|rs|₹)\b/i.test(text)) {
    return 'finance-corporate';
  }
  if (/\b(breaking|news|minister|court|policy|election|government|official|latest|update|case|report)\b/i.test(text)) {
    return 'news-documentary';
  }
  if (/\b(ai|app|software|website|tech|startup|saas|product|coding|data|device|phone|launch)\b/i.test(text)) {
    return 'tech-product';
  }
  if (/\b(luxury|premium|brand|jewellery|jewelry|gold|watch|fashion|wedding|real estate|property)\b/i.test(text)) {
    return 'luxury-premium';
  }
  if (/\b(learn|explain|study|exam|class|lesson|student|teacher|steps|tutorial|guide|kaise|samjho)\b/i.test(text)) {
    return 'education-clean';
  }
  return 'creator-energetic';
}

function cueTypeForText(text: string, kind: string, styleLock: PremiumStyleLock): PremiumSoundCueType {
  const source = normalizeText(`${kind} ${text}`);
  if (/\b(warning|risk|danger|mistake|problem|alert|avoid|nahi|nahin)\b/i.test(source)) return 'warning';
  if (/\b(cash|money|bank|loan|credit|debit|price|gold|rupee|rs|₹|profit|payment)\b/i.test(source)) return 'cash';
  if (/\b(type|write|note|document|paper|form|signature|page|lesson|study)\b/i.test(source)) {
    return styleLock.styleId === 'education-clean' ? 'paper' : 'typing';
  }
  if (/\b(chart|growth|increase|rise|stat|number|percent|%)\b/i.test(source)) return 'rise';
  if (/\b(success|done|complete|answer|conclusion|winner|best)\b/i.test(source)) return 'ding';

  if (styleLock.motionPreset === 'creator-pop') return 'soft-pop';
  if (styleLock.motionPreset === 'education-marker') return 'paper';
  if (styleLock.motionPreset === 'tech-ui') return 'soft-click';
  if (styleLock.motionPreset === 'luxury-cinematic') return 'whoosh';
  return 'swipe';
}

function cueVolume(styleLock: PremiumStyleLock, index: number) {
  const base = styleLock.styleId === 'creator-energetic' ? 0.14 : styleLock.styleId === 'luxury-premium' ? 0.09 : 0.11;
  return Math.max(0.06, Math.min(0.18, base - (index % 3) * 0.012));
}

function cuePanForText(text: string, index: number): PremiumSoundCue['pan'] {
  if (/\b(left|option a|first|pehla|lhs)\b/i.test(text)) return -0.5;
  if (/\b(right|option b|second|dusra|rhs)\b/i.test(text)) return 0.5;
  return index % 4 === 1 ? -0.5 : index % 4 === 3 ? 0.5 : 0;
}

function addPatternInterruptCues({
  cues,
  styleLock,
  durationSeconds,
  maxCues,
}: {
  cues: PremiumSoundCue[];
  styleLock: PremiumStyleLock;
  durationSeconds: number;
  maxCues: number;
}) {
  const every = Math.max(4.5, Math.min(8, Number(styleLock.pacing.patternInterruptEverySeconds) || 6));
  for (let time = every; time < durationSeconds - 0.7 && cues.length < maxCues; time += every) {
    const rounded = roundTime(time);
    if (cues.some((cue) => Math.abs(cue.time - rounded) < 0.55)) continue;
    cues.push({
      time: rounded,
      type: styleLock.motionPreset === 'luxury-cinematic' ? 'whoosh' : styleLock.motionPreset === 'education-marker' ? 'paper' : 'soft-pop',
      volume: Math.max(0.055, Math.min(0.13, 0.08 + styleLock.pacing.patternInterruptIntensity * 0.04)),
      durationSeconds: 0.72,
      ducking: styleLock.audioMix.ducking,
      pan: 0,
    });
  }
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function roundTime(value: number) {
  return Math.round(value * 100) / 100;
}

const STYLE_LOCKS: Record<PremiumStyleId, PremiumStyleLock> = {
  'finance-corporate': {
    styleId: 'finance-corporate',
    label: 'Finance Corporate',
    palette: ['#0B1F3A', '#2563EB', '#06B6D4', '#F8FAFC'],
    fontFamily: 'Inter, system-ui, sans-serif',
    captionStyle: 'Studio Clean',
    iconStyle: 'line',
    stickerPack: 'corporate',
    backgroundPack: 'office',
    motionPreset: 'corporate-smooth',
    transitionPreset: 'soft-slide',
    soundPack: 'finance-office',
    colorGrade: {
      name: 'cool-trust',
      filter: 'contrast(1.06) saturate(0.92) brightness(0.98)',
      overlayColor: '#0B1F3A',
      overlayOpacity: 0.13,
      grainOpacity: 0.045,
      vignetteOpacity: 0.22,
    },
    camera: {kenBurnsIntensity: 0.018, shakeIntensity: 0, motionBlur: 0.2},
    depth: {shadow: '0 28px 80px rgba(2,8,23,0.32)', foregroundOpacity: 0.08, backgroundBlur: 18},
    pacing: {changeEverySeconds: 3, breathSeconds: 0.22, patternInterruptEverySeconds: 6.4, patternInterruptIntensity: 0.5},
    audioMix: {ducking: true, duckToVolume: 0.72, spatialPan: true, duckAttackMs: 5, duckReleaseMs: 200},
    energyCurve: {hook: 0.78, body: 0.48, close: 0.82},
    attentionGuide: {safeZone: 'thirds', keywordHighlight: true},
    ambience: {type: 'office', src: 'assets/reusable/sound-effects/office-ambience.wav', volume: 0.025},
  },
  'education-clean': {
    styleId: 'education-clean',
    label: 'Education Clean',
    palette: ['#F8FAFC', '#111827', '#2563EB', '#F59E0B'],
    fontFamily: 'Inter, system-ui, sans-serif',
    captionStyle: 'Reels Clean',
    iconStyle: 'minimal',
    stickerPack: 'teacher',
    backgroundPack: 'paper',
    motionPreset: 'education-marker',
    transitionPreset: 'marker-reveal',
    soundPack: 'education-paper',
    colorGrade: {
      name: 'clean-paper',
      filter: 'contrast(1.03) saturate(0.96) brightness(1.02)',
      overlayColor: '#F8FAFC',
      overlayOpacity: 0.04,
      grainOpacity: 0.035,
      vignetteOpacity: 0.08,
    },
    camera: {kenBurnsIntensity: 0.01, shakeIntensity: 0, motionBlur: 0.15},
    depth: {shadow: '0 20px 70px rgba(15,23,42,0.18)', foregroundOpacity: 0.05, backgroundBlur: 10},
    pacing: {changeEverySeconds: 3, breathSeconds: 0.35, patternInterruptEverySeconds: 7, patternInterruptIntensity: 0.36},
    audioMix: {ducking: true, duckToVolume: 0.7, spatialPan: false, duckAttackMs: 5, duckReleaseMs: 220},
    energyCurve: {hook: 0.64, body: 0.42, close: 0.7},
    attentionGuide: {safeZone: 'center', keywordHighlight: true},
  },
  'creator-energetic': {
    styleId: 'creator-energetic',
    label: 'Creator Energetic',
    palette: ['#0F172A', '#7DD3FC', '#FACC15', '#FFFFFF'],
    fontFamily: 'Inter, system-ui, sans-serif',
    captionStyle: 'Bold Highlight Strip',
    iconStyle: 'solid',
    stickerPack: 'creator',
    backgroundPack: 'media-blur',
    motionPreset: 'creator-pop',
    transitionPreset: 'snap-pop',
    soundPack: 'creator-ui',
    colorGrade: {
      name: 'creator-contrast',
      filter: 'contrast(1.1) saturate(1.08) brightness(0.99)',
      overlayColor: '#0F172A',
      overlayOpacity: 0.08,
      grainOpacity: 0.035,
      vignetteOpacity: 0.2,
    },
    camera: {kenBurnsIntensity: 0.026, shakeIntensity: 0.15, motionBlur: 0.35},
    depth: {shadow: '0 30px 90px rgba(0,0,0,0.38)', foregroundOpacity: 0.07, backgroundBlur: 16},
    pacing: {changeEverySeconds: 2.6, breathSeconds: 0.16, patternInterruptEverySeconds: 5.2, patternInterruptIntensity: 0.78},
    audioMix: {ducking: true, duckToVolume: 0.76, spatialPan: false, duckAttackMs: 5, duckReleaseMs: 180},
    energyCurve: {hook: 0.92, body: 0.62, close: 0.95},
    attentionGuide: {safeZone: 'center', keywordHighlight: true},
  },
  'luxury-premium': {
    styleId: 'luxury-premium',
    label: 'Luxury Premium',
    palette: ['#0F172A', '#F8FAFC', '#C8A45D', '#CBD5E1'],
    fontFamily: 'Inter, system-ui, sans-serif',
    captionStyle: 'Cinematic',
    iconStyle: 'minimal',
    stickerPack: 'documentary',
    backgroundPack: 'premium-minimal',
    motionPreset: 'luxury-cinematic',
    transitionPreset: 'slow-fade',
    soundPack: 'luxury-soft',
    colorGrade: {
      name: 'premium-warm',
      filter: 'contrast(1.08) saturate(0.9) sepia(0.08) brightness(0.96)',
      overlayColor: '#C8A45D',
      overlayOpacity: 0.06,
      grainOpacity: 0.055,
      vignetteOpacity: 0.28,
    },
    camera: {kenBurnsIntensity: 0.016, shakeIntensity: 0, motionBlur: 0.25},
    depth: {shadow: '0 34px 110px rgba(0,0,0,0.45)', foregroundOpacity: 0.09, backgroundBlur: 22},
    pacing: {changeEverySeconds: 3.4, breathSeconds: 0.4, patternInterruptEverySeconds: 6.8, patternInterruptIntensity: 0.42},
    audioMix: {ducking: true, duckToVolume: 0.68, spatialPan: true, duckAttackMs: 5, duckReleaseMs: 260},
    energyCurve: {hook: 0.7, body: 0.38, close: 0.74},
    attentionGuide: {safeZone: 'thirds', keywordHighlight: false},
  },
  'news-documentary': {
    styleId: 'news-documentary',
    label: 'News Documentary',
    palette: ['#111827', '#DC2626', '#F8FAFC', '#94A3B8'],
    fontFamily: 'Inter, system-ui, sans-serif',
    captionStyle: 'Cinematic',
    iconStyle: 'editorial',
    stickerPack: 'documentary',
    backgroundPack: 'dark-editorial',
    motionPreset: 'news-editorial',
    transitionPreset: 'editorial-cut',
    soundPack: 'news-room',
    colorGrade: {
      name: 'editorial-cool',
      filter: 'contrast(1.12) saturate(0.88) brightness(0.95)',
      overlayColor: '#111827',
      overlayOpacity: 0.16,
      grainOpacity: 0.05,
      vignetteOpacity: 0.3,
    },
    camera: {kenBurnsIntensity: 0.012, shakeIntensity: 0.08, motionBlur: 0.25},
    depth: {shadow: '0 24px 80px rgba(0,0,0,0.4)', foregroundOpacity: 0.08, backgroundBlur: 18},
    pacing: {changeEverySeconds: 2.8, breathSeconds: 0.2, patternInterruptEverySeconds: 5.8, patternInterruptIntensity: 0.6},
    audioMix: {ducking: true, duckToVolume: 0.7, spatialPan: true, duckAttackMs: 5, duckReleaseMs: 190},
    energyCurve: {hook: 0.86, body: 0.56, close: 0.82},
    attentionGuide: {safeZone: 'lower-third', keywordHighlight: true},
  },
  'tech-product': {
    styleId: 'tech-product',
    label: 'Tech Product',
    palette: ['#07111F', '#06B6D4', '#2563EB', '#F8FAFC'],
    fontFamily: 'Inter, system-ui, sans-serif',
    captionStyle: 'Hacker Type',
    iconStyle: 'line',
    stickerPack: 'corporate',
    backgroundPack: 'dark-editorial',
    motionPreset: 'tech-ui',
    transitionPreset: 'ui-scan',
    soundPack: 'tech-ui',
    colorGrade: {
      name: 'tech-cyan',
      filter: 'contrast(1.08) saturate(1.02) brightness(0.96)',
      overlayColor: '#06B6D4',
      overlayOpacity: 0.07,
      grainOpacity: 0.035,
      vignetteOpacity: 0.24,
    },
    camera: {kenBurnsIntensity: 0.018, shakeIntensity: 0.05, motionBlur: 0.3},
    depth: {shadow: '0 28px 90px rgba(6,182,212,0.2)', foregroundOpacity: 0.07, backgroundBlur: 20},
    pacing: {changeEverySeconds: 2.8, breathSeconds: 0.18, patternInterruptEverySeconds: 5.6, patternInterruptIntensity: 0.66},
    audioMix: {ducking: true, duckToVolume: 0.74, spatialPan: true, duckAttackMs: 5, duckReleaseMs: 190},
    energyCurve: {hook: 0.84, body: 0.58, close: 0.88},
    attentionGuide: {safeZone: 'center', keywordHighlight: true},
  },
};
