import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface FocusLeverItem {
  number: string;
  leverName: string;
  trapToAvoid: string;
  topOnePercentAction: string;
  leverageMultiplier: string;
  accentColor: string;
  icon: string;
}

export interface CodieSanchezTopPercentileAssetProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  levers?: FocusLeverItem[];
  telemetry?: {
    marketHomogenization: string;
    arbitrageAdvantage: string;
    focusDensity: string;
  };
  contrarianLaw?: string;
  isDark?: boolean;
}

const DEFAULT_LEVERS: FocusLeverItem[] = [
  {
    number: "01",
    leverName: "The Anti-Slop Human Taste Moat",
    trapToAvoid: "Copy-pasting bland AI summaries and identical templates that look like everyone else.",
    topOnePercentAction: "Inject radical, polarizing POV and unfiltered human taste that algorithms cannot synthesize.",
    leverageMultiplier: "10x Brand Retention",
    accentColor: "#ef4444", // Crimson
    icon: "🔥",
  },
  {
    number: "02",
    leverName: "Monopolistic Deep Focus Blocks",
    trapToAvoid: "Fragmented 10-minute work bursts drowned in Slack pings, email refreshes, and context switching.",
    topOnePercentAction: "Lock 4-hour uninterrupted deep work sprints; treat uninterrupted focus as an unfair competitive moat.",
    leverageMultiplier: "4x Cognitive Output",
    accentColor: "#10b981", // Emerald
    icon: "🧠",
  },
  {
    number: "03",
    leverName: "The Barbell Profile (Kill the Middle)",
    trapToAvoid: "Being a lukewarm, mediocre middle manager who knows a little bit of everything and excels at nothing.",
    topOnePercentAction: "Be either the extreme technical specialist or the first-principles capital allocator who owns the asset.",
    leverageMultiplier: "Asymmetric Equity",
    accentColor: "#f59e0b", // Amber
    icon: "⚖️",
  },
  {
    number: "04",
    leverName: "Extreme Rejection & Discomfort Tolerance",
    trapToAvoid: "Polite passivity—fearing looking awkward, waiting for permission, or hesitating to make low offers.",
    topOnePercentAction: "Embrace uncomfortable cold outreach and lowball buyout offers; rejection is merely free market feedback.",
    leverageMultiplier: "Uncapped Upside",
    accentColor: "#38bdf8", // Sky
    icon: "🛡️",
  },
  {
    number: "05",
    leverName: "Zero Administrative Operational Drag",
    trapToAvoid: "Spending 20+ hours weekly on invoicing, manual entity filings, and low-leverage paperwork.",
    topOnePercentAction: "Automate or outsource 100% of non-core administration so every hour directly compounds your net worth.",
    leverageMultiplier: "20+ Hours Reclaimed",
    accentColor: "#a855f7", // Purple
    icon: "⚡",
  },
];

export const CodieSanchezTopPercentileAsset: React.FC<CodieSanchezTopPercentileAssetProps> = ({
  title = "It’s Never Been Easier To Be In The Top 1%",
  subtitle = "Codie Sanchez's Focus Finder Engine: The Anti-Slop Arbitrage Architecture",
  badgeText = "CONTRARIAN THINKING • THE TOP 1% ARBITRAGE",
  levers = DEFAULT_LEVERS,
  telemetry = {
    marketHomogenization: "99% Generic AI Slop",
    arbitrageAdvantage: "Top 1% Barrier Cut by 80%",
    focusDensity: "5 Non-Negotiable Levers",
  },
  contrarianLaw = "“When the entire world rushes toward average, executing the simple fundamentals with obsessive depth makes you mathematically unbeatable.”",
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
        padding: "40px 50px",
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
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)",
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
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)",
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
              backgroundColor: isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#f59e0b",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "8px",
              transform: `scale(${pulseScale})`,
            }}
          >
            <span>👑</span>
            {badgeText}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
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

        {/* The Top 1% Arbitrage Gauge */}
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
            The Competitive Reality
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: textPrimary, marginTop: "4px" }}>
            Masses: <span style={{ color: "#ef4444" }}>{telemetry.marketHomogenization}</span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
            Edge: {telemetry.arbitrageAdvantage}
          </div>
        </div>
      </div>

      {/* CONTRARIAN QUOTE BANNER */}
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
          {contrarianLaw}
        </span>
      </div>

      {/* 5 FOCUS FINDER LEVERS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "16px",
        }}
      >
        {levers.map((lever, idx) => {
          const cardSpring = spring({
            frame: frame - (14 + idx * 5),
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 95 },
          });

          return (
            <div
              key={lever.number}
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
                  backgroundColor: lever.accentColor,
                }}
              />

              {/* Lever Header */}
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
                      fontSize: "11px",
                      fontWeight: 800,
                      color: lever.accentColor,
                      letterSpacing: "0.8px",
                    }}
                  >
                    LEVER {lever.number}
                  </span>
                  <span style={{ fontSize: "18px" }}>{lever.icon}</span>
                </div>

                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "14.5px",
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.25,
                  }}
                >
                  {lever.leverName}
                </h4>

                {/* The Trap */}
                <div
                  style={{
                    fontSize: "11px",
                    color: textSecondary,
                    lineHeight: 1.4,
                    marginBottom: "10px",
                    backgroundColor: isDark ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.05)",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    borderLeft: "2px solid #ef4444",
                  }}
                >
                  <strong style={{ color: "#ef4444", display: "block", fontSize: "10px", textTransform: "uppercase" }}>
                    The 99% Trap:
                  </strong>
                  {lever.trapToAvoid}
                </div>

                {/* The Top 1% Move */}
                <div
                  style={{
                    fontSize: "11px",
                    color: textPrimary,
                    lineHeight: 1.4,
                    fontWeight: 500,
                  }}
                >
                  <strong style={{ color: lever.accentColor, display: "block", fontSize: "10px", textTransform: "uppercase" }}>
                    Top 1% Execution:
                  </strong>
                  {lever.topOnePercentAction}
                </div>
              </div>

              {/* Multiplier Badge */}
              <div style={{ marginTop: "14px" }}>
                <div
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    backgroundColor: `${lever.accentColor}15`,
                    border: `1px solid ${lever.accentColor}35`,
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: lever.accentColor,
                    letterSpacing: "0.5px",
                  }}
                >
                  {lever.leverageMultiplier}
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
              Core Audit Driver
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginTop: "2px" }}>
              Top 5 Focus Finder Protocol
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              The Moat
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              Anti-Slop Craftsmanship & Polarizing POV
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Operating Law
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#f59e0b", marginTop: "2px" }}>
              Depth Over Broad Mediocrity
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
          ITNAVIDEO • HIGH-RETENTION ASSET LIBRARY
        </div>
      </div>
    </div>
  );
};
