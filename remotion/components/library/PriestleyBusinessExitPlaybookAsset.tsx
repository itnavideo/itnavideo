import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface ExitPillarItem {
  number: string;
  title: string;
  action: string;
  valuationImpact: string;
  accentColor: string;
  icon: string;
}

export interface DealStructureSlice {
  label: string;
  percentage: string;
  desc: string;
  color: string;
}

export interface PriestleyBusinessExitPlaybookAssetProps {
  title?: string;
  subtitle?: string;
  valuationMultiple?: string;
  walkawayNote?: string;
  pillars?: ExitPillarItem[];
  dealSlices?: DealStructureSlice[];
  isDark?: boolean;
}

const DEFAULT_PILLARS: ExitPillarItem[] = [
  {
    number: "01",
    title: "Assetization (24 Assets)",
    action: "Package proprietary IP, systems, brand, and client data into standalone assets.",
    valuationImpact: "+3x-5x on Valuation Multiplier",
    accentColor: "#38bdf8", // Sky
    icon: "📦",
  },
  {
    number: "02",
    title: "100-Day Sabbatical Test",
    action: "Founder steps away completely for 100 days to prove business runs without them.",
    valuationImpact: "Eliminates Key-Person Discount",
    accentColor: "#10b981", // Emerald
    icon: "🏝️",
  },
  {
    number: "03",
    title: "Competitive Bidding War",
    action: "Run a structured M&A auction with 3–5 strategic buyers simultaneously.",
    valuationImpact: "+40% to +100% Deal Price",
    accentColor: "#f59e0b", // Amber
    icon: "⚔️",
  },
  {
    number: "04",
    title: "Optimized Deal Pie",
    action: "Structure cash-at-close vs rollover equity and defensive earn-out milestones.",
    valuationImpact: "Protects After-Tax Net Wealth",
    accentColor: "#818cf8", // Indigo
    icon: "🥧",
  },
];

const DEFAULT_SLICES: DealStructureSlice[] = [
  {
    label: "Cash at Close",
    percentage: "70%",
    desc: "Guaranteed liquid payout deposited on closing day",
    color: "#10b981",
  },
  {
    label: "Rollover Equity",
    percentage: "20%",
    desc: "Second bite of the apple in parent entity",
    color: "#818cf8",
  },
  {
    label: "Milestone Earnout",
    percentage: "10%",
    desc: "Clear, defensible metric-based upside",
    color: "#f59e0b",
  },
];

export const PriestleyBusinessExitPlaybookAsset: React.FC<PriestleyBusinessExitPlaybookAssetProps> = ({
  title = "THE 8-FIGURE EXIT PLAYBOOK",
  subtitle = "Daniel Priestley M&A Framework • Founder Decoupling & Valuation Multipliers",
  valuationMultiple = "Valuation Multiple: 4x EBITDA (Commodity) → 12x+ (Strategic IP)",
  walkawayNote = "Walkaway Power (BATNA): The strongest negotiating position is a thriving business you don't NEED to sell.",
  pillars = DEFAULT_PILLARS,
  dealSlices = DEFAULT_SLICES,
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
      {/* Background Subtle Tech Glow */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "380px",
          height: "380px",
          background: isDark
            ? "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
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
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span>💼 M&A EXIT STRATEGY</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.15)",
                  fontSize: "11px",
                }}
              >
                DANIEL PRIESTLEY PLAYBOOK
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
              backgroundColor: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.35)",
              padding: "8px 16px",
              borderRadius: "14px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#f59e0b",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              STRATEGIC PREMIUM
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: isDark ? "#fef3c7" : "#78350f",
                marginTop: "2px",
              }}
            >
              {valuationMultiple}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 4 PILLARS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        {pillars.map((pillar, idx) => {
          const cardSpring = spring({
            frame: frame - 5 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={pillar.number}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${pillar.accentColor}35`
                  : `1px solid ${pillar.accentColor}50`,
                borderRadius: "18px",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 24px -6px ${pillar.accentColor}20`
                  : "0 6px 18px -4px rgba(0,0,0,0.05)",
              }}
            >
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
                      color: pillar.accentColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    PHASE {pillar.number}
                  </span>
                  <span style={{ fontSize: "16px" }}>{pillar.icon}</span>
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
                  {pillar.title}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.35,
                    color: isDark ? "#cbd5e1" : "#475569",
                    fontWeight: 500,
                  }}
                >
                  {pillar.action}
                </div>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: pillar.accentColor,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                ★ {pillar.valuationImpact}
              </div>
            </div>
          );
        })}
      </div>

      {/* DEAL PIE STRUCTURE STRIP */}
      <div
        style={{
          backgroundColor: isDark ? "rgba(18,18,22,0.8)" : "#ffffff",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          borderRadius: "16px",
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "12px",
        }}
      >
        <div style={{ minWidth: "120px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: isDark ? "#cbd5e1" : "#334155",
            }}
          >
            Deal Pie Structure
          </div>
          <div
            style={{
              fontSize: "10px",
              color: isDark ? "#94a3b8" : "#64748b",
            }}
          >
            Optimized Capital Allocation
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            flex: 1,
          }}
        >
          {dealSlices.map((slice) => (
            <div
              key={slice.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                padding: "6px 12px",
                borderRadius: "10px",
                borderLeft: `3px solid ${slice.color}`,
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 900,
                  color: slice.color,
                }}
              >
                {slice.percentage}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: isDark ? "#f1f5f9" : "#0f172a",
                  }}
                >
                  {slice.label}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}
                >
                  {slice.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM FOOTER: WALKAWAY POWER */}
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
          <span style={{ fontSize: "14px" }}>🛡️</span>
          <span style={{ fontStyle: "italic" }}>{walkawayNote}</span>
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#f59e0b",
            backgroundColor: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          BATNA LEVERAGE
        </div>
      </div>
    </div>
  );
};
