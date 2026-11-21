import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface LightingPromptPreset {
  id: string;
  name: string;
  type: string;
  ratio: string;
  promptSnippet: string;
}

export interface StealLightingPromptAssetProps {
  brandHandle?: string;
  hookLine1?: string;
  hookLine2?: string;
  commentKeyword?: string;
  presets?: LightingPromptPreset[];
  activePresetIndex?: number;
  accentOrangeColor?: string;
  accentCyanColor?: string;
  isOverlayMode?: boolean;
}

const DEFAULT_PRESETS: LightingPromptPreset[] = [
  {
    id: "rim",
    name: "Edge Rim & Hair Light",
    type: "Cinematic Separation",
    ratio: "4:1 Contrast",
    promptSnippet: "sharp cyan rim lighting, backlight edge glow, 85mm portrait, 8k",
  },
  {
    id: "rembrandt",
    name: "Rembrandt Triangle",
    type: "Dramatic Studio Key",
    ratio: "3:1 Contrast",
    promptSnippet: "rembrandt lighting, characteristic light triangle on cheek, dark moody",
  },
  {
    id: "volumetric",
    name: "Volumetric God Rays",
    type: "Atmospheric Natural",
    ratio: "Tyndall Effect",
    promptSnippet: "volumetric dust rays through window blinds, morning golden haze",
  },
  {
    id: "cyberpunk",
    name: "Dual-Tone Neon",
    type: "Complementary Contrast",
    ratio: "Orange & Cyan",
    promptSnippet: "warm amber key light, electric cyan backfill, high contrast cinematic",
  },
];

export const StealLightingPromptAsset: React.FC<StealLightingPromptAssetProps> = ({
  brandHandle = "@ai.volve.news",
  hookLine1 = "Steal These 20",
  hookLine2 = "Camera Lights",
  commentKeyword = "Light",
  presets = DEFAULT_PRESETS,
  activePresetIndex,
  accentOrangeColor = "#F97316",
  accentCyanColor = "#06B6D4",
  isOverlayMode = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active preset cycling (every 80 frames = ~2.6s)
  const computedActiveIndex =
    activePresetIndex !== undefined
      ? activePresetIndex
      : Math.floor(frame / 80) % presets.length;

  const currentPreset = presets[computedActiveIndex] || presets[0];

  // Springs
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const cardEntrance = spring({
    frame: frame % 80,
    fps,
    config: { damping: 15, stiffness: 95 },
  });

  const ctaEntrance = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 13, stiffness: 115 },
  });

  // Calligraphic underline squiggly stroke offset animation
  const squiggleProgress = interpolate(
    spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 12, stiffness: 100 } }),
    [0, 1],
    [100, 0]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "135px 36px 220px 36px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isOverlayMode ? "transparent" : "#091D26",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── BACKGROUND TEAL BLUEPRINT GRID ── */}
      {!isOverlayMode && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              pointerEvents: "none",
            }}
          />
          {/* Radial cyan backlight glow */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${accentCyanColor}33 0%, transparent 70%)`,
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* ── TOP SECTION: Creator Brand Pill ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "999px",
            background: "rgba(9, 29, 38, 0.8)",
            border: `1px solid ${accentCyanColor}44`,
            boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 16px ${accentCyanColor}22`,
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ fontSize: "14px" }}>💡</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: accentCyanColor,
              textTransform: "uppercase",
            }}
          >
            AI LIGHTING & CINEMATOGRAPHY
          </span>
          <span style={{ color: "#475569" }}>•</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#E2E8F0" }}>
            {brandHandle}
          </span>
        </div>
      </div>

      {/* ── CENTER SECTION: Frosted Glass Hook Banner with Calligraphic Squiggle ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 15,
          opacity: hookEntrance,
          transform: `translateY(${interpolate(hookEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        {/* Glassmorphic Hook Box */}
        <div
          style={{
            width: "100%",
            borderRadius: "26px",
            background: "rgba(12, 37, 51, 0.65)",
            border: "1.5px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05)",
            padding: "24px 28px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            backdropFilter: "blur(20px)",
            position: "relative",
          }}
        >
          {/* Line 1: Steal These 20 */}
          <span
            style={{
              fontSize: "44px",
              fontWeight: 900,
              fontStyle: "italic",
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            }}
          >
            {hookLine1}
          </span>

          {/* Line 2: Camera Lights */}
          <div style={{ position: "relative", marginTop: "2px", display: "inline-block" }}>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 950,
                fontStyle: "italic",
                color: accentOrangeColor,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                textShadow: `0 4px 20px ${accentOrangeColor}66`,
              }}
            >
              {hookLine2}
            </span>

            {/* Calligraphic Squiggle Underline */}
            <svg
              width="240"
              height="24"
              viewBox="0 0 240 24"
              fill="none"
              style={{
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                overflow: "visible",
              }}
            >
              <path
                d="M 5 12 Q 35 4, 75 14 T 155 12 T 235 14 C 190 22, 120 22, 40 20"
                stroke={accentOrangeColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="300"
                strokeDashoffset={squiggleProgress * 3}
                style={{ filter: `drop-shadow(0 0 6px ${accentOrangeColor})` }}
              />
            </svg>
          </div>
        </div>

        {/* Dynamic Preset Preview Sub-Card */}
        <div
          style={{
            width: "92%",
            marginTop: "16px",
            borderRadius: "18px",
            background: "rgba(9, 29, 38, 0.85)",
            border: `1px solid ${accentCyanColor}44`,
            padding: "16px 20px",
            boxSizing: "border-box",
            opacity: cardEntrance,
            transform: `scale(${interpolate(cardEntrance, [0, 1], [0.95, 1])})`,
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color: "#FFFFFF",
              }}
            >
              ✦ {currentPreset.name}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "4px",
                background: `${accentOrangeColor}22`,
                color: accentOrangeColor,
                border: `1px solid ${accentOrangeColor}55`,
              }}
            >
              {currentPreset.ratio}
            </span>
          </div>

          <p
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#94A3B8",
              margin: 0,
              fontFamily: "monospace",
              lineHeight: 1.4,
            }}
          >
            "{currentPreset.promptSnippet}"
          </p>
        </div>
      </div>

      {/* ── BOTTOM SECTION: 16K ManyChat Viral Comment Trigger ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 25,
          opacity: ctaEntrance,
          transform: `translateY(${interpolate(ctaEntrance, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 28px",
            borderRadius: "16px",
            background: "rgba(9, 29, 38, 0.95)",
            border: `1.5px solid ${accentOrangeColor}88`,
            boxShadow: `0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px ${accentOrangeColor}33`,
            backdropFilter: "blur(16px)",
          }}
        >
          <span style={{ fontSize: "18px" }}>💬</span>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Comment{" "}
            <span
              style={{
                color: accentOrangeColor,
                fontWeight: 900,
                textDecoration: "underline",
                letterSpacing: "0.06em",
              }}
            >
              "{commentKeyword}"
            </span>{" "}
            for the full prompt guide!
          </span>
        </div>
      </div>
    </div>
  );
};
