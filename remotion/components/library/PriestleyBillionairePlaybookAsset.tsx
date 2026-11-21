import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface BillionairePrincipleItem {
  number: string;
  title: string;
  coreRule: string;
  trapToAvoid: string;
  asymmetricLeverage: string;
  accentColor: string;
  icon: string;
}

export interface PriestleyBillionairePlaybookAssetProps {
  title?: string;
  subtitle?: string;
  luckFormula?: string;
  currencyTagline?: string;
  principles?: BillionairePrincipleItem[];
  leverageHierarchy?: string;
  isDark?: boolean;
}

const DEFAULT_PRINCIPLES: BillionairePrincipleItem[] = [
  {
    number: "01",
    title: "Control Luck Surface Area",
    coreRule: "Luck = Doing × Telling. Maximize proactive initiatives and loud public broadcasting.",
    trapToAvoid: "Passive doomscrolling and hoping luck finds you on your couch.",
    asymmetricLeverage: "Mathematical Serendipity",
    accentColor: "#38bdf8", // Sky
    icon: "🎲",
  },
  {
    number: "02",
    title: "Invent Your Own Currency",
    coreRule: "Trade in equity, valuation shares, and reputation capital instead of scarce cash.",
    trapToAvoid: "Funding every acquisition and growth leap with post-tax operational cash.",
    asymmetricLeverage: "Acquisitions with Zero Cash",
    accentColor: "#10b981", // Emerald
    icon: "🪙",
  },
  {
    number: "03",
    title: "Recruit The Beethovens",
    coreRule: "Audition 1,000 people to find the 1 true virtuoso. A-players produce 100x output.",
    trapToAvoid: "Settling for convenient B-players who create managerial drag and bureaucracy.",
    asymmetricLeverage: "100x Talent Multiplication",
    accentColor: "#f59e0b", // Amber
    icon: "🎼",
  },
  {
    number: "04",
    title: "Create A Common Enemy",
    coreRule: "Give your team and customers a shared villain to fight against (Status Quo / Red Tape).",
    trapToAvoid: "Being blandly agreeable and trying to be everything to everyone.",
    asymmetricLeverage: "Tribal Loyalty & Purpose",
    accentColor: "#ec4899", // Rose / Pink
    icon: "⚔️",
  },
];

export const PriestleyBillionairePlaybookAsset: React.FC<PriestleyBillionairePlaybookAssetProps> = ({
  title = "THE TOP 0.01% LEVERAGE PLAYBOOK",
  subtitle = "Daniel Priestley Framework • Billionaire Mindsets & Asymmetric Wealth Architecture",
  luckFormula = "Luck Surface Area: Luck = Doing × Telling (Active Output × Broad Reach)",
  currencyTagline = "Equity > Cash: Using Corporate Valuation as Real Currency",
  principles = DEFAULT_PRINCIPLES,
  leverageHierarchy = "Leverage Hierarchy: Labor (1x) → Capital (10x) → Code & Media (100x) → Equity & IP (1,000x)",
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
            ? "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
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
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span>👑 ASYMMETRIC MENTAL MODELS</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(56,189,248,0.2)" : "rgba(56,189,248,0.15)",
                  fontSize: "11px",
                }}
              >
                THE TOP 0.01%
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
              backgroundColor: isDark ? "rgba(56,189,248,0.12)" : "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.35)",
              padding: "8px 16px",
              borderRadius: "14px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              EXPOSURE LAW
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: isDark ? "#e0f2fe" : "#0369a1",
                marginTop: "2px",
              }}
            >
              {luckFormula}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 4 PRINCIPLES GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "14px",
        }}
      >
        {principles.map((p, idx) => {
          const cardSpring = spring({
            frame: frame - 5 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={p.number}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${p.accentColor}35`
                  : `1px solid ${p.accentColor}50`,
                borderRadius: "18px",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 24px -6px ${p.accentColor}20`
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
                  backgroundColor: p.accentColor,
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
                      color: p.accentColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    PILLAR {p.number}
                  </span>
                  <span style={{ fontSize: "16px" }}>{p.icon}</span>
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
                  {p.title}
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
                  {p.coreRule}
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
                    color: isDark ? "#a1a1aa" : "#64748b",
                    lineHeight: 1.2,
                  }}
                >
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>Trap: </span>
                  {p.trapToAvoid}
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: p.accentColor,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    padding: "3px 6px",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  ⚡ {p.asymmetricLeverage}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM FOOTER: LEVERAGE HIERARCHY */}
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
          <span style={{ fontSize: "14px" }}>📐</span>
          <span style={{ fontStyle: "italic" }}>{leverageHierarchy}</span>
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#38bdf8",
            backgroundColor: isDark ? "rgba(56,189,248,0.12)" : "rgba(56,189,248,0.08)",
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(56,189,248,0.25)",
          }}
        >
          {currencyTagline}
        </div>
      </div>
    </div>
  );
};
