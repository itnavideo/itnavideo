import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface AgentDepartmentItem {
  number: string;
  departmentName: string;
  agentRole: string;
  coreFunction: string;
  humanBottleneckEliminated: string;
  hoursReclaimed: string;
  accentColor: string;
  icon: string;
}

export interface DanMartellAiCompanyOperatingSystemAssetProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  identityFiles?: {
    soulFile: string;
    identityFile: string;
    userFile: string;
  };
  departments?: AgentDepartmentItem[];
  telemetry?: {
    founderBottleneck: string;
    hoursReclaimedWeekly: string;
    teamStructure: string;
  };
  operatingLaw?: string;
  isDark?: boolean;
}

const DEFAULT_DEPARTMENTS: AgentDepartmentItem[] = [
  {
    number: "01",
    departmentName: "Executive Orchestration",
    agentRole: "Chief of Staff Manager Agent",
    coreFunction: "Triages company inputs; breaks complex projects into discrete tickets and delegates to specialized subagents.",
    humanBottleneckEliminated: "Project Management & Task Babysitting",
    hoursReclaimed: "12h / Week",
    accentColor: "#3b82f6", // Electric Blue
    icon: "🧭",
  },
  {
    number: "02",
    departmentName: "Communications & Inbox",
    agentRole: "Triage & Voice Cloning Subagent",
    coreFunction: "Scans past threads; drafts 100% of emails in the founder's exact voice using the Tri-Context Identity profile.",
    humanBottleneckEliminated: "Endless Inbox Refreshing & Drafting",
    hoursReclaimed: "14h / Week",
    accentColor: "#10b981", // Emerald
    icon: "✉️",
  },
  {
    number: "03",
    departmentName: "Revenue & Fulfillment",
    agentRole: "Inbound Closer & Delivery Subagent",
    coreFunction: "Enriches leads from CRM, runs qualification filters, briefs founder before closing calls, and automates onboarding.",
    humanBottleneckEliminated: "Prospect Research & Manual Client Setup",
    hoursReclaimed: "10h / Week",
    accentColor: "#f59e0b", // Amber Gold
    icon: "💼",
  },
];

