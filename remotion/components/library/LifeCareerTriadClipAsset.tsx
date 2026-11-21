import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface TriadPhaseItem {
  number: string;
  keyword: string;
  subLabel: string;
  desc: string;
  icon: string;
  color: string;
  gradient: string;
  bgGlow: string;
}

export interface LifeCareerTriadClipAssetProps {
  speakerName?: string;
  speakerTitle?: string;
  topHookTitle?: string;
  topHookSubtitle?: string;
  currentPhaseIndex?: number; // 0: LEARN, 1: EARN, 2: RETURN, or -1 for auto
  autoCycleFrames?: number; // auto switch phases every N frames
  phases?: TriadPhaseItem[];
  ctaQuestion?: string;
  showSpeakerBadge?: boolean;
  watermark?: boolean;
}

const DEFAULT_PHASES: TriadPhaseItem[] = [
  {
    number: "01",
    keyword: "LEARN",
    subLabel: "The Absorption Phase",
    desc: "Be a sponge. Master high-income skills, seek ruthless mentors, and invest obsessively in personal growth.",
    icon: "🧠",
    color: "#38BDF8", // Sky blue
    gradient: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
    bgGlow: "rgba(56, 189, 248, 0.18)",
  },
  {
    number: "02",
    keyword: "EARN",
    subLabel: "The Leverage Phase",
    desc: "Apply your craft relentlessly. Close high-ticket deals, build equity, scale your agency, and compound capital.",
    icon: "💎",
    color: "#F59E0B", // Warm gold / amber
    gradient: "linear-gradient(135deg, #FCD34D 0%, #D97706 100%)",
    bgGlow: "rgba(245, 158, 11, 0.18)",
  },
  {
    number: "03",
    keyword: "RETURN",
    subLabel: "The Legacy Phase",
    desc: "Multiply your impact. Mentor rising leaders, build empowering communities, and leave the world better than you found it.",
    icon: "🌱",
    color: "#10B981", // Emerald green
    gradient: "linear-gradient(135deg, #34D399 0%, #059669 100%)",
    bgGlow: "rgba(16, 185, 129, 0.18)",
  },
];

export const LifeCareerTriadClipAsset: React.FC<LifeCareerTriadClipAssetProps> = ({
  speakerName = "Calli Wolff",
  speakerTitle = "Luxury Real Estate Advisor • The Becoming Room",
  topHookTitle = "FIRST YOU LEARN, THEN YOU EARN, THEN YOU RETURN",
  topHookSubtitle = "The 3 Stages of Life & Career Mastery",
  currentPhaseIndex = -1,
  autoCycleFrames = 90, // 3 seconds per phase at 30 fps
  phases = DEFAULT_PHASES,
  ctaQuestion = "Which phase are you currently in? 1, 2, or 3? 👇",
  showSpeakerBadge = true,
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active Phase calculation
  const calculatedIndex =
    currentPhaseIndex >= 0 && currentPhaseIndex < phases.length
      ? currentPhaseIndex
      : Math.floor((frame / autoCycleFrames) % phases.length);

  const activePhase = phases[calculatedIndex] || phases[0];

  // Spring animations
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const cardPop = spring({
    frame: frame % autoCycleFrames,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const badgeEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const ctaEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Continuous subtle pulse
  const pulseScale = interpolate(
    Math.sin((frame / 30) * Math.PI * 2),
    [-1, 1],
    [0.985, 1.015]
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "transparent",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Dynamic Ambient Background Glow matched to active phase */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 820,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activePhase.bgGlow} 0%, rgba(0,0,0,0) 70%)`,
          filter: "blur(70px)",
          transition: "background 0.5s ease",
          zIndex: 0,
        }}
      />

      {/* TOP FLOATING HOOK CARD */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-40, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 28,
            padding: "24px 32px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.55)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Eyebrow Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 16 }}>🏛️</span>
            <span
              style={{
                color: "#E2E8F0",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {topHookSubtitle}
            </span>
          </div>

          {/* Triad Headline with 3-color accents */}
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              lineHeight: 1.25,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "#FFFFFF",
            }}
          >
            First you{" "}
            <span
              style={{
                color: "#38BDF8",
                textShadow: "0 0 20px rgba(56, 189, 248, 0.6)",
              }}
            >
              LEARN
            </span>
            , then you{" "}
            <span
              style={{
                color: "#F59E0B",
                textShadow: "0 0 20px rgba(245, 158, 11, 0.6)",
              }}
            >
              EARN
            </span>
            , then you{" "}
            <span
              style={{
                color: "#10B981",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
              }}
            >
              RETURN
            </span>
            !
          </div>

          {/* 3-Step Mini Progress Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 20,
              width: "100%",
            }}
          >
            {phases.map((p, idx) => {
              const isCurrent = idx === calculatedIndex;
              return (
                <div
                  key={p.number}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: isCurrent
                      ? p.gradient
                      : "rgba(255, 255, 255, 0.06)",
                    border: isCurrent
                      ? `1px solid ${p.color}`
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    transform: isCurrent ? "scale(1.05)" : "scale(0.96)",
                    transition: "all 0.3s ease",
                    boxShadow: isCurrent
                      ? `0 6px 20px ${p.bgGlow}`
                      : "none",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{p.icon}</span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: isCurrent ? "#FFFFFF" : "#94A3B8",
                      letterSpacing: 1,
                    }}
                  >
                    {p.keyword}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MID-SCREEN ACTIVE STAGE BREAKDOWN CARD */}
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 60,
          right: 60,
          zIndex: 10,
          transform: `scale(${cardPop * pulseScale})`,
          opacity: cardPop,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(24px)",
            borderRadius: 32,
            border: `2px solid ${activePhase.color}`,
            padding: "36px 36px 32px 36px",
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.65), 0 0 40px ${activePhase.bgGlow}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Stage Header Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: activePhase.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  boxShadow: `0 6px 16px ${activePhase.bgGlow}`,
                }}
              >
                {activePhase.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: activePhase.color,
                  }}
                >
                  STAGE {activePhase.number} • {activePhase.subLabel}
                </div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: 1,
                    lineHeight: 1.1,
                  }}
                >
                  {activePhase.keyword}
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "rgba(255, 255, 255, 0.12)",
                fontFamily: "monospace",
              }}
            >
              {activePhase.number}
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.45,
              color: "#E2E8F0",
              fontWeight: 500,
              marginTop: 12,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: 18,
            }}
          >
            {activePhase.desc}
          </div>
        </div>
      </div>

      {/* SPEAKER LOWER-THIRD BADGE */}
      {showSpeakerBadge && (
        <div
          style={{
            position: "absolute",
            bottom: 300,
            left: 60,
            right: 60,
            zIndex: 10,
            opacity: badgeEntrance,
            transform: `translateY(${interpolate(badgeEntrance, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: 22,
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 12px 35px rgba(0, 0, 0, 0.45)",
            }}
          >
            {/* Speaker avatar initial pill */}
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: 900,
                boxShadow: "0 4px 12px rgba(236, 72, 153, 0.35)",
              }}
            >
              CW
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: 0.5,
                }}
              >
                {speakerName}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#94A3B8",
                  fontWeight: 600,
                }}
              >
                {speakerTitle}
              </div>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                color: "#38BDF8",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Speaker Clip
            </div>
          </div>
        </div>
      )}

      {/* VIRAL QUESTION POLL FOOTER CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: ctaEntrance,
          transform: `translateY(${interpolate(ctaEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: 22,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: 0.5,
            }}
          >
            {ctaQuestion}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
