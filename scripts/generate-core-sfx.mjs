import {mkdir, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'public', 'assets', 'reusable', 'sound-effects');
const sampleRate = 48000;

const library = [
  ['whoosh-short', 'Whoosh Short', 'transition', ['whoosh', 'short', 'scene-change']],
  ['whoosh-medium', 'Whoosh Medium', 'transition', ['whoosh', 'medium', 'card-transition']],
  ['whoosh-fast', 'Whoosh Fast', 'transition', ['whoosh', 'fast', 'swipe']],
  ['swipe-left', 'Swipe Left', 'transition', ['swipe', 'left', 'image-change']],
  ['swipe-right', 'Swipe Right', 'transition', ['swipe', 'right', 'image-change']],
  ['air-rush', 'Air Rush', 'transition', ['air', 'rush', 'fast-motion']],
  ['transition-sweep', 'Transition Sweep', 'transition', ['sweep', 'scene-change']],
  ['pop-soft', 'Pop Soft', 'text-pop', ['pop', 'soft', 'keyword']],
  ['pop-medium', 'Pop Medium', 'text-pop', ['pop', 'medium', 'stat']],
  ['pop-strong', 'Pop Strong', 'text-pop', ['pop', 'strong', 'cta']],
  ['bubble-pop', 'Bubble Pop', 'text-pop', ['bubble', 'pop', 'playful']],
  ['ui-click-pop', 'UI Click Pop', 'text-pop', ['ui', 'click', 'pop']],
  ['mouse-click', 'Mouse Click', 'ui', ['mouse', 'click', 'interface']],
  ['soft-click', 'Soft Click', 'ui', ['soft', 'click', 'interface']],
  ['keyboard-tap', 'Keyboard Tap', 'ui', ['keyboard', 'typing', 'tap']],
  ['notification-ding', 'Notification Ding', 'ui', ['notification', 'ding', 'app']],
  ['success-chime', 'Success Chime', 'ui', ['success', 'chime', 'positive']],
  ['toggle-switch', 'Toggle Switch', 'ui', ['toggle', 'switch', 'interface']],
  ['digital-beep', 'Digital Beep', 'ui', ['digital', 'beep', 'tech']],
  ['counter-tick', 'Counter Tick', 'statistic', ['counter', 'tick', 'number']],
  ['count-up-beep', 'Count Up Beep', 'statistic', ['count-up', 'beep', 'number']],
  ['data-pulse', 'Data Pulse', 'statistic', ['data', 'pulse', 'analytics']],
  ['score-reveal', 'Score Reveal', 'statistic', ['score', 'reveal', 'number']],
  ['digital-tick', 'Digital Tick', 'statistic', ['digital', 'tick', 'stat']],
  ['hit-soft', 'impact', 'impact', ['hit', 'soft', 'emphasis']],
  ['hit-medium', 'Hit Medium', 'impact', ['hit', 'medium', 'hook']],
  ['hit-strong', 'Hit Strong', 'impact', ['hit', 'strong', 'reveal']],
  ['bass-drop-light', 'Bass Drop Light', 'impact', ['bass-drop', 'light', 'shock']],
  ['cinematic-boom', 'Cinematic Boom', 'impact', ['boom', 'cinematic', 'important']],
  ['warning-beep', 'Warning Beep', 'warning', ['warning', 'beep', 'risk']],
  ['alarm-tick', 'Alarm Tick', 'warning', ['alarm', 'tick', 'deadline']],
  ['negative-buzz', 'Negative Buzz', 'warning', ['negative', 'buzz', 'mistake']],
  ['error-sound', 'Error Sound', 'warning', ['error', 'sound', 'wrong']],
  ['achievement-unlock', 'Achievement Unlock', 'success', ['achievement', 'unlock', 'success']],
  ['trophy-sound', 'Trophy Sound', 'success', ['trophy', 'win', 'achievement']],
  ['cash-register', 'Cash Register', 'finance', ['cash', 'register', 'payment']],
  ['coin-drop', 'Coin Drop', 'finance', ['coin', 'drop', 'money']],
  ['success-bell', 'Success Bell', 'success', ['success', 'bell', 'selected']],
  ['coin-stack', 'Coin Stack', 'finance', ['coin', 'stack', 'salary']],
  ['cash-count', 'Cash Count', 'finance', ['cash', 'count', 'money']],
  ['wallet-open', 'Wallet Open', 'finance', ['wallet', 'open', 'payment']],
  ['payment-success', 'Payment Success', 'finance', ['payment', 'success', 'upi']],
  ['pen-writing', 'Pen Writing', 'education', ['pen', 'writing', 'notes']],
  ['page-flip', 'Page Flip', 'education', ['page', 'flip', 'study']],
  ['paper-turn', 'Paper Turn', 'education', ['paper', 'turn', 'exam']],
  ['exam-bell', 'Exam Bell', 'education', ['exam', 'bell', 'school']],
  ['stamp-approved', 'Stamp Approved', 'education', ['stamp', 'approved', 'document']],
  ['typing-fast', 'Typing Fast', 'office', ['typing', 'fast', 'keyboard']],
  ['printer-sound', 'Printer Sound', 'office', ['printer', 'document', 'office']],
  ['end-stinger', 'End Stinger', 'cta', ['end', 'stinger', 'subscribe']],
];

