import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface LifestylePillarItem {
  icon: string;
  tag: string;
  title: string;
  desc: string;
}

export interface NeighborhoodLifestylePromoAssetProps {
  communityName?: string;
  cityName?: string;
  vibeTag?: string;
  topEyebrow?: string;
  lifestylePillars?: LifestylePillarItem[];
  agentName?: string;
  agentTitle?: string;
  agentPhone?: string;
  ctaText?: string;
  activePillarIndex?: number;
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_PILLARS: LifestylePillarItem[] = [
  {
    icon: "☕",
    tag: "MORNING RITUALS",
    title: "Pond Walks & Local Coffee",
    desc: "Scenic walking trails surrounding the central lake with artisanal bakeries and morning coffee right outside your door.",
  },
  {
    icon: "🛍️",
    tag: "WALKABLE CHARM",
    title: "Boutiques & Open-Air Dining",
    desc: "Stroll down palm-lined sidewalks to local designer boutiques, movie theater, and top chef-driven restaurants.",
  },
  {
    icon: "🎵",
    tag: "COMMUNITY VIBE",
    title: "Live Music & Seasonal Events",
    desc: "Active community atmosphere with farmers markets, outdoor concerts, and dog-friendly neighborhood parks.",
  },
  {
    icon: "🏖️",
    tag: "COASTAL ACCESS",
    title: "Minutes to Atlantic Beaches",
    desc: "Low-maintenance coastal living with quick access to Myrtle Beach oceanfront, state parks, and golf greens.",
  },
];

export const NeighborhoodLifestylePromoAsset: React.FC<NeighborhoodLifestylePromoAssetProps> = ({
  communityName = "The Market Common",
  cityName = "Myrtle Beach, South Carolina",
  vibeTag = "COASTAL WALKABLE LIVING",
  topEyebrow = "NEIGHBORHOOD SPOTLIGHT",
  lifestylePillars = DEFAULT_PILLARS,
  agentName = "Leslie Perkins",
  agentTitle = "Myrtle Beach REALTOR® • Living South",
  agentPhone = "+1 (843) 360-0089",
  ctaText = "Get the Free Market Common Relocation Guide 🌴 Link in Bio",
  activePillarIndex = -1,
  autoCycleFrames = 75, // 2.5s per pillar
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active pillar index calculation
  const calculatedIndex =
    activePillarIndex >= 0 && activePillarIndex < lifestylePillars.length
      ? activePillarIndex
      : Math.floor((frame / autoCycleFrames) % lifestylePillars.length);

  const activePillar =
    lifestylePillars[calculatedIndex] || lifestylePillars[0];

  // Springs
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 105 },
  });

  const cardEntrance = spring({
    frame: frame % autoCycleFrames,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const lowerThirdEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const ctaEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Soft ambient pulse
  const ambientPulse = interpolate(
    Math.sin((frame / 25) * Math.PI * 2),
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
      {/* Dynamic Warm Coastal Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      {/* TOP COMMUNITY HEADER CAPSULE */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: 26,
            padding: "20px 28px",
            boxShadow: "0 18px 45px rgba(0, 0, 0, 0.55)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
              }}
            >
              🌴
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#38BDF8",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                {topEyebrow}
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                }}
              >
                {communityName}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {cityName}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "8px 16px",
              borderRadius: 12,
              background: "rgba(14, 165, 233, 0.15)",
              border: "1px solid rgba(14, 165, 233, 0.35)",
              color: "#38BDF8",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {vibeTag}
          </div>
        </div>

        {/* 4-Pillar Progress Navigation Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 14,
          }}
        >
          {lifestylePillars.map((p, idx) => {
            const isCurrent = idx === calculatedIndex;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  background: isCurrent
                    ? "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)"
                    : "rgba(15, 23, 42, 0.8)",
                  border: isCurrent
                    ? "1px solid #38BDF8"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  color: isCurrent ? "#FFFFFF" : "#94A3B8",
                  fontSize: 13,
                  fontWeight: 700,
                  transform: isCurrent ? "scale(1.05)" : "scale(0.96)",
                  transition: "all 0.3s ease",
                  boxShadow: isCurrent
                    ? "0 4px 15px rgba(14, 165, 233, 0.4)"
                    : "none",
                }}
              >
                <span>{p.icon}</span>
                <span>{p.tag}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MID-SCREEN LIFESTYLE PILLAR CARD */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: cardEntrance,
          transform: `scale(${cardEntrance * ambientPulse})`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(24px)",
            borderRadius: 28,
            border: "2px solid rgba(56, 189, 248, 0.6)",
            padding: "32px 36px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(14, 165, 233, 0.25)",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background:
                    "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  boxShadow: "0 6px 18px rgba(14, 165, 233, 0.4)",
                  flexShrink: 0,
                }}
              >
                {activePillar.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#38BDF8",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  LIFESTYLE PILLAR • {calculatedIndex + 1}/
                  {lifestylePillars.length}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: 0.5,
                  }}
                >
                  {activePillar.title}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#E2E8F0",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              0{calculatedIndex + 1}
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.45,
              color: "#E2E8F0",
              fontWeight: 500,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: 16,
            }}
          >
            {activePillar.desc}
          </div>
        </div>
      </div>

      {/* AGENT FOOTPRINT LOWER-THIRD */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: lowerThirdEntrance,
          transform: `translateY(${interpolate(lowerThirdEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.86)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 20,
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              LP
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#FFFFFF",
                }}
              >
                {agentName}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#94A3B8",
                  fontWeight: 600,
                }}
              >
                {agentTitle}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(14, 165, 233, 0.15)",
              border: "1px solid rgba(14, 165, 233, 0.35)",
              color: "#38BDF8",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {agentPhone}
          </div>
        </div>
      </div>

      {/* BOTTOM CONVERSION CTA BANNER */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: ctaEntrance,
          transform: `translateY(${interpolate(ctaEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(14, 165, 233, 0.45)",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 0.5,
            }}
          >
            {ctaText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
