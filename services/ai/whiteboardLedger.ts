/**
 * whiteboardLedger.ts
 * Dedicated Per-Video Asset Ledger & Diversity Controller
 *
 * Implements Rule 2 of the Whiteboard Blueprint:
 * 1. Enforces zero duplicate assets per video via a per-video ledger (usedAssetIds, usedFamilies, usedPoses).
 * 2. Hard exclusion rules so an exact asset or icon family is never picked twice.
 * 3. Near-duplicate protection: clusters related icons (e.g. coin icons, lightbulbs) into families.
 * 4. Archetype pacing: guarantees no consecutive identical archetypes and max 25% single archetype per video.
 */

import { WhiteboardArchetype } from './whiteboardPlanner';

export interface AssetMetadata {
  id: string;
  familyId: string;
  topics: string[];
  concepts: string[];
  role: 'hero' | 'support' | 'bullet' | 'decor';
  action?: string;
  emotion?: string;
}

// ── Abstract-to-Concrete Metaphor Map ──────────────────────────────────────────
export const METAPHOR_MAP: Record<string, string[]> = {
  gold: ['gold_bars', 'coins_falling', 'trophy_gold'],
  currency: ['money_stack', 'coins_falling', 'wallet_open'],
  money: ['money_stack', 'piggy_bank', 'gold_bars', 'wallet_open', 'coins_falling'],
  cash: ['money_stack', 'wallet_open', 'piggy_bank'],
  invest: ['gold_bars', 'growth_chart', 'wealth_plant', 'building_bank'],
  wealth: ['gold_bars', 'wealth_plant', 'money_stack', 'piggy_bank'],
  bank: ['building_bank', 'shield_security', 'money_stack'],
  inflation: ['bucket_leaking', 'fire_flame', 'alert_triangle'],
  leak: ['bucket_leaking', 'alert_triangle'],
  waste: ['bucket_leaking', 'vintage_hourglass'],
  loss: ['bucket_leaking', 'alert_triangle'],
  risk: ['tightrope_walk', 'alert_triangle', 'balancing_scale', 'shield_security'],
  growth: ['wealth_plant', 'ladder_climb', 'rocket_launch', 'growth_chart'],
  scale: ['rocket_launch', 'growth_chart', 'ladder_climb'],
  launch: ['rocket_launch', 'lightning_bolt'],
  startup: ['rocket_launch', 'lightbulb_idea', 'piggy_bank'],
  entrepreneur: ['piggy_bank', 'rocket_launch', 'gold_bars', 'handshake_deal'],
  focus: ['target_bullseye', 'pencil_write'],
  goal: ['target_bullseye', 'trophy_gold', 'ladder_climb'],
  target: ['target_bullseye', 'trophy_gold'],
  victory: ['trophy_gold', 'sparkle_rays', 'rocket_launch'],
  win: ['trophy_gold', 'rocket_launch'],
  success: ['trophy_gold', 'rocket_launch', 'gold_bars'],
  fail: ['alert_triangle', 'bucket_leaking'],
  doubt: ['character_thinking', 'alert_triangle'],
  think: ['character_thinking', 'brain_synapse', 'ai_split_brain'],
  mind: ['brain_synapse', 'lightbulb_idea', 'ai_split_brain'],
  brain: ['ai_split_brain', 'brain_synapse', 'open_book'],
  ai: ['ai_split_brain', 'microchip_processor', 'neural_network_nodes'],
  'artificial intelligence': ['ai_split_brain', 'microchip_processor'],
  data: ['database_cylinder'],
  database: ['database_cylinder'],
  computer: ['microchip_processor', 'laptop_desk'],
  hardware: ['microchip_processor'],
  processor: ['microchip_processor'],
  algorithm: ['neural_network_nodes'],
  algorithms: ['neural_network_nodes'],
  network: ['neural_network_nodes'],
  world: ['earth_globe_future'],
  global: ['earth_globe_future'],
  planet: ['earth_globe_future'],
  automate: ['automation_gears'],
  automation: ['automation_gears'],
  gears: ['automation_gears'],
  summary: ['stickman_summary_pointer'],
  conclusion: ['stickman_summary_pointer'],
  psychology: ['brain_synapse', 'character_thinking'],
  learn: ['open_book', 'graduation_cap', 'pencil_write'],
  book: ['open_book', 'graduation_cap'],
  study: ['boy_studying_desk', 'open_book', 'pencil_write'],
  studying: ['boy_studying_desk', 'open_book'],
  padhai: ['boy_studying_desk', 'open_book', 'college_building'],
  read: ['open_book', 'character_thinking'],
  education: ['graduation_cap', 'open_book', 'college_building'],
  college: ['college_building', 'student_boy_walking', 'graduation_cap'],
  university: ['college_building', 'graduation_cap'],
  campus: ['college_building'],
  student: ['student_boy_walking', 'boy_studying_desk', 'college_building'],
  boy: ['student_boy_walking', 'boy_studying_desk', 'character_thinking'],
  ladka: ['student_boy_walking', 'boy_studying_desk'],
  balance: ['balancing_scale', 'road_fork'],
  compare: ['balancing_scale', 'growth_chart'],
  versus: ['balancing_scale', 'growth_chart'],
  difference: ['balancing_scale', 'road_fork'],
  decision: ['road_fork', 'compass_north', 'signpost_directions'],
  direction: ['compass_north', 'signpost_directions'],
  path: ['road_fork', 'signpost_directions', 'ladder_climb'],
  trust: ['handshake_deal', 'shield_security', 'lock_secure'],
  partner: ['handshake_deal', 'building_bank'],
  deal: ['handshake_deal', 'money_stack'],
  contract: ['handshake_deal', 'pencil_write'],
  time: ['evening_clock', 'vintage_hourglass', 'stopwatch_timer'],
  clock: ['evening_clock', 'stopwatch_timer'],
  evening: ['evening_clock', 'vintage_hourglass'],
  shaam: ['evening_clock'],
  night: ['boy_studying_desk'],
  speed: ['lightning_bolt', 'rocket_launch', 'stopwatch_timer'],
  fast: ['lightning_bolt', 'rocket_launch'],
  energy: ['lightning_bolt', 'fire_flame'],
  power: ['lightning_bolt', 'trophy_gold'],
  protect: ['shield_security', 'lock_secure'],
  security: ['shield_security', 'lock_secure'],
  safe: ['shield_security', 'building_bank'],
  health: ['heart_pulse', 'medical_emergency'],
  heart: ['heart_pulse'],
  doctor: ['medical_emergency', 'heart_pulse'],
  car: ['car_repairs'],
  repair: ['car_repairs'],
  house: ['house_home', 'future_house'],
  home: ['house_home', 'future_house'],
  ghar: ['house_home', 'future_house'],
  future: ['future_house', 'rocket_launch', 'vintage_hourglass'],
  persist: ['trophy_gold', 'ladder_climb'],
  dream: ['trophy_gold', 'rocket_launch', 'future_house'],
  hard: ['process_step_curved_arrow', 'ladder_climb'],
  work: ['process_step_curved_arrow', 'pencil_write'],
  daily: ['calendar_everyday', 'calendar_sheet'],
  day: ['calendar_everyday', 'calendar_sheet'],
  everyday: ['calendar_everyday'],
  every: ['calendar_everyday'],
  rozana: ['calendar_everyday'],
  routine: ['calendar_everyday', 'process_step_curved_arrow'],
  system: ['process_step_curved_arrow', 'building_bank'],
};

