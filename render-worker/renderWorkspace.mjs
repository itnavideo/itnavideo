import fs from 'fs';
import os from 'os';
import path from 'path';

const workspaceRoot = process.env.RENDER_WORKSPACE_DIR ||
  path.join(os.tmpdir(), 'itnavideo-render-workspace');

export function getRenderWorkspace() {
  const root = workspaceRoot;
  return {
    root,
    rawAssets: {
      root: path.join(root, 'raw_assets'),
      userVideos: path.join(root, 'raw_assets', 'user_videos'),
      userAudios: path.join(root, 'raw_assets', 'user_audios'),
      userImages: path.join(root, 'raw_assets', 'user_images'),
    },
    processedAssets: {
      root: path.join(root, 'processed_assets'),
      transcriptions: path.join(root, 'processed_assets', 'transcriptions'),
      audioCuts: path.join(root, 'processed_assets', 'audio_cuts'),
      overlays: path.join(root, 'processed_assets', 'overlays'),
      cache: path.join(root, 'processed_assets', 'cache'),
      pythonBridge: path.join(root, 'processed_assets', 'python_bridge'),
    },
    assetsLibrary: {
      root: path.join(root, 'assets_library'),
      fonts: path.join(root, 'assets_library', 'fonts'),
      icons: path.join(root, 'assets_library', 'icons'),
      soundEffects: path.join(root, 'assets_library', 'sound_effects'),
    },
    finalOutput: path.join(root, 'final_output'),
  };
}

export function ensureRenderWorkspace() {
  const workspace = getRenderWorkspace();
  const dirs = [
    workspace.rawAssets.root,
    workspace.rawAssets.userVideos,
    workspace.rawAssets.userAudios,
    workspace.rawAssets.userImages,
    workspace.processedAssets.root,
    workspace.processedAssets.transcriptions,
    workspace.processedAssets.audioCuts,
    workspace.processedAssets.overlays,
    workspace.processedAssets.cache,
    workspace.processedAssets.pythonBridge,
    workspace.assetsLibrary.root,
    workspace.assetsLibrary.fonts,
    workspace.assetsLibrary.icons,
    workspace.assetsLibrary.soundEffects,
    workspace.finalOutput,
  ];

  dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
  return workspace;
}

export function getWorkspaceAssetDir(extension) {
  const workspace = ensureRenderWorkspace();
  const ext = String(extension || '').toLowerCase();

  if (['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm'].includes(ext)) {
    return workspace.rawAssets.userAudios;
  }

  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    return workspace.rawAssets.userImages;
  }

  if (['.mp4', '.mov', '.m4v', '.avi', '.mkv'].includes(ext)) {
    return workspace.rawAssets.userVideos;
  }

  return workspace.processedAssets.cache;
}
