import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface MicroLawItem {
  lawNumber: string;
  title: string;
  coreRule: string;
  trapToAvoid: string;
  leverageBenefit: string;
  accentColor: string;
  icon: string;
}

export interface PriestleyMicroeconomicsAssetProps {
  title?: string;
  subtitle?: string;
  makerTagline?: string;
  takerTagline?: string;
  laws?: MicroLawItem[];
  steinmetzNote?: string;
  isDark?: boolean;
}

const DEFAULT_LAWS: MicroLawItem[] = [
  {
    lawNumber: "LAW 01",
    title: "Ignore Macro, Master Micro",
    coreRule: "Control your niche ecosystem, customer intimacy, and proprietary offer.",
    trapToAvoid: "Blaming inflation, interest rates, or national headlines for low sales.",
    leverageBenefit: "Immunity to Macro Cycles",
    accentColor: "#38bdf8", // Sky
    icon: "🌐",
  },
  {
    lawNumber: "LAW 02",
    title: "Engineer Demand > Supply",
    coreRule: "Build an oversubscribed waiting list before manufacturing or fulfilling.",
    trapToAvoid: "Thinking like a supplier; overbuilding capacity before proving appetite.",
    leverageBenefit: "Extreme Pricing Power",
    accentColor: "#10b981", // Emerald
    icon: "📈",
  },
  {
    lawNumber: "LAW 03",
    title: "Build Your Own Market",
    coreRule: "Design a category of one with unique IP, signature names, and diagnostics.",
    trapToAvoid: "Competing in crowded commodity red oceans on hourly rates.",
    leverageBenefit: "Zero Direct Competitors",
    accentColor: "#818cf8", // Indigo
    icon: "🏰",
  },
  {
    lawNumber: "LAW 04",
    title: "Offer Here & Now (Campaigns)",
    coreRule: "Use fixed campaign windows and real capacity limits to force decisions.",
    trapToAvoid: "Passive evergreen open carts with zero urgency or consequence of delay.",
    leverageBenefit: "Urgency-Driven Buying",
    accentColor: "#f59e0b", // Amber
    icon: "⏳",
  },
  {
    lawNumber: "LAW 05",
    title: "Sell Utility, Not Effort",
    coreRule: "Value-based pricing: clients buy the transformation and risk elimination.",
    trapToAvoid: "Cost-plus billing; trading raw hours for dollars.",
    leverageBenefit: "10x Margin Expansion",
    accentColor: "#ec4899", // Pink / Rose
    icon: "💎",
  },
];

export const PriestleyMicroeconomicsAsset: React.FC<PriestleyMicroeconomicsAssetProps> = ({
  title = "MICROECONOMICS OF PRICING POWER",
  subtitle = "Daniel Priestley Framework • The 5 Laws of Becoming a Price Maker",
  makerTagline = "PRICE MAKER: Proprietary IP • Demand > Supply • 50%+ Net Margins",
  takerTagline = "PRICE TAKER: Commodity • Selling Hours • Zero Pricing Power • 0% Profit",
  laws = DEFAULT_LAWS,
  steinmetzNote = "The $10,000 Screw Principle: $1 for turning the screw — $9,999 for knowing WHICH screw to turn.",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro animation
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scaleY = interpolate(introSpring, [0, 1], [0.94, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 42px",
        backgroundColor: isDark ? "#09090b" : "#f8fafc",
        color: isDark ? "#f8fafc" : "#0f172a",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        transform: `scale(${scaleY})`,
        opacity: introSpring,
        borderRadius: "28px",
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.1)",
        boxShadow: isDark
          ? "0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 20px 45px -10px rgba(0,0,0,0.08)",
      }}
    >
      {/* Background Accent Glow */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "350px",
          height: "350px",
          background: isDark
            ? "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADER SECTION */}
      <div
        style={{
          opacity: headerOpacity,
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingBottom: "16px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span>⚖️ VALUE ARCHITECTURE</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)",
                  fontSize: "11px",
                }}
              >
                MICROECONOMIC LAWS
              </span>
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 900,
                margin: 0,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "13px",
                margin: "4px 0 0 0",
                color: isDark ? "#94a3b8" : "#64748b",
                fontWeight: 500,
              }}
            >
              {subtitle}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#10b981",
                backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                padding: "4px 10px",
                borderRadius: "8px",
              }}
            >
              🏆 {makerTagline}
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: isDark ? "#94a3b8" : "#64748b",
                padding: "2px 8px",
              }}
            >
              ⚠️ {takerTagline}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 5 LAWS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "14px",
        }}
      >
        {laws.map((law, idx) => {
          const cardSpring = spring({
            frame: frame - 5 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={law.lawNumber}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${law.accentColor}35`
                  : `1px solid ${law.accentColor}50`,
                borderRadius: "18px",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 24px -6px ${law.accentColor}20`
                  : "0 6px 18px -4px rgba(0,0,0,0.05)",
              }}
            >
              {/* Colored top bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  backgroundColor: law.accentColor,
                }}
              />

              {/* Card Header */}
              <div>
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
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: law.accentColor,
                    }}
                  >
                    {law.lawNumber}
                  </span>
                  <span style={{ fontSize: "16px" }}>{law.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    lineHeight: 1.25,
                    color: isDark ? "#f8fafc" : "#0f172a",
                    marginBottom: "8px",
                  }}
                >
                  {law.title}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.35,
                    color: isDark ? "#cbd5e1" : "#334155",
                    fontWeight: 500,
                    marginBottom: "8px",
                  }}
                >
                  {law.coreRule}
                </div>
              </div>

              {/* Trap & Benefit Pills */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "8px",
                  borderTop: isDark
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(0,0,0,0.05)",
                  paddingTop: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: isDark ? "#a1a1aa" : "#64748b",
                    lineHeight: 1.2,
                  }}
                >
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>Trap: </span>
                  {law.trapToAvoid}
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: law.accentColor,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    padding: "3px 6px",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  ✓ {law.leverageBenefit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM FOOTER: STEINMETZ PRINCIPLE */}
      <div
        style={{
          opacity: headerOpacity,
          borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: isDark ? "#cbd5e1" : "#475569",
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: "14px" }}>🔩</span>
          <span style={{ fontStyle: "italic" }}>{steinmetzNote}</span>
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#10b981",
            backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          VALUE-BASED LEVERAGE
        </div>
      </div>
    </div>
  );
};
