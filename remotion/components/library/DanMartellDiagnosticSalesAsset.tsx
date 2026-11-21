import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface SalesStepItem {
  number: string;
  stepName: string;
  doctorMindset: string;
  tacticalScript: string;
  rookieMistakeToAvoid: string;
  accentColor: string;
  icon: string;
}

export interface DanMartellDiagnosticSalesAssetProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  steps?: SalesStepItem[];
  telemetry?: {
    closeRateLift: string;
    needinessFactor: string;
    gapDiscovered: string;
  };
  closingLaw?: string;
  isDark?: boolean;
}

const DEFAULT_STEPS: SalesStepItem[] = [
  {
    number: "01",
    stepName: "CONNECT",
    doctorMindset: "Set the call frame & identify the trigger event.",
    tacticalScript: "“Here’s how I run these calls: I’ll ask a few questions. If I can help, I’ll tell you. If not, I’ll refer you. Fair? What made you reach out today, and why NOW?”",
    rookieMistakeToAvoid: "Rambling small talk; starting with a slide deck or company history.",
    accentColor: "#3b82f6", // Electric Blue
    icon: "🤝",
  },
  {
    number: "02",
    stepName: "DIAGNOSE",
    doctorMindset: "Uncover the gap between Point A & Point B.",
    tacticalScript: "“Where are you today? Where do you want to be in 12 months? What is preventing you from getting there? What have you tried that failed?”",
    rookieMistakeToAvoid: "Cheerleading! Saying 'You’re doing great' dissolves the pain gap.",
    accentColor: "#ef4444", // Crimson
    icon: "🩺",
  },
  {
    number: "03",
    stepName: "PRESCRIBE",
    doctorMindset: "Clear obstacles before presenting the offer.",
    tacticalScript: "“Aside from yourself, who else is involved in this decision? Do you have budget allocated? If this makes sense, can we kick off this week?”",
    rookieMistakeToAvoid: "Pitching features; failing to tie the solution directly to their roadblocks.",
    accentColor: "#f59e0b", // Amber Gold
    icon: "💊",
  },
  {
    number: "04",
    stepName: "COMMIT",
    doctorMindset: "State the price cleanly once, then shut up.",
    tacticalScript: "“The investment is $15,000 for the 90-day accelerator. Where would you like to go from here?” [Maintain absolute silence].",
    rookieMistakeToAvoid: "Nervous babbling after stating price; offering unprompted discounts.",
    accentColor: "#10b981", // Emerald
    icon: "🎯",
  },
];

