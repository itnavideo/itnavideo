import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface TenPointZeroQuadrantItem {
  quadrantName: string;
  category: string;
  tacticalHabit: string;
  idealTenSelfStandard: string;
  weeklyTarget: string;
  accentColor: string;
  icon: string;
}

export interface DanMartellTenPointZeroSelfAssetProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  quadrants?: TenPointZeroQuadrantItem[];
  telemetry?: {
    calendarDesignStatus: string;
    deepWorkBlocks: string;
    fulfillmentScore: string;
  };
  fulfillmentLaw?: string;
  isDark?: boolean;
}

const DEFAULT_QUADRANTS: TenPointZeroQuadrantItem[] = [
  {
    quadrantName: "01. BODY",
    category: "Physical Vitality & Energy",
    tacticalHabit: "Non-negotiable morning workout, whole-food nutrition, 8h sleep recovery.",
    idealTenSelfStandard: "Peak physical energy that powers 12-hour high-stakes executive days.",
    weeklyTarget: "100% Morning Vitality",
    accentColor: "#10b981", // Emerald
    icon: "⚡",
  },
  {
    quadrantName: "02. BANK",
    category: "Capital & Asset Sovereignty",
    tacticalHabit: "Reinvest active cashflow into automated assets; strictly buy back time.",
    idealTenSelfStandard: "Total financial independence where capital works while you sleep.",
    weeklyTarget: "Buy Back Non-Core Hours",
    accentColor: "#f59e0b", // Amber Gold
    icon: "🏛️",
  },
  {
    quadrantName: "03. CALENDAR",
    category: "The Perfect Week Architecture",
    tacticalHabit: "Red Deep Work blocks, batched Yellow meetings, protected Green family time.",
    idealTenSelfStandard: "Zero chaos mode; 30-minute Sunday reset dictates the entire week.",
    weeklyTarget: "20h Deep Work Monoliths",
    accentColor: "#3b82f6", // Electric Blue
    icon: "📅",
  },
  {
    quadrantName: "04. PEOPLE",
    category: "The 33% Relationship Circle",
    tacticalHabit: "33% Mentors ahead, 33% Peers pushing you, 33% Mentees to uplift (King's Club).",
    idealTenSelfStandard: "Surrounded by world-class leaders who expand your psychological ceiling.",
    weeklyTarget: "Active Mentorship & Growth",
    accentColor: "#a855f7", // Purple
    icon: "🤝",
  },
];

