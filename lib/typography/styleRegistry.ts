import type { TypographyStyleId, AdvancedStyleBlueprint } from './types';

import bpDynamicPunch from './blueprints/dynamic-punch.json';
import bpDepth3DText from './blueprints/depth-3d-text.json';
import bpDubaiGold from './blueprints/dubai-gold.json';
import bpNeonKinetic from './blueprints/neon-kinetic.json';
import bpPrismPro from './blueprints/prism-pro.json';
import bpPaperII from './blueprints/paper-ii.json';
import bpElevateScript from './blueprints/elevate-script.json';
import bpPlatinumPenthouse from './blueprints/platinum-penthouse.json';
import bpRoyalEmerald from './blueprints/royal-emerald.json';
import bpSilverChrome from './blueprints/silver-chrome.json';

export const ADVANCED_STYLE_BLUEPRINTS: Record<string, AdvancedStyleBlueprint> = {
  'dynamic-punch': bpDynamicPunch as unknown as AdvancedStyleBlueprint,
  'depth-3d-text': bpDepth3DText as unknown as AdvancedStyleBlueprint,
  'dubai-gold': bpDubaiGold as unknown as AdvancedStyleBlueprint,
  'neon-kinetic': bpNeonKinetic as unknown as AdvancedStyleBlueprint,
  'prism-pro': bpPrismPro as unknown as AdvancedStyleBlueprint,
  'paper-ii': bpPaperII as unknown as AdvancedStyleBlueprint,
  'elevate-script': bpElevateScript as unknown as AdvancedStyleBlueprint,
  'platinum-penthouse': bpPlatinumPenthouse as unknown as AdvancedStyleBlueprint,
  'royal-emerald': bpRoyalEmerald as unknown as AdvancedStyleBlueprint,
  'silver-chrome': bpSilverChrome as unknown as AdvancedStyleBlueprint,
};

// Legacy compatibility interface
export type StyleBlueprint = {
  id: TypographyStyleId;
  name: string;
  fontFamily: string;
  heroFontWeight: number;
  leadFontWeight: number;
  textColor: string;
  accentColor: string;
  secondaryAccentColor: string;
  maxWordsPerChunk: number;
  kenBurnsIntensity: number;
  colorGrade: {
    name: string;
    filter: string;
  };
  animationPreset: string;
  animation: {
    mass: number;
    damping: number;
    stiffness: number;
    scaleEntrance: [number, number];
    blurEntrance: [number, number];
    opacityEntrance?: [number, number];
    [key: string]: any;
  };
  [key: string]: any;
};

