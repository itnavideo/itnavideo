import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface FounderStruggleMetrics {
  yearsOfStruggle: string;
  regrets: string;
  growthVerdict: string;
}

export interface FounderPodcastClipAssetProps {
  topCuriosityPill?: string;
  pillBgColor?: string;
  pillTextColor?: string;
  punchlineQuote?: string;
  punchlineHighlight?: string;
  speakerName?: string;
  speakerTitle?: string;
  metrics?: FounderStruggleMetrics;
  questionCTA?: string;
  accentYellowColor?: string;
  isDark?: boolean;
}

export const FounderPodcastClipAsset: React.FC<FounderPodcastClipAssetProps> = ({
  topCuriosityPill = "MY ADVICE TO ASPIRING ENTREPRENEURS",
  pillBgColor = "#facc15",
  pillTextColor = "#000000",
  punchlineQuote = "GO FOR IT.",
  punchlineHighlight = "IT.",
  speakerName = "Mahesh Shahdadpuri",
  speakerTitle = "Founder, TASC Group",
  metrics = {
    yearsOfStruggle: "8 Years Struggle",
    regrets: "Zero Regrets",
    growthVerdict: "Process > Outcome",
  },
  questionCTA = "Which belief is holding you back right now? 👇",
  accentYellowColor = "#facc15",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const pillEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const quoteEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  const lowerThirdEntrance = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 13, stiffness: 90 },
  });

  const metricsEntrance = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: { damping: 12, stiffness: 85 },
  });

  // Micro-shimmer on punchline
  const pulseScale = 1 + Math.sin(frame / 20) * 0.015;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "150px 48px 230px 48px", // 9:16 vertical safe margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Curiosity Pill & Punchline Headline ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          zIndex: 10,
        }}
      >
        {/* Rounded Yellow Curiosity Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 28px",
            borderRadius: "9999px",
            backgroundColor: pillBgColor,
            boxShadow: "0 8px 24px rgba(250, 204, 21, 0.35)",
            opacity: pillEntrance,
            transform: `translateY(${interpolate(pillEntrance, [0, 1], [-25, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: "17px",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: pillTextColor,
            }}
          >
            {topCuriosityPill}
          </span>
        </div>

        {/* High-Impact All-Caps Kinetic Headline */}
        <div
          style={{
            textAlign: "center",
            opacity: quoteEntrance,
            transform: `scale(${interpolate(quoteEntrance, [0, 1], [0.92, 1])})`,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              lineHeight: 1.15,
              textShadow: "0 6px 24px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0, 0, 0, 0.9)",
              color: "#ffffff",
            }}
          >
            {punchlineQuote.replace(punchlineHighlight, "").trim()}{" "}
            <span style={{ color: accentYellowColor }}>{punchlineHighlight}</span>
          </h1>
        </div>
      </div>

      {/* ── MIDDLE / LOWER SECTION: Speaker Lower-Third & Struggle Metrics Matrix ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          zIndex: 10,
        }}
      >
        {/* Founder Lower-Third Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            opacity: lowerThirdEntrance,
            transform: `translateY(${interpolate(lowerThirdEntrance, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.01em",
              textShadow: "0 4px 16px rgba(0,0,0,0.9)",
            }}
          >
            {speakerName}
          </span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#e2e8f0",
              letterSpacing: "0.04em",
              marginTop: "4px",
              textShadow: "0 2px 10px rgba(0,0,0,0.85)",
            }}
          >
            {speakerTitle}
          </span>
          <div
            style={{
              width: "44px",
              height: "2px",
              backgroundColor: accentYellowColor,
              marginTop: "8px",
            }}
          />
        </div>

        {/* 3-Pillar Struggle Telemetry Card */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            opacity: metricsEntrance,
            transform: `scale(${pulseScale})`,
          }}
        >
          <div
            style={{
              padding: "16px 14px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(14px)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Struggle</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>{metrics.yearsOfStruggle}</div>
          </div>
          <div
            style={{
              padding: "16px 14px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              border: `1px solid ${accentYellowColor}55`,
              backdropFilter: "blur(14px)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: accentYellowColor, textTransform: "uppercase" }}>Mindset</div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>{metrics.regrets}</div>
          </div>
          <div
            style={{
              padding: "16px 14px",
              borderRadius: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(14px)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", textTransform: "uppercase" }}>Principle</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>{metrics.growthVerdict}</div>
          </div>
        </div>

        {/* Interactive Question CTA */}
        <p
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#e2e8f0",
            margin: 0,
            textAlign: "center",
            letterSpacing: "0.02em",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {questionCTA}
        </p>
      </div>
    </div>
  );
};
