import type {
  CanvasLayoutMode,
  SceneCompositionPlan,
  VisualLayoutType,
} from './sceneBlueprintTypes';

/**
 * Derives a full 16:9 Screen Composition Recipe for any scene.
 * Ensures the renderer knows exact canvas geometry, media placement,
 * typography coordinates, scrim styling, and camera motion.
 */
export function deriveSceneComposition(
  layoutType: VisualLayoutType,
  hasMediaAsset: boolean,
  aiComposition?: any
): SceneCompositionPlan {
  let canvasLayout: CanvasLayoutMode = 'split_screen_right_media';

  if (layoutType === 'stat_card' || layoutType === 'data_visualization' || layoutType === 'donut_breakdown') {
    canvasLayout = 'data_dashboard';
  } else if (layoutType === 'comparison' || layoutType === 'vs_battle') {
    canvasLayout = 'comparison_versus';
  } else if (
    layoutType === 'horizontal_process' ||
    layoutType === 'process_steps' ||
    layoutType === 'workflow' ||
    layoutType === 'roadmap'
  ) {
    canvasLayout = 'process_horizontal_flow';
  } else if (layoutType === 'big_typography' || layoutType === 'hook' || layoutType === 'quote') {
    canvasLayout = 'typography_dominant';
  } else if (layoutType === 'full_bleed_visual') {
    canvasLayout = 'full_bleed_cinematic';
  } else if (hasMediaAsset) {
    const requested = String(aiComposition?.canvasLayout || '').toLowerCase();
    if (requested.includes('left')) {
      canvasLayout = 'split_screen_left_media';
    } else if (requested.includes('full') || requested.includes('cinematic')) {
      canvasLayout = 'full_bleed_cinematic';
    } else if (requested.includes('card') || requested.includes('center')) {
      canvasLayout = 'card_hero_center';
    } else {
      canvasLayout = 'split_screen_right_media';
    }
  } else {
    canvasLayout = 'card_hero_center';
  }

  // ── Golden Rule: Timestamp decides WHEN visual appears; Layout decides WHERE (placement) and IN WHAT SIZE (size) ──
  // Determine media slot geometry, placement, size & camera choreography
  const rawMedia = aiComposition?.mediaSlot || {};

  // Exact spatial coordinates & sizes on 1920x1080 canvas
  const mediaPlacementAndSize: {
    placement: SceneCompositionPlan['mediaSlot']['placement'];
    size: SceneCompositionPlan['mediaSlot']['size'];
  } = (() => {
    switch (canvasLayout) {
      case 'full_bleed_cinematic':
        return {
          placement: { x: 0, y: 0, anchor: 'top-left', quadrant: 'full-canvas' },
          size: { width: 1920, height: 1080, scale: 1.0, aspectRatio: '16:9' },
        };
      case 'split_screen_left_media':
        return {
          placement: { x: 80, y: 80, anchor: 'top-left', quadrant: 'left-split' },
          size: { width: 860, height: 920, scale: 1.0, aspectRatio: '16:9', maxWidth: 880 },
        };
      case 'split_screen_right_media':
        return {
          placement: { x: 980, y: 80, anchor: 'top-left', quadrant: 'right-split' },
          size: { width: 860, height: 920, scale: 1.0, aspectRatio: '16:9', maxWidth: 880 },
        };
      case 'card_hero_center':
        return {
          placement: { x: 690, y: 460, anchor: 'top-left', quadrant: 'center-stage' },
          size: { width: 540, height: 420, scale: 1.0, aspectRatio: '4:3' },
        };
      case 'data_dashboard':
        return {
          placement: { x: 940, y: 80, anchor: 'top-left', quadrant: 'right-split' },
          size: { width: 900, height: 920, scale: 1.0, aspectRatio: '16:9' },
        };
      case 'process_horizontal_flow':
        return {
          placement: { x: 120, y: 360, anchor: 'top-left', quadrant: 'center-stage' },
          size: { width: 1680, height: 580, scale: 1.0 },
        };
      case 'comparison_versus':
        return {
          placement: { x: 100, y: 260, anchor: 'top-left', quadrant: 'center-stage' },
          size: { width: 1720, height: 720, scale: 1.0 },
        };
      case 'typography_dominant':
      default:
        return {
          placement: { x: 960, y: 540, anchor: 'center', quadrant: 'center-stage' },
          size: { width: 0, height: 0, scale: 0 },
        };
    }
  })();

  const mediaSlot: SceneCompositionPlan['mediaSlot'] = {
    region:
      canvasLayout === 'full_bleed_cinematic'
        ? 'full'
        : canvasLayout === 'split_screen_left_media'
          ? 'left-half'
          : canvasLayout === 'split_screen_right_media'
            ? 'right-half'
            : canvasLayout === 'card_hero_center'
              ? 'floating-card'
              : 'center-third',
    cameraMotion:
      rawMedia.cameraMotion === 'pan_left' ||
        rawMedia.cameraMotion === 'pan_right' ||
        rawMedia.cameraMotion === 'slow_zoom_out' ||
        rawMedia.cameraMotion === 'ambient_drift'
        ? rawMedia.cameraMotion
        : 'slow_zoom_in',
    aspectFraming: canvasLayout === 'full_bleed_cinematic' ? 'cover' : 'padded_card',
    overlayScrim: canvasLayout === 'full_bleed_cinematic' ? 'subtle_dark_gradient' : 'none',
    placement: mediaPlacementAndSize.placement,
    size: mediaPlacementAndSize.size,
  };

  // Determine typography placement (WHERE) & size (IN WHAT SIZE)
  const rawTypo = aiComposition?.typographySlot || {};
  const typoPlacementAndSize: {
    placement: SceneCompositionPlan['typographySlot']['placement'];
    size: SceneCompositionPlan['typographySlot']['size'];
  } = (() => {
    switch (canvasLayout) {
      case 'split_screen_right_media':
        return {
          placement: { x: 80, y: 80, anchor: 'top-left', quadrant: 'left-split' },
          size: { width: 840, height: 920 },
        };
      case 'split_screen_left_media':
        return {
          placement: { x: 980, y: 80, anchor: 'top-left', quadrant: 'right-split' },
          size: { width: 840, height: 920 },
        };
      case 'card_hero_center':
        return {
          placement: { x: 220, y: 120, anchor: 'top-center', quadrant: 'center-stage' },
          size: { width: 1480, height: 280 },
        };
      case 'full_bleed_cinematic':
        return {
          placement: { x: 120, y: 680, anchor: 'bottom-left', quadrant: 'floating-overlay' },
          size: { width: 1200, height: 320 },
        };
      case 'data_dashboard':
        return {
          placement: { x: 80, y: 80, anchor: 'top-left', quadrant: 'left-split' },
          size: { width: 800, height: 920 },
        };
      case 'process_horizontal_flow':
        return {
          placement: { x: 120, y: 100, anchor: 'top-left', quadrant: 'center-stage' },
          size: { width: 1680, height: 200 },
        };
      case 'comparison_versus':
        return {
          placement: { x: 120, y: 80, anchor: 'top-left', quadrant: 'center-stage' },
          size: { width: 1680, height: 140 },
        };
      case 'typography_dominant':
      default:
        return {
          placement: { x: 160, y: 220, anchor: 'center', quadrant: 'center-stage' },
          size: { width: 1600, height: 640 },
        };
    }
  })();

  const typographySlot: SceneCompositionPlan['typographySlot'] = {
    region:
      canvasLayout === 'split_screen_right_media'
        ? 'left-half'
        : canvasLayout === 'split_screen_left_media'
          ? 'right-half'
          : canvasLayout === 'typography_dominant'
            ? 'center'
            : 'top-band',
    alignment:
      canvasLayout === 'typography_dominant' || canvasLayout === 'card_hero_center'
        ? 'center'
        : rawTypo.alignment === 'right'
          ? 'right'
          : 'left',
    badgePosition: 'above-title',
    placement: typoPlacementAndSize.placement,
    size: typoPlacementAndSize.size,
  };

  // Motion choreography
  const rawChoreo = aiComposition?.choreography || {};
  const choreography: SceneCompositionPlan['choreography'] = {
    heroEntrance:
      layoutType === 'stat_card'
        ? 'countUp'
        : layoutType === 'drawing_story'
          ? 'drawOn'
          : canvasLayout === 'split_screen_left_media'
            ? 'slideRight'
            : canvasLayout === 'split_screen_right_media'
              ? 'slideLeft'
              : rawChoreo.heroEntrance || 'popIn',
    staggerDelayMs: 120,
    leadTimeMs: 80,
  };

  return {
    canvasLayout,
    mediaSlot,
    typographySlot,
    choreography,
    visualBalance: hasMediaAsset ? 'balanced_editorial' : '85_vector_dominant',
  };
}