export const DanMartellAiCompanyOperatingSystemAsset: React.FC<DanMartellAiCompanyOperatingSystemAssetProps> = ({
  title = "Build a 1-Person Business with AI Agents",
  subtitle = "Dan Martell's Autonomous AI Company Operating System (AI COS) & Tri-Context Identity Architecture",
  badgeText = "BUY BACK YOUR TIME 2.0 • AGENTIC AUTONOMY",
  identityFiles = {
    soulFile: "SOUL.md • Core Philosophies & Objectives",
    identityFile: "IDENTITY.md • Tone, Voice Quirks & Formatting",
    userFile: "USER.md • Founder Calendar & Boundaries",
  },
  departments = DEFAULT_DEPARTMENTS,
  telemetry = {
    founderBottleneck: "0% (Fully Decoupled)",
    hoursReclaimedWeekly: "36+ Hours / Wk",
    teamStructure: "1 Founder + 8 Agents",
  },
  operatingLaw = "“You don't need a massive team to scale. You need autonomous agents with strict identity files that execute without babysitting.”",
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

  const identityEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, mass: 0.85, stiffness: 95 },
  });

  const quoteEntrance = spring({
    frame: frame - 16,
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 90 },
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
      {/* Background Radial Glows */}
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
              backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              color: "#3b82f6",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "8px",
              transform: `scale(${pulseScale})`,
            }}
          >
            <span>🚀</span>
            {badgeText}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
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

        {/* Operating System Telemetry Pill */}
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
            Autonomous Capacity
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: textPrimary, marginTop: "4px" }}>
            Model: <span style={{ color: "#3b82f6", fontWeight: 800 }}>{telemetry.teamStructure}</span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
            Saved: {telemetry.hoursReclaimedWeekly}
          </div>
        </div>
      </div>

      {/* TRI-CONTEXT IDENTITY STRIP (SOUL, IDENTITY, USER FILES) */}
      <div
        style={{
          opacity: Math.max(0, identityEntrance),
          transform: `translateY(${interpolate(Math.max(0, identityEntrance), [0, 1], [15, 0])}px)`,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          margin: "12px 0 14px 0",
        }}
      >
        <div
          style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: `1px solid ${cardBorder}`,
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>🔮</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#3b82f6", textTransform: "uppercase" }}>
              File 01: Core Operating Philosophy
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{identityFiles.soulFile}</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: `1px solid ${cardBorder}`,
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>🗣️</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#10b981", textTransform: "uppercase" }}>
              File 02: Tone & Voice Rules
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{identityFiles.identityFile}</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: `1px solid ${cardBorder}`,
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>👤</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase" }}>
              File 03: Founder Boundaries
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary }}>{identityFiles.userFile}</div>
          </div>
        </div>
      </div>

      {/* CONTRARIAN QUOTE BANNER */}
      <div
        style={{
          opacity: Math.max(0, quoteEntrance),
          transform: `translateY(${interpolate(Math.max(0, quoteEntrance), [0, 1], [15, 0])}px)`,
          padding: "10px 18px",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(241, 245, 249, 0.9)",
          borderLeft: "4px solid #3b82f6",
          borderRadius: "8px",
          marginBottom: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            fontSize: "12.5px",
            color: isDark ? "#e2e8f0" : "#1e293b",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {operatingLaw}
        </span>
      </div>

      {/* 3 CORE AUTONOMOUS DEPARTMENTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
          flex: 1,
          alignItems: "stretch",
          marginBottom: "16px",
        }}
      >
        {departments.map((dept, idx) => {
          const cardSpring = spring({
            frame: frame - (14 + idx * 6),
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 95 },
          });

          return (
            <div
              key={dept.number}
              style={{
                opacity: Math.max(0, cardSpring),
                transform: `translateY(${interpolate(Math.max(0, cardSpring), [0, 1], [30, 0])}px)`,
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px",
                padding: "20px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
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
                  backgroundColor: dept.accentColor,
                }}
              />

              {/* Department Header */}
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
                      color: dept.accentColor,
                      letterSpacing: "0.8px",
                    }}
                  >
                    DEPARTMENT {dept.number}
                  </span>
                  <span style={{ fontSize: "20px" }}>{dept.icon}</span>
                </div>

                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.2,
                  }}
                >
                  {dept.departmentName}
                </h3>

                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: dept.accentColor,
                    marginBottom: "12px",
                  }}
                >
                  {dept.agentRole}
                </div>

                {/* Core Function */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: textSecondary,
                    lineHeight: 1.45,
                    marginBottom: "14px",
                  }}
                >
                  {dept.coreFunction}
                </p>

                {/* Bottleneck Eliminated */}
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    borderLeft: `2px solid ${dept.accentColor}`,
                    fontSize: "11px",
                    color: textPrimary,
                  }}
                >
                  <strong style={{ color: textMuted, display: "block", fontSize: "9px", textTransform: "uppercase" }}>
                    Bottleneck Killed:
                  </strong>
                  {dept.humanBottleneckEliminated}
                </div>
              </div>

              {/* Hours Reclaimed Badge */}
              <div style={{ marginTop: "14px" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: `${dept.accentColor}18`,
                    border: `1px solid ${dept.accentColor}35`,
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: dept.accentColor,
                  }}
                >
                  ⚡ Reclaims {dept.hoursReclaimed}
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
              Founder Leverage
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
              {telemetry.founderBottleneck}
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Operating Engine
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#3b82f6", marginTop: "2px" }}>
              Apex Autonomous Orchestrator
            </div>
          </div>
          <div style={{ width: "1px", height: "26px", backgroundColor: cardBorder }} />
          <div>
            <div style={{ fontSize: "9px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>
              Core Thesis
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#f59e0b", marginTop: "2px" }}>
              Buy Back Time via Agents, Not Payroll
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
          ITNAVIDEO • AUTONOMOUS STUDIO PIPELINE
        </div>
      </div>
    </div>
  );
};
