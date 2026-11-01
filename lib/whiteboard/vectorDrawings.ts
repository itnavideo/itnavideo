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
  category:
    | 'character'
    | 'medical'
    | 'business'
    | 'science'
    | 'process'
    | 'comparison'
    | 'general'
    | 'location'
    | 'story';
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

  // ── STORYTELLING & ENVIRONMENT (VILLAGES, CITIES, JOURNEYS) ────────────────
  'story_village_house': {
    id: 'story_village_house',
    name: 'Village Home & Countryside Pathway',
    category: 'location',
    viewBox: '0 0 100 100',
    strokes: [
      // Pitched Roof
      { d: 'M 16 46 L 50 18 L 84 46 Z', len: 150, strokeWidth: 3, order: 0 },
      // Chimney & Smoke
      { d: 'M 66 32 L 66 20 L 74 20 L 74 38 M 70 16 Q 76 10 70 4', len: 65, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // House Walls
      { d: 'M 24 46 L 24 82 L 76 82 L 76 46', len: 124, strokeWidth: 3, order: 2 },
      // Wooden Door
      { d: 'M 44 82 L 44 60 L 56 60 L 56 82 M 53 71 A 1.5 1.5 0 1 0 53 72', len: 68, strokeWidth: 2.5, colorKey: 'highlight', order: 3 },
      // Window with Cross Panes
      { d: 'M 28 54 L 38 54 L 38 66 L 28 66 Z M 33 54 L 33 66 M 28 60 L 38 60', len: 64, strokeWidth: 2, colorKey: 'accent', order: 4 },
      // Countryside Ground & Trail
      { d: 'M 6 84 Q 45 82 94 84 M 44 82 L 36 94 M 56 82 L 64 94', len: 120, strokeWidth: 2.5, order: 5 },
      // Side Garden Tree
      { d: 'M 88 84 L 88 62 M 88 62 C 80 58 80 48 88 44 C 96 48 96 58 88 62', len: 75, strokeWidth: 2.5, colorKey: 'success', order: 6 },
    ],
    keywords: ['village', 'house', 'home', 'cottage', 'rural', 'town', 'basti', 'gao', 'childhood', 'roots', 'origin', 'family', 'cabin'],
  },

  'story_city_buildings': {
    id: 'story_city_buildings',
    name: 'City Skyline & Modern Architecture',
    category: 'location',
    viewBox: '0 0 100 100',
    strokes: [
      // Street Ground Line & Lane Dashes
      { d: 'M 6 88 L 94 88 M 16 93 L 28 93 M 42 93 L 54 93 M 68 93 L 80 93', len: 135, strokeWidth: 2.5, order: 0 },
      // Building 1 (Left Medium Block)
      { d: 'M 14 88 L 14 42 L 34 42 L 34 88', len: 112, strokeWidth: 2.5, order: 1 },
      // Center Skyscraper with Antenna Spire
      { d: 'M 38 88 L 38 18 L 64 18 L 64 88 M 51 18 L 51 6', len: 165, strokeWidth: 3, colorKey: 'accent', order: 2 },
      // Corporate Tower (Right Stepped)
      { d: 'M 68 88 L 68 32 L 88 32 L 88 88', len: 132, strokeWidth: 2.5, order: 3 },
      // Architectural Window Grid on Center Skyscraper
      { d: 'M 44 28 L 58 28 M 44 38 L 58 38 M 44 48 L 58 48 M 44 58 L 58 58 M 44 68 L 58 68 M 44 78 L 58 78', len: 84, strokeWidth: 2, colorKey: 'highlight', order: 4 },
      // Window Rows on Left & Right Towers
      { d: 'M 20 52 L 28 52 M 20 64 L 28 64 M 20 76 L 28 76 M 74 44 L 82 44 M 74 56 L 82 56 M 74 68 L 82 68 M 74 80 L 82 80', len: 65, strokeWidth: 1.8, colorKey: 'accent', order: 5 },
    ],
    keywords: ['city', 'skyline', 'buildings', 'skyscrapers', 'urban', 'metro', 'shahar', 'corporate', 'downtown', 'capital', 'office', 'agency'],
  },

  'story_journey_road': {
    id: 'story_journey_road',
    name: 'Winding Road to the Future',
    category: 'location',
    viewBox: '0 0 100 100',
    strokes: [
      // Horizon Mountains / Hills
      { d: 'M 6 46 Q 30 36 50 42 Q 74 34 94 45', len: 95, strokeWidth: 2.5, order: 0 },
      // Rising Sun Beacon at Horizon
      { d: 'M 44 42 C 44 34 56 34 56 42 M 50 26 L 50 31 M 40 31 L 44 34 M 60 31 L 56 34', len: 55, strokeWidth: 2, colorKey: 'highlight', order: 1 },
      // Perspective Road Borders (Narrow at horizon, wide in foreground)
      { d: 'M 47 42 L 10 92 M 53 42 L 90 92', len: 140, strokeWidth: 3, colorKey: 'accent', order: 2 },
      // Dynamic Center Dashed Lines (Scaling in perspective)
      { d: 'M 50 45 L 50 49 M 50 54 L 50 60 M 50 66 L 50 74 M 50 82 L 50 92', len: 50, strokeWidth: 3, colorKey: 'white', order: 3 },
      // Milestone Route Marker / Signpost
      { d: 'M 22 68 L 22 52 L 34 52 L 34 68 M 18 56 L 36 56', len: 58, strokeWidth: 2.5, colorKey: 'success', order: 4 },
    ],
    keywords: ['road', 'journey', 'path', 'travel', 'highway', 'destination', 'safar', 'rasta', 'future', 'direction', 'timeline', 'way', 'route'],
  },

  'character_journey_walking': {
    id: 'character_journey_walking',
    name: 'Determined Traveler on Journey',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Head
      { d: 'M 56 20 A 8 8 0 1 0 56 36 A 8 8 0 1 0 56 20', len: 50, strokeWidth: 3, order: 0 },
      // Torso Leaning Forward
      { d: 'M 53 36 L 47 62', len: 28, strokeWidth: 3, order: 1 },
      // Backpack
      { d: 'M 44 40 L 34 42 L 34 56 L 46 56 Z', len: 50, strokeWidth: 2.5, colorKey: 'accent', order: 2 },
      // Forward Stride Leg
      { d: 'M 47 62 L 62 74 L 66 88', len: 45, strokeWidth: 3, colorKey: 'accent', order: 3 },
      // Trailing Push Leg
      { d: 'M 47 62 L 36 72 L 28 86', len: 45, strokeWidth: 3, order: 4 },
      // Pumping Arms in Motion
      { d: 'M 50 42 L 64 52 M 46 42 L 34 52', len: 40, strokeWidth: 3, colorKey: 'highlight', order: 5 },
      // Ground Path & Dust
      { d: 'M 15 88 L 85 88 M 20 92 L 28 92 M 62 92 L 72 92', len: 85, strokeWidth: 2, order: 6 },
    ],
    keywords: ['walking', 'traveler', 'journey', 'moving', 'alone', 'began', 'started', 'hustle', 'chalna', 'stride', 'boy', 'man', 'person'],
  },

  'character_struggling_burden': {
    id: 'character_struggling_burden',
    name: 'Overcoming Heavy Challenge',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Steep Incline Hill
      { d: 'M 8 88 L 92 48', len: 94, strokeWidth: 2.5, order: 0 },
      // Heavy Boulder Stone
      { d: 'M 64 36 A 15 15 0 1 0 64 66 A 15 15 0 1 0 64 36', len: 95, strokeWidth: 3.5, colorKey: 'danger', order: 1 },
      // Person Head & Straining Torso
      { d: 'M 38 52 A 6 6 0 1 0 38 64 A 6 6 0 1 0 38 52 M 38 64 L 34 76', len: 50, strokeWidth: 3, order: 2 },
      // Extended Straining Arms Pushing Boulder
      { d: 'M 37 62 L 49 54 M 37 65 L 50 60', len: 38, strokeWidth: 3, colorKey: 'accent', order: 3 },
      // Braced Legs on Hill Slope
      { d: 'M 34 76 L 24 82 M 34 76 L 38 84', len: 32, strokeWidth: 3, order: 4 },
      // Sweat / Effort Droplets
      { d: 'M 30 50 Q 32 46 30 44', len: 10, strokeWidth: 2, colorKey: 'highlight', order: 5 },
    ],
    keywords: ['struggle', 'hardship', 'challenge', 'burden', 'problem', 'effort', 'musibat', 'mushkil', 'grit', 'pressure', 'heavy', 'obstacle', 'tough'],
  },

  'story_home_workspace': {
    id: 'story_home_workspace',
    name: 'Late Night Workspace & Study',
    category: 'location',
    viewBox: '0 0 100 100',
    strokes: [
      // Desk Surface & Sturdy Legs
      { d: 'M 14 66 L 86 66 M 20 66 L 20 90 M 80 66 L 80 90', len: 120, strokeWidth: 3, order: 0 },
      // Open Laptop
      { d: 'M 38 66 L 36 50 L 56 50 L 54 66 Z M 32 66 L 60 66', len: 80, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Desk Reading Lamp
      { d: 'M 72 66 L 72 38 L 60 36 M 60 32 L 54 40 L 64 40 Z', len: 65, strokeWidth: 2.5, colorKey: 'highlight', order: 2 },
      // Lamp Glow Cones
      { d: 'M 54 42 L 46 52 M 64 42 L 70 52', len: 30, strokeWidth: 2, colorKey: 'highlight', order: 3 },
      // Coffee / Tea Mug
      { d: 'M 25 66 L 25 56 L 31 56 L 31 66 Z M 31 58 C 34 58 34 63 31 63', len: 38, strokeWidth: 2, colorKey: 'white', order: 4 },
    ],
    keywords: ['workspace', 'desk', 'laptop', 'study', 'late night', 'working', 'code', 'research', 'writing', 'kamra', 'kam', 'room', 'bed'],
  },

  'concept_zero_to_one': {
    id: 'concept_zero_to_one',
    name: 'Starting From Zero to Milestone',
    category: 'story',
    viewBox: '0 0 100 100',
    strokes: [
      // Bold "0" at start
      { d: 'M 24 35 C 24 24 36 24 36 35 L 36 65 C 36 76 24 76 24 65 Z', len: 120, strokeWidth: 3.5, colorKey: 'highlight', order: 0 },
      // Connecting growth arrow leaping from 0 to 1
      { d: 'M 40 60 Q 56 42 70 32 M 62 32 L 70 32 L 70 40', len: 65, strokeWidth: 3.5, colorKey: 'accent', order: 1 },
      // Rising "1" pillar
      { d: 'M 78 30 L 84 26 L 84 74 M 76 74 L 92 74', len: 80, strokeWidth: 3.5, colorKey: 'success', order: 2 },
      // Upward sparkle star
      { d: 'M 84 14 L 84 10 M 80 12 L 88 12', len: 16, strokeWidth: 2, colorKey: 'highlight', order: 3 },
      // Ground foundation
      { d: 'M 14 80 L 94 80', len: 80, strokeWidth: 2.5, order: 4 },
    ],
    keywords: ['zero', 'shunya', 'starting', 'start', 'scratch', 'shuruat', 'kadam', 'step', 'first', 'origin', 'foundation'],
  },

  'money_growth_coins': {
    id: 'money_growth_coins',
    name: 'Financial Foundation & Wealth Building',
    category: 'business',
    viewBox: '0 0 100 100',
    strokes: [
      // Coin Stack 1 (Small)
      { d: 'M 20 62 C 20 58 36 58 36 62 C 36 66 20 66 20 62 M 20 62 L 20 78 C 20 82 36 82 36 78 L 36 62', len: 90, strokeWidth: 2.5, colorKey: 'highlight', order: 0 },
      // Coin Stack 2 (Medium)
      { d: 'M 42 46 C 42 42 58 42 58 46 C 58 50 42 50 42 46 M 42 46 L 42 78 C 42 82 58 82 58 78 L 58 46', len: 110, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Coin Stack 3 (Large)
      { d: 'M 64 30 C 64 26 80 26 80 30 C 80 34 64 34 64 30 M 64 30 L 64 78 C 64 82 80 82 80 78 L 80 30', len: 130, strokeWidth: 2.5, colorKey: 'success', order: 2 },
      // Currency Symbol Floating
      { d: 'M 50 16 L 50 26 M 44 19 L 56 19 M 44 23 L 54 23', len: 35, strokeWidth: 2.5, colorKey: 'highlight', order: 3 },
      // Base Table Line
      { d: 'M 10 82 L 90 82', len: 80, strokeWidth: 2.5, order: 4 },
    ],
    keywords: ['money', 'paisa', 'paise', 'rupee', 'capital', 'resource', 'fund', 'savings', 'income', 'budget', 'investment', 'wealth'],
  },

  'character_burning_passion': {
    id: 'character_burning_passion',
    name: 'Relentless Drive & Burning Passion',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Determined Runner Head
      { d: 'M 52 20 A 8 8 0 1 0 52 36 A 8 8 0 1 0 52 20', len: 50, strokeWidth: 3, order: 0 },
      // Torso Moving with Forward Momentum
      { d: 'M 50 36 L 44 62', len: 28, strokeWidth: 3, order: 1 },
      // Torch / Flaming Passion in Hand
      { d: 'M 48 42 L 68 34 M 68 34 L 72 26 M 68 24 C 68 16 76 16 74 24 C 78 20 82 24 76 28 C 76 30 70 30 68 24 Z', len: 85, strokeWidth: 3, colorKey: 'accent', order: 2 },
      // Powerful Forward Stride Legs
      { d: 'M 44 62 L 60 74 L 66 88 M 44 62 L 30 72 L 20 86', len: 85, strokeWidth: 3, order: 3 },
      // Ground Speed Lines
      { d: 'M 8 88 L 88 88 M 14 93 L 36 93 M 52 93 L 74 93', len: 120, strokeWidth: 2.5, colorKey: 'highlight', order: 4 },
    ],
    keywords: ['passion', 'junoon', 'fire', 'drive', 'energy', 'grit', 'mehnat', 'hard work', 'consistency', 'relentless', 'moving forward', 'determination'],
  },

  'mindset_focus_lane': {
    id: 'mindset_focus_lane',
    name: 'Focus on Your Own Lane (No Comparison)',
    category: 'comparison',
    viewBox: '0 0 100 100',
    strokes: [
      // Central Protected Running Lane
      { d: 'M 35 15 L 20 85 M 65 15 L 80 85', len: 150, strokeWidth: 3, colorKey: 'accent', order: 0 },
      // Center Runner in Focus
      { d: 'M 50 30 A 6 6 0 1 0 50 42 A 6 6 0 1 0 50 30 M 50 42 L 50 64 M 50 64 L 42 78 M 50 64 L 58 78', len: 80, strokeWidth: 3, colorKey: 'success', order: 1 },
      // Target Star at the end of your lane
      { d: 'M 50 14 L 50 8 M 46 11 L 54 11', len: 20, strokeWidth: 2.5, colorKey: 'highlight', order: 2 },
      // Faded/Crossed out outside noise (left and right distractions blocked)
      { d: 'M 8 40 L 22 40 M 12 34 L 18 46 M 78 40 L 92 40 M 82 34 L 88 46', len: 60, strokeWidth: 2, colorKey: 'danger', order: 3 },
    ],
    keywords: ['compare', 'comparison', 'tulna', 'focus', 'lane', 'noise', 'own path', 'self', 'unique', 'mindset', 'distraction'],
  },

  'dream_big_vision': {
    id: 'dream_big_vision',
    name: 'Dream Big & Reaching High',
    category: 'story',
    viewBox: '0 0 100 100',
    strokes: [
      // Figure looking up at the summit
      { d: 'M 32 60 A 7 7 0 1 0 32 74 A 7 7 0 1 0 32 60 M 32 74 L 32 92 M 32 78 L 44 68 M 32 78 L 22 86', len: 80, strokeWidth: 3, order: 0 },
      // Mountain Peak Summit in background
      { d: 'M 10 92 L 68 28 L 94 92 M 52 44 L 84 92', len: 180, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Massive Glowing Dream Star above peak
      { d: 'M 68 18 L 71 10 L 79 13 L 74 20 L 78 28 L 70 26 L 65 32 L 64 24 L 56 22 L 63 16 Z', len: 90, strokeWidth: 2.5, colorKey: 'highlight', order: 2 },
      // Radiating Dream Light Beams
      { d: 'M 50 20 L 42 16 M 85 15 L 93 11 M 86 34 L 94 38 M 52 30 L 44 36', len: 60, strokeWidth: 2, colorKey: 'highlight', order: 3 },
    ],
    keywords: ['dream', 'sapna', 'vision', 'big', 'bada', 'future', 'star', 'mountain', 'summit', 'aim', 'ambition', 'hope', 'goal', 'reach'],
  },

  'college_building': {
    id: 'college_building',
    name: 'College / University Campus',
    category: 'location',
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 16 90 L 16 48 L 84 48 L 84 90 M 10 90 L 90 90', len: 160, strokeWidth: 3, order: 0 },
      { d: 'M 12 48 L 50 20 L 88 48 Z', len: 130, strokeWidth: 3, colorKey: 'accent', order: 1 },
      { d: 'M 42 20 L 42 8 L 58 8 L 58 20 M 42 8 L 50 2 L 58 8', len: 65, strokeWidth: 2.5, order: 2 },
      { d: 'M 50 11 A 3 3 0 1 0 50 17 A 3 3 0 1 0 50 11 M 50 14 L 52 14', len: 22, strokeWidth: 1.5, colorKey: 'highlight', order: 3 },
      { d: 'M 42 90 L 42 66 C 42 60 58 60 58 66 L 58 90 M 50 62 L 50 90', len: 75, strokeWidth: 2.5, order: 4 },
      { d: 'M 24 58 L 34 58 L 34 72 L 24 72 Z M 66 58 L 76 58 L 76 72 L 66 72 Z', len: 80, strokeWidth: 2, colorKey: 'accent', order: 5 },
    ],
    keywords: ['college', 'university', 'campus', 'school', 'institute', 'darsgah', 'padhai', 'education', 'degree', 'classes'],
  },

  'student_boy_walking': {
    id: 'student_boy_walking',
    name: 'Student Boy Walking with Backpack',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 48 16 A 8 8 0 1 0 48 32 A 8 8 0 1 0 48 16 M 42 18 C 45 13 54 13 56 19', len: 62, strokeWidth: 3, order: 0 },
      { d: 'M 48 32 L 48 60 M 40 40 L 56 40', len: 44, strokeWidth: 3, order: 1 },
      { d: 'M 38 34 C 32 34 30 40 30 50 C 30 58 34 60 38 60 Z M 38 38 L 44 48', len: 60, strokeWidth: 2.5, colorKey: 'accent', order: 2 },
      { d: 'M 48 38 L 60 48 M 48 38 L 38 48', len: 35, strokeWidth: 3, order: 3 },
      { d: 'M 48 60 L 62 76 L 68 90 M 48 60 L 36 74 L 28 88', len: 80, strokeWidth: 3, order: 4 },
      { d: 'M 20 90 L 76 90', len: 56, strokeWidth: 2, colorKey: 'highlight', order: 5 },
    ],
    keywords: ['boy', 'student', 'ladka', 'walking', 'goes', 'commute', 'backpack', 'teen', 'youth', 'young', 'go to college'],
  },

  'house_home': {
    id: 'house_home',
    name: 'Home / Sweet House',
    category: 'location',
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 22 88 L 22 52 L 78 52 L 78 88 M 16 88 L 84 88', len: 155, strokeWidth: 3, order: 0 },
      { d: 'M 18 52 L 50 24 L 82 52 Z', len: 120, strokeWidth: 3, colorKey: 'accent', order: 1 },
      { d: 'M 64 36 L 64 20 L 72 20 L 72 44 M 68 16 C 68 12 74 12 72 8', len: 45, strokeWidth: 2, order: 2 },
      { d: 'M 44 88 L 44 66 L 56 66 L 56 88 M 53 77 A 1 1 0 1 0 53 79 A 1 1 0 1 0 53 77', len: 55, strokeWidth: 2.5, colorKey: 'danger', order: 3 },
      { d: 'M 28 62 L 38 62 L 38 74 L 28 74 Z M 33 62 L 33 74 M 28 68 L 38 68', len: 52, strokeWidth: 2, colorKey: 'highlight', order: 4 },
      { d: 'M 88 88 L 88 70 M 82 70 C 80 62 86 56 92 60 C 98 56 102 62 98 70 C 96 74 84 74 82 70 Z', len: 65, strokeWidth: 2, colorKey: 'success', order: 5 },
    ],
    keywords: ['home', 'house', 'ghar', 'makaan', 'room', 'at home', 'residence', 'family', 'homeward', 'peace'],
  },

  'evening_clock': {
    id: 'evening_clock',
    name: 'Evening Time & Sunset Clock',
    category: 'process',
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 50 18 A 26 26 0 1 0 50 70 A 26 26 0 1 0 50 18', len: 163, strokeWidth: 3, order: 0 },
      { d: 'M 50 44 L 50 28 M 50 44 L 50 58', len: 32, strokeWidth: 3.5, colorKey: 'danger', order: 1 },
      { d: 'M 50 20 L 50 24 M 68 44 L 64 44 M 50 68 L 50 64 M 32 44 L 36 44', len: 24, strokeWidth: 2, order: 2 },
      { d: 'M 50 10 L 50 4 M 76 22 L 82 18 M 84 44 L 92 44 M 24 22 L 18 18 M 16 44 L 8 44', len: 50, strokeWidth: 2.5, colorKey: 'highlight', order: 3 },
      { d: 'M 34 82 L 66 82 M 38 88 L 62 88', len: 56, strokeWidth: 2, colorKey: 'accent', order: 4 },
    ],
    keywords: ['evening', 'shaam', 'clock', 'time', 'after college', 'sunset', 'pm', 'hour', '6pm', 'daily time', 'schedule'],
  },

  'boy_studying_desk': {
    id: 'boy_studying_desk',
    name: 'Student Studying at Desk with Lamp',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 50 28 A 8 8 0 1 0 50 44 A 8 8 0 1 0 50 28 M 44 29 C 48 24 54 24 56 30', len: 62, strokeWidth: 3, order: 0 },
      { d: 'M 50 44 L 50 66 M 40 50 L 50 44 L 60 50', len: 44, strokeWidth: 3, order: 1 },
      { d: 'M 36 68 L 50 66 L 64 68 L 62 76 L 50 74 L 38 76 Z M 50 66 L 50 74', len: 75, strokeWidth: 2.5, colorKey: 'accent', order: 2 },
      { d: 'M 14 76 L 86 76 M 22 76 L 22 92 M 78 76 L 78 92', len: 104, strokeWidth: 3, order: 3 },
      { d: 'M 24 76 L 24 54 L 32 46 M 28 42 L 36 50 M 24 74 L 28 76', len: 48, strokeWidth: 2.5, colorKey: 'highlight', order: 4 },
      { d: 'M 70 20 L 88 20 L 88 40 L 70 40 Z M 78 24 C 76 28 80 32 84 30 C 82 34 76 34 74 30 Z', len: 72, strokeWidth: 2, colorKey: 'accent', order: 5 },
      { d: 'M 72 76 L 84 76 L 84 72 L 72 72 Z M 73 72 L 83 72 L 83 68 L 73 68 Z', len: 48, strokeWidth: 2, order: 6 },
    ],
    keywords: ['study', 'studies', 'studying', 'padhai', 'book', 'desk', 'homework', 'exam', 'learning', 'revision', 'focused', 'knowledge'],
  },

  'calendar_everyday': {
    id: 'calendar_everyday',
    name: 'Weekly Calendar & Habit Loop (Every Day)',
    category: 'process',
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 16 28 L 84 28 L 84 78 L 16 78 Z M 24 22 L 24 30 M 40 22 L 40 30 M 60 22 L 60 30 M 76 22 L 76 30', len: 210, strokeWidth: 3, order: 0 },
      { d: 'M 16 42 L 84 42', len: 68, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      { d: 'M 26 42 L 26 78 M 36 42 L 36 78 M 46 42 L 46 78 M 56 42 L 56 78 M 66 42 L 66 78 M 75 42 L 75 78', len: 216, strokeWidth: 1.5, order: 2 },
      { d: 'M 18 58 L 22 64 L 25 52 M 28 58 L 32 64 L 35 52 M 38 58 L 42 64 L 45 52 M 48 58 L 52 64 L 55 52 M 58 58 L 62 64 L 65 52 M 68 58 L 72 64 L 74 52 M 77 58 L 80 64 L 83 52', len: 90, strokeWidth: 2.5, colorKey: 'success', order: 3 },
      { d: 'M 50 14 C 74 14 88 24 88 50 C 88 74 74 88 50 88 C 26 88 12 74 12 50 M 54 10 L 50 14 L 54 18', len: 170, strokeWidth: 2.5, colorKey: 'danger', order: 4 },
    ],
    keywords: ['every day', 'daily', 'rozana', 'calendar', 'routine', 'habit', 'consistency', 'discipline', 'regular', 'week', 'schedule'],
  },

  'flow_arrow_transition': {
    id: 'flow_arrow_transition',
    name: 'Flow & Travel Arrow',
    category: 'process',
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 14 50 L 76 50 M 64 36 L 80 50 L 64 64', len: 105, strokeWidth: 4, colorKey: 'danger', order: 0 },
      { d: 'M 20 38 Q 48 30 72 38', len: 55, strokeWidth: 2, colorKey: 'accent', order: 1 },
    ],
    keywords: ['arrow', 'flow', 'then', 'after', 'next', 'direction', 'travel', 'commute', 'transition', 'sequence'],
  },

  // ── AI & MODERN TECHNOLOGY (From Master 9:16 Whiteboard Examples) ───────────
  'ai_split_brain': {
    id: 'ai_split_brain',
    name: 'Split Brain (Human Intelligence & AI Circuits)',
    category: 'science',
    viewBox: '0 0 100 100',
    strokes: [
      // Left Human Hemisphere (Organic curves)
      { d: 'M 48 18 C 34 18 24 28 24 42 C 24 50 28 56 26 64 C 24 72 32 82 48 82', len: 140, strokeWidth: 3, order: 0 },
      { d: 'M 32 36 C 40 38 42 48 36 54 C 44 58 42 68 48 70', len: 85, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      // Center dividing seam
      { d: 'M 48 16 L 48 84', len: 68, strokeWidth: 2.5, order: 2 },
      // Right AI Hemisphere (Circuit lines & nodes)
      { d: 'M 52 18 C 66 18 76 28 76 42 C 76 50 72 56 74 64 C 76 72 68 82 52 82', len: 140, strokeWidth: 3, colorKey: 'accent', order: 3 },
      { d: 'M 52 30 L 66 30 L 72 40 M 52 50 L 64 50 L 70 60 M 52 70 L 62 70', len: 80, strokeWidth: 2.5, colorKey: 'highlight', order: 4 },
      // Circuit connection dots
      { d: 'M 72 40 A 2 2 0 1 0 72 44 A 2 2 0 1 0 72 40 M 70 60 A 2 2 0 1 0 70 64 A 2 2 0 1 0 70 60', len: 25, strokeWidth: 2, colorKey: 'danger', order: 5 },
    ],
    keywords: ['ai', 'artificial intelligence', 'brain', 'intelligence', 'think', 'smart', 'machine learning', 'mind', 'deep learning'],
  },

  'database_cylinder': {
    id: 'database_cylinder',
    name: 'Database Storage Cylinder (More Data)',
    category: 'business',
    viewBox: '0 0 100 100',
    strokes: [
      // Top ellipse
      { d: 'M 24 26 C 24 18 76 18 76 26 C 76 34 24 34 24 26 Z', len: 110, strokeWidth: 3, colorKey: 'accent', order: 0 },
      // Tier 1 body
      { d: 'M 24 26 L 24 44 C 24 52 76 52 76 44 L 76 26', len: 120, strokeWidth: 3, order: 1 },
      // Tier 2 body
      { d: 'M 24 44 L 24 62 C 24 70 76 70 76 62 L 76 44', len: 120, strokeWidth: 3, order: 2 },
      // Tier 3 body (bottom)
      { d: 'M 24 62 L 24 80 C 24 88 76 88 76 80 L 76 62', len: 120, strokeWidth: 3, colorKey: 'highlight', order: 3 },
      // Data indicator dots on each ring
      { d: 'M 36 38 A 2 2 0 1 0 36 40 M 36 56 A 2 2 0 1 0 36 58 M 36 74 A 2 2 0 1 0 36 76', len: 20, strokeWidth: 2.5, colorKey: 'success', order: 4 },
    ],
    keywords: ['data', 'more data', 'database', 'storage', 'server', 'information', 'cloud data', 'records', 'inputs', 'files'],
  },

  'microchip_processor': {
    id: 'microchip_processor',
    name: 'Microchip CPU Processor (Powerful Computers)',
    category: 'science',
    viewBox: '0 0 100 100',
    strokes: [
      // Square chip body
      { d: 'M 28 28 L 72 28 L 72 72 L 28 72 Z', len: 176, strokeWidth: 3.5, colorKey: 'accent', order: 0 },
      // Inner AI Core
      { d: 'M 38 38 L 62 38 L 62 62 L 38 62 Z', len: 96, strokeWidth: 2, order: 1 },
      // Top pins
      { d: 'M 36 28 L 36 16 M 46 28 L 46 16 M 54 28 L 54 16 M 64 28 L 64 16', len: 48, strokeWidth: 2.5, order: 2 },
      // Bottom pins
      { d: 'M 36 72 L 36 84 M 46 72 L 46 84 M 54 72 L 54 84 M 64 72 L 64 84', len: 48, strokeWidth: 2.5, order: 3 },
      // Left pins
      { d: 'M 28 36 L 16 36 M 28 46 L 16 46 M 28 54 L 16 54 M 28 64 L 16 64', len: 48, strokeWidth: 2.5, order: 4 },
      // Right pins
      { d: 'M 72 36 L 84 36 M 72 46 L 84 46 M 72 54 L 84 54 M 72 64 L 84 64', len: 48, strokeWidth: 2.5, order: 5 },
      // Spark core
      { d: 'M 44 50 L 56 50 M 50 44 L 50 56', len: 24, strokeWidth: 2.5, colorKey: 'danger', order: 6 },
    ],
    keywords: ['computer', 'powerful', 'hardware', 'processor', 'cpu', 'chip', 'microchip', 'speed', 'computation', 'gpu', 'faster'],
  },

  'neural_network_nodes': {
    id: 'neural_network_nodes',
    name: 'Neural Network Graph (Better Algorithms)',
    category: 'science',
    viewBox: '0 0 100 100',
    strokes: [
      // 5 Interconnected Nodes
      { d: 'M 20 50 A 5 5 0 1 0 20 60 A 5 5 0 1 0 20 50', len: 31, strokeWidth: 2.5, colorKey: 'accent', order: 0 },
      { d: 'M 45 25 A 5 5 0 1 0 45 35 A 5 5 0 1 0 45 25', len: 31, strokeWidth: 2.5, colorKey: 'accent', order: 1 },
      { d: 'M 45 75 A 5 5 0 1 0 45 85 A 5 5 0 1 0 45 75', len: 31, strokeWidth: 2.5, colorKey: 'accent', order: 2 },
      { d: 'M 75 35 A 5 5 0 1 0 75 45 A 5 5 0 1 0 75 35', len: 31, strokeWidth: 2.5, colorKey: 'highlight', order: 3 },
      { d: 'M 75 65 A 5 5 0 1 0 75 75 A 5 5 0 1 0 75 65', len: 31, strokeWidth: 2.5, colorKey: 'highlight', order: 4 },
      // Synaptic connection lines
      { d: 'M 25 53 L 45 32 M 25 57 L 45 78 M 50 32 L 75 38 M 50 32 L 75 68 M 50 78 L 75 42 M 50 78 L 75 72', len: 180, strokeWidth: 2, colorKey: 'danger', order: 5 },
    ],
    keywords: ['algorithm', 'algorithms', 'neural network', 'nodes', 'model', 'weights', 'deep learning', 'better algorithms', 'logic', 'code'],
  },

  'earth_globe_future': {
    id: 'earth_globe_future',
    name: 'Earth Globe (Changing Our World)',
    category: 'general',
    viewBox: '0 0 100 100',
    strokes: [
      // Globe circular boundary
      { d: 'M 50 16 A 34 34 0 1 0 50 84 A 34 34 0 1 0 50 16', len: 213, strokeWidth: 3.5, colorKey: 'accent', order: 0 },
      // Continents (Americas & Eurasia contours)
      { d: 'M 28 32 C 34 36 40 32 38 44 C 36 52 44 58 40 68 C 36 76 30 74 34 70', len: 95, strokeWidth: 2.5, colorKey: 'success', order: 1 },
      { d: 'M 54 26 C 62 24 74 30 76 40 C 72 44 66 42 62 48 C 66 58 78 62 72 74', len: 90, strokeWidth: 2.5, colorKey: 'success', order: 2 },
      // Surrounding burst spark lines
      { d: 'M 50 8 L 50 2 M 80 20 L 86 16 M 92 50 L 98 50 M 80 80 L 86 84 M 20 20 L 14 16 M 8 50 L 2 50 M 20 80 L 14 84', len: 75, strokeWidth: 2.5, colorKey: 'highlight', order: 3 },
    ],
    keywords: ['world', 'earth', 'global', 'future', 'duniya', 'planet', 'international', 'society', 'humanity', 'impact', 'changing our world'],
  },

  'growth_trend_chart': {
    id: 'growth_trend_chart',
    name: 'Growth Trend Bar Chart & Ascending Arrow',
    category: 'business',
    viewBox: '0 0 100 100',
    strokes: [
      // Axes (X and Y baseline)
      { d: 'M 14 16 L 14 84 L 92 84', len: 146, strokeWidth: 3, order: 0 },
      // Bar 1 (2020 small)
      { d: 'M 24 84 L 24 64 L 38 64 L 38 84 Z', len: 68, strokeWidth: 2.5, order: 1 },
      // Bar 2 (Medium)
      { d: 'M 46 84 L 46 48 L 60 48 L 60 84 Z', len: 100, strokeWidth: 2.5, colorKey: 'accent', order: 2 },
      // Bar 3 (2024 tall with diagonal hatch stripes)
      { d: 'M 68 84 L 68 30 L 82 30 L 82 84 Z M 68 42 L 82 36 M 68 56 L 82 50 M 68 70 L 82 64', len: 160, strokeWidth: 2.5, colorKey: 'accent', order: 3 },
      // Upward trend arrow surging to top right
      { d: 'M 20 68 Q 50 44 86 22 M 74 22 L 86 22 L 86 34', len: 90, strokeWidth: 3.5, colorKey: 'danger', order: 4 },
    ],
    keywords: ['market size', 'growth in numbers', 'stats', 'numbers', 'chart', 'bars', 'uptrend', 'rapidly', 'billions', '3x growth', 'revenue'],
  },

  'automation_gears': {
    id: 'automation_gears',
    name: 'Automation Interlocking Gears',
    category: 'process',
    viewBox: '0 0 100 100',
    strokes: [
      // Main Gear 1
      { d: 'M 35 25 L 45 25 L 43 32 L 51 35 L 57 29 L 64 36 L 58 42 L 61 50 L 68 48 L 68 58 L 61 56 L 58 64 L 64 70 L 57 77 L 51 71 L 43 74 L 45 81 L 35 81 Z', len: 210, strokeWidth: 2.5, colorKey: 'accent', order: 0 },
      // Center hole Gear 1
      { d: 'M 40 45 A 8 8 0 1 0 40 61 A 8 8 0 1 0 40 45', len: 50, strokeWidth: 2.5, order: 1 },
      // Smaller Gear 2 (Interlocking)
      { d: 'M 72 18 L 80 18 L 85 24 L 85 32 L 80 38 L 72 38 L 67 32 Z', len: 75, strokeWidth: 2, colorKey: 'highlight', order: 2 },
    ],
    keywords: ['automate', 'automation', 'automate work', 'gears', 'efficiency', 'system', 'engine', 'workflow', 'streamlined'],
  },

  'stickman_summary_pointer': {
    id: 'stickman_summary_pointer',
    name: 'Stickman Presenter Pointing to Summary',
    category: 'character',
    viewBox: '0 0 100 100',
    strokes: [
      // Smiling Head
      { d: 'M 32 18 A 10 10 0 1 0 32 38 A 10 10 0 1 0 32 18', len: 63, strokeWidth: 3, order: 0 },
      // Smile & Eyes
      { d: 'M 28 26 L 28 28 M 36 26 L 36 28 M 28 32 Q 32 36 36 32', len: 20, strokeWidth: 2, order: 1 },
      // Body
      { d: 'M 32 38 L 32 70', len: 32, strokeWidth: 3, order: 2 },
      // Right Arm Pointing eagerly to the right box
      { d: 'M 32 46 L 56 42 L 68 38', len: 38, strokeWidth: 3.5, colorKey: 'danger', order: 3 },
      // Left Arm on hip
      { d: 'M 32 46 L 20 54 L 26 62', len: 26, strokeWidth: 2.5, order: 4 },
      // Legs
      { d: 'M 32 70 L 22 92 M 32 70 L 42 92', len: 48, strokeWidth: 3, order: 5 },
      // Summary Card Outline on the right
      { d: 'M 54 20 L 94 20 C 96 20 98 22 98 24 L 98 64 C 98 66 96 68 94 68 L 54 68 C 52 68 50 66 50 64 L 50 24 C 50 22 52 20 54 20 Z', len: 180, strokeWidth: 2.5, colorKey: 'accent', order: 6 },
    ],
    keywords: ['in short', 'summary', 'conclusion', 'takeaway', 'finally', 'message', 'result', 'remember', 'wrap up', 'stickman'],
  },
};

