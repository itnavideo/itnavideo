export const videoPipelineConfig = {
  qualityPreset: getStringEnv('NEXT_PUBLIC_VIDEO_QUALITY_PRESET', getStringEnv('VIDEO_QUALITY_PRESET', '720p')),
  targetWidth: getNumberEnv('NEXT_PUBLIC_TARGET_WIDTH', getNumberEnv('TARGET_WIDTH', 720)),
  targetHeight: getNumberEnv('NEXT_PUBLIC_TARGET_HEIGHT', getNumberEnv('TARGET_HEIGHT', 1280)),
  premiumQualityPreset: getStringEnv('NEXT_PUBLIC_PREMIUM_VIDEO_QUALITY_PRESET', getStringEnv('PREMIUM_VIDEO_QUALITY_PRESET', '1080p')),
  premiumTargetWidth: getNumberEnv('NEXT_PUBLIC_PREMIUM_TARGET_WIDTH', getNumberEnv('PREMIUM_TARGET_WIDTH', 1080)),
  premiumTargetHeight: getNumberEnv('NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT', getNumberEnv('PREMIUM_TARGET_HEIGHT', 1920)),
  maxUploadSizeMb: getNumberEnv('NEXT_PUBLIC_MAX_AUDIO_SIZE_MB', getNumberEnv('MAX_AUDIO_SIZE_MB', 50)),
  maxDurationSec: getNumberEnv('NEXT_PUBLIC_MAX_AUDIO_DURATION_SEC', getNumberEnv('MAX_AUDIO_DURATION_SEC', 300)),
  maxConcurrentRenders: getNumberEnv('MAX_CONCURRENT_RENDERS', getNumberEnv('MAX_PARALLEL_RENDERS', 1)),
  renderTimeoutSec: getNumberEnv('RENDER_TIMEOUT_SEC', Math.round(getNumberEnv('RENDER_TIMEOUT_MS', 240_000) / 1000)),
};

export function getMaxUploadBytes() {
  return Math.max(1, videoPipelineConfig.maxUploadSizeMb) * 1024 * 1024;
}

export function getPipelineQualityLabel() {
  return videoPipelineConfig.qualityPreset;
}

export function getPipelineResolutionLabel() {
  return `${videoPipelineConfig.targetWidth}x${videoPipelineConfig.targetHeight}`;
}

export function getPipelineProfileForTier(userTier?: string) {
  const normalizedTier = String(userTier || '').toLowerCase();
  const isPremium = ['premium', 'pro', 'creator', 'studio', 'paid'].includes(normalizedTier);

  return {
    qualityPreset: isPremium ? videoPipelineConfig.premiumQualityPreset : videoPipelineConfig.qualityPreset,
    targetWidth: isPremium ? videoPipelineConfig.premiumTargetWidth : videoPipelineConfig.targetWidth,
    targetHeight: isPremium ? videoPipelineConfig.premiumTargetHeight : videoPipelineConfig.targetHeight,
    isPremium,
  };
}

function getStringEnv(name: string, fallback: string) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