export const DanMartellTenPointZeroSelfAsset: React.FC<DanMartellTenPointZeroSelfAssetProps> = ({
  title = "It took me 30 harsh years to learn what I’ll teach you in 27 minutes",
  subtitle = "Dan Martell's 10.0 Self Architecture & The Perfect Week Fulfillment Engine",
  badgeText = "THE MARTELL METHOD • 10.0 SELF PROTOCOL",
  quadrants = DEFAULT_QUADRANTS,
  telemetry = {
    calendarDesignStatus: "The Perfect Week",
    deepWorkBlocks: "20h / Wk Protected",
    fulfillmentScore: "99.8% Self-Alignment",
  },
  fulfillmentLaw = "“Happiness is not a destination you arrive at. It is the byproduct of continuous personal progress toward becoming your 10.0 Self.”",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const quoteEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 95 },
  });

  const telemetryEntrance = spring({
    frame: frame - 32,
    fps,
    config: { damping: 16, mass: 1, stiffness: 85 },
  });

  // Pulse animation for high contrast
  const pulseScale = interpolate(
    Math.sin((frame / fps) * 3.5),
    [-1, 1],
    [0.985, 1.015]
  );

  // Colors
  const bgGradient = isDark
    ? "linear-gradient(145deg, #09090b 0%, #0f172a 50%, #020617 100%)"
    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)";

  const cardBg = isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.85)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
  const textPrimary = isDark ? "#f8fafc" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#475569";
  const textMuted = isDark ? "#64748b" : "#94a3b8";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 50px",
        background: bgGradient,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-5%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* HEADER SECTION */}
      <div
        style={{
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-20, 0])}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `1px solid ${cardBorder}`,
          paddingBottom: "18px",
        }}
      >
        <div style={{ maxWidth: "70%" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "999px",
              backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#10b981",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "8px",
              transform: `scale(${pulseScale})`,
            }}
          >
            <span>✨</span>
            {badgeText}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: textPrimary,
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: "14px",
              color: textSecondary,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* 10.0 Self Fulfillment Metric */}
        <div
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "14px",
            padding: "12px 18px",
            textAlign: "right",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
            The 10.0 Self Metric
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "4px" }}>
            {telemetry.fulfillmentScore}
          </div>
          <div style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>
            Calendar: <span style={{ color: "#3b82f6", fontWeight: 700 }}>{telemetry.calendarDesignStatus}</span>
          </div>
        </div>
      </div>

      {/* FULFILLMENT LAW BANNER */}
      <div
        style={{
          opacity: Math.max(0, quoteEntrance),
          transform: `translateY(${interpolate(Math.max(0, quoteEntrance), [0, 1], [15, 0])}px)`,
          padding: "12px 20px",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(241, 245, 249, 0.9)",
          borderLeft: "4px solid #10b981",
          borderRadius: "8px",
          margin: "12px 0 16px 0",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            fontSize: "13px",
            color: isDark ? "#e2e8f0" : "#1e293b",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {fulfillmentLaw}
        </span>
      </div>

      {/* 4 QUADRANTS GRID (BODY, BANK, CALENDAR, PEOPLE) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "16px",
        }}
      >
        {quadrants.map((quad, idx) => {
          const cardSpring = spring({
            frame: frame - (14 + idx * 5),
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 95 },
          });

          return (
            <div
              key={quad.quadrantName}
              style={{
                opacity: Math.max(0, cardSpring),
                transform: `translateY(${interpolate(Math.max(0, cardSpring), [0, 1], [30, 0])}px)`,
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px",
                padding: "18px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                backdropFilter: "blur(12px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  backgroundColor: quad.accentColor,
                }}
              />

              {/* Quadrant Header */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: quad.accentColor,
                      letterSpacing: "0.8px",
                    }}
                  >
                    {quad.quadrantName}
                  </span>
                  <span style={{ fontSize: "18px" }}>{quad.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "10px",
                  }}
                >
                  {quad.category}
                </div>

                {/* 10.0 Self Ideal Standard */}
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    borderLeft: `2px solid ${quad.accentColor}`,
                    marginBottom: "10px",
                  }}
                >
                  <strong style={{ color: quad.accentColor, display: "block", fontSize: "10px", textTransform: "uppercase" }}>
                    10.0 Self Standard:
                  </strong>
                  <span style={{ fontSize: "11.5px", color: textPrimary, lineHeight: 1.4 }}>
                    {quad.idealTenSelfStandard}
                  </span>
                </div>

                {/* Tactical Habit */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: textSecondary,
                    lineHeight: 1.45,
                  }}
                >
                  {quad.tacticalHabit}
                </p>
              </div>

              {/* Weekly Target Badge */}
              <div style={{ marginTop: "14px" }}>
                <div
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    backgroundColor: `${quad.accentColor}18`,
                    border: `1px solid ${quad.accentColor}35`,
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: quad.accentColor,
                  }}
                >
                  🎯 {quad.weeklyTarget}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TELEMETRY & BRAND STAMP */}
      <div
        style={{
          opacity: Math.max(0, telemetryEntrance),
          transform: `translateY(${interpolate(Math.max(0, telemetryEntrance), [0, 1], [15, 0])}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: "14px",
          padding: "14px 22px",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Core Habit
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginTop: "2px" }}>
              30-Minute Sunday Calendar Reset
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Deep Focus Cadence
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#3b82f6", marginTop: "2px" }}>
              {telemetry.deepWorkBlocks}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              King's Club Law
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              Progress Creates Lasting Fulfillment
            </div>
          </div>
        </div>

        {/* Brand Stamp */}
        <div
          style={{
            padding: "5px 10px",
            borderRadius: "6px",
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            fontSize: "10px",
            fontWeight: 800,
            color: textSecondary,
            letterSpacing: "0.8px",
          }}
        >
          ITNAVIDEO • PERSONAL DEVELOPMENT ASSET SUITE
        </div>
      </div>
    </div>
  );
};
