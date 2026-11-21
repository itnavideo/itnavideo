import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface EcommercePillarItem {
  number: string;
  pillarName: string;
  tacticalLever: string;
  amateurMistake: string;
  targetKpi: string;
  accentColor: string;
  icon: string;
}

export interface DavieFogartyEcommerceEngineAssetProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  pillars?: EcommercePillarItem[];
  telemetry?: {
    monthlyRevenueTarget: string;
    netMarginBenchmark: string;
    weeklyCreativeOutput: string;
  };
  ecommerceLaw?: string;
  isDark?: boolean;
}

const DEFAULT_PILLARS: EcommercePillarItem[] = [
  {
    number: "01",
    pillarName: "AI Offer & Product Page CRO",
    tacticalLever: "Use Claude Code to audit mobile UX friction, build dynamic bundle tiers, and optimize Liquid templates directly.",
    amateurMistake: "Paying $15k/mo to slow CRO agencies who take 6 weeks to test button colors.",
    targetKpi: "CVR: 1.8% → 3.8% (+110%)",
    accentColor: "#10b981", // Emerald
    icon: "🛍️",
  },
  {
    number: "02",
    pillarName: "Creative Ad Velocity Engine",
    tacticalLever: "Treat creative as the targeting. Deploy 25+ new hook variations, UGC formats, and comparison shorts every single Monday.",
    amateurMistake: "Obsessing over Facebook lookalikes and CBO bid caps while running stale ad creatives.",
    targetKpi: "25+ New Creative Assets / Wk",
    accentColor: "#3b82f6", // Electric Blue
    icon: "🎬",
  },
  {
    number: "03",
    pillarName: "Daily Contribution Margin Audit",
    tacticalLever: "Track net profit (POAS & MER) every night at 11:59 PM after ad spend, COGS, merchant fees, and shipping surcharges.",
    amateurMistake: "Celebrating $1M top-line Shopify revenue while silently losing $50,000 net in the bank.",
    targetKpi: ">22% Daily Net Contribution Margin",
    accentColor: "#f59e0b", // Amber Gold
    icon: "📊",
  },
];

export const DavieFogartyEcommerceEngineAsset: React.FC<DavieFogartyEcommerceEngineAssetProps> = ({
  title = "If I Wanted to Hit $1M/Month in Ecommerce, I'd Do This",
  subtitle = "Davie Fogarty's Scaling Playbook: AI CRO • Creative Ad Velocity • Daily Margin Discipline",
  badgeText = "THE OODIE $500M SCALE BLUEPRINT • $1M/MO SYSTEM",
  pillars = DEFAULT_PILLARS,
  telemetry = {
    monthlyRevenueTarget: "$1,000,000 / Mo",
    netMarginBenchmark: "24.5% Net Profit",
    weeklyCreativeOutput: "25+ Ads / Week",
  },
  ecommerceLaw = "“Revenue is vanity, profit is sanity, cash is king. Fix your offer with AI, flood the algorithm with creative, and track margins daily.”",
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
            <span>💎</span>
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

        {/* E-Commerce Scale Metric */}
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
            Monthly Target
          </div>
          <div style={{ fontSize: "20px", fontWeight: 900, color: "#10b981", marginTop: "2px" }}>
            {telemetry.monthlyRevenueTarget}
          </div>
          <div style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>
            Target Net: <span style={{ color: "#f59e0b", fontWeight: 700 }}>{telemetry.netMarginBenchmark}</span>
          </div>
        </div>
      </div>

      {/* E-COMMERCE LAW BANNER */}
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
          {ecommerceLaw}
        </span>
      </div>

      {/* 3 CORE SCALING PILLARS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "16px",
        }}
      >
        {pillars.map((pillar, idx) => {
          const cardSpring = spring({
            frame: frame - (14 + idx * 6),
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 95 },
          });

          return (
            <div
              key={pillar.number}
              style={{
                opacity: Math.max(0, cardSpring),
                transform: `translateY(${interpolate(Math.max(0, cardSpring), [0, 1], [30, 0])}px)`,
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px",
                padding: "20px 18px",
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
                  backgroundColor: pillar.accentColor,
                }}
              />

              {/* Pillar Header */}
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
                      color: pillar.accentColor,
                      letterSpacing: "0.8px",
                    }}
                  >
                    PILLAR {pillar.number}
                  </span>
                  <span style={{ fontSize: "20px" }}>{pillar.icon}</span>
                </div>

                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "17px",
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.25,
                  }}
                >
                  {pillar.pillarName}
                </h3>

                {/* Tactical Lever */}
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "12px",
                    color: textSecondary,
                    lineHeight: 1.45,
                  }}
                >
                  {pillar.tacticalLever}
                </p>

                {/* Amateur Mistake */}
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.05)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    borderLeft: "2px solid #ef4444",
                    fontSize: "10.5px",
                    color: isDark ? "#fca5a5" : "#b91c1c",
                    lineHeight: 1.35,
                  }}
                >
                  <strong style={{ color: "#ef4444", display: "block", fontSize: "9px", textTransform: "uppercase" }}>
                    The $1M Trap:
                  </strong>
                  {pillar.amateurMistake}
                </div>
              </div>

              {/* Target KPI Badge */}
              <div style={{ marginTop: "14px" }}>
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: "6px",
                    backgroundColor: `${pillar.accentColor}18`,
                    border: `1px solid ${pillar.accentColor}35`,
                    textAlign: "center",
                    fontSize: "11.5px",
                    fontWeight: 800,
                    color: pillar.accentColor,
                  }}
                >
                  🎯 {pillar.targetKpi}
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
              Creative Velocity
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#3b82f6", marginTop: "2px" }}>
              {telemetry.weeklyCreativeOutput}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              The Conversion Moat
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              Claude Code Liquid Optimization
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Core Law
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#f59e0b", marginTop: "2px" }}>
              Profit is Sanity, Cash is King
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
          ITNAVIDEO • E-COMMERCE VIRAL ASSET SUITE
        </div>
      </div>
    </div>
  );
};
