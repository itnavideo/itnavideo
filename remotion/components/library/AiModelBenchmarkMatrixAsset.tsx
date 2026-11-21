import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface BenchmarkBuildItem {
  buildName: string;
  taskType: string;
  fableScore: string;
  fableStrengths: string;
  opusScore: string;
  opusStrengths: string;
  winnerModel: string;
  winnerColor: string;
  icon: string;
}

export interface AiModelBenchmarkMatrixAssetProps {
  title?: string;
  subtitle?: string;
  routerRuleBadge?: string;
  builds?: BenchmarkBuildItem[];
  routingLaw?: string;
  isDark?: boolean;
}

const DEFAULT_BUILDS: BenchmarkBuildItem[] = [
  {
    buildName: "Test 1: SaaS Website Redesign",
    taskType: "Frontend UI & Visual Aesthetics",
    fableScore: "9.8 / 10",
    fableStrengths: "Frosted glass, luxury typography, fluid micro-interactions",
    opusScore: "8.5 / 10",
    opusStrengths: "Clean semantic HTML, robust SEO metadata, standard CSS",
    winnerModel: "🏆 Winner: Fable 5.2",
    winnerColor: "#a855f7", // Purple / Violet
    icon: "🎨",
  },
  {
    buildName: "Test 2: Canva Clone Web App",
    taskType: "Complex Interactive Canvas State",
    fableScore: "8.2 / 10",
    fableStrengths: "Great UI widgets, minor drag coordinate offset bugs",
    opusScore: "9.6 / 10",
    opusStrengths: "Flawless undo/redo stack, state reducers, deep logic",
    winnerModel: "🏆 Winner: Opus 5.5",
    winnerColor: "#38bdf8", // Sky
    icon: "🕹️",
  },
  {
    buildName: "Test 3: Motion Graphics Video",
    taskType: "Remotion Spring Physics & Kinetic Cuts",
    fableScore: "9.7 / 10",
    fableStrengths: "Cinematic Bezier curves, dynamic typography scale",
    opusScore: "8.8 / 10",
    opusStrengths: "Modular Remotion tree, slightly stiffer transition pacing",
    winnerModel: "🏆 Winner: Fable 5.2",
    winnerColor: "#a855f7", // Purple
    icon: "🎬",
  },
];

export const AiModelBenchmarkMatrixAsset: React.FC<AiModelBenchmarkMatrixAssetProps> = ({
  title = "AI MODEL BENCHMARK: FABLE 5.2 VS OPUS 5.5",
  subtitle = "Jason Lee Empirical Shootout • Vibe Coding Performance Across 3 Real-World Builds",
  routerRuleBadge = "Hybrid Router Rule: Fable for Visuals & Motion • Opus for Complex State & Backend Logic",
  builds = DEFAULT_BUILDS,
  routingLaw = "Agentic Routing Law: Never waste reasoning giants on CSS, and never trust creative models with state machines.",
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
            ? "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
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
                color: "#a855f7",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span>⚔️ MODEL SHOOTOUT</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isDark ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.15)",
                  fontSize: "11px",
                }}
              >
                CLAUDE CODE BENCHMARK
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
              backgroundColor: isDark ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.35)",
              padding: "6px 14px",
              borderRadius: "12px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#a855f7",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              ROUTING DECISION
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: isDark ? "#f3e8ff" : "#581c87",
                marginTop: "2px",
              }}
            >
              {routerRuleBadge}
            </div>
          </div>
        </div>
      </div>

      {/* CORE 3-BUILD COMPARISON MATRIX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "12px",
        }}
      >
        {builds.map((build, idx) => {
          const cardSpring = spring({
            frame: frame - 5 * idx,
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          return (
            <div
              key={build.buildName}
              style={{
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
                opacity: cardSpring,
                backgroundColor: isDark ? "rgba(24,24,27,0.7)" : "#ffffff",
                border: isDark
                  ? `1px solid ${build.winnerColor}35`
                  : `1px solid ${build.winnerColor}50`,
                borderRadius: "18px",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                boxShadow: isDark
                  ? `0 8px 20px -6px ${build.winnerColor}20`
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
                  backgroundColor: build.winnerColor,
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
                      color: build.winnerColor,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {build.taskType}
                  </span>
                  <span style={{ fontSize: "16px" }}>{build.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    lineHeight: 1.25,
                    color: isDark ? "#f8fafc" : "#0f172a",
                    marginBottom: "10px",
                  }}
                >
                  {build.buildName}
                </div>

                {/* Fable Model Row */}
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(168,85,247,0.08)" : "rgba(168,85,247,0.05)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    borderRadius: "10px",
                    padding: "8px 10px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#c084fc" }}>
                      Claude Fable 5.2
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 900, color: "#c084fc" }}>
                      {build.fableScore}
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", color: isDark ? "#cbd5e1" : "#475569", lineHeight: 1.3 }}>
                    {build.fableStrengths}
                  </div>
                </div>

                {/* Opus Model Row */}
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(56,189,248,0.08)" : "rgba(56,189,248,0.05)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    borderRadius: "10px",
                    padding: "8px 10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8" }}>
                      Claude Opus 5.5
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 900, color: "#38bdf8" }}>
                      {build.opusScore}
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", color: isDark ? "#cbd5e1" : "#475569", lineHeight: 1.3 }}>
                    {build.opusStrengths}
                  </div>
                </div>
              </div>

              {/* Winner Pill */}
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "10px",
                  fontWeight: 800,
                  color: build.winnerColor,
                  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: `1px solid ${build.winnerColor}30`,
                }}
              >
                {build.winnerModel}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM FOOTER: ROUTING LAW */}
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
          <span style={{ fontSize: "13px" }}>⚖️</span>
          <span style={{ fontStyle: "italic" }}>{routingLaw}</span>
        </div>

        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#a855f7",
            backgroundColor: isDark ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.08)",
            padding: "4px 8px",
            borderRadius: "999px",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
        >
          HYBRID ROUTER
        </div>
      </div>
    </div>
  );
};
