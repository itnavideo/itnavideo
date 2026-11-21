import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface EstateAmenityItem {
  icon: string;
  tag: string;
  title: string;
  desc: string;
}

export interface UltraLuxuryArchitecturalEstateAssetProps {
  locationName?: string;
  estateTitle?: string;
  villaSubtitle?: string;
  architectName?: string;
  priceEuro?: string;
  keySpecsLine?: string;
  povHookText?: string;
  amenities?: EstateAmenityItem[];
  agentName?: string;
  agentTitle?: string;
  ctaText?: string;
  showPovPill?: boolean;
  activeAmenityIndex?: number;
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_AMENITIES: EstateAmenityItem[] = [
  {
    icon: "🏛️",
    tag: "ARCHITECTURAL PEDIGREE",
    title: "Marcio Kogan / Studio MK27",
    desc: "Renowned signature horizontal lines, raw natural materials, board-formed concrete, and floor-to-ceiling glass.",
  },
  {
    icon: "🌊",
    tag: "HILLSIDE SANCTUARY",
    title: "Panoramic Mediterranean Views",
    desc: "Set within a private gated enclave in El Madroñal with uninterrupted coastal and mountain vistas.",
  },
  {
    icon: "🏊‍♂️",
    tag: "RESORT LIVING",
    title: "Horizon Infinity Pool & Terraces",
    desc: "Expansive outdoor limestone living spaces seamlessly blending indoor elegance with warm Mediterranean climate.",
  },
  {
    icon: "🎬",
    tag: "PRIVATE RETREAT",
    title: "Spa, Wellness Gym & Cinema",
    desc: "Fully bespoke wellness sanctuary featuring indoor spa, commercial-grade fitness center, and acoustic cinema.",
  },
];

export const UltraLuxuryArchitecturalEstateAsset: React.FC<UltraLuxuryArchitecturalEstateAssetProps> = ({
  locationName = "Marbella, Spain",
  estateTitle = "EL MADROÑAL",
  villaSubtitle = "VILLA ALIA",
  architectName = "Designed by Studio MK27",
  priceEuro = "€10,800,000 + IVA",
  keySpecsLine = "7 Bed | 8 Bath | 1,077 SqM",
  povHookText = "POV: when your contribution is €800K... and he handles the other €10M",
  amenities = DEFAULT_AMENITIES,
  agentName = "Rasa Bagdonaviciute",
  agentTitle = "Marbella Luxury Real Estate Advisor",
  ctaText = "Schedule Confidential Showing 🔑 Private Inquiries via DM",
  showPovPill = true,
  activeAmenityIndex = -1,
  autoCycleFrames = 75,
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active amenity index calculation
  const calculatedIndex =
    activeAmenityIndex >= 0 && activeAmenityIndex < amenities.length
      ? activeAmenityIndex
      : Math.floor((frame / autoCycleFrames) % amenities.length);

  const activeAmenity =
    amenities[calculatedIndex] || amenities[0];

  // Springs
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 105 },
  });

  const titleEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 110 },
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

  // Breathing pulse on center title
  const titlePulse = interpolate(
    Math.sin((frame / 25) * Math.PI * 2),
    [-1, 1],
    [0.99, 1.01]
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
      {/* TOP POV TEASER HOOK PILL (Reel @rasa.bagd) */}
      {showPovPill && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 50,
            right: 50,
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
            opacity: hookEntrance,
            transform: `translateY(${interpolate(hookEntrance, [0, 1], [-30, 0])}px)`,
          }}
        >
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              background: "rgba(15, 23, 42, 0.88)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 18 }}>✨</span>
            <span
              style={{
                color: "#F8FAFC",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {povHookText}
            </span>
          </div>
        </div>
      )}

      {/* SIGNATURE ARCHITECTURAL CENTER TYPOGRAPHY (Reel @rasa.bagd) */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          opacity: titleEntrance,
          transform: `scale(${titleEntrance * titlePulse})`,
        }}
      >
        {/* Location Line */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 400,
            color: "#E2E8F0",
            letterSpacing: 4,
            textTransform: "uppercase",
            textShadow: "0 4px 18px rgba(0, 0, 0, 0.85)",
            marginBottom: 8,
          }}
        >
          {locationName}
        </div>

        {/* Estate Title: Giant Architectural All-Caps */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 6,
            lineHeight: 1,
            textTransform: "uppercase",
            textShadow:
              "0 6px 30px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.2)",
            marginBottom: 6,
          }}
        >
          {estateTitle}
        </div>

        {/* Villa Name & Architect */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#FCD34D", // Soft gold
            letterSpacing: 3,
            textTransform: "uppercase",
            textShadow: "0 3px 14px rgba(0, 0, 0, 0.8)",
            marginBottom: 12,
          }}
        >
          {villaSubtitle} • {architectName}
        </div>

        {/* Specs & Price Line */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "8px 24px",
            borderRadius: 999,
            background: "rgba(15, 23, 42, 0.82)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: 1,
            }}
          >
            {keySpecsLine}
          </span>
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>|</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#10B981", // Emerald
              letterSpacing: 1,
            }}
          >
            {priceEuro}
          </span>
        </div>
      </div>

      {/* MID-SCREEN ARCHITECTURAL AMENITY CARD */}
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
            border: "2px solid rgba(250, 204, 21, 0.55)",
            padding: "30px 36px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(250, 204, 21, 0.18)",
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
                    "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  boxShadow: "0 6px 18px rgba(245, 158, 11, 0.35)",
                  flexShrink: 0,
                }}
              >
                {activeAmenity.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#FDE047",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {activeAmenity.tag} • {calculatedIndex + 1}/
                  {amenities.length}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: 0.5,
                  }}
                >
                  {activeAmenity.title}
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
            {activeAmenity.desc}
          </div>
        </div>
      </div>

      {/* AGENT FOOTPRINT LOWER-THIRD */}
      <div
        style={{
          position: "absolute",
          bottom: 230,
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
                  "linear-gradient(135deg, #F59E0B 0%, #10B981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0F172A",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              RB
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
              background: "rgba(250, 204, 21, 0.15)",
              border: "1px solid rgba(250, 204, 21, 0.35)",
              color: "#FDE047",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            Exclusive Listing
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
              "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            border: "1.5px solid rgba(250, 204, 21, 0.4)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#F8FAFC",
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
