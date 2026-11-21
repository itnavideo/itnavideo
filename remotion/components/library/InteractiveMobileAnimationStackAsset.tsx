import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface AnimationStackItem {
  format: string;
  filesize: string;
  interactivity: string;
  performance: string;
  verdict: string;
  color: string;
  icon: string;
}

export interface InteractiveMobileAnimationStackAssetProps {
  title?: string;
  subtitle?: string;
  retentionBadge?: string;
  appName?: string;
  mascotState?: string;
  timerDisplay?: string;
  streakCount?: string;
  stackComparison?: AnimationStackItem[];
  vibeCodeNote?: string;
  isDark?: boolean;
}

const DEFAULT_STACK: AnimationStackItem[] = [
  {
    format: "Video (.MP4)",
    filesize: "15MB+ (Heavy)",
    interactivity: "Zero (Passive)",
    performance: "Battery Drain & Lag",
    verdict: "❌ Unusable for UI",
    color: "#ef4444", // Red
    icon: "🎞️",
  },
  {
    format: "Pure Code / SVG",
    filesize: "100KB (Light)",
    interactivity: "Manual Math Code",
    performance: "Tedious Keyframing",
    verdict: "⚠️ Expensive Dev Time",
    color: "#f59e0b", // Amber
    icon: "💻",
  },
  {
    format: "Rive / Fable (.RIV)",
    filesize: "<50KB (Micro)",
    interactivity: "State Machine Native",
    performance: "120 FPS GPU Render",
    verdict: "🏆 Industry Standard",
    color: "#10b981", // Emerald
    icon: "⚡",
  },
];

export const InteractiveMobileAnimationStackAsset: React.FC<InteractiveMobileAnimationStackAssetProps> = ({
  title = "MOBILE APP ANIMATION & VIBE CODING STACK",
  subtitle = "Jason Lee Framework • Claude + Rive State Machines + Expo iOS Architecture",
  retentionBadge = "The Duolingo Effect: Character Gamification = 5x DAU & 90-Day Retention",
  appName = "FocusPup iOS Pomodoro",
  mascotState = "🐶 Reactive Pup: Focused & Breathing (120 FPS)",
  timerDisplay = "25:00",
  streakCount = "🔥 7-Day Focus Streak",
  stackComparison = DEFAULT_STACK,
  vibeCodeNote = "Vibe Coding Law: Don't keyframe bone rigs in code — use AI agents to orchestrate Rive state machines.",
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
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span>📱 VIBE CODING & UI MOTION</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(56,189,248,0.2)" : "rgba(56,189,248,0.15)",
                  fontSize: "11px",
                }}
              >
                JASON LEE ARCHITECTURE
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
              backgroundColor: isDark ? "rgba(56,189,248,0.12)" : "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.35)",
              padding: "6px 14px",
              borderRadius: "12px",
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
              RETENTION IMPACT
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: isDark ? "#e0f2fe" : "#0369a1",
                marginTop: "2px",
              }}
            >
              {retentionBadge}
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: 3-WAY STACK COMPARISON & INTERACTIVE APP PREVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "14px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "12px",
        }}
      >
        {/* LEFT COLUMN: 3-WAY ANIMATION STACK COMPARISON */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isDark ? "#cbd5e1" : "#334155",
              marginBottom: "2px",
            }}
          >
            Mobile Animation Format Shootout
          </div>

          {stackComparison.map((item, idx) => {
            const cardSpring = spring({
              frame: frame - 4 * idx,
              fps,
              config: { damping: 13, stiffness: 100 },
            });

            return (
              <div
                key={item.format}
                style={{
                  transform: `scale(${interpolate(cardSpring, [0, 1], [0.94, 1])})`,
                  opacity: cardSpring,
                  backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                  border: isDark
                    ? `1px solid ${item.color}35`
                    : `1px solid ${item.color}50`,
                  borderRadius: "14px",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: isDark
                    ? `0 6px 18px -4px ${item.color}20`
                    : "0 4px 12px -2px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        color: isDark ? "#f8fafc" : "#0f172a",
                      }}
                    >
                      {item.format}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: isDark ? "#94a3b8" : "#64748b",
                      }}
                    >
                      {item.filesize} • {item.interactivity}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {item.verdict}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: isDark ? "#a1a1aa" : "#64748b",
                    }}
                  >
                    {item.performance}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: SIMULATED IOS FOCUSPUP CARD */}
        <div
          style={{
            backgroundColor: isDark ? "rgba(18,18,22,0.9)" : "#ffffff",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
            borderRadius: "18px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: isDark
              ? "0 10px 30px -10px rgba(0,0,0,0.7)"
              : "0 10px 25px -5px rgba(0,0,0,0.06)",
          }}
        >
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
                  color: "#38bdf8",
                  letterSpacing: "0.06em",
                }}
              >
                {appName}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#10b981",
                  backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
                  padding: "2px 6px",
                  borderRadius: "6px",
                }}
              >
                LIVE RIVE RIG
              </span>
            </div>

            <div
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
                marginBottom: "10px",
                border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "4px" }}>🐶 🎾</div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: isDark ? "#ffffff" : "#0f172a",
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {timerDisplay}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#38bdf8",
                  marginTop: "2px",
                }}
              >
                {mascotState}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
              borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
              paddingTop: "8px",
            }}
          >
            <span style={{ fontWeight: 700, color: "#f59e0b" }}>
              {streakCount}
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: isDark ? "#cbd5e1" : "#475569",
                }}
              >
                Claude Code
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  backgroundColor: isDark ? "rgba(56,189,248,0.15)" : "#e0f2fe",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: "#0284c7",
                }}
              >
                Expo EAS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER: VIBE CODE NOTE */}
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
          <span style={{ fontStyle: "italic" }}>{vibeCodeNote}</span>
        </div>

        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#38bdf8",
            backgroundColor: isDark ? "rgba(56,189,248,0.12)" : "rgba(56,189,248,0.08)",
            padding: "4px 8px",
            borderRadius: "999px",
            border: "1px solid rgba(56,189,248,0.25)",
          }}
        >
          RIVE STATE MACHINE
        </div>
      </div>
    </div>
  );
};
