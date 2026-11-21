import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface EstateFeatureItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface LuxuryEstateTourPromoAssetProps {
  hookLine1?: string;
  hookLine2?: string;
  estateName?: string;
  location?: string;
  price?: string;
  sqft?: string;
  acreage?: string;
  bedBath?: string;
  features?: EstateFeatureItem[];
  agentName?: string;
  agentTitle?: string;
  agentPhone?: string;
  ctaText?: string;
  showHookCheckmark?: boolean;
  showSpecPills?: boolean;
  activeFeatureIndex?: number; // -1 for auto cycle
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_FEATURES: EstateFeatureItem[] = [
  {
    icon: "🍷",
    title: "Arched Glass Wine Cellar",
    subtitle: "Custom double-sided arched glass doors with dedicated wine fridge",
  },
  {
    icon: "🍳",
    title: "18ft Vaulted Gourmet Kitchen",
    subtitle: "Commercial double oven, 18-foot ceilings, and walk-in butler pantry",
  },
  {
    icon: "🛁",
    title: "Main Level Primary Spa Suite",
    subtitle: "Freestanding soaking tub, his & her vanities, and private covered patio",
  },
  {
    icon: "🚗",
    title: "4-Car Garage & Storage Room",
    subtitle: "Extra-deep smart-door bays with climate-controlled workshop",
  },
  {
    icon: "🌲",
    title: "4.5 Gated Usable Acres",
    subtitle: "Webb's Chapel Cove gated sanctuary with zero city taxes",
  },
];

export const LuxuryEstateTourPromoAsset: React.FC<LuxuryEstateTourPromoAssetProps> = ({
  hookLine1 = "checks all",
  hookLine2 = "your boxes.",
  estateName = "Webb's Chapel Cove Estate",
  location = "Denver, North Carolina",
  price = "$1,800,000",
  sqft = "5,455 SQ FT",
  acreage = "4.5 ACRES",
  bedBath = "4 BEDS • 6 BATHS",
  features = DEFAULT_FEATURES,
  agentName = "Kelsie Blevins",
  agentTitle = "Top 1% REALTOR® • Realty Executives Lake Norman",
  agentPhone = "828-221-6070",
  ctaText = "Schedule Private Tour 🔑 Link in Bio for 3D Walkthrough",
  showHookCheckmark = true,
  showSpecPills = true,
  activeFeatureIndex = -1,
  autoCycleFrames = 75, // 2.5s per feature at 30 fps
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active feature calculation
  const calculatedIndex =
    activeFeatureIndex >= 0 && activeFeatureIndex < features.length
      ? activeFeatureIndex
      : Math.floor((frame / autoCycleFrames) % features.length);

  const activeFeature = features[calculatedIndex] || features[0];

  // Springs
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const checkPulse = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [0.96, 1.04]
  );

  const cardEntrance = spring({
    frame: frame % autoCycleFrames,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const lowerThirdEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const ctaEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

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
      {/* TOP LOCATION & PRICE CAPSULE */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: hookEntrance,
          transform: `translateY(${interpolate(hookEntrance, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: 24,
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>📍</span>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                {estateName}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {location}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "8px 20px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 900,
              boxShadow: "0 4px 18px rgba(16, 185, 129, 0.45)",
              letterSpacing: 1,
            }}
          >
            {price}
          </div>
        </div>

        {/* SPEC PILLS BAR */}
        {showSpecPills && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 14,
            }}
          >
            {[sqft, acreage, bedBath, "NO CITY TAXES"].map((pill, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#E2E8F0",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  backdropFilter: "blur(12px)",
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SIGNATURE GLOWING CHECKMARK HOOK (As seen in Reel @_k.elsie) */}
      {showHookCheckmark && (
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            opacity: hookEntrance,
            transform: `scale(${hookEntrance * checkPulse})`,
          }}
        >
          {/* Emerald Square Checkmark Pill with intense bloom glow */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 26,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 50px rgba(16, 185, 129, 0.85), 0 0 100px rgba(16, 185, 129, 0.4)",
              marginBottom: 16,
              border: "2px solid #34D399",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Ultra-Clean Editorial Text */}
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 68,
              fontWeight: 200,
              lineHeight: 1.05,
              textAlign: "center",
              letterSpacing: 2,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
            }}
          >
            your
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 0.95,
              textAlign: "center",
              letterSpacing: 1,
              textShadow: "0 6px 30px rgba(0, 0, 0, 0.9)",
            }}
          >
            boxes.
          </div>
        </div>
      )}

      {/* MID-BOTTOM ROTATING FEATURE CARD (Overlays Tour B-Roll) */}
      <div
        style={{
          position: "absolute",
          bottom: 350,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: cardEntrance,
          transform: `scale(${cardEntrance})`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(24px)",
            borderRadius: 28,
            border: "2px solid rgba(16, 185, 129, 0.6)",
            padding: "24px 30px",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(16, 185, 129, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
              flexShrink: 0,
            }}
          >
            {activeFeature.icon}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#34D399",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              ESTATE HIGHLIGHT • {calculatedIndex + 1}/{features.length}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 0.5,
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              {activeFeature.title}
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#CBD5E1",
                fontWeight: 500,
                lineHeight: 1.35,
              }}
            >
              {activeFeature.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* AGENT AUTHORITY BADGE */}
      <div
        style={{
          position: "absolute",
          bottom: 210,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: lowerThirdEntrance,
          transform: `translateY(${interpolate(lowerThirdEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
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
                background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              KB
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: 0.5,
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
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#E2E8F0",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {agentPhone}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA FOOTER */}
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
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
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
