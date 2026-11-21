import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface AgenticSuperpowerItem {
  number: string;
  title: string;
  capability: string;
  developerImpact: string;
  accentColor: string;
  icon: string;
}

export interface ClaudeDesktopEcosystemAssetProps {
  title?: string;
  subtitle?: string;
  productivityBadge?: string;
  superpowers?: AgenticSuperpowerItem[];
  telemetry?: {
    contextUsage: string;
    subagentsActive: string;
    rollbackStatus: string;
  };
  agenticLaw?: string;
  isDark?: boolean;
}

const DEFAULT_SUPERPOWERS: AgenticSuperpowerItem[] = [
  {
    number: "01",
    title: "Nested Sessions & Side Chats",
    capability: "Isolated context subagents; speculative branching without polluting main git worktree.",
    developerImpact: "Zero Context Contamination",
    accentColor: "#38bdf8", // Sky
    icon: "🌿",
  },
  {
    number: "02",
    title: "/rewind Time Travel Engine",
    capability: "Instant state rollback across file diffs, command histories, and terminal sessions.",
    developerImpact: "Fearless Experimentation",
    accentColor: "#10b981", // Emerald
    icon: "⏪",
  },
  {
    number: "03",
    title: "Integrated iOS & DOM Simulator",
    capability: "In-app headless preview allowing the model to visually inspect its own UI layouts.",
    developerImpact: "Visual Self-Correction",
    accentColor: "#818cf8", // Indigo
    icon: "📱",
  },
  {
    number: "04",
    title: "Connectors & MCP Server Palette",
    capability: "Native tool calling with Figma, Mobbin, GitHub, Supabase, and S3 infrastructure.",
    developerImpact: "Direct Production Plumbing",
    accentColor: "#f59e0b", // Amber
    icon: "🔌",
  },
  {
    number: "05",
    title: "Auto-Continue & Self-Healing",
    capability: "Autonomous test-and-repair loops; catches runtime crashes and self-fixes without user hand-holding.",
    developerImpact: "Unattended Build Loops",
    accentColor: "#ec4899", // Rose
    icon: "🔄",
  },
  {
    number: "06",
    title: "Claude Motion & Spring Engine",
    capability: "Generates physics-based Bezier curves, Remotion transitions, and kinetic micro-interactions.",
    developerImpact: "High-Perception Fluid UX",
    accentColor: "#a855f7", // Purple
    icon: "✨",
  },
];

export const ClaudeDesktopEcosystemAsset: React.FC<ClaudeDesktopEcosystemAssetProps> = ({
  title = "CLAUDE 2.0 & AGENTIC DEV ECOSYSTEM",
  subtitle = "Jason Lee Masterclass • Modern Autonomous Vibe Coding & Subagent Architecture",
  productivityBadge = "Autonomous Dev Leverage: 10x Velocity • Nested Subagents • /rewind Checkpoints • Live Simulator",
  superpowers = DEFAULT_SUPERPOWERS,
  telemetry = {
    contextUsage: "Context: 16% Used (32k / 200k)",
    subagentsActive: "Active Workers: 3 Subagents (Mobbin, Expo, Tester)",
    rollbackStatus: "Checkpoint Engine: /rewind Armed",
  },
  agenticLaw = "Agentic Dev Law: Developers no longer write syntax; they orchestrate environments, audit outputs, and steer architecture.",
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
              <span>⚡ AGENTIC IDE ARCHITECTURE</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(56,189,248,0.2)" : "rgba(56,189,248,0.15)",
                  fontSize: "11px",
                }}
              >
                CLAUDE 2.0 DESKTOP
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
              DEV VELOCITY
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: isDark ? "#e0f2fe" : "#0369a1",
                marginTop: "2px",
              }}
            >
              {productivityBadge}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 6 SUPERPOWERS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "12px",
        }}
      >
        {superpowers.map((sp, idx) => {
          const cardSpring = spring({
            frame: frame - 4 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={sp.number}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.94, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${sp.accentColor}35`
                  : `1px solid ${sp.accentColor}50`,
                borderRadius: "16px",
                padding: "14px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 20px -6px ${sp.accentColor}20`
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
                  backgroundColor: sp.accentColor,
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
                      color: sp.accentColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    FEATURE {sp.number}
                  </span>
                  <span style={{ fontSize: "16px" }}>{sp.icon}</span>
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
                  {sp.title}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.35,
                    color: isDark ? "#cbd5e1" : "#475569",
                    fontWeight: 500,
                    marginBottom: "6px",
                  }}
                >
                  {sp.capability}
                </div>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: sp.accentColor,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                ✓ {sp.developerImpact}
              </div>
            </div>
          );
        })}
      </div>

      {/* TELEMETRY BAR STRIP */}
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
        <div style={{ color: "#10b981", fontWeight: 700 }}>
          📊 {telemetry.contextUsage}
        </div>
        <div style={{ color: "#38bdf8", fontWeight: 700 }}>
          🤖 {telemetry.subagentsActive}
        </div>
        <div style={{ color: "#f59e0b", fontWeight: 700 }}>
          🛡️ {telemetry.rollbackStatus}
        </div>
      </div>

      {/* BOTTOM FOOTER: AGENTIC DEV LAW */}
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
          <span style={{ fontSize: "13px" }}>🧠</span>
          <span style={{ fontStyle: "italic" }}>{agenticLaw}</span>
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
          VIBE CODING 2.0
        </div>
      </div>
    </div>
  );
};