async function main() {
  await mkdir(outDir, {recursive: true});
  await rm(path.join(outDir, '.gitkeep'), {force: true});

  const items = [];
  for (const [slug, title, category, tags] of library) {
    const fileName = `${slug}.wav`;
    const filePath = path.join(outDir, fileName);
    const samples = renderEffect(slug);
    await writeFile(filePath, wav(samples));
    items.push({
      id: slug,
      title,
      category,
      style: 'synthetic-video-safe',
      use_case: useCase(category),
      file: `reusable/sound-effects/${fileName}`,
      src: `/assets/reusable/sound-effects/${fileName}`,
      tags: [...new Set([category, ...tags, 'sfx', 'short-reel', 'reusable'])],
      durationSeconds: Number((samples.length / sampleRate).toFixed(3)),
      license: 'generated in-repo; no third-party sample recording',
    });
  }

  await writeFile(
    path.join(outDir, 'sound-effects-manifest.json'),
    `${JSON.stringify({
      version: 1,
      generatedAt: new Date().toISOString(),
      purpose: 'Core reusable SFX library for Itnavideo reels.',
      count: items.length,
      items,
    }, null, 2)}\n`,
    'utf8',
  );

  console.log(`Generated ${items.length} reusable SFX -> ${path.relative(root, outDir)}`);
}

function renderEffect(slug) {
  if (slug.includes('whoosh') || slug.includes('swipe') || slug.includes('rush') || slug.includes('sweep')) return whoosh(slug);
  if (slug.includes('pop')) return pop(slug);
  if (slug.includes('click') || slug.includes('tap') || slug.includes('toggle')) return click(slug);
  if (slug.includes('ding') || slug.includes('chime') || slug.includes('bell') || slug.includes('unlock') || slug.includes('trophy')) return chime(slug);
  if (slug.includes('tick') || slug.includes('beep') || slug.includes('pulse') || slug.includes('score')) return digital(slug);
  if (slug.includes('hit') || slug.includes('drop') || slug.includes('boom') || slug.includes('buzz') || slug.includes('error')) return impact(slug);
  if (slug.includes('cash') || slug.includes('coin') || slug.includes('wallet') || slug.includes('payment')) return money(slug);
  if (slug.includes('pen') || slug.includes('page') || slug.includes('paper') || slug.includes('stamp')) return paper(slug);
  if (slug.includes('typing')) return typing(slug);
  if (slug.includes('printer')) return printer(slug);
  if (slug.includes('stinger')) return stinger();
  return digital(slug);
}

function whoosh(slug) {
  const duration = slug.includes('medium') || slug.includes('sweep') ? 0.52 : slug.includes('fast') ? 0.22 : 0.34;
  return synth(duration, (t, d) => {
    const sweep = slug.includes('left') ? 900 - 620 * t / d : 280 + 850 * t / d;
    const n = noise(t * 9000) * envelope(t, d, 0.02, 0.18);
    return (Math.sin(2 * Math.PI * sweep * t) * 0.18 + n * 0.55) * 0.42;
  });
}

function pop(slug) {
  const strong = slug.includes('strong') ? 1.3 : slug.includes('medium') ? 1 : 0.7;
  return synth(0.18, (t, d) => {
    const pitch = 360 + 520 * Math.exp(-t * 34);
    return Math.sin(2 * Math.PI * pitch * t) * envelope(t, d, 0.003, 0.04) * 0.55 * strong;
  });
}

function click(slug) {
  const duration = slug.includes('keyboard') || slug.includes('typing') ? 0.08 : 0.065;
  return synth(duration, (t, d) => {
    const f = slug.includes('soft') ? 1350 : 2400;
    return (Math.sin(2 * Math.PI * f * t) * 0.25 + noise(t * 12000) * 0.24) * envelope(t, d, 0.001, 0.012);
  });
}

function chime(slug) {
  const freqs = slug.includes('success') || slug.includes('unlock') ? [523.25, 659.25, 783.99] : [880, 1174.66];
  return synth(0.62, (t, d) => freqs.reduce((sum, f, i) => sum + Math.sin(2 * Math.PI * f * t) * envelope(Math.max(0, t - i * 0.08), d - i * 0.08, 0.004, 0.18) * 0.18, 0));
}

