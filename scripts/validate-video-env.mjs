import fs from 'fs';
import path from 'path';

loadEnvFile('.env');
loadEnvFile('.env.local');

const required = [
  'VIDEO_QUALITY_PRESET',
  'TARGET_WIDTH',
  'TARGET_HEIGHT',
  'PREMIUM_VIDEO_QUALITY_PRESET',
  'PREMIUM_TARGET_WIDTH',
  'PREMIUM_TARGET_HEIGHT',
  'MAX_AUDIO_SIZE_MB',
  'MAX_AUDIO_DURATION_SEC',
  'MAX_CONCURRENT_RENDERS',
  'RENDER_TIMEOUT_SEC',
  'RENDER_PRIMARY_TIMEOUT_SEC',
  'TEMP_ASSET_RETENTION_HOURS',
  'FREE_TIER_RENDER_ENABLED',
  'FREE_TIER_QUEUE_LIMIT',
  'NEXT_PUBLIC_VIDEO_QUALITY_PRESET',
  'NEXT_PUBLIC_TARGET_WIDTH',
  'NEXT_PUBLIC_TARGET_HEIGHT',
  'NEXT_PUBLIC_PREMIUM_VIDEO_QUALITY_PRESET',
  'NEXT_PUBLIC_PREMIUM_TARGET_WIDTH',
  'NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT',
  'NEXT_PUBLIC_MAX_AUDIO_SIZE_MB',
  'NEXT_PUBLIC_MAX_AUDIO_DURATION_SEC',
];

const missing = required.filter((key) => !hasValue(process.env[key]));
if (missing.length) {
  fail(`Missing video pipeline env keys: ${missing.join(', ')}`);
}

const numericKeys = [
  'TARGET_WIDTH',
  'TARGET_HEIGHT',
  'PREMIUM_TARGET_WIDTH',
  'PREMIUM_TARGET_HEIGHT',
  'MAX_AUDIO_SIZE_MB',
  'MAX_AUDIO_DURATION_SEC',
  'MAX_CONCURRENT_RENDERS',
  'RENDER_TIMEOUT_SEC',
  'RENDER_PRIMARY_TIMEOUT_SEC',
  'TEMP_ASSET_RETENTION_HOURS',
  'FREE_TIER_QUEUE_LIMIT',
  'NEXT_PUBLIC_TARGET_WIDTH',
  'NEXT_PUBLIC_TARGET_HEIGHT',
  'NEXT_PUBLIC_PREMIUM_TARGET_WIDTH',
  'NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT',
  'NEXT_PUBLIC_MAX_AUDIO_SIZE_MB',
  'NEXT_PUBLIC_MAX_AUDIO_DURATION_SEC',
];

for (const key of numericKeys) {
  const value = Number(process.env[key]);
  if (!Number.isFinite(value) || value <= 0) {
    fail(`${key} must be a positive number.`);
  }
}

for (const key of ['TARGET_WIDTH', 'TARGET_HEIGHT', 'PREMIUM_TARGET_WIDTH', 'PREMIUM_TARGET_HEIGHT', 'NEXT_PUBLIC_TARGET_WIDTH', 'NEXT_PUBLIC_TARGET_HEIGHT', 'NEXT_PUBLIC_PREMIUM_TARGET_WIDTH', 'NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT']) {
  if (Number(process.env[key]) % 2 !== 0) {
    fail(`${key} must be an even number for H.264/yuv420p output.`);
  }
}

assertMirror('VIDEO_QUALITY_PRESET', 'NEXT_PUBLIC_VIDEO_QUALITY_PRESET');
assertMirror('TARGET_WIDTH', 'NEXT_PUBLIC_TARGET_WIDTH');
assertMirror('TARGET_HEIGHT', 'NEXT_PUBLIC_TARGET_HEIGHT');
assertMirror('PREMIUM_VIDEO_QUALITY_PRESET', 'NEXT_PUBLIC_PREMIUM_VIDEO_QUALITY_PRESET');
assertMirror('PREMIUM_TARGET_WIDTH', 'NEXT_PUBLIC_PREMIUM_TARGET_WIDTH');
assertMirror('PREMIUM_TARGET_HEIGHT', 'NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT');
assertMirror('MAX_AUDIO_SIZE_MB', 'NEXT_PUBLIC_MAX_AUDIO_SIZE_MB');
assertMirror('MAX_AUDIO_DURATION_SEC', 'NEXT_PUBLIC_MAX_AUDIO_DURATION_SEC');

if (Number(process.env.RENDER_PRIMARY_TIMEOUT_SEC) >= Number(process.env.RENDER_TIMEOUT_SEC)) {
  fail('RENDER_PRIMARY_TIMEOUT_SEC must be lower than RENDER_TIMEOUT_SEC so fallback render still has time to run.');
}

if (!['0', '1', 'true', 'false', 'yes', 'no', 'on', 'off'].includes(String(process.env.FREE_TIER_RENDER_ENABLED).trim().toLowerCase())) {
  fail('FREE_TIER_RENDER_ENABLED must be a boolean flag such as 1, 0, true, or false.');
}

console.log(
  `Video pipeline env OK: ${process.env.VIDEO_QUALITY_PRESET} ${process.env.TARGET_WIDTH}x${process.env.TARGET_HEIGHT}, max ${process.env.MAX_AUDIO_DURATION_SEC}s, concurrency ${process.env.MAX_CONCURRENT_RENDERS}, free queue limit ${process.env.FREE_TIER_QUEUE_LIMIT}.`,
);

function loadEnvFile(fileName) {
  const filePath = path.resolve(fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^['"]|['"]$/g, '');
  }
}

function assertMirror(privateKey, publicKey) {
  if (String(process.env[privateKey]) !== String(process.env[publicKey])) {
    fail(`${publicKey} must match ${privateKey}.`);
  }
}

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function fail(message) {
  console.error(`Video pipeline env error: ${message}`);
  process.exit(1);
}
