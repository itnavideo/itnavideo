import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface LifeResetPillarItem {
  number: string;
  phase: string;
  title: string;
  contrarianPrinciple: string;
  actionableDomino: string;
  metricTarget: string;
  accentColor: string;
  icon: string;
}

export interface CodieSanchezLifeResetEngineAssetProps {
  title?: string;
  subtitle?: string;
  speedBadge?: string;
  activePhase?: "romantic-lie" | "stair-summit" | "execution-sprint" | "all";
  pillars?: LifeResetPillarItem[];
  telemetry?: {
    velocityScore: string;
    inactionTaxAvoided: string;
    summitTimeline: string;
  };
  contrarianQuote?: string;
  isDark?: boolean;
}

const DEFAULT_PILLARS: LifeResetPillarItem[] = [
  {
    number: "01",
    phase: "The Romantic Lie",
    title: "Kill the Myth of Gradual Change",
    contrarianPrinciple: "Transformation is not a 5-year gentle meditation; it is a violent 24-hour pattern interrupt that kills your old identity.",
    actionableDomino: "Conduct a ruthless 'Stop-Doing' audit: eliminate the bottom 80% of low-ROI obligations and time vampires.",
    metricTarget: "Cut 15+ weekly zombie hours",
    accentColor: "#ef4444", // Crimson / Red
    icon: "⚡",
  },
  {
    number: "02",
    phase: "The Stair Summit System",
    title: "Ladder Your Vehicle to the Mountain Peak",
    contrarianPrinciple: "You cannot jump straight to the summit. Climb through 3 rigid staircases: cashflow defense, asymmetric assets, then total ownership.",
    actionableDomino: "Stop trading hours for money; acquire or build boring cashflowing assets with existing cashflow moats.",
    metricTarget: "1 Asymmetric Asset Vehicle",
    accentColor: "#10b981", // Emerald
    icon: "🏔️",
  },
  {
    number: "03",
    phase: "The 24-Hour Execution Sprint",
    title: "The 60-Minute Irreversible Action",
    contrarianPrinciple: "Money loves speed. Never leave the site of a life decision without taking a physical, irreversible commitment action.",
    actionableDomino: "Lock an irreversible stake: wire deposit, sign the contract, send the resignation, or publicly burn the ships.",
    metricTarget: "Action locked in <60 mins",
    accentColor: "#f59e0b", // Amber
    icon: "⏱️",
  },
];