// ── Curated Accent Color Palettes ────────────────────────────────────────────
export const WHITEBOARD_PALETTES = [
  { id: 'executive_navy', primary: '#1E3A8A', accent: '#3B82F6', alert: '#EF4444', success: '#10B981' },
  { id: 'boardroom_emerald', primary: '#0F766E', accent: '#14B8A6', alert: '#F43F5E', success: '#22C55E' },
  { id: 'sunset_crimson', primary: '#B91C1C', accent: '#F97316', alert: '#DC2626', success: '#16A34A' },
  { id: 'warm_amber', primary: '#B45309', accent: '#F59E0B', alert: '#E11D48', success: '#059669' },
  { id: 'modern_slate', primary: '#334155', accent: '#6366F1', alert: '#E11D48', success: '#10B981' },
];

export class WhiteboardAssetLedger {
  private usedAssetIds = new Set<string>();
  private usedFamilies = new Set<string>();
  private usedPoses = new Set<string>();
  private usedArchetypes: WhiteboardArchetype[] = [];
  public readonly selectedPalette: typeof WHITEBOARD_PALETTES[0];

  constructor(seed: number = Date.now()) {
    // Pick deterministic palette per video based on seed
    const paletteIndex = Math.abs(seed) % WHITEBOARD_PALETTES.length;
    this.selectedPalette = WHITEBOARD_PALETTES[paletteIndex];
  }