// ── Smart Semantic Keyword Resolver (Zero Repetition Hash Fallback) ─────────
const FALLBACK_POOL = [
  'ai_split_brain',
  'growth_trend_chart',
  'college_building',
  'student_boy_walking',
  'boy_studying_desk',
  'calendar_everyday',
  'house_home',
  'evening_clock',
  'microchip_processor',
  'database_cylinder',
  'neural_network_nodes',
  'earth_globe_future',
  'automation_gears',
  'stickman_summary_pointer',
  'science_lightbulb_idea',
  'business_growth_chart',
  'concept_zero_to_one',
  'character_burning_passion',
  'business_target_bullseye',
  'dream_big_vision',
  'mindset_focus_lane',
  'process_step_curved_arrow',
  'character_celebration',
  'money_growth_coins',
  'business_handshake',
  'character_thinking',
];

export function resolveVectorDrawing(keywordOrText?: string): VectorDrawingDef {
  if (!keywordOrText) return WHITEBOARD_VECTOR_DRAWINGS['science_lightbulb_idea'];
  const text = keywordOrText.toLowerCase().trim();

  // 1. Direct keyword match
  for (const def of Object.values(WHITEBOARD_VECTOR_DRAWINGS)) {
    for (const kw of def.keywords) {
      if (text.includes(kw)) {
        return def;
      }
    }
  }

  // 2. Hash-based diverse fallback rotation so consecutive scenes never repeat the same icon
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const poolIndex = Math.abs(hash) % FALLBACK_POOL.length;
  const pickedId = FALLBACK_POOL[poolIndex];

  return WHITEBOARD_VECTOR_DRAWINGS[pickedId] || WHITEBOARD_VECTOR_DRAWINGS['science_lightbulb_idea'];
}
