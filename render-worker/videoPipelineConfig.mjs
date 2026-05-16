export function getVideoPipelineConfig() {
  const qualityPreset = getStringEnv('VIDEO_QUALITY_PRESET', getStringEnv('NEXT_PUBLIC_VIDEO_QUALITY_PRESET', '720p'));
  const targetWidth = getNumberEnv('TARGET_WIDTH', getNumberEnv('RENDER_WIDTH', 720));
  const targetHeight = getNumberEnv('TARGET_HEIGHT', getNumberEnv('RENDER_HEIGHT', 1280));
  const premiumQualityPreset = getStringEnv('PREMIUM_VIDEO_QUALITY_PRESET', getStringEnv('NEXT_PUBLIC_PREMIUM_VIDEO_QUALITY_PRESET', '1080p'));
  const premiumTargetWidth = getNumberEnv('PREMIUM_TARGET_WIDTH', getNumberEnv('NEXT_PUBLIC_PREMIUM_TARGET_WIDTH', 1080));
  const premiumTargetHeight = getNumberEnv('PREMIUM_TARGET_HEIGHT', getNumberEnv('NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT', 1920));
  const maxUploadSizeMb = getNumberEnv('MAX_AUDIO_SIZE_MB', 50);
  const maxDurationSec = getNumberEnv('MAX_AUDIO_DURATION_SEC', 300);
  const maxConcurrentRenders = getNumberEnv('MAX_CONCURRENT_RENDERS', getNumberEnv('MAX_PARALLEL_RENDERS', 1));
  const renderTimeoutSec = getNumberEnv('RENDER_TIMEOUT_SEC', Math.round(getNumberEnv('RENDER_TIMEOUT_MS', 240_000) / 1000));
  const primaryRenderTimeoutSec = getNumberEnv(
    'RENDER_PRIMARY_TIMEOUT_SEC',
    Math.round(getNumberEnv('RENDER_PRIMARY_TIMEOUT_MS', Math.min(renderTimeoutSec * 1000, 120_000)) / 1000),
  );

  return {
    qualityPreset,
    targetWidth,
    targetHeight,
    premiumQualityPreset,
    premiumTargetWidth,
    premiumTargetHeight,
    maxUploadSizeMb,
    maxDurationSec,
    maxConcurrentRenders: Math.max(1, Math.floor(maxConcurrentRenders)),
    renderTimeoutMs: Math.max(60_000, renderTimeoutSec * 1000),
    primaryRenderTimeoutMs: Math.max(45_000, primaryRenderTimeoutSec * 1000),
    tempRetentionHours: getNumberEnv('TEMP_ASSET_RETENTION_HOURS', 24),
  };
}

export function getVideoProfileForTier(userTier = 'free') {
  const config = getVideoPipelineConfig();
  const normalizedTier = String(userTier || '').toLowerCase();
  const isPremium = ['premium', 'pro', 'creator', 'studio', 'paid'].includes(normalizedTier);

  return {
    qualityPreset: isPremium ? config.premiumQualityPreset : config.qualityPreset,
    targetWidth: isPremium ? config.premiumTargetWidth : config.targetWidth,
    targetHeight: isPremium ? config.premiumTargetHeight : config.targetHeight,
    isPremium,
  };
}

function getStringEnv(name, fallback) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getNumberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