export const STYLE_BLUEPRINTS: Record<string, StyleBlueprint> = {
  'dynamic-punch': {
    id: 'dynamic-punch',
    name: 'Dynamic Punch',
    fontFamily: 'Montserrat',
    heroFontWeight: 900,
    leadFontWeight: 800,
    textColor: '#FFFFFF',
    accentColor: '#38BDF8',
    secondaryAccentColor: '#FDE047',
    maxWordsPerChunk: 3,
    kenBurnsIntensity: 0.04,
    colorGrade: { name: 'High Contrast Vibrant', filter: 'contrast(1.15) saturate(1.2)' },
    animationPreset: 'slam',
    animation: {
      mass: 0.35,
      damping: 12,
      stiffness: 220,
      scaleEntrance: [0.68, 1.0],
      blurEntrance: [6, 0],
    },
  },
  'depth-3d-text': {
    id: 'depth-3d-text',
    name: '3D Depth & Pill',
    fontFamily: 'Plus Jakarta Sans',
    heroFontWeight: 900,
    leadFontWeight: 700,
    textColor: '#FFFFFF',
    accentColor: '#FACC15',
    secondaryAccentColor: '#38BDF8',
    maxWordsPerChunk: 3,
    kenBurnsIntensity: 0.03,
    colorGrade: { name: 'Modern Crisp', filter: 'contrast(1.08) saturate(1.1)' },
    animationPreset: 'pop',
    animation: {
      mass: 0.45,
      damping: 14,
      stiffness: 190,
      scaleEntrance: [0.85, 1.0],
      blurEntrance: [4, 0],
    },
  },
  'dubai-gold': {
    id: 'dubai-gold',
    name: 'Dubai 24k Gold',
    fontFamily: 'Cinzel',
    heroFontWeight: 900,
    leadFontWeight: 600,
    textColor: '#FFFFFF',
    accentColor: '#EAB308',
    secondaryAccentColor: '#CA8A04',
    maxWordsPerChunk: 3,
    kenBurnsIntensity: 0.02,
    colorGrade: { name: 'Warm Golden Luxury', filter: 'contrast(1.1) brightness(1.04) sepia(0.08)' },
    animationPreset: 'scale-snap',
    animation: {
      mass: 0.45,
      damping: 14,
      stiffness: 180,
      scaleEntrance: [0.9, 1.0],
      blurEntrance: [4, 0],
    },
  },
  'neon-kinetic': {
    id: 'neon-kinetic',
    name: 'Neon Cyber Motion',
    fontFamily: 'Syne',
    heroFontWeight: 900,
    leadFontWeight: 800,
    textColor: '#FFFFFF',
    accentColor: '#22D3EE',
    secondaryAccentColor: '#F43F5E',
    maxWordsPerChunk: 2,
    kenBurnsIntensity: 0.05,
    colorGrade: { name: 'Cyber Neon Glow', filter: 'contrast(1.2) saturate(1.3)' },
    animationPreset: 'slam',
    animation: {
      mass: 0.35,
      damping: 11,
      stiffness: 240,
      scaleEntrance: [0.75, 1.0],
      blurEntrance: [8, 0],
    },
  },
  'prism-pro': {
    id: 'prism-pro',
    name: 'Prism Pro',
    fontFamily: 'Plus Jakarta Sans',
    heroFontWeight: 800,
    leadFontWeight: 700,
    textColor: '#F8FAFC',
    accentColor: '#38BDF8',
    secondaryAccentColor: '#818CF8',
    maxWordsPerChunk: 3,
    kenBurnsIntensity: 0.03,
    colorGrade: { name: 'Cool Glass Crisp', filter: 'contrast(1.12) brightness(1.02)' },
    animationPreset: 'pop',
    animation: {
      mass: 0.45,
      damping: 14,
      stiffness: 200,
      scaleEntrance: [0.88, 1.0],
      blurEntrance: [6, 0],
    },
  },
  'paper-ii': {
    id: 'paper-ii',
    name: 'Paper II Collage',
    fontFamily: 'Montserrat',
    heroFontWeight: 900,
    leadFontWeight: 700,
    textColor: '#0F172A',
    accentColor: '#FEF08A',
    secondaryAccentColor: '#F87171',
    maxWordsPerChunk: 2,
    kenBurnsIntensity: 0.04,
    colorGrade: { name: 'Raw Film Matte', filter: 'contrast(1.1) saturate(0.95)' },
    animationPreset: 'slam',
    animation: {
      mass: 0.3,
      damping: 10,
      stiffness: 240,
      scaleEntrance: [0.65, 1.0],
      blurEntrance: [2, 0],
    },
  },
  'elevate-script': {
    id: 'elevate-script',
    name: 'Elevate Script & Real Estate Luxury',
    fontFamily: 'Playfair Display',
    heroFontWeight: 700,
    leadFontWeight: 600,
    textColor: '#FFFFFF',
    accentColor: '#F5D061',
    secondaryAccentColor: '#C99700',
    maxWordsPerChunk: 3,
    kenBurnsIntensity: 0.02,
    colorGrade: { name: 'Warm Luxury Editorial', filter: 'contrast(1.08) brightness(1.03) saturate(1.1)' },
    animationPreset: 'scale-snap',
    animation: {
      mass: 0.45,
      damping: 14,
      stiffness: 190,
      scaleEntrance: [0.9, 1.0],
      blurEntrance: [6, 0],
    },
  },
  'platinum-penthouse': {
    id: 'platinum-penthouse',
    name: 'Platinum Estate',
    fontFamily: 'Cinzel',
    heroFontWeight: 700,
    leadFontWeight: 600,
    textColor: '#F8FAFC',
    accentColor: '#E2E8F0',
    secondaryAccentColor: '#94A3B8',
    maxWordsPerChunk: 3,
    kenBurnsIntensity: 0.02,
    colorGrade: { name: 'Monochrome Platinum High-End', filter: 'contrast(1.2) grayscale(0.2)' },
    animationPreset: 'rise',
    animation: {
      mass: 0.65,
      damping: 18,
      stiffness: 130,
      scaleEntrance: [0.95, 1.0],
      blurEntrance: [6, 0],
    },
  },
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Royal Emerald',
    fontFamily: 'Plus Jakarta Sans',
    heroFontWeight: 900,
    leadFontWeight: 600,
    textColor: '#FFFFFF',
    accentColor: '#10B981',
    secondaryAccentColor: '#FCD34D',
    maxWordsPerChunk: 2,
    kenBurnsIntensity: 0.03,
    colorGrade: { name: 'Deep Emerald Luxury', filter: 'contrast(1.15) saturate(1.15)' },
    animationPreset: 'pop',
    animation: {
      mass: 0.45,
      damping: 14,
      stiffness: 180,
      scaleEntrance: [0.88, 1.0],
      blurEntrance: [4, 0],
    },
  },
  'silver-chrome': {
    id: 'silver-chrome',
    name: 'Silver Chrome',
    fontFamily: 'Oswald',
    heroFontWeight: 900,
    leadFontWeight: 700,
    textColor: '#FFFFFF',
    accentColor: '#CBD5E1',
    secondaryAccentColor: '#94A3B8',
    maxWordsPerChunk: 2,
    kenBurnsIntensity: 0.04,
    colorGrade: { name: 'Metallic Chrome Precision', filter: 'contrast(1.25) brightness(1.05)' },
    animationPreset: 'slam',
    animation: {
      mass: 0.38,
      damping: 12,
      stiffness: 220,
      scaleEntrance: [0.7, 1.0],
      blurEntrance: [4, 0],
    },
  },
};

export function getStyleBlueprint(styleId?: string): StyleBlueprint {
  if (styleId && STYLE_BLUEPRINTS[styleId]) {
    return STYLE_BLUEPRINTS[styleId];
  }
  return STYLE_BLUEPRINTS['dynamic-punch'];
}

/**
 * Loads an AdvancedStyleBlueprint from static registry or disk
 */
export function getAdvancedStyleBlueprint(styleId?: string): AdvancedStyleBlueprint | null {
  const targetId = styleId || 'dynamic-punch';
  return ADVANCED_STYLE_BLUEPRINTS[targetId] || ADVANCED_STYLE_BLUEPRINTS['dynamic-punch'] || null;
}
