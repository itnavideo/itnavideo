// ── Procedural Whiteboard Vector Drawing Registry ─────────────────────────────
// Pure vector stroke drawings for characters, medical, business, science, and processes.
// Animated dynamically via stroke-dashoffset interpolation in Remotion (zero bitmap images).

export type VectorStroke = {
  d: string;
  len: number;
  strokeWidth?: number;
  colorKey?: 'primary' | 'accent' | 'highlight' | 'danger' | 'success' | 'white';
  fill?: string;
  order?: number; // 0 = first stroke, 1 = next stroke, etc.
};

export type VectorDrawingDef = {
  id: string;
  name: string;
  category: 'character' | 'medical' | 'business' | 'science' | 'process' | 'comparison' | 'general';
  viewBox: string;
  strokes: VectorStroke[];
  keywords: string[];
};

export const WHITEBOARD_VECTOR_DRAWINGS: Record<string, VectorDrawingDef> = {
  // ── CHARACTERS & STICK FIGURES ───────────────────────────────────────────────
  'character_doctor': {
    id: 'character_doctor',
    name: 'Doctor with Stethoscope',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Head
      { d: 'M 50 15 A 10 10 0 1 0 50 35 A 10 10 0 1 0 50 15', len: 63, strokeWidth: 3, order: 0 },
      // Medical Head Mirror / Cap
      { d: 'M 44 14 C 47 10 53 10 56 14', len: 14, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Body Coat
      { d: 'M 50 35 L 50 72 M 38 45 L 38 72 M 62 45 L 62 72 M 38 72 L 62 72', len: 110, strokeWidth: 3, order: 2 },
      // Stethoscope around neck
      { d: 'M 44 38 C 44 48 48 54 50 54 C 52 54 56 48 56 38 M 50 54 L 50 60 A 3 3 0 1 0 50 66 A 3 3 0 1 0 50 60', len: 65, strokeWidth: 2.5, colorKey: 'accent', order: 3 },
      // Arms (welcoming/diagnosing)
      { d: 'M 38 45 L 24 55 M 62 45 L 76 55', len: 40, strokeWidth: 3, order: 4 },
      // Legs
      { d: 'M 44 72 L 44 92 M 56 72 L 56 92', len: 44, strokeWidth: 3, order: 5 },
    ],
    keywords: ['doctor', 'dr', 'physician', 'surgeon', 'hospital', 'clinic', 'medical', 'nurse', 'tashkhees', 'ilaj', 'dawa'],
  },

  'character_business_leader': {
    id: 'character_business_leader',
    name: 'Business Presenter / Executive',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Head
      { d: 'M 50 16 A 10 10 0 1 0 50 36 A 10 10 0 1 0 50 16', len: 63, strokeWidth: 3, order: 0 },
      // Tie
      { d: 'M 48 37 L 52 37 L 54 48 L 50 54 L 46 48 Z', len: 42, strokeWidth: 2, colorKey: 'accent', order: 1 },
      // Suit Jacket Torso
      { d: 'M 35 44 L 50 36 L 65 44 L 62 72 L 38 72 Z', len: 120, strokeWidth: 3, order: 2 },
      // Presenting Right Arm Pointing Up
      { d: 'M 65 44 L 82 32 L 86 26', len: 32, strokeWidth: 3, colorKey: 'accent', order: 3 },
      // Left Arm on Hip
      { d: 'M 35 44 L 24 54 L 32 60', len: 30, strokeWidth: 3, order: 4 },
      // Legs
      { d: 'M 44 72 L 42 94 M 56 72 L 58 94', len: 46, strokeWidth: 3, order: 5 },
    ],
    keywords: ['business', 'leader', 'ceo', 'executive', 'boss', 'founder', 'strategy', 'karobar', 'manager', 'corporate'],
  },

  'character_thinking': {
    id: 'character_thinking',
    name: 'Thinking / Questioning Person',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Head
      { d: 'M 45 22 A 9 9 0 1 0 45 40 A 9 9 0 1 0 45 22', len: 57, strokeWidth: 3, order: 0 },
      // Body
      { d: 'M 45 40 L 45 72', len: 32, strokeWidth: 3, order: 1 },
      // Hand on Chin / Thought pose
      { d: 'M 45 50 L 32 54 L 38 38', len: 34, strokeWidth: 3, order: 2 },
      // Left arm relaxed
      { d: 'M 45 48 L 58 58', len: 20, strokeWidth: 3, order: 3 },
      // Legs
      { d: 'M 45 72 L 38 92 M 45 72 L 52 92', len: 44, strokeWidth: 3, order: 4 },
      // Thought Cloud Bubble
      { d: 'M 64 24 C 64 20 68 16 74 16 C 80 16 84 19 84 24 C 88 25 90 28 90 32 C 90 36 86 39 82 39 L 68 39 C 62 39 58 35 58 30 C 58 26 61 24 64 24 Z', len: 90, strokeWidth: 2, colorKey: 'accent', order: 5 },
      // Question Mark inside thought bubble
      { d: 'M 72 23 C 72 20 76 20 76 24 C 76 28 73 29 73 31 M 73 34 L 73 35', len: 24, strokeWidth: 2.5, colorKey: 'danger', order: 6 },
    ],
    keywords: ['think', 'thinking', 'question', 'why', 'problem', 'confused', 'soch', 'sawal', 'wonder', 'reason'],
  },

  'character_celebration': {
    id: 'character_celebration',
    name: 'Success / Victory Character',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Head
      { d: 'M 50 20 A 9 9 0 1 0 50 38 A 9 9 0 1 0 50 20', len: 57, strokeWidth: 3, order: 0 },
      // Body
      { d: 'M 50 38 L 50 68', len: 30, strokeWidth: 3, order: 1 },
      // Both Arms Raised in Joy (V shape)
      { d: 'M 50 44 L 28 22 M 50 44 L 72 22', len: 64, strokeWidth: 3, colorKey: 'success', order: 2 },
      // Legs (Sturdy victory stance)
      { d: 'M 50 68 L 36 92 M 50 68 L 64 92', len: 52, strokeWidth: 3, order: 3 },
      // Sparkle Rays around hands
      { d: 'M 22 16 L 16 12 M 28 14 L 28 8 M 34 16 L 40 12 M 78 16 L 84 12 M 72 14 L 72 8 M 66 16 L 60 12', len: 60, strokeWidth: 2, colorKey: 'highlight', order: 4 },
    ],
    keywords: ['success', 'win', 'kaamyabi', 'victory', 'result', 'profit', 'done', 'achievement', 'growth', 'celebrate'],
  },

  // ── MEDICAL & HEALTH DIAGRAMS ───────────────────────────────────────────────
  'medical_ecg_pulse': {
    id: 'medical_ecg_pulse',
    name: 'ECG Heart Pulse Wave',
    category: 'medical',
    viewBox: '0 0 120 80',
    strokes: [
      // Heart background sketch
      { d: 'M 60 30 C 50 14 30 14 30 32 C 30 50 56 66 60 70 C 64 66 90 50 90 32 C 90 14 70 14 60 30 Z', len: 150, strokeWidth: 2, colorKey: 'highlight', order: 0 },
      // Live ECG Rhythm Line
      { d: 'M 5 44 L 35 44 L 42 44 L 46 32 L 52 62 L 60 12 L 68 56 L 73 40 L 78 44 L 115 44', len: 185, strokeWidth: 3.5, colorKey: 'danger', order: 1 },
    ],
    keywords: ['heart', 'ecg', 'pulse', 'cardiac', 'rate', 'rhythm', 'sehat', 'dil', 'vital', 'beat', 'living'],
  },

  'medical_pill_capsule': {
    id: 'medical_pill_capsule',
    name: 'Medicine Pill Capsule & Tablets',
    category: 'medical',
    viewBox: '0 0 100 100',
    strokes: [
      // Angled Capsule Outline
      { d: 'M 30 30 C 20 40 20 56 30 66 L 54 90 C 64 100 80 100 90 90 C 100 80 100 64 90 54 L 66 30 C 56 20 40 20 30 30 Z', len: 240, strokeWidth: 3, order: 0 },
      // Center dividing seam
      { d: 'M 42 42 L 78 78', len: 52, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Dose Cross Mark on left half
      { d: 'M 38 52 L 50 40 M 44 46 L 44 46', len: 24, strokeWidth: 2.5, colorKey: 'danger', order: 2 },
    ],
    keywords: ['medicine', 'pill', 'tablet', 'capsule', 'dawa', 'cure', 'treatment', 'dose', 'pharmacy', 'prescription'],
  },

  'medical_dna_helix': {
    id: 'medical_dna_helix',
    name: 'DNA Double Helix',
    category: 'medical',
    viewBox: '0 0 80 120',
    strokes: [
      // Strand 1
      { d: 'M 20 10 Q 60 35 20 60 Q 60 85 20 110', len: 140, strokeWidth: 3, colorKey: 'accent', order: 0 },
      // Strand 2
      { d: 'M 60 10 Q 20 35 60 60 Q 20 85 60 110', len: 140, strokeWidth: 3, colorKey: 'primary', order: 1 },
      // Base rungs
      { d: 'M 28 20 L 52 20 M 36 35 L 44 35 M 28 50 L 52 50 M 28 70 L 52 70 M 36 85 L 44 85 M 28 100 L 52 100', len: 110, strokeWidth: 2.5, colorKey: 'highlight', order: 2 },
    ],
    keywords: ['dna', 'genetics', 'biology', 'cells', 'gene', 'heredity', 'scientific', 'molecular', 'body'],
  },

  // ── BUSINESS & FINANCIAL DIAGRAMS ────────────────────────────────────────────
  'business_growth_chart': {
    id: 'business_growth_chart',
    name: 'Bar Chart with Growth Arrow',
    category: 'business',
    viewBox: '0 0 110 90',
    strokes: [
      // X and Y Axes
      { d: 'M 15 15 L 15 75 L 100 75', len: 145, strokeWidth: 3, order: 0 },
      // Bar 1
      { d: 'M 28 75 L 28 55 L 40 55 L 40 75', len: 65, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Bar 2
      { d: 'M 48 75 L 48 38 L 60 38 L 60 75', len: 90, strokeWidth: 2.5, colorKey: 'accent', order: 2 },
      // Bar 3
      { d: 'M 68 75 L 68 22 L 80 22 L 80 75', len: 120, strokeWidth: 2.5, colorKey: 'accent', order: 3 },
      // Upward Exponential Trend Curve + Arrow Head
      { d: 'M 22 62 Q 52 48 88 16 M 78 16 L 88 16 L 88 26', len: 95, strokeWidth: 3.5, colorKey: 'success', order: 4 },
    ],
    keywords: ['chart', 'growth', 'sales', 'revenue', 'taraqqi', 'karobar', 'metrics', 'analytics', 'profit', 'scale', 'roi'],
  },

  'business_target_bullseye': {
    id: 'business_target_bullseye',
    name: 'Target Bullseye with Arrow',
    category: 'business',
    viewBox: '0 0 100 100',
    strokes: [
      // Outer Circle
      { d: 'M 50 15 A 35 35 0 1 0 50 85 A 35 35 0 1 0 50 15', len: 220, strokeWidth: 2.5, order: 0 },
      // Mid Circle
      { d: 'M 50 28 A 22 22 0 1 0 50 72 A 22 22 0 1 0 50 28', len: 138, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Center Bullseye
      { d: 'M 50 42 A 8 8 0 1 0 50 58 A 8 8 0 1 0 50 42', len: 50, strokeWidth: 3, colorKey: 'danger', order: 2 },
      // Arrow Hit at Center
      { d: 'M 18 18 L 48 48 M 48 48 L 40 46 M 48 48 L 46 40 M 18 18 L 12 12 M 18 18 L 14 24 M 18 18 L 24 14', len: 80, strokeWidth: 3, colorKey: 'danger', order: 3 },
    ],
    keywords: ['target', 'goal', 'aim', 'focus', 'objective', 'maqsad', 'hit', 'mission', 'strategy'],
  },

  'business_handshake': {
    id: 'business_handshake',
    name: 'Partnership Handshake',
    category: 'business',
    viewBox: '0 0 110 80',
    strokes: [
      // Left Arm & Cuff
      { d: 'M 10 48 L 32 36 L 42 45', len: 45, strokeWidth: 3, order: 0 },
      // Right Arm & Cuff
      { d: 'M 100 48 L 78 36 L 68 45', len: 45, strokeWidth: 3, order: 1 },
      // Interlocked Hands
      { d: 'M 42 45 C 48 40 56 40 62 45 C 66 50 64 58 55 60 C 48 62 40 54 42 45 Z M 48 50 L 60 50 M 50 56 L 58 56', len: 90, strokeWidth: 2.5, colorKey: 'accent', order: 2 },
      // Spark of agreement
      { d: 'M 55 24 L 55 16 M 45 28 L 39 22 M 65 28 L 71 22', len: 35, strokeWidth: 2, colorKey: 'highlight', order: 3 },
    ],
    keywords: ['deal', 'partnership', 'agreement', 'trust', 'contract', 'handshake', 'teamwork', 'alliance', 'muaahida'],
  },

  // ── PROCESS & STEP-BY-STEP FLOWS ───────────────────────────────────────────
  'process_step_curved_arrow': {
    id: 'process_step_curved_arrow',
    name: 'Dynamic Step Connector Arrow',
    category: 'process',
    viewBox: '0 0 100 80',
    strokes: [
      // Bold swooping curved arrow
      { d: 'M 15 65 C 25 20 70 20 85 50 M 74 48 L 85 50 L 84 38', len: 120, strokeWidth: 3.5, colorKey: 'accent', order: 0 },
      // Motion dashed trail
      { d: 'M 10 70 C 18 35 55 35 68 55', len: 75, strokeWidth: 2, colorKey: 'highlight', order: 1 },
    ],
    keywords: ['step', 'next', 'arrow', 'process', 'move', 'forward', 'pehle', 'phir', 'tarteeb', 'pipeline'],
  },

  'process_funnel_filter': {
    id: 'process_funnel_filter',
    name: 'Conversion Filter Funnel',
    category: 'process',
    viewBox: '0 0 90 100',
    strokes: [
      // Top Funnel Mouth
      { d: 'M 15 20 L 75 20 C 75 25 15 25 15 20 Z', len: 130, strokeWidth: 2.5, order: 0 },
      // Funnel Body
      { d: 'M 15 22 L 36 60 L 36 85 L 54 85 L 54 60 L 75 22', len: 170, strokeWidth: 3, order: 1 },
      // Droplets falling out bottom
      { d: 'M 45 92 A 3 3 0 1 0 45 98 A 3 3 0 1 0 45 92', len: 20, strokeWidth: 2, colorKey: 'success', order: 2 },
    ],
    keywords: ['funnel', 'filter', 'conversion', 'leads', 'traffic', 'customers', 'select', 'streamline'],
  },

  // ── SCIENCE & EDUCATION ────────────────────────────────────────────────────
  'science_atom_orbit': {
    id: 'science_atom_orbit',
    name: 'Atomic Nucleus & Electron Orbits',
    category: 'science',
    viewBox: '0 0 100 100',
    strokes: [
      // Orbit 1 (Horizontal tilt)
      { d: 'M 15 50 C 15 32 85 32 85 50 C 85 68 15 68 15 50 Z', len: 180, strokeWidth: 2.5, colorKey: 'accent', order: 0 },
      // Orbit 2 (60 deg tilt)
      { d: 'M 32 20 C 48 10 82 70 68 80 C 52 90 18 30 32 20 Z', len: 180, strokeWidth: 2.5, colorKey: 'primary', order: 1 },
      // Orbit 3 (-60 deg tilt)
      { d: 'M 68 20 C 82 30 48 90 32 80 C 18 70 52 10 68 20 Z', len: 180, strokeWidth: 2.5, colorKey: 'highlight', order: 2 },
      // Center Nucleus Group
      { d: 'M 50 46 A 4 4 0 1 0 50 54 A 4 4 0 1 0 50 46', len: 26, strokeWidth: 3, colorKey: 'danger', order: 3 },
    ],
    keywords: ['atom', 'science', 'physics', 'energy', 'orbit', 'electron', 'quantum', 'research', 'formula'],
  },

  'science_beaker_flask': {
    id: 'science_beaker_flask',
    name: 'Chemistry Erlenmeyer Flask',
    category: 'science',
    viewBox: '0 0 90 100',
    strokes: [
      // Flask Neck & Body
      { d: 'M 38 15 L 52 15 M 42 15 L 42 35 L 20 80 C 18 85 22 88 28 88 L 62 88 C 68 88 72 85 70 80 L 48 35 L 48 15', len: 210, strokeWidth: 3, order: 0 },
      // Liquid Level Wave
      { d: 'M 26 72 Q 45 66 64 72', len: 42, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Rising Bubbles
      { d: 'M 40 58 A 3 3 0 1 0 40 64 A 3 3 0 1 0 40 58 M 50 48 A 2 2 0 1 0 50 52 A 2 2 0 1 0 50 48', len: 35, strokeWidth: 2, colorKey: 'success', order: 2 },
    ],
    keywords: ['chemistry', 'flask', 'beaker', 'formula', 'experiment', 'lab', 'mixture', 'tajruba', 'liquid'],
  },

  'science_lightbulb_idea': {
    id: 'science_lightbulb_idea',
    name: 'Idea Lightbulb with Filament',
    category: 'science',
    viewBox: '0 0 90 90',
    strokes: [
      // Bulb Outline
      { d: 'M 30 42 C 22 34 22 20 34 12 C 46 4 60 10 64 22 C 66 28 62 36 56 42 L 56 54 L 34 54 Z', len: 160, strokeWidth: 3, order: 0 },
      // Filament inside
      { d: 'M 40 42 L 40 28 L 45 34 L 50 28 L 50 42', len: 45, strokeWidth: 2, colorKey: 'highlight', order: 1 },
      // Base Screws
      { d: 'M 36 58 L 54 58 M 38 64 L 52 64 M 42 70 L 48 70', len: 46, strokeWidth: 2.5, order: 2 },
      // Glow Spark Rays
      { d: 'M 45 4 L 45 0 M 20 16 L 14 12 M 70 16 L 76 12 M 12 36 L 6 36 M 78 36 L 84 36', len: 50, strokeWidth: 2.5, colorKey: 'highlight', order: 3 },
    ],
    keywords: ['idea', 'lightbulb', 'solution', 'eureka', 'soch', 'creative', 'smart', 'insight', 'concept'],
  },

  // ── COMPARISON & VS ────────────────────────────────────────────────────────
  'comparison_cross_error': {
    id: 'comparison_cross_error',
    name: 'Red Mistake / Problem Cross',
    category: 'comparison',
    viewBox: '0 0 80 80',
    strokes: [
      // Jagged Circle
      { d: 'M 40 10 A 30 30 0 1 0 40 70 A 30 30 0 1 0 40 10', len: 190, strokeWidth: 2.5, colorKey: 'danger', order: 0 },
      // Heavy Cross Strokes
      { d: 'M 26 26 L 54 54 M 54 26 L 26 54', len: 80, strokeWidth: 4, colorKey: 'danger', order: 1 },
    ],
    keywords: ['error', 'mistake', 'wrong', 'no', 'problem', 'galti', 'old', 'avoid', 'bad', 'loss'],
  },

  'comparison_checkmark_success': {
    id: 'comparison_checkmark_success',
    name: 'Green Solution / Success Checkmark',
    category: 'comparison',
    viewBox: '0 0 80 80',
    strokes: [
      // Shield / Circle Outline
      { d: 'M 40 10 A 30 30 0 1 0 40 70 A 30 30 0 1 0 40 10', len: 190, strokeWidth: 2.5, colorKey: 'success', order: 0 },
      // Bold Checkmark
      { d: 'M 22 40 L 34 52 L 58 24', len: 55, strokeWidth: 4, colorKey: 'success', order: 1 },
    ],
    keywords: ['correct', 'success', 'solution', 'right', 'yes', 'sahi', 'new', 'fixed', 'advantage'],
  },
};

// ── Smart Semantic Keyword Resolver ──────────────────────────────────────────
export function resolveVectorDrawing(keywordOrText?: string): VectorDrawingDef {
  if (!keywordOrText) return WHITEBOARD_VECTOR_DRAWINGS['science_lightbulb_idea'];
  const text = keywordOrText.toLowerCase();

  for (const def of Object.values(WHITEBOARD_VECTOR_DRAWINGS)) {
    for (const kw of def.keywords) {
      if (text.includes(kw)) {
        return def;
      }
    }
  }

  return WHITEBOARD_VECTOR_DRAWINGS['science_lightbulb_idea'];
}
