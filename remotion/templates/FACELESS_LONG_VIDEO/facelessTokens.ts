/**
 * Authoritative Design Tokens for Itnavideo Faceless Video System
 * Pure White (#FFFFFF) Canvas with Role-Based Semantic Typography and Ali Abdaal Editorial Accents.
 * Single Source of Truth derived from Reference 1 (BNRfzI6E1Es) and Reference 2 (szVXpM7VVMg).
 */

export const FACELESS_DESIGN_TOKENS = {
  canvas: {
    width: 1920,
    height: 1080,
    aspectRatio: '16:9' as const,
    backgroundColor: '#FFFFFF',
    safeMarginX: 120,
    safeMarginY: 80,
  },
  colors: {
    // Fixed Canvas & Card Surfaces
    canvasWhite: '#FFFFFF',
    surfaceWhite: '#FFFFFF',
    surfaceWarm: '#FAF9F6',
    surfaceCard: '#FFFFFF',
    surfaceCardMuted: '#F8FAFC',
    
    // High-Contrast Typography
    textPrimary: '#111827',     // Obsidian Slate (Headings, primary statements)
    textSecondary: '#374151',   // Slate 700 (Body explanations, subheadings)
    textMuted: '#9CA3AF',       // Slate 400 (Inactive list items, timestamps)
    textInverse: '#FFFFFF',     // White (Inside dark pills/badges only)
    
    // Semantic Contextual Accents (Ali Abdaal Benchmark)
    accentYellow: '#FFE600',     // Signature Marker Highlight Tape
    accentYellowBg: '#FEF08A',   // Light yellow pill background
    accentCoral: '#EA580C',      // Primary Action / Number Badges / Active Dot
    accentCoralBg: '#FFEDD5',    // Peach/Coral pill background
    accentGreen: '#10B981',      // Success / Active Checklist Item / High Retention
    accentGreenBg: '#D1FAE5',    // Light Mint pill background
    accentBlue: '#0284C7',       // Logic / Systems / Mindset Flow
    accentBlueBg: '#E0F2FE',     // Light Blue pill background
    accentAmber: '#FFA000',      // Sunset Amber Brand Accent
    accentAmberBg: '#FEF3C7',    // Light Amber pill background
    accentRed: '#EF4444',        // Crossed-out / Friction / Low Retention
    accentRedBg: '#FEE2E2',      // Light Red pill background

    // macOS Prompt Window Controls
    windowDotClose: '#EF4444',
    windowDotMinimize: '#F59E0B',
    windowDotExpand: '#10B981',

    // Pastel Time-Block Colors (Calendar System)
    timeBlockSky: '#BAE6FD',
    timeBlockMint: '#D1FAE5',
    timeBlockPeach: '#FFEDD5',
    timeBlockLilac: '#E9D5FF',

    // Structural Borders & Shadows
    borderHairline: '1px solid rgba(0, 0, 0, 0.08)',
    borderMedium: '1px solid rgba(0, 0, 0, 0.12)',
    borderActiveCoral: '1.5px solid #EA580C',
    borderActiveAmber: '1.5px solid #FFA000',
    shadowSoft: '0 8px 30px rgba(0, 0, 0, 0.05)',
    shadowElevated: '0 16px 40px rgba(0, 0, 0, 0.07)',
    shadowPill: '0 4px 16px rgba(0, 0, 0, 0.04)',
  },
  typography: {
    // Editorial Serif Font Stack (Headlines, Quotes, Prompts)
    editorialSerif: 'Fraunces, "Playfair Display", Georgia, "Times New Roman", serif',
    // Clean Geometric Sans Stack (Cards, UI, Labels, Captions)
    interfaceSans: 'Inter, "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    // Monospace Stack (Code, Technical Blocks, Prompts)
    codeMono: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
    
    // Configurable Starting Estimates (1920x1080 Reference Frame)
    sizes: {
      heroHeadline: 56,        // 48px - 64px
      sectionTitle: 38,        // 34px - 44px
      promptQuestion: 34,      // 32px - 40px
      promptBodyText: 24,      // 22px - 28px
      bodyText: 24,            // 22px - 28px
      cardItem: 20,            // 18px - 22px
      statisticNumber: 52,     // 44px - 64px
      codeText: 22,            // 18px - 24px
      captionText: 26,         // 24px - 28px
      annotationText: 16,      // 14px - 18px
      badgeText: 14,           // 13px - 16px
    },
    weights: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
  },
  motion: {
    springConfig: {
      damping: 16,
      mass: 0.8,
      stiffness: 130,
    },
    staggerFrames: 4, // 133ms stagger between list items at 30 FPS
  },
} as const;

export type FacelessDesignTokens = typeof FACELESS_DESIGN_TOKENS;
