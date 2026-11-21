import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface RelocationPillarItem {
  icon: string;
  tag: string;
  title: string;
  desc: string;
}

export interface SuburbRelocationGuideAssetProps {
  regionName?: string;
  topTownName?: string;
  majorCityName?: string;
  heroKeyword?: string;
  leadingHookText?: string;
  trailingHookText?: string;
  commuteTime?: string;
  decisionPillars?: RelocationPillarItem[];
  agentName?: string;
  agentTitle?: string;
  agentPhone?: string;
  ctaText?: string;
  activePillarIndex?: number;
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_PILLARS: RelocationPillarItem[] = [
  {
    icon: "🛍️",
    tag: "LIFESTYLE HUB",
    title: "Birkdale Village Walkability",
    desc: "Outdoor shopping, green gathering spaces, artisan bakeries, and premier outdoor dining all in one spot.",
  },
  {
    icon: "⛵",
    tag: "WATERFRONT RECREATION",
    title: "Instant Lake Norman Access",
    desc: "Minutes to public boat launches, paddleboarding, and waterfront parks without the secluded lake price tag.",
  },
  {
    icon: "⚡",
    tag: "FRICTIONLESS COMMUTE",
    title: "20 Mins to Uptown Charlotte",
    desc: "Quick highway access gives you peaceful suburban living without sacrificing big-city careers and entertainment.",
  },
  {
    icon: "🏡",
    tag: "GROWTH & VALUE",
    title: "Top Schools & Family Space",
    desc: "Established tree-lined neighborhoods, larger lots, and top-rated schools make it the premier choice for relocators.",
  },
];

export const SuburbRelocationGuideAsset: React.FC<SuburbRelocationGuideAssetProps> = ({
  regionName = "Lake Norman Area",
  topTownName = "Huntersville",
  majorCityName = "Charlotte",
  heroKeyword = "giving",
  leadingHookText = "without",
  trailingHookText = "up",
  commuteTime = "20 MINS TO UPTOWN",
  decisionPillars = DEFAULT_PILLARS,
  agentName = "Hannah Herald",
  agentTitle = "Lake Norman REALTOR® • Coldwell Banker",
  agentPhone = "(828) 320-6411",
  ctaText = "Considering a Move to Lake Norman? Send a DM & Let's Connect 📩",
  activePillarIndex = -1,
  autoCycleFrames = 75,
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active pillar index calculation
  const calculatedIndex =
    activePillarIndex >= 0 && activePillarIndex < decisionPillars.length
      ? activePillarIndex
      : Math.floor((frame / autoCycleFrames) % decisionPillars.length);

  const activePillar =
    decisionPillars[calculatedIndex] || decisionPillars[0];

  // Springs
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const headerEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 105 },
  });

  const cardEntrance = spring({
    frame: frame % autoCycleFrames,
    fps,
    config: { damping: 13, stiffness: 115 },
  });

  const lowerThirdEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const ctaEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Hero word pulse
  const heroPulse = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [0.98, 1.02]
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
      {/* Dynamic Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 780,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192, 38, 211, 0.22) 0%, rgba(225, 29, 72, 0.12) 40%, rgba(0,0,0,0) 70%)",
          filter: "blur(75px)",
          zIndex: 0,
        }}
      />

      {/* TOP REGION & TOWN HEADER CAPSULE */}
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
            borderRadius: 24,
            padding: "16px 26px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 26 }}>📍</span>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#F472B6",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                TOP OF MY LIST • {regionName}
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                }}
              >
                {topTownName}, NC
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 16px",
              borderRadius: 12,
              background: "rgba(244, 114, 182, 0.15)",
              border: "1px solid rgba(244, 114, 182, 0.35)",
              color: "#F472B6",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {commuteTime}
          </div>
        </div>
      </div>

      {/* SIGNATURE HERO GRADIENT SUBTITLE HOOK (Reel @hannahheraldrealtor) */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          opacity: hookEntrance,
          transform: `scale(${hookEntrance * heroPulse})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: 1,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            }}
          >
            {leadingHookText}
          </span>

          {/* Hero Keyword: 92px Extruded Magenta/Violet Gradient Text */}
          <span
            style={{
              fontSize: 94,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: 1,
              textTransform: "lowercase",
              background:
                "linear-gradient(135deg, #F43F5E 0%, #D946EF 50%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 25px rgba(217, 70, 239, 0.6))",
              display: "inline-block",
            }}
          >
            {heroKeyword}
          </span>

          <span
            style={{
              color: "#FFFFFF",
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: 1,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            }}
          >
            {trailingHookText}
          </span>
        </div>

        {/* City Destination */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 1,
            marginTop: 4,
            textShadow: "0 6px 25px rgba(0, 0, 0, 0.9)",
          }}
        >
          {majorCityName}.
        </div>
      </div>

      {/* MID-SCREEN RELOCATION DECISION PILLAR CARD */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: cardEntrance,
          transform: `scale(${cardEntrance})`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(24px)",
            borderRadius: 28,
            border: "2px solid rgba(217, 70, 239, 0.55)",
            padding: "30px 36px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(217, 70, 239, 0.2)",
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
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, #E11D48 0%, #C026D3 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  boxShadow: "0 6px 18px rgba(217, 70, 239, 0.35)",
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
                    color: "#F472B6",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {activePillar.tag} • {calculatedIndex + 1}/
                  {decisionPillars.length}
                </div>
                <div
                  style={{
                    fontSize: 26,
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
                  "linear-gradient(135deg, #F43F5E 0%, #A855F7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              HH
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
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.35)",
              color: "#F472B6",
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
            background:
              "linear-gradient(135deg, #BE185D 0%, #831843 100%)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(190, 24, 93, 0.45)",
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