export const DanMartellDiagnosticSalesAsset: React.FC<DanMartellDiagnosticSalesAssetProps> = ({
  title = "If you only watch one sales video, make it this one",
  subtitle = "Dan Martell's 4-Step Diagnostic Closing Architecture: Connect • Diagnose • Prescribe • Commit",
  badgeText = "PRESCRIBING WITHOUT DIAGNOSIS IS MALPRACTICE",
  steps = DEFAULT_STEPS,
  telemetry = {
    closeRateLift: "3.4x Higher Conversion",
    needinessFactor: "0% Desperation",
    gapDiscovered: "12-Month Pain Moat",
  },
  closingLaw = "“Great closers aren't born with charisma. They follow a calm diagnostic process and let the prospect ask for the prescription.”",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const quoteEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 95 },
  });

  const telemetryEntrance = spring({
    frame: frame - 32,
    fps,
    config: { damping: 16, mass: 1, stiffness: 85 },
  });

  // Pulse animation for high contrast
  const pulseScale = interpolate(
    Math.sin((frame / fps) * 3.5),
    [-1, 1],
    [0.985, 1.015]
  );

  // Colors
  const bgGradient = isDark
    ? "linear-gradient(145deg, #09090b 0%, #0f172a 50%, #020617 100%)"
    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)";

  const cardBg = isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.85)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
  const textPrimary = isDark ? "#f8fafc" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#475569";
  const textMuted = isDark ? "#64748b" : "#94a3b8";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 50px",
        background: bgGradient,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-5%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* HEADER SECTION */}
      <div
        style={{
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-20, 0])}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `1px solid ${cardBorder}`,
          paddingBottom: "18px",
        }}
      >
        <div style={{ maxWidth: "70%" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "999px",
              backgroundColor: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#ef4444",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "8px",
              transform: `scale(${pulseScale})`,
            }}
          >
            <span>🩺</span>
            {badgeText}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: textPrimary,
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: "14px",
              color: textSecondary,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Diagnostic Conversion Gauge */}
        <div
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: "14px",
            padding: "12px 18px",
            textAlign: "right",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
            Conversion Metric
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "4px" }}>
            {telemetry.closeRateLift}
          </div>
          <div style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>
            Pitch Posture: <span style={{ color: "#3b82f6", fontWeight: 700 }}>{telemetry.needinessFactor}</span>
          </div>
        </div>
      </div>

      {/* CLOSING LAW BANNER */}
      <div
        style={{
          opacity: Math.max(0, quoteEntrance),
          transform: `translateY(${interpolate(Math.max(0, quoteEntrance), [0, 1], [15, 0])}px)`,
          padding: "12px 20px",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(241, 245, 249, 0.9)",
          borderLeft: "4px solid #3b82f6",
          borderRadius: "8px",
          margin: "12px 0 16px 0",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            fontSize: "13px",
            color: isDark ? "#e2e8f0" : "#1e293b",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {closingLaw}
        </span>
      </div>

      {/* 4 STEPS GRID (CONNECT, DIAGNOSE, PRESCRIBE, COMMIT) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "16px",
        }}
      >
        {steps.map((step, idx) => {
          const cardSpring = spring({
            frame: frame - (14 + idx * 5),
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 95 },
          });

          return (
            <div
              key={step.number}
              style={{
                opacity: Math.max(0, cardSpring),
                transform: `translateY(${interpolate(Math.max(0, cardSpring), [0, 1], [30, 0])}px)`,
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px",
                padding: "18px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                backdropFilter: "blur(12px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  backgroundColor: step.accentColor,
                }}
              />

              {/* Step Header */}
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
                      fontSize: "12px",
                      fontWeight: 800,
                      color: step.accentColor,
                      letterSpacing: "0.8px",
                    }}
                  >
                    STEP {step.number} • {step.stepName}
                  </span>
                  <span style={{ fontSize: "18px" }}>{step.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: textPrimary,
                    marginBottom: "10px",
                    lineHeight: 1.35,
                  }}
                >
                  {step.doctorMindset}
                </div>

                {/* Tactical Script */}
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    borderLeft: `2px solid ${step.accentColor}`,
                    marginBottom: "10px",
                  }}
                >
                  <strong style={{ color: step.accentColor, display: "block", fontSize: "10px", textTransform: "uppercase", marginBottom: "4px" }}>
                    Tactical Script:
                  </strong>
                  <span style={{ fontSize: "11px", color: isDark ? "#e2e8f0" : "#1e293b", lineHeight: 1.4, fontStyle: "italic" }}>
                    {step.tacticalScript}
                  </span>
                </div>
              </div>

              {/* Rookie Mistake Warning */}
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    fontSize: "10.5px",
                    color: isDark ? "#fca5a5" : "#b91c1c",
                    lineHeight: 1.35,
                  }}
                >
                  <strong style={{ color: "#ef4444", display: "block", fontSize: "9px", textTransform: "uppercase" }}>
                    Rookie Mistake:
                  </strong>
                  {step.rookieMistakeToAvoid}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TELEMETRY & BRAND STAMP */}
      <div
        style={{
          opacity: Math.max(0, telemetryEntrance),
          transform: `translateY(${interpolate(Math.max(0, telemetryEntrance), [0, 1], [15, 0])}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: "14px",
          padding: "14px 22px",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Core Philosophy
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: textPrimary, marginTop: "2px" }}>
              Doctor-Patient Diagnostic Frame
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Diagnostic Gap
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#3b82f6", marginTop: "2px" }}>
              {telemetry.gapDiscovered}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Key Rule
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              Clear Obstacles BEFORE the Offer
            </div>
          </div>
        </div>

        {/* Brand Stamp */}
        <div
          style={{
            padding: "5px 10px",
            borderRadius: "6px",
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            fontSize: "10px",
            fontWeight: 800,
            color: textSecondary,
            letterSpacing: "0.8px",
          }}
        >
          ITNAVIDEO • B2B SALES REEL ENGINE
        </div>
      </div>
    </div>
  );
};
