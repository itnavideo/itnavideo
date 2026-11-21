import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface BfcmStrategyPillarItem {
  number: string;
  pillarTitle: string;
  coreMechanism: string;
  amateurMistake: string;
  scaleMetric: string;
  accentColor: string;
  icon: string;
}

export interface DavieFogartyBlackFridayEngineAssetProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  pillars?: BfcmStrategyPillarItem[];
  telemetry?: {
    totalCampaignSales: string;
    aovLift: string;
    earlyAccessRevenueShare: string;
  };
  bfcmLaw?: string;
  isDark?: boolean;
}

const DEFAULT_PILLARS: BfcmStrategyPillarItem[] = [
  {
    number: "01",
    pillarTitle: "The High-AOV Tiered Offer Matrix",
    coreMechanism: "Ditch lazy 15% discounts. Deploy tiered bundles: 'Buy 1 Get 20% Off, Buy 2 Get 35% Off, Buy 4 Get 50% Off' + Free Gift at $120.",
    amateurMistake: "Running a weak 10-20% sitewide discount that gets crushed by 3x ad CPMs.",
    scaleMetric: "AOV: $75 → $145 (+93%)",
    accentColor: "#f59e0b", // Amber Gold
    icon: "🎁",
  },
  {
    number: "02",
    pillarTitle: "The VIP Early Access SMS/Email Moat",
    coreMechanism: "Build a dedicated VIP waitlist 30 days prior. Open the sale 7 days early to your owned list before advertising costs skyrocket on Friday.",
    amateurMistake: "Waiting until Black Friday morning to send your first promotional email.",
    scaleMetric: "42% of Sales Banked Early",
    accentColor: "#10b981", // Emerald
    icon: "📱",
  },
  {
    number: "03",
    pillarTitle: "Shopify Storefront Visual Continuity",
    coreMechanism: "Full Black Friday visual theme takeover: live countdown timers, dynamic free shipping meters, and instant bundle checkout buttons.",
    amateurMistake: "Running Black Friday ads that send shoppers to a normal, unbranded product page.",
    scaleMetric: "CVR: 2.2% → 5.4% During Peak",
    accentColor: "#ef4444", // Crimson
    icon: "⚡",
  },
];

export const DavieFogartyBlackFridayEngineAsset: React.FC<DavieFogartyBlackFridayEngineAssetProps> = ({
  title = "Black Friday Ecommerce Masterclass: My $65M Strategy",
  subtitle = "Davie Fogarty's Q4 BFCM Scaling Engine: Tiered Offer Architecture • VIP Early Access • Storefront Takeover",
  badgeText = "THE OODIE $65M PLAYBOOK • BFCM SCALE ENGINE",
  pillars = DEFAULT_PILLARS,
  telemetry = {
    totalCampaignSales: "$65,000,000 Peak",
    aovLift: "+93% AOV Expansion",
    earlyAccessRevenueShare: "42% Banked in Pre-Sale",
  },
  bfcmLaw = "“During Black Friday, weak discounts die in the ad auction. Build high-AOV tiered bundles, launch to VIPs early, and let scarcity do the selling.”",
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

  const phaseTimelineEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, mass: 0.85, stiffness: 95 },
  });

  const quoteEntrance = spring({
    frame: frame - 16,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 90 },
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
    ? "linear-gradient(145deg, #09090b 0%, #18181b 50%, #030712 100%)"
    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)";

  const cardBg = isDark ? "rgba(24, 24, 27, 0.75)" : "rgba(255, 255, 255, 0.85)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
  const textPrimary = isDark ? "#f8fafc" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#475569";
  const textMuted = isDark ? "#71717a" : "#94a3b8";

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
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0) 70%)",
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
            <span>🏷️</span>
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

        {/* Campaign Revenue Scale Metric */}
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
            Total Q4 Scale
          </div>
          <div style={{ fontSize: "22px", fontWeight: 900, color: "#f59e0b", marginTop: "2px" }}>
            {telemetry.totalCampaignSales}
          </div>
          <div style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>
            AOV Impact: <span style={{ color: "#10b981", fontWeight: 800 }}>{telemetry.aovLift}</span>
          </div>
        </div>
      </div>

      {/* 3-PHASE TIMELINE STRIP */}
      <div
        style={{
          opacity: Math.max(0, phaseTimelineEntrance),
          transform: `translateY(${interpolate(Math.max(0, phaseTimelineEntrance), [0, 1], [15, 0])}px)`,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          margin: "12px 0 14px 0",
        }}
      >
        <div
          style={{
            backgroundColor: isDark ? "rgba(39, 39, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: `1px solid ${cardBorder}`,
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>🔥</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase" }}>
              Phase 1: Pre-Heat (Oct 15 - Nov 10)
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>
              VIP List Building & Creative Testing
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? "rgba(39, 39, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: `1px solid ${cardBorder}`,
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>🔒</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#10b981", textTransform: "uppercase" }}>
              Phase 2: VIP Early Access (Nov 15 - 23)
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>
              Bank 40%+ Sales Before CPMs Spike
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? "rgba(39, 39, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: `1px solid ${cardBorder}`,
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>⚡</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#ef4444", textTransform: "uppercase" }}>
              Phase 3: The Blitz (BF - Cyber Monday)
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>
              96-Hour Urgency & Final Scarcity Push
            </div>
          </div>
        </div>
      </div>

      {/* BFCM LAW BANNER */}
      <div
        style={{
          opacity: Math.max(0, quoteEntrance),
          transform: `translateY(${interpolate(Math.max(0, quoteEntrance), [0, 1], [15, 0])}px)`,
          padding: "10px 18px",
          backgroundColor: isDark ? "rgba(24, 24, 27, 0.7)" : "rgba(241, 245, 249, 0.9)",
          borderLeft: "4px solid #f59e0b",
          borderRadius: "8px",
          marginBottom: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            fontSize: "12.5px",
            color: isDark ? "#e2e8f0" : "#1e293b",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {bfcmLaw}
        </span>
      </div>

      {/* 3 CORE PILLARS */}
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
                  {pillar.pillarTitle}
                </h3>

                {/* Core Mechanism */}
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "12px",
                    color: textSecondary,
                    lineHeight: 1.45,
                  }}
                >
                  {pillar.coreMechanism}
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
                    Amateur Mistake:
                  </strong>
                  {pillar.amateurMistake}
                </div>
              </div>

              {/* Scale Metric Badge */}
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
                  🎯 {pillar.scaleMetric}
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
              Pre-Sale Advantage
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              {telemetry.earlyAccessRevenueShare}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Core Moat
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#f59e0b", marginTop: "2px" }}>
              Tiered Bundles Over Flat Discounts
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Oodie Formula
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#ef4444", marginTop: "2px" }}>
              Beat 3x CPMs with Massive AOV
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
          ITNAVIDEO • HIGH-CONVERTING ECOMMERCE SUITE
        </div>
      </div>
    </div>
  );
};