function digital(slug) {
  const duration = slug.includes('pulse') || slug.includes('score') ? 0.34 : 0.14;
  return synth(duration, (t, d) => {
    const f = slug.includes('warning') || slug.includes('alarm') ? 720 : 1040;
    const gate = Math.sin(2 * Math.PI * 18 * t) > 0 ? 1 : 0.4;
    return Math.sin(2 * Math.PI * f * t) * gate * envelope(t, d, 0.002, 0.05) * 0.36;
  });
}

function impact(slug) {
  const duration = slug.includes('boom') ? 0.78 : slug.includes('strong') || slug.includes('drop') ? 0.48 : 0.28;
  return synth(duration, (t, d) => {
    const low = Math.sin(2 * Math.PI * (95 - 48 * t / d) * t) * envelope(t, d, 0.002, 0.22);
    const snap = noise(t * 8000) * envelope(t, Math.min(d, 0.12), 0.001, 0.04);
    return (low * 0.75 + snap * 0.28) * 0.62;
  });
}

function money(slug) {
  const freqs = slug.includes('coin') ? [1760, 2349, 3136] : [900, 1200, 1500];
  return synth(0.46, (t, d) => {
    const clicks = Math.sin(2 * Math.PI * 28 * t) > 0.82 ? noise(t * 16000) * 0.25 : 0;
    const ring = freqs.reduce((sum, f, i) => sum + Math.sin(2 * Math.PI * f * t) * envelope(Math.max(0, t - i * 0.045), d, 0.001, 0.12) * 0.11, 0);
    return ring + clicks * envelope(t, d, 0.001, 0.2);
  });
}

function paper(slug) {
  const duration = slug.includes('stamp') ? 0.24 : 0.5;
  return synth(duration, (t, d) => {
    const scratch = noise(t * 18000) * envelope(t, d, 0.02, 0.16) * 0.28;
    const thump = slug.includes('stamp') ? Math.sin(2 * Math.PI * 130 * t) * envelope(t, 0.18, 0.001, 0.05) * 0.45 : 0;
    return scratch + thump;
  });
}

function typing(slug) {
  const duration = slug.includes('fast') ? 0.72 : 0.3;
  return synth(duration, (t, d) => {
    const hit = Math.sin(2 * Math.PI * 12 * t) > 0.78 ? click('keyboard-tap')[Math.floor((t % 0.08) * sampleRate)] || 0 : 0;
    return hit * envelope(t, d, 0.001, 0.08);
  });
}

function printer() {
  return synth(0.74, (t, d) => (noise(t * 10000) * 0.18 + Math.sin(2 * Math.PI * 44 * t) * 0.08) * envelope(t, d, 0.03, 0.18));
}

function stinger() {
  return synth(0.72, (t, d) => {
    const a = Math.sin(2 * Math.PI * 392 * t) + Math.sin(2 * Math.PI * 587.33 * t) + Math.sin(2 * Math.PI * 783.99 * t);
    return a * envelope(t, d, 0.01, 0.24) * 0.16;
  });
}

function synth(duration, fn) {
  const length = Math.max(1, Math.round(duration * sampleRate));
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    samples[i] = clamp(fn(i / sampleRate, duration), -0.95, 0.95);
  }
  return samples;
}

function envelope(t, duration, attack, release) {
  if (duration <= 0) return 0;
  const a = Math.min(1, t / Math.max(attack, 0.001));
  const r = Math.min(1, Math.max(0, (duration - t) / Math.max(release, 0.001)));
  return Math.sin(Math.min(a, r) * Math.PI / 2);
}

function noise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function wav(samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    buffer.writeInt16LE(Math.round(clamp(samples[i], -1, 1) * 32767), 44 + i * 2);
  }
  return buffer;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function useCase(category) {
  const cases = {
    transition: 'Scene changes, card transitions, image changes.',
    'text-pop': 'Keywords, statistics, CTA text, and reveal moments.',
    ui: 'Finance, AI, tech, SaaS, forms, and interface actions.',
    statistic: 'Salary, revenue, vacancy, exam stats, and count-up moments.',
    impact: 'Hooks, shocking facts, and important revelations.',
    warning: 'Mistakes, risks, scams, errors, and warning cards.',
    success: 'Job selection, achievement, positive CTA, and income growth.',
    finance: 'Salary, banking, investment, payment, and business scenes.',
    education: 'SSC, UPSC, RBI, IBPS, notes, documents, and study scenes.',
    office: 'Corporate jobs, career videos, office workflows, and documents.',
    cta: 'Like, comment, follow, subscribe, and ending moments.',
  };
  return cases[category] || 'General explainer reel sound cue.';
}

await main();
