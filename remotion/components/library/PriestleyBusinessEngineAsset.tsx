import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface LapsStage {
  label: string;
  count: number | string;
  sub: string;
  color: string;
  conversionRate?: string;
  icon?: string;
}

export interface MediaTier {
  title: string;
  role: string;
  deliverable: string;
  friction: string;
  badgeColor: string;
}

export interface PriestleyBusinessEngineAssetProps {
  title?: string;
  subtitle?: string;
  weeklyTarget?: string;
  annualRunRate?: string;
  activeMode?: "laps" | "threeTier" | "hybrid";
  stages?: LapsStage[];
  tiers?: MediaTier[];
  allowableCac?: string;
  cadenceNote?: string;
  isDark?: boolean;
}

const DEFAULT_STAGES: LapsStage[] = [
  {
    label: "Leads",
    count: "250",
    sub: "Targeted Inbound & Scorecard Leads",
    color: "#38bdf8", // Sky
    conversionRate: "16% to Appt",
    icon: "🧲",
  },
  {
    label: "Appointments",
    count: "40",
    sub: "Qualified Discovery & Strategy Calls",
    color: "#818cf8", // Indigo
    conversionRate: "37.5% to Pitch",
    icon: "📅",
  },
  {
    label: "Presentations",
    count: "15",
    sub: "Custom Proposals & Solution Pitches",
    color: "#f59e0b", // Amber
    conversionRate: "33.3% Close",
    icon: "🎯",
  },
  {
    label: "Sales",
    count: "5",
    sub: "Closed Deals @ $5,000 ACV ($25k/wk)",
    color: "#10b981", // Emerald
    conversionRate: "$1M Annual Run Rate",
    icon: "🏆",
  },
];

const DEFAULT_TIERS: MediaTier[] = [
  {
    title: "1. Short-Form Video",
    role: "Attention & Hook Engine",
    deliverable: "Viral Reels, TikToks, Shorts",
    friction: "Zero Friction (Broad Reach)",
    badgeColor: "#38bdf8",
  },
  {
    title: "2. Long-Form Authority",
    role: "Trust & Intellectual Property",
    deliverable: "YouTube Breakdowns, Books, Podcasts",
    friction: "High Engagement (Deep Affinity)",
    badgeColor: "#818cf8",
  },
  {
    title: "3. Lead-Form Scorecard",
    role: "Signal & Data Qualification",
    deliverable: "Interactive Assessment / Diagnostic",
    friction: "Active Participation (Warm Intent)",
    badgeColor: "#10b981",
  },
];

