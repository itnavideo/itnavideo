import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface CaptionBurstItem {
  phrase: string;
  emphasisWordIndex?: number;
  startFrame: number;
  endFrame: number;
}

export interface ExecutiveMinimalistCaptionAssetProps {
  bursts?: CaptionBurstItem[];
  topicBadge?: string;
  authorWatermark?: string;
  fontSizePx?: number;
  activeTextColor?: string;
  inactiveTextColor?: string;
  textShadowIntensity?: string;
  isDark?: boolean;
}

const DEFAULT_BURSTS: CaptionBurstItem[] = [
  { phrase: "“NEVER GIVE UP”", emphasisWordIndex: 2, startFrame: 0, endFrame: 35 },
  { phrase: "SOUNDS SIMPLE", emphasisWordIndex: 1, startFrame: 36, endFrame: 65 },
  { phrase: "UNTIL YOU ACTUALLY", emphasisWordIndex: 2, startFrame: 66, endFrame: 105 },
  { phrase: "HAVE TO LIVE IT.", emphasisWordIndex: 2, startFrame: 106, endFrame: 150 },
  { phrase: "CHANGING THE PLAN,", emphasisWordIndex: 0, startFrame: 151, endFrame: 195 },
  { phrase: "TRYING AGAIN,", emphasisWordIndex: 1, startFrame: 196, endFrame: 235 },
  { phrase: "STAYING WITH IT", emphasisWordIndex: 0, startFrame: 236, endFrame: 275 },
  { phrase: "LONGER THAN FEELS COMFORTABLE.", emphasisWordIndex: 3, startFrame: 276, endFrame: 340 },
];

export const ExecutiveMinimalistCaptionAsset: React.FC<ExecutiveMinimalistCaptionAssetProps> = ({
  bursts = DEFAULT_BURSTS,
  topicBadge = "EXECUTIVE MINIMALIST CAPTION ENGINE (DR. ROGACHEV)",
  authorWatermark = "DR. ROGACHEV • STRATEGIC LEADERSHIP",
  fontSizePx = 54,
  activeTextColor = "#FFFFFF",
  inactiveTextColor = "#CBD5E1",
  textShadowIntensity = "0 4px 20px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0, 0, 0, 0.85)",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active burst
  const activeBurst = bursts.find(
    (b) => frame >= b.startFrame && frame <= b.endFrame
  ) || bursts[0];

  // Local frame within burst for entrance spring
  const burstLocalFrame = Math.max(0, frame - activeBurst.startFrame);
  const popSpring = spring({
    frame: burstLocalFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.6 },
  });

  const scale = interpolate(popSpring, [0, 1], [0.94, 1]);
  const opacity = interpolate(popSpring, [0, 1], [0.2, 1]);

  const words = activeBurst.phrase.split(" ");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "160px 48px 240px 48px", // 9:16 vertical safe margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isDark ? "rgba(9, 13, 22, 0.65)" : "rgba(248, 250, 252, 0.75)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Top Executive Style Pill ── */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 20px",
          borderRadius: "9999px",
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.14)"}`,
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: "14px" }}>⚡</span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isDark ? "#E2E8F0" : "#1E293B",
          }}
        >
          {topicBadge}
        </span>
      </div>

      {/* ── Center Stage: Kinetic All-Caps Words (Dr. Rogachev Style) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: `scale(${scale})`,
          opacity,
          zIndex: 10,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: `${fontSizePx}px`,
            fontWeight: 900,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            lineHeight: 1.25,
            textShadow: textShadowIntensity,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          {words.map((word, idx) => {
            const isEmphasis = activeBurst.emphasisWordIndex === idx;
            return (
              <span
                key={idx}
                style={{
                  color: isEmphasis ? activeTextColor : inactiveTextColor,
                  transform: isEmphasis ? "scale(1.08)" : "scale(1)",
                  display: "inline-block",
                  transition: "transform 0.15s ease",
                  textDecoration: isEmphasis ? "underline" : "none",
                  textDecorationColor: "rgba(255, 255, 255, 0.4)",
                  textUnderlineOffset: "8px",
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>

      {/* ── Bottom Author / Speaker Watermark ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: isDark ? "#94A3B8" : "#64748B",
          }}
        >
          {authorWatermark}
        </span>
        <div
          style={{
            width: "48px",
            height: "2px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)",
          }}
        />
      </div>
    </div>
  );
};