export const CodieSanchezLifeResetEngineAsset: React.FC<CodieSanchezLifeResetEngineAssetProps> = ({
  title = "How To Change Your Entire Life In 24 Hours",
  subtitle = "Codie Sanchez's Stair Summit System & High-Velocity Life Reset Architecture",
  speedBadge = "MONEY LOVES SPEED • 24H RESET PROTOCOL",
  activePhase = "all",
  pillars = DEFAULT_PILLARS,
  telemetry = {
    velocityScore: "99.4%",
    inactionTaxAvoided: "$180,000 / Yr",
    summitTimeline: "24-Hour Hard Reset",
  },
  contrarianQuote = "“The distance between who you are and who you want to be is the speed at which you take uncomfortable action.”",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const quoteEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 90 },
  });

  const staircaseEntrance = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, mass: 0.85, stiffness: 110 },
  });

  const telemetryEntrance = spring({
    frame: frame - 32,
    fps,
    config: { damping: 16, mass: 1, stiffness: 85 },
  });

  // Pulse animation for high velocity
  const pulseScale = interpolate(
    Math.sin((frame / fps) * 4),
    [-1, 1],
    [0.98, 1.02]
  );

  // Theme palettes (Contrarian Thinking signature dark slate & emerald)
  const bgGradient = isDark
    ? "linear-gradient(145deg, #09090b 0%, #111827 50%, #030712 100%)"
    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)";

  const cardBg = isDark ? "rgba(17, 24, 39, 0.75)" : "rgba(255, 255, 255, 0.85)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
  const textPrimary = isDark ? "#f9fafb" : "#0f172a";
  const textSecondary = isDark ? "#9ca3af" : "#475569";
  const textMuted = isDark ? "#6b7280" : "#94a3b8";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        background: bgGradient,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Accent Gradients */}
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
          left: "-10%",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* HEADER SECTION */}
      <div
        style={{
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-25, 0])}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `1px solid ${cardBorder}`,
          paddingBottom: "24px",
        }}
      >
        <div style={{ maxWidth: "70%" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#10b981",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "12px",
              transform: `scale(${pulseScale})`,
            }}
          >
            <span style={{ fontSize: "14px" }}>⚡</span>
            {speedBadge}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
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
              margin: "8px 0 0 0",
              fontSize: "15px",
              color: textSecondary,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Contrarian Speed Meter */}
        <div
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "16px",
            padding: "16px 20px",
            textAlign: "right",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
            Speed of Implementation
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "#10b981", margin: "4px 0" }}>
            {telemetry.velocityScore}
          </div>
          <div style={{ fontSize: "12px", color: textSecondary }}>
            Inaction Cost: <span style={{ color: "#ef4444", fontWeight: 700 }}>{telemetry.inactionTaxAvoided}</span>
          </div>
        </div>
      </div>

      {/* CONTRARIAN QUOTE CALLOUT */}
      <div
        style={{
          opacity: Math.max(0, quoteEntrance),
          transform: `translateY(${interpolate(Math.max(0, quoteEntrance), [0, 1], [15, 0])}px)`,
          padding: "14px 22px",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.65)" : "rgba(241, 245, 249, 0.9)",
          borderLeft: "4px solid #10b981",
          borderRadius: "8px",
          margin: "16px 0 20px 0",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            fontSize: "14px",
            color: isDark ? "#e2e8f0" : "#1e293b",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {contrarianQuote}
        </span>
      </div>

      {/* 3 CORE PILLARS / STAIR SUMMIT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "20px",
        }}
      >
        {pillars.map((pillar, idx) => {
          const cardSpring = spring({
            frame: frame - (18 + idx * 7),
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 95 },
          });

          const isCardActive = activePhase === "all" || activePhase === pillar.phase.toLowerCase().replace(/\s+/g, "-");

          return (
            <div
              key={pillar.number}
              style={{
                opacity: Math.max(0, cardSpring),
                transform: `translateY(${interpolate(Math.max(0, cardSpring), [0, 1], [35, 0])}px)`,
                backgroundColor: cardBg,
                border: `1px solid ${isCardActive ? pillar.accentColor : cardBorder}`,
                borderRadius: "20px",
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: isCardActive
                  ? `0 14px 35px ${pillar.accentColor}25`
                  : "0 8px 24px rgba(0,0,0,0.15)",
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
                  backgroundColor: pillar.accentColor,
                }}
              />

              {/* Card Header */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: pillar.accentColor,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    PHASE {pillar.number} • {pillar.phase}
                  </span>
                  <span style={{ fontSize: "20px" }}>{pillar.icon}</span>
                </div>

                <h3
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "20px",
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.25,
                  }}
                >
                  {pillar.title}
                </h3>

                {/* Contrarian Principle */}
                <div
                  style={{
                    fontSize: "13px",
                    color: textSecondary,
                    lineHeight: 1.5,
                    marginBottom: "16px",
                    borderLeft: `2px solid ${cardBorder}`,
                    paddingLeft: "10px",
                  }}
                >
                  <strong style={{ color: textPrimary, display: "block", marginBottom: "4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Contrarian Law:
                  </strong>
                  {pillar.contrarianPrinciple}
                </div>
              </div>

              {/* Actionable Domino & Target */}
              <div>
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    border: `1px solid ${cardBorder}`,
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: pillar.accentColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: "4px",
                    }}
                  >
                    24-Hour Domino Action
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: textPrimary,
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {pillar.actionableDomino}
                  </div>
                </div>

                {/* Target Metric Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: `${pillar.accentColor}18`,
                    border: `1px solid ${pillar.accentColor}35`,
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: textSecondary }}>Target KPI</span>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: pillar.accentColor }}>
                    {pillar.metricTarget}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TELEMETRY & STAIR SUMMIT LADDER */}
      <div
        style={{
          opacity: Math.max(0, telemetryEntrance),
          transform: `translateY(${interpolate(Math.max(0, telemetryEntrance), [0, 1], [20, 0])}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: "16px",
          padding: "16px 24px",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Summit Velocity
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              {telemetry.summitTimeline}
            </div>
          </div>
          <div style={{ width: "1px", height: "30px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Execution Protocol
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: textPrimary, marginTop: "2px" }}>
              60-Min Irreversible Commitment Rule
            </div>
          </div>
          <div style={{ width: "1px", height: "30px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Contrarian Thinking Moat
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f59e0b", marginTop: "2px" }}>
              Cashflow Assets Over Hourly Wages
            </div>
          </div>
        </div>

        {/* Brand Stamp */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              fontSize: "11px",
              fontWeight: 800,
              color: textSecondary,
              letterSpacing: "0.8px",
            }}
          >
            ITNAVIDEO • HIGH-RETENTION ASSET LIBRARY
          </div>
        </div>
      </div>
    </div>
  );
};