export const PriestleyBusinessEngineAsset: React.FC<PriestleyBusinessEngineAssetProps> = ({
  title = "THE $1M BUSINESS ENGINE",
  subtitle = "Daniel Priestley Architecture • LAPS Velocity & 3-Tier Media Funnel",
  weeklyTarget = "$25,000 / week",
  annualRunRate = "$1,000,000 Run-Rate",
  activeMode = "hybrid",
  stages = DEFAULT_STAGES,
  tiers = DEFAULT_TIERS,
  allowableCac = "Allowable CAC: $1,250 / client (25% margin cushion)",
  cadenceNote = "Monday Alignment • Friday Celebration Rhythm",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scaleY = interpolate(introSpring, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "36px 44px",
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
      {/* Background Subtle Tech Grid Accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingBottom: "18px",
          marginBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
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
            <span>⚡ ENTREPRENEURIAL ARCHITECTURE</span>
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)",
                fontSize: "11px",
              }}
            >
              DANIEL PRIESTLEY MODEL
            </span>
          </div>
          <h1
            style={{
              fontSize: "30px",
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
              fontSize: "14px",
              margin: "6px 0 0 0",
              color: isDark ? "#94a3b8" : "#64748b",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Target Badge Counter */}
        <div
          style={{
            textAlign: "right",
            backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.35)",
            padding: "10px 18px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#10b981",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            WEEKLY TARGET
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#10b981",
              lineHeight: 1.2,
            }}
          >
            {weeklyTarget}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: isDark ? "#cbd5e1" : "#475569",
            }}
          >
            {annualRunRate}
          </div>
        </div>
      </div>

      {/* CORE MIDDLE SECTION: LAPS ENGINE & 3-TIER FLYWHEEL */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* LAPS PIPELINE VELOCITY STRIP */}
        {(activeMode === "laps" || activeMode === "hybrid") && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isDark ? "#cbd5e1" : "#334155",
                }}
              >
                1. LAPS Pipeline Velocity Model (Weekly Rhythm)
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                L → A → P → S
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
              }}
            >
              {stages.map((stage, idx) => {
                const stageSpring = spring({
                  frame: frame - 6 * idx,
                  fps,
                  config: { damping: 12, stiffness: 100 },
                });

                return (
                  <div
                    key={stage.label}
                    style={{
                      transform: `scale(${interpolate(stageSpring, [0, 1], [0.92, 1])})`,
                      opacity: stageSpring,
                      backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                      border: isDark
                        ? `1px solid ${stage.color}40`
                        : `1px solid ${stage.color}60`,
                      borderRadius: "16px",
                      padding: "14px 16px",
                      boxShadow: isDark
                        ? `0 8px 24px -6px ${stage.color}25`
                        : "0 6px 18px -4px rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        backgroundColor: stage.color,
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
                            fontSize: "11px",
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: stage.color,
                          }}
                        >
                          {stage.icon} {stage.label}
                        </span>
                        {stage.conversionRate && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              color: isDark ? "#94a3b8" : "#64748b",
                            }}
                          >
                            {stage.conversionRate}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "26px",
                          fontWeight: 900,
                          color: isDark ? "#ffffff" : "#0f172a",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.15,
                        }}
                      >
                        {stage.count}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        color: isDark ? "#a1a1aa" : "#64748b",
                        marginTop: "6px",
                        lineHeight: 1.3,
                        fontWeight: 500,
                      }}
                    >
                      {stage.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3-TIER MEDIA ENGINE: SHORT FORM -> LONG FORM -> LEAD FORM */}
        {(activeMode === "threeTier" || activeMode === "hybrid") && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isDark ? "#cbd5e1" : "#334155",
                }}
              >
                2. Modern 3-Tier Media Flywheel (Content to Inbound)
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#10b981",
                  fontWeight: 700,
                }}
              >
                Reach → Depth → Scorecard Data
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {tiers.map((tier, idx) => {
                const tierSpring = spring({
                  frame: frame - (18 + 6 * idx),
                  fps,
                  config: { damping: 13, stiffness: 100 },
                });

                return (
                  <div
                    key={tier.title}
                    style={{
                      transform: `scale(${interpolate(tierSpring, [0, 1], [0.94, 1])})`,
                      opacity: tierSpring,
                      backgroundColor: isDark ? "rgba(18,18,22,0.8)" : "#f8fafc",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "16px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "6px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: tier.badgeColor,
                          marginBottom: "4px",
                        }}
                      >
                        {tier.title}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: isDark ? "#f1f5f9" : "#0f172a",
                          lineHeight: 1.25,
                        }}
                      >
                        {tier.role}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: isDark ? "#94a3b8" : "#64748b",
                          marginTop: "4px",
                        }}
                      >
                        {tier.deliverable}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: tier.badgeColor,
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.04)",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        width: "fit-content",
                        marginTop: "4px",
                      }}
                    >
                      {tier.friction}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER: CAC GUARDRAILS & OPERATIONAL RHYTHM */}
      <div
        style={{
          opacity: headerOpacity,
          borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingTop: "14px",
          marginTop: "14px",
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
            gap: "10px",
            color: isDark ? "#cbd5e1" : "#475569",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 8px #10b981",
            }}
          />
          <span>{allowableCac}</span>
        </div>

        <div
          style={{
            color: isDark ? "#94a3b8" : "#64748b",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>🔄</span>
          <span>{cadenceNote}</span>
        </div>
      </div>
    </div>
  );
};