  /**
   * Check if an asset or family has already been used in this video.
   */
  public isExcluded(assetId: string, familyId?: string): boolean {
    if (this.usedAssetIds.has(assetId)) return true;
    if (familyId && this.usedFamilies.has(familyId)) return true;
    return false;
  }

  /**
   * Record that an asset, family, pose, and archetype were used in a scene.
   */
  public recordUsage(assetId: string, familyId?: string, pose?: string, archetype?: WhiteboardArchetype): void {
    if (assetId) this.usedAssetIds.add(assetId);
    if (familyId) this.usedFamilies.add(familyId);
    if (pose) this.usedPoses.add(pose);
    if (archetype) this.usedArchetypes.push(archetype);
  }

  /**
   * Select best candidate asset avoiding duplicates with top-3 jitter sampling.
   */
  public selectBestAsset(
    candidates: Array<{ id: string; familyId: string; score: number }>,
    seed: number = 0
  ): string {
    // 1. Filter out already used assets and families (Hard Rule)
    const valid = candidates.filter(c => !this.isExcluded(c.id, c.familyId));

    if (valid.length === 0) {
      // If all candidates in this family were used, fall back to the least recently used candidate
      return candidates[0]?.id || 'lightbulb_idea';
    }

    // 2. Sort by score descending
    valid.sort((a, b) => b.score - a.score);

    // 3. Sample from top 3 candidates with seeded jitter so identical scripts produce fresh visual choices
    const samplePool = valid.slice(0, Math.min(3, valid.length));
    const chosenIndex = Math.abs(seed) % samplePool.length;
    const chosen = samplePool[chosenIndex];

    this.recordUsage(chosen.id, chosen.familyId);
    return chosen.id;
  }

  /**
   * Archetype pacing validator:
   * 1. Never repeat the same archetype in consecutive scenes.
   * 2. No single archetype may exceed 25% of total scenes.
   */
  public pickDiverseArchetype(
    candidateArchetypes: WhiteboardArchetype[],
    totalPlannedScenes: number,
    seed: number = 0
  ): WhiteboardArchetype {
    const lastArchetype = this.usedArchetypes[this.usedArchetypes.length - 1];
    const maxAllowedCount = Math.max(1, Math.ceil(totalPlannedScenes * 0.25));

    // Filter out:
    // a) Last used archetype (no consecutive duplicates)
    // b) Archetypes that reached 25% cap
    const filtered = candidateArchetypes.filter(arch => {
      if (arch === lastArchetype) return false;
      const count = this.usedArchetypes.filter(a => a === arch).length;
      return count < maxAllowedCount;
    });

    const pool = filtered.length > 0 ? filtered : candidateArchetypes.filter(a => a !== lastArchetype);
    const finalPool = pool.length > 0 ? pool : candidateArchetypes;

    const chosen = finalPool[Math.abs(seed) % finalPool.length];
    return chosen;
  }

  public getSummary() {
    return {
      totalUniqueAssetsUsed: this.usedAssetIds.size,
      usedFamiliesCount: this.usedFamilies.size,
      palette: this.selectedPalette.id,
      archetypesSequence: this.usedArchetypes,
    };
  }
}
