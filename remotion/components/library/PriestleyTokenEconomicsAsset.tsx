import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface HumanMoatItem {
  moatNumber: string;
  title: string;
  humanAdvantage: string;
  aiLimitation: string;
  economicValue: string;
  accentColor: string;
  icon: string;
}

export interface PriestleyTokenEconomicsAssetProps {
  title?: string;
  subtitle?: string;
  shockRatioBadge?: string;
  moats?: HumanMoatItem[];
  legacyVsModern?: {
    legacy: string;
    modern: string;
  };
  tractorLaw?: string;
  isDark?: boolean;
}

const DEFAULT_MOATS: HumanMoatItem[] = [
  {
    moatNumber: "MOAT 01",
    title: "Trust & Emotional Intimacy",
    humanAdvantage: "High-stakes empathy, active listening, and bedside crisis counsel.",
    aiLimitation: "Cannot feel human stakes, love, or personal emotional risk.",
    economicValue: "Premium Retainer Moat",
    accentColor: "#38bdf8", // Sky
    icon: "🤝",
  },
  {
    moatNumber: "MOAT 02",
    title: "Taste, Vision & Curation",
    humanAdvantage: "Knowing WHAT to make; aesthetic curation and creative discernment.",
    aiLimitation: "Generates endless average noise; lacks contextual subjective taste.",
    economicValue: "Category Defining Moat",
    accentColor: "#10b981", // Emerald
    icon: "🎨",
  },
  {
    moatNumber: "MOAT 03",
    title: "Skin in the Game & Liability",
    humanAdvantage: "Legal sign-off, professional accountability, and capital at risk.",
    aiLimitation: "Cannot be sued, jailed, or held financially accountable.",
    economicValue: "High-Risk High-Margin Moat",
    accentColor: "#f59e0b", // Amber
    icon: "⚖️",
  },
  {
    moatNumber: "MOAT 04",
    title: "Audience & Distribution",
    humanAdvantage: "Owned attention, personal brand trust, and community loyalty.",
    aiLimitation: "No proprietary audience; zero organic social loyalty.",
    economicValue: "Zero Marginal Cost Moat",
    accentColor: "#ec4899", // Rose
    icon: "📢",
  },
];

export const PriestleyTokenEconomicsAsset: React.FC<PriestleyTokenEconomicsAssetProps> = ({
  title = "TOKEN ECONOMICS & THE 4 HUMAN MOATS",
  subtitle = "Daniel Priestley Framework • The End of Selling Hours for Money",
  shockRatioBadge = "COST COLLAPSE: 600x Cheaper ($75,000 Knowledge Worker vs $122 AI Tokens)",
  moats = DEFAULT_MOATS,
  legacyVsModern = {
    legacy: "Legacy: 3 Months of Hourly Consulting • Billable Hours • High Friction",
    modern: "2026: 30-Second AI Diagnostic • Outcome Utility • Instant Speed-to-Value",
  },
  tractorLaw = "The Tractor Parable: Never compete with the tractor in the field — own the farm and orchestrate the machinery.",
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
        padding: "30px 40px",
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
      {/* Background Subtle Tech Glow */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "380px",
          height: "380px",
          background: isDark
            ? "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADER SECTION */}
      <div
        style={{
          opacity: headerOpacity,
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingBottom: "14px",
          marginBottom: "12px",
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
                color: "#ec4899",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span>🤖 POST-AI WORK MODEL</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(236,72,153,0.2)" : "rgba(236,72,153,0.15)",
                  fontSize: "11px",
                }}
              >
                TOKEN ECONOMICS
              </span>
            </div>
            <h1
              style={{
                fontSize: "26px",
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
              backgroundColor: isDark ? "rgba(236,72,153,0.12)" : "rgba(236,72,153,0.08)",
              border: "1px solid rgba(236,72,153,0.35)",
              padding: "6px 14px",
              borderRadius: "12px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#ec4899",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              SHOCK COMPARISON
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: isDark ? "#fce7f3" : "#831843",
                marginTop: "2px",
              }}
            >
              {shockRatioBadge}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 4 HUMAN MOATS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "12px",
        }}
      >
        {moats.map((m, idx) => {
          const cardSpring = spring({
            frame: frame - 5 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={m.moatNumber}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${m.accentColor}35`
                  : `1px solid ${m.accentColor}50`,
                borderRadius: "18px",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 20px -6px ${m.accentColor}20`
                  : "0 4px 14px -3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  backgroundColor: m.accentColor,
                }}
              />

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color: m.accentColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {m.moatNumber}
                  </span>
                  <span style={{ fontSize: "16px" }}>{m.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    lineHeight: 1.25,
                    color: isDark ? "#f8fafc" : "#0f172a",
                    marginBottom: "6px",
                  }}
                >
                  {m.title}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.35,
                    color: isDark ? "#cbd5e1" : "#475569",
                    fontWeight: 500,
                    marginBottom: "8px",
                  }}
                >
                  {m.humanAdvantage}
                </div>
              </div>

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
                    color: isDark ? "#94a3b8" : "#64748b",
                    lineHeight: 1.25,
                  }}
                >
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>AI Gap: </span>
                  {m.aiLimitation}
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: m.accentColor,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    padding: "3px 6px",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  ★ {m.economicValue}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SPEED TO VALUE COMPARISON STRIP */}
      <div
        style={{
          backgroundColor: isDark ? "rgba(18,18,22,0.8)" : "#ffffff",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          borderRadius: "14px",
          padding: "10px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          fontSize: "11px",
          marginBottom: "10px",
        }}
      >
        <div style={{ color: "#ef4444", fontWeight: 600 }}>
          ⏳ {legacyVsModern.legacy}
        </div>
        <div
          style={{
            color: "#10b981",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>⚡</span>
          <span>{legacyVsModern.modern}</span>
        </div>
      </div>

      {/* BOTTOM FOOTER: TRACTOR PARABLE */}
      <div
        style={{
          opacity: headerOpacity,
          borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
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
          <span style={{ fontSize: "13px" }}>🚜</span>
          <span style={{ fontStyle: "italic" }}>{tractorLaw}</span>
        </div>

        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#ec4899",
            backgroundColor: isDark ? "rgba(236,72,153,0.12)" : "rgba(236,72,153,0.08)",
            padding: "4px 8px",
            borderRadius: "999px",
            border: "1px solid rgba(236,72,153,0.25)",
          }}
        >
          SPEED TO VALUE
        </div>
      </div>
    </div>
  );
};
