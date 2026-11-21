import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface MicroAppArchetype {
  rank: string;
  name: string;
  category: string;
  estimatedMrr: string;
  acuteProblem: string;
  viralGrowthLoop: string;
  paywallModel: string;
  accentColor: string;
  icon: string;
}

export interface ViralMicroAppEngineAssetProps {
  title?: string;
  subtitle?: string;
  soloScaleBadge?: string;
  apps?: MicroAppArchetype[];
  playbookRule?: string;
  isDark?: boolean;
}

const DEFAULT_APPS: MicroAppArchetype[] = [
  {
    rank: "#01",
    name: "Body & Posture Transformation",
    category: "Physical Optimization",
    estimatedMrr: "$110,000 / mo",
    acuteProblem: "Insecurity about slouching and height; desire for visible posture gains.",
    viralGrowthLoop: "Before/After 30-day posture split videos on TikTok UGC.",
    paywallModel: "$9.99 / week trial paywall",
    accentColor: "#38bdf8", // Sky
    icon: "🧍",
  },
  {
    rank: "#02",
    name: "AI Meal & Calorie Photo Scanner",
    category: "Nutrition & Health",
    estimatedMrr: "$250,000 / mo",
    acuteProblem: "Typing and weighing food manually is tedious; 90% quit tracking.",
    viralGrowthLoop: "1-second camera snap revealing instant macro breakdown in reels.",
    paywallModel: "$29.99 / quarter subscription",
    accentColor: "#10b981", // Emerald
    icon: "📸",
  },
  {
    rank: "#03",
    name: "Dopamine Detox & Screen Friction",
    category: "Digital Wellness",
    estimatedMrr: "$140,000 / mo",
    acuteProblem: "Unconscious phone checking and doomscrolling robbing 4 hours a day.",
    viralGrowthLoop: "Gamified cute mascot guilt-tripping friends into focus streaks.",
    paywallModel: "$4.99 / mo or $39 lifetime",
    accentColor: "#f59e0b", // Amber
    icon: "🧘",
  },
  {
    rank: "#04",
    name: "AI Facial Symmetry Diagnostic",
    category: "Self-Care & Grooming",
    estimatedMrr: "$180,000 / mo",
    acuteProblem: "Gen Z anxiety over jawline, skin texture, and grooming potential.",
    viralGrowthLoop: "Facial scan ratings (82/100) and step-by-step glowup checklist.",
    paywallModel: "$7.99 / week unlock",
    accentColor: "#ec4899", // Rose
    icon: "✨",
  },
  {
    rank: "#05",
    name: "Couples Daily Spark Widget",
    category: "Intimacy & Relationship",
    estimatedMrr: "$95,000 / mo",
    acuteProblem: "Couples drifting apart through mundane, silent daily routines.",
    viralGrowthLoop: "Locked iPhone home screen widget answering surprise daily prompts.",
    paywallModel: "$14.99 / year per couple",
    accentColor: "#a855f7", // Purple
    icon: "❤️",
  },
];

export const ViralMicroAppEngineAsset: React.FC<ViralMicroAppEngineAssetProps> = ({
  title = "THE $100K/MO SOLO FOUNDER MICRO-APP PLAYBOOK",
  subtitle = "Jason Lee Framework • 5 Breakout Consumer Mobile Apps Built in Under 72 Hours",
  soloScaleBadge = "Solo Scale: 5 Apps > $100K/mo MRR • 1-3 Day Build Time • 0 VC Funding",
  apps = DEFAULT_APPS,
  playbookRule = "Micro-App Formula: Solve 1 Acute Itch • Hook with Camera/Quiz • Charge $9.99/Week • Scale via Organic UGC",
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
        padding: "28px 38px",
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
          top: "-50px",
          right: "-50px",
          width: "360px",
          height: "360px",
          background: isDark
            ? "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
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
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span>🚀 MICRO-SaaS BLUEPRINT</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)",
                  fontSize: "11px",
                }}
              >
                JASON LEE ANALYSIS
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
              backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.35)",
              padding: "6px 14px",
              borderRadius: "12px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#10b981",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              SPEED & REVENUE
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: isDark ? "#dcfce7" : "#14532d",
                marginTop: "2px",
              }}
            >
              {soloScaleBadge}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 5 MICRO-APPS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "12px",
        }}
      >
        {apps.map((app, idx) => {
          const cardSpring = spring({
            frame: frame - 4 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={app.rank}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${app.accentColor}35`
                  : `1px solid ${app.accentColor}50`,
                borderRadius: "16px",
                padding: "14px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 20px -6px ${app.accentColor}20`
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
                  backgroundColor: app.accentColor,
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
                      color: app.accentColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {app.rank}
                  </span>
                  <span style={{ fontSize: "16px" }}>{app.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: isDark ? "#94a3b8" : "#64748b",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {app.category}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    lineHeight: 1.25,
                    color: isDark ? "#f8fafc" : "#0f172a",
                    marginBottom: "4px",
                  }}
                >
                  {app.name}
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    color: app.accentColor,
                    marginBottom: "6px",
                  }}
                >
                  {app.estimatedMrr}
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.3,
                    color: isDark ? "#cbd5e1" : "#475569",
                    fontWeight: 500,
                    marginBottom: "6px",
                  }}
                >
                  {app.acuteProblem}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  marginTop: "8px",
                  borderTop: isDark
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "1px solid rgba(0,0,0,0.05)",
                  paddingTop: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: isDark ? "#a1a1aa" : "#64748b",
                    lineHeight: 1.25,
                  }}
                >
                  <span style={{ color: "#38bdf8", fontWeight: 700 }}>Loop: </span>
                  {app.viralGrowthLoop}
                </div>

                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: app.accentColor,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    padding: "3px 4px",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  💳 {app.paywallModel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM FOOTER: PLAYBOOK RULE */}
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
          <span style={{ fontSize: "13px" }}>💡</span>
          <span style={{ fontStyle: "italic" }}>{playbookRule}</span>
        </div>

        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#10b981",
            backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
            padding: "4px 8px",
            borderRadius: "999px",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          ORGANIC UGC LEVERAGE
        </div>
      </div>
    </div>
  );
};
