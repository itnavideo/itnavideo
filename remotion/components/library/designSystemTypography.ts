/**
 * Design System Responsive Fluid Typography Calculator
 *
 * Calculates fluid pixel sizes based on composition width and height.
 * Default reference resolution: 1920x1080 (Horizontal) / 1080x1920 (Vertical).
 */

export interface FluidTypographySizes {
  h1: number; // H1 Title (64px - 96px)
  subheading: number; // Subheading (32px - 48px)
  body: number; // Body Text (22px - 30px)
  stat: number; // Stat / Metric (70px - 120px)
  scaleFactor: number;
}

export const SUPPORTED_HEADING_FONTS = [
  'Bebas Neue',
  'Plus Jakarta Sans',
  'Montserrat',
  'Playfair Display',
  'Cinzel',
  'Syne',
] as const;

export const SUPPORTED_BODY_FONTS = [
  'Inter',
  'Plus Jakarta Sans',
  'Roboto',
  'Montserrat',
] as const;

export function calculateFluidTypography(
  width: number = 1920,
  height: number = 1080
): FluidTypographySizes {
  // Reference height is 1080px
  const scaleFactor = Math.max(0.6, Math.min(2.0, height / 1080));

  // Is vertical video (e.g. 1080x1920 Shorts/Reels)
  const isVertical = height > width;
  const aspectAdjustment = isVertical ? 0.85 : 1.0;

  const rawH1 = Math.round(72 * scaleFactor * aspectAdjustment);
  const rawSubheading = Math.round(38 * scaleFactor * aspectAdjustment);
  const rawBody = Math.round(24 * scaleFactor * aspectAdjustment);
  const rawStat = Math.round(90 * scaleFactor * aspectAdjustment);

  return {
    h1: Math.max(48, Math.min(110, rawH1)),
    subheading: Math.max(26, Math.min(54, rawSubheading)),
    body: Math.max(18, Math.min(34, rawBody)),
    stat: Math.max(56, Math.min(130, rawStat)),
    scaleFactor,
  };
}

