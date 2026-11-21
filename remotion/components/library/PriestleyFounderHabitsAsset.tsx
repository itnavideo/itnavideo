import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface FounderHabitItem {
  number: string;
  title: string;
  cadence: string;
  rule: string;
  impact: string;
  accentColor: string;
  icon: string;
}

export interface PriestleyFounderHabitsAssetProps {
  title?: string;
  subtitle?: string;
  trackRecordBadge?: string;
  habits?: FounderHabitItem[];
  anchorQuote?: string;
  isDark?: boolean;
}

const DEFAULT_HABITS: FounderHabitItem[] = [
  {
    number: "01",
    title: "Perfect Repeatable Week",
    cadence: "Weekly Cadence",
    rule: "Lock your calendar into themed blocks: Focus Days, Buffer Days, and Free Days.",
    impact: "Stops Ad-Hoc Chaos",
    accentColor: "#38bdf8", // Sky
    icon: "📅",
  },
  {
    number: "02",
    title: "Enroll a Team Early",
    cadence: "Continuous Leverage",
    rule: "Hire talent before you feel ready; buy back founder hours to work ON the business.",
    impact: "Breaks Capacity Ceiling",
    accentColor: "#10b981", // Emerald
    icon: "👥",
  },
  {
    number: "03",
    title: "Quarterly Planning Retreat",
    cadence: "Every 90 Days",
    rule: "Step out of operations for 2 days to audit the quarter and lock 3 non-negotiable rocks.",
    impact: "Strategic Course Correction",
    accentColor: "#818cf8", // Indigo
    icon: "🧭",
  },
  {
    number: "04",
    title: "Daily Lead Gen Pulse",
    cadence: "Daily First Hour",
    rule: "Dedicate the first hour of every morning to pipeline velocity and inbound generation.",
    impact: "Guarantees Cash Flow",
    accentColor: "#f59e0b", // Amber
    icon: "🧲",
  },
  {
    number: "05",
    title: "Bookend Your Week",
    cadence: "Mon 9AM & Fri 4PM",
    rule: "Monday Launch (pipeline clarity & team sync) + Friday Land (output audit & celebration).",
    impact: "100% Team Alignment",
    accentColor: "#ec4899", // Rose
    icon: "🎯",
  },
  {
    number: "06",
    title: "Signature Intro Workshop",
    cadence: "Bi-Weekly / Monthly",
    rule: "Host a repeatable 1-to-many live stage showcasing proprietary IP without hard sales.",
    impact: "Effortless Conversion",
    accentColor: "#14b8a6", // Teal
    icon: "🎤",
  },
  {
    number: "07",
    title: "Environment Dictates Output",
    cadence: "Daily Architecture",
    rule: "Upgrade physical workspace, curated social circle, and frictionless digital inputs.",
    impact: "Effortless High Energy",
    accentColor: "#a855f7", // Purple
    icon: "⚡",
  },
];

export const PriestleyFounderHabitsAsset: React.FC<PriestleyFounderHabitsAssetProps> = ({
  title = "THE 7 FOUNDER HABITS FOR $1M+",
  subtitle = "Daniel Priestley Operating Model • 25 Years of Systematized Scaling Across 7 Companies",
  trackRecordBadge = "7 Companies Scaled Past $1M • 0 Viral Hacks • 100% Operational Rhythm",
  habits = DEFAULT_HABITS,
  anchorQuote = "Operational Law: Amateurs wait for motivation; 7-figure founders rely on the Perfect Repeatable Week.",
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
      {/* Background Subtle Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "350px",
          height: "350px",
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
              <span>⚙️ OPERATIONAL MASTERY</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)",
                  fontSize: "11px",
                }}
              >
                7 FOUNDER HABITS
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
              SCALE RECORD
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: isDark ? "#dcfce7" : "#14532d",
                marginTop: "2px",
              }}
            >
              {trackRecordBadge}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 7 HABITS CAROUSEL / GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "12px",
        }}
      >
        {habits.map((habit, idx) => {
          const cardSpring = spring({
            frame: frame - 4 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={habit.number}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${habit.accentColor}35`
                  : `1px solid ${habit.accentColor}50`,
                borderRadius: "16px",
                padding: "14px 10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 20px -6px ${habit.accentColor}20`
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
                  backgroundColor: habit.accentColor,
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
                      color: habit.accentColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    #{habit.number}
                  </span>
                  <span style={{ fontSize: "14px" }}>{habit.icon}</span>
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
                  {habit.cadence}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    lineHeight: 1.2,
                    color: isDark ? "#f8fafc" : "#0f172a",
                    marginBottom: "6px",
                  }}
                >
                  {habit.title}
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.3,
                    color: isDark ? "#cbd5e1" : "#475569",
                    fontWeight: 500,
                  }}
                >
                  {habit.rule}
                </div>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: habit.accentColor,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  padding: "3px 4px",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                ✓ {habit.impact}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM FOOTER: ANCHOR QUOTE */}
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
          <span style={{ fontSize: "13px" }}>🔄</span>
          <span style={{ fontStyle: "italic" }}>{anchorQuote}</span>
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
          PREDICTABLE SCALE
        </div>
      </div>
    </div>
  );
};
