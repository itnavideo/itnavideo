import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ServiceCommitmentItem {
  icon: string;
  tag: string;
  title: string;
  desc: string;
}

export interface RadicalServiceHeroGradientAssetProps {
  heroKeyword?: string;
  leadingText?: string;
  trailingText?: string;
  creatorTag?: string;
  heroGradient?: string;
  heroGlowColor?: string;
  commitments?: ServiceCommitmentItem[];
  agentName?: string;
  agentTitle?: string;
  agentPhone?: string;
  commentTriggerWord?: string;
  activeCommitmentIndex?: number; // -1 for auto cycle
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_COMMITMENTS: ServiceCommitmentItem[] = [
  {
    icon: "🌙",
    tag: "24/7 AVAILABILITY",
    title: "Answering Midnight Calls",
    desc: "No voicemail black holes. When time-sensitive negotiations are on the line, I pick up immediately.",
  },
  {
    icon: "🎁",
    tag: "CLIENT-FIRST GENEROSITY",
    title: "Closing-Day Appliance Relief",
    desc: "Gifted washers, dryers, and essentials to families when tight budgets threatened move-in peace.",
  },
  {
    icon: "🛡️",
    tag: "RELENTLESS ADVOCACY",
    title: "Zero-Pressure Contract Defense",
    desc: "Walking you through every legal clause, appraisal contingency, and counter-offer with zero rush.",
  },
  {
    icon: "📈",
    tag: "UPFRONT INVESTMENT",
    title: "$1,000s Invested Before Day 1",
    desc: "Professional twilight staging, cinematic video, and targeted digital campaigns paid out of pocket.",
  },
];

export const RadicalServiceHeroGradientAsset: React.FC<RadicalServiceHeroGradientAssetProps> = ({
  heroKeyword = "solving",
  leadingText = "but I'm",
  trailingText = "problems.",
  creatorTag = "@yourrealtorraelynn • RADICAL COMMITMENT",
  heroGradient = "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
  heroGlowColor = "rgba(168, 85, 247, 0.65)",
  commitments = DEFAULT_COMMITMENTS,
  agentName = "Rae'lynn Wetzel Hibbert",
  agentTitle = "Utah Luxury & Residential REALTOR®",
  agentPhone = "385-487-6763",
  commentTriggerWord = "DOOR",
  activeCommitmentIndex = -1,
  autoCycleFrames = 80, // 2.6s per commitment
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active commitment index calculation
  const calculatedIndex =
    activeCommitmentIndex >= 0 && activeCommitmentIndex < commitments.length
      ? activeCommitmentIndex
      : Math.floor((frame / autoCycleFrames) % commitments.length);

  const activeItem = commitments[calculatedIndex] || commitments[0];

  // Springs
  const heroEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const cardEntrance = spring({
    frame: frame % autoCycleFrames,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const lowerThirdEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const ctaEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Hero word scale bounce and pulse
  const heroPulse = interpolate(
    Math.sin((frame / 18) * Math.PI * 2),
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
      {/* Dynamic Ambient Background Glow matched to Hero Gradient */}
      <div
        style={{
          position: "absolute",
          top: "16%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 750,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${heroGlowColor} 0%, rgba(0,0,0,0) 70%)`,
          filter: "blur(75px)",
          opacity: 0.7,
          zIndex: 0,
        }}
      />

      {/* TOP TAG PILL */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          opacity: heroEntrance,
          transform: `translateY(${interpolate(heroEntrance, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.45)",
          }}
        >
          <span style={{ fontSize: 18 }}>✦</span>
          <span
            style={{
              color: "#F1F5F9",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {creatorTag}
          </span>
        </div>
      </div>

      {/* SIGNATURE HERO GRADIENT KINETIC TYPOGRAPHY (Reel @yourrealtorraelynn) */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 50,
          right: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          columnGap: 18,
          rowGap: 8,
          zIndex: 10,
          opacity: heroEntrance,
          transform: `scale(${heroEntrance * heroPulse})`,
        }}
      >
        {/* Leading text */}
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: 1,
            textShadow: "0 4px 18px rgba(0, 0, 0, 0.85)",
          }}
        >
          {leadingText}
        </span>

        {/* Hero Keyword: Giant 96px Extruded Gradient Text */}
        <span
          style={{
            fontSize: 98,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: 1.5,
            textTransform: "lowercase",
            background: heroGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 25px ${heroGlowColor})`,
            display: "inline-block",
            transform: "translateY(2px)",
          }}
        >
          {heroKeyword}
        </span>

        {/* Trailing text */}
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: 1,
            textShadow: "0 4px 18px rgba(0, 0, 0, 0.85)",
          }}
        >
          {trailingText}
        </span>
      </div>

      {/* MID-SCREEN SERVICE COMMITMENT VALUE CARD */}
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
            borderRadius: 30,
            border: "2px solid rgba(168, 85, 247, 0.55)",
            padding: "32px 36px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(168, 85, 247, 0.22)",
            position: "relative",
          }}
        >
          {/* Header Bar */}
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
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: heroGradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  boxShadow: `0 6px 18px ${heroGlowColor}`,
                }}
              >
                {activeItem.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#C084FC",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {activeItem.tag}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: 0.5,
                  }}
                >
                  {activeItem.title}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#CBD5E1",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {calculatedIndex + 1}/{commitments.length}
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
            {activeItem.desc}
          </div>
        </div>
      </div>

      {/* AGENT FOOTPRINT LOWER-THIRD */}
      <div
        style={{
          position: "absolute",
          bottom: 270,
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
            borderRadius: 22,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: heroGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 20,
                boxShadow: `0 4px 14px ${heroGlowColor}`,
              }}
            >
              RH
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: 0.5,
                }}
              >
                {agentName}
              </div>
              <div
                style={{
                  fontSize: 15,
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
              borderRadius: 12,
              background: "rgba(168, 85, 247, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              color: "#C084FC",
              fontSize: 15,
              fontWeight: 800,
            }}
          >
            {agentPhone}
          </div>
        </div>
      </div>

      {/* VIRAL LEAD MAGNET COMMENT TRIGGER FOOTER */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: ctaEntrance,
          transform: `translateY(${interpolate(ctaEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
            border: "1.5px solid rgba(168, 85, 247, 0.5)",
            borderRadius: 22,
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            boxShadow:
              "0 14px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(168, 85, 247, 0.3)",
          }}
        >
          <span style={{ fontSize: 24 }}>💬</span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: 0.5,
            }}
          >
            Comment{" "}
            <span
              style={{
                color: "#EC4899",
                background: "rgba(236, 72, 153, 0.18)",
                padding: "4px 12px",
                borderRadius: 8,
                border: "1px solid rgba(236, 72, 153, 0.4)",
                fontWeight: 900,
                letterSpacing: 1,
              }}
            >
              {commentTriggerWord}
            </span>{" "}
            to get the Utah Buyer Guide
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
