import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface AiBotAuditItem {
  number: string;
  botName: string;
  category: string;
  strategy: string;
  cashResult: string;
  isProfit: boolean;
  verdict: string;
  accentColor: string;
  icon: string;
}

export interface CodieSanchezAiAgentsAuditAssetProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  bots?: AiBotAuditItem[];
  telemetry?: {
    totalBudget: string;
    netCashGenerated: string;
    internalCostSavings: string;
    efficiencyRating: string;
  };
  contrarianLaw?: string;
  isDark?: boolean;
}

const DEFAULT_BOTS: AiBotAuditItem[] = [
  {
    number: "01",
    botName: "Trading Bot ('Wolfie')",
    category: "Financial Speculation",
    strategy: "Auto-scanning Reddit & X sentiment; algorithmic momentum trades on Robinhood.",
    cashResult: "-$15.20 Loss",
    isProfit: false,
    verdict: "High Hype, Zero Edge",
    accentColor: "#ef4444", // Crimson
    icon: "📈",
  },
  {
    number: "02",
    botName: "Flipping Trio ('Alvin & Simon')",
    category: "Physical Arbitrage",
    strategy: "Scraping free/discounted local items on Marketplace, coordinating couriers & re-listing.",
    cashResult: "+$88.40 Profit",
    isProfit: true,
    verdict: "Boring Winner",
    accentColor: "#10b981", // Emerald
    icon: "📦",
  },
  {
    number: "03",
    botName: "Clipping & Caption Bot",
    category: "Media Repurposing",
    strategy: "Slicing long podcasts into viral vertical reels with kinetic subtitles for creator gigs.",
    cashResult: "+$450 In-House Value",
    isProfit: true,
    verdict: "Internal Superpower",
    accentColor: "#38bdf8", // Sky
    icon: "✂️",
  },
  {
    number: "04",
    botName: "Re-engagement Bot ('Finn')",
    category: "Owned Audience Win-Back",
    strategy: "Automated personalized email reactivation flows sent to dormant past buyers via Klaviyo.",
    cashResult: "+$14.50 Cash Flow",
    isProfit: true,
    verdict: "Dormant Goldmine",
    accentColor: "#f59e0b", // Amber
    icon: "✉️",
  },
  {
    number: "05",
    botName: "Cold Outreach Bot ('Dora')",
    category: "B2B Lead Enrichment",
    strategy: "Scraping local SMBs on Google Maps & Apollo; sending personalized workshop pitches.",
    cashResult: "$2,000 Pipeline (Soft)",
    isProfit: true,
    verdict: "Vanity Metric Gap",
    accentColor: "#a855f7", // Purple
    icon: "🎯",
  },
];

export const CodieSanchezAiAgentsAuditAsset: React.FC<CodieSanchezAiAgentsAuditAssetProps> = ({
  title = "I Tried The “Easiest” Ways To Make Money With AI",
  subtitle = "Codie Sanchez's 5-Bot Reality Audit: The $100 to $1,000 Hard Cash Experiment",
  badgeText = "CONTRARIAN THINKING • AI AGENTS FORENSIC AUDIT",
  bots = DEFAULT_BOTS,
  telemetry = {
    totalBudget: "$100 Cap",
    netCashGenerated: "+$102.90 Cash",
    internalCostSavings: "+$450.00 Saved",
    efficiencyRating: "Boring > Hype",
  },
  contrarianLaw = "“An AI agent running a bad strategy just loses money faster. Automate boring logistics and owned customer lists—never market timing.”",
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

  const bannerEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 95 },
  });

  const quoteEntrance = spring({
    frame: frame - 16,
    fps,
    config: { damping: 14, mass: 0.85, stiffness: 90 },
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
          top: "-20%",
          left: "20%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0) 70%)",
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
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "8px",
              transform: `scale(${pulseScale})`,
            }}
          >
            <span>🤖</span>
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

        {/* Top 3 Constraints Stamp */}
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
            The 3 Hard Constraints
          </div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary, marginTop: "4px", lineHeight: 1.4 }}>
            1. Zero Human Labor <br />
            2. Max $100 Budget Cap <br />
            3. Hard Cash or Verifiable Savings
          </div>
        </div>
      </div>

      {/* CONTRARIAN LAW CALLOUT BANNER */}
      <div
        style={{
          opacity: Math.max(0, bannerEntrance),
          transform: `translateY(${interpolate(Math.max(0, bannerEntrance), [0, 1], [15, 0])}px)`,
          padding: "12px 20px",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(241, 245, 249, 0.9)",
          borderLeft: "4px solid #f59e0b",
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

      {/* 5-BOT COMPARATIVE MATRIX */}
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
        {bots.map((bot, idx) => {
          const cardSpring = spring({
            frame: frame - (14 + idx * 5),
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 95 },
          });

          return (
            <div
              key={bot.number}
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
                  backgroundColor: bot.accentColor,
                }}
              />

              {/* Bot Info Header */}
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
                      color: bot.accentColor,
                      letterSpacing: "0.8px",
                    }}
                  >
                    BOT {bot.number}
                  </span>
                  <span style={{ fontSize: "18px" }}>{bot.icon}</span>
                </div>

                <h4
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "15px",
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.25,
                  }}
                >
                  {bot.botName}
                </h4>

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
                  {bot.category}
                </div>

                {/* Strategy Text */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "11.5px",
                    color: textSecondary,
                    lineHeight: 1.45,
                  }}
                >
                  {bot.strategy}
                </p>
              </div>

              {/* Cash Result & Verdict Badge */}
              <div style={{ marginTop: "14px" }}>
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    backgroundColor: `${bot.accentColor}15`,
                    border: `1px solid ${bot.accentColor}35`,
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "9px", fontWeight: 700, color: textMuted, textTransform: "uppercase" }}>
                    Cash P&L
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 900,
                      color: bot.accentColor,
                      marginTop: "2px",
                    }}
                  >
                    {bot.cashResult}
                  </div>
                </div>

                {/* Verdict Tag */}
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    textAlign: "center",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    color: bot.accentColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {bot.verdict}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TELEMETRY AUDIT BAR */}
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
              Budget Deployed
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: textPrimary, marginTop: "2px" }}>
              {telemetry.totalBudget}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Net Cash Realized
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              {telemetry.netCashGenerated}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Internal In-House Savings
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#38bdf8", marginTop: "2px" }}>
              {telemetry.internalCostSavings}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Contrarian Verdict
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#f59e0b", marginTop: "2px" }}>
              {telemetry.efficiencyRating}
            </div>
          </div>
        </div>

        {/* Brand Stamp */}
        <div
          style={{
            padding: "5px 10px",
            borderRadius: "6px",
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            fontSize: "10px",
            fontWeight: 800,
            color: textSecondary,
            letterSpacing: "0.8px",
          }}
        >
          ITNAVIDEO • AI AGENTS REEL LIBRARY
        </div>
      </div>
    </div>
  );
};
