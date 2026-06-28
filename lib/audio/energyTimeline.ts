/**
 * energyTimeline.ts
 *
 * Pre-computes a per-frame audio energy map from Groq word timestamps.
 * No audio analysis needed at render time — all computed server-side before Lambda render.
 *
 * Core insight: word density from Groq timestamps is a strong proxy for audio energy:
 *   - Many short words close together = high energy / fast speech
 *   - Long pauses between words = low energy / calm moment
 *   - Word emphasis (capitalized, long syllables) = peak moment
 *
 * Output: number[] — one energy value [0.0–1.0] per frame at 30fps
 */

const FPS = 30;

export type WordTiming = {
  word: string;
  start: number;
  end: number;
};

/**
 * Build a per-frame energy timeline from Groq word timestamps.
 * Returns a Float32Array of energy values, one per frame.
 */
export function buildEnergyTimeline(
  words: WordTiming[],
  durationSeconds: number,
  fps: number = FPS,
): number[] {
  const totalFrames = Math.ceil(durationSeconds * fps);
  const raw = new Float32Array(totalFrames).fill(0);

  if (!words || words.length === 0) return Array.from(raw);

  // Pass 1: Inject energy at each word onset (start of word)
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const frame = Math.round(w.start * fps);
    if (frame < 0 || frame >= totalFrames) continue;

    // Base energy for each word
    let energy = 0.4;

    // Short word duration = fast speech = higher energy
    const wordDuration = w.end - w.start;
    if (wordDuration < 0.12) energy += 0.3;
    else if (wordDuration < 0.2) energy += 0.15;

    // Short gap to previous word = dense speech = higher energy
    const prevWord = words[i - 1];
    if (prevWord) {
      const gap = w.start - prevWord.end;
      if (gap < 0.05) energy += 0.3;       // nearly no gap — very dense
      else if (gap < 0.15) energy += 0.15; // tight pacing
      else if (gap > 0.5) energy -= 0.15;  // pause — lower energy
    }

    // Emphasis words (ALL CAPS, long words like "AMAZING", "BOOM", "NEVER")
    const upper = w.word.toUpperCase();
    const emphasisWords = new Set(['NEVER','ALWAYS','BEST','FREE','NOW','BOOM','AMAZING','INCREDIBLE',
      'WOW','FIRE','CRAZY','LISTEN','STOP','MUST','ONLY','BIGGEST','SECRET','REAL','TRUTH',
      'SABSE','ZAROOR','PAKKA','SERIOUSLY','BILKUL','ASLI','SACH']);
    if (emphasisWords.has(upper.replace(/[^A-Z]/g, ''))) energy += 0.35;

    // Long word = syllable peak
    if (w.word.length >= 8) energy += 0.1;

    raw[frame] = Math.min(1.0, Math.max(0, energy));
  }

  // Pass 2: Gaussian blur — spread energy across ~3 frames around each peak
  // This prevents hard single-frame spikes that look jittery
  const blurred = new Float32Array(totalFrames);
  const kernel = [0.15, 0.25, 0.2, 0.25, 0.15]; // 5-frame kernel
  const half = Math.floor(kernel.length / 2);

  for (let f = 0; f < totalFrames; f++) {
    let val = 0;
    for (let k = 0; k < kernel.length; k++) {
      const idx = f - half + k;
      if (idx >= 0 && idx < totalFrames) {
        val += raw[idx] * kernel[k];
      }
    }
    blurred[f] = val;
  }

  // Pass 3: Exponential decay — energy fades after each peak
  // This gives that "sustain" feel rather than instant-off
  const decayed = new Float32Array(totalFrames);
  const decayFactor = 0.82; // per frame decay (lower = faster decay)
  let runningPeak = 0;

  for (let f = 0; f < totalFrames; f++) {
    runningPeak = Math.max(blurred[f], runningPeak * decayFactor);
    decayed[f] = runningPeak;
  }

  // Pass 4: Normalize to [0, 1] range
  const max = Math.max(...Array.from(decayed), 0.001);
  const normalized = Array.from(decayed).map(v => v / max);

  return normalized;
}

/**
 * Get smoothed energy at a specific frame with forward-look smoothing.
 * Use this inside Remotion components instead of raw array lookup.
 */
export function getEnergyAtFrame(
  energyTimeline: number[],
  frame: number,
  smoothWindow: number = 3,
): number {
  if (!energyTimeline || energyTimeline.length === 0) return 0;
  const start = Math.max(0, frame - smoothWindow);
  const end = Math.min(energyTimeline.length - 1, frame + smoothWindow);
  let sum = 0;
  let count = 0;
  for (let i = start; i <= end; i++) {
    sum += energyTimeline[i] ?? 0;
    count++;
  }
  return count > 0 ? sum / count : 0;
}

/**
 * Find beat peak frames — frames where energy is locally maximum.
 * Useful for placing effects (sparkle, flash) exactly on beats.
 */
export function findBeatPeaks(
  energyTimeline: number[],
  threshold: number = 0.65,
  minGapFrames: number = 8,
): number[] {
  const peaks: number[] = [];
  let lastPeak = -minGapFrames;

  for (let f = 1; f < energyTimeline.length - 1; f++) {
    const prev = energyTimeline[f - 1] ?? 0;
    const curr = energyTimeline[f] ?? 0;
    const next = energyTimeline[f + 1] ?? 0;

    if (curr > threshold && curr >= prev && curr >= next && f - lastPeak >= minGapFrames) {
      peaks.push(f);
      lastPeak = f;
    }
  }

  return peaks;
}
