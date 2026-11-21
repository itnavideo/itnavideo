import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface MvpValidationStep {
  step: string;
  title: string;
  desc: string;
  emoji: string;
}

export interface StartupMvpValidationAssetProps {
  brandHandle?: string;
  headlineWord1?: string;
  headlineHero?: string;
  headlineWord2?: string;
  steps?: MvpValidationStep[];
  activeStepIndex?: number;
  accentBlueColor?: string;
  isLightGrid?: boolean;
}

const DEFAULT_STEPS: MvpValidationStep[] = [
  {
    step: "01",
    title: "Validate the Problem",
    desc: "Talk to 20 potential customers first. Verify if it's a real pain point.",
    emoji: "🎯",
  },
  {
    step: "02",
    title: "Test Market Demand",
    desc: "Build a simple 1-page landing page with waitlist before coding.",
    emoji: "🌐",
  },
  {
    step: "03",
    title: "Ship 1-Feature MVP",
    desc: "Build only the single core feature that solves the immediate problem.",
    emoji: "🚀",
  },
  {
    step: "04",
    title: "Track User Retention",
    desc: "Measure activation and repeat usage before spending money on scaling.",
    emoji: "📈",
  },
];

export const StartupMvpValidationAsset: React.FC<StartupMvpValidationAssetProps> = ({
  brandHandle = "@wabsyin",
  headlineWord1 = "Startup",
  headlineHero = "idea",
  headlineWord2 = "hai?",
  steps = DEFAULT_STEPS,
  activeStepIndex,
  accentBlueColor = "#2563EB",
  isLightGrid = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active step cycling (every 80 frames = ~2.6s)
  const computedActiveIndex =
    activeStepIndex !== undefined
      ? activeStepIndex
      : Math.floor(frame / 80) % steps.length;

  const currentStep = steps[computedActiveIndex] || steps[0];

  // Springs
  const bulbEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  const headlineEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const cardEntrance = spring({
    frame: frame % 80,
    fps,
    config: { damping: 15, stiffness: 95 },
  });

  // Lightbulb glowing pulse & ray rotation
  const bulbPulse = 1 + Math.sin(frame / 12) * 0.05;
  const raysOpacity = 0.6 + Math.sin(frame / 8) * 0.35;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "130px 36px 210px 36px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isLightGrid ? "#F8FAFC" : "#0F172A",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── BACKGROUND SUBTLE COORDINATE GRID ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* ── TOP SECTION: Glowing Blue Lightbulb & Dual-Script Headline ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 15,
        }}
      >
        {/* Animated Lightbulb Vector with Radial Sunburst Rays */}
        <div
          style={{
            position: "relative",
            width: "160px",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: bulbEntrance,
            transform: `scale(${interpolate(bulbEntrance, [0, 1], [0.8, 1]) * bulbPulse})`,
            marginBottom: "16px",
          }}
        >
          {/* Radial Blue Glow Backing */}
          <div
            style={{
              position: "absolute",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accentBlueColor}33 0%, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />

          {/* Sunburst Rays (SVG) */}
          <svg
            width="150"
            height="150"
            viewBox="0 0 100 100"
            style={{
              position: "absolute",
              inset: 0,
              opacity: raysOpacity,
            }}
          >
            {Array.from({ length: 12 }).map((_, rIdx) => {
              const angle = (rIdx * 360) / 12;
              return (
                <line
                  key={rIdx}
                  x1="50"
                  y1="12"
                  x2="50"
                  y2="20"
                  stroke={accentBlueColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
          </svg>

          {/* Central Blue Lightbulb Graphic */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              border: `4px solid ${accentBlueColor}`,
              boxShadow: `0 0 20px ${accentBlueColor}55`,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: accentBlueColor,
                opacity: 0.85,
              }}
            />
          </div>
        </div>

        {/* Signature Dual-Script Headline: Startup [idea] hai? */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "10px",
            opacity: headlineEntrance,
            transform: `translateY(${interpolate(headlineEntrance, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', 'Newsreader', Georgia, serif",
              fontStyle: "italic",
              fontSize: "46px",
              fontWeight: 800,
              color: "#1E293B",
              lineHeight: 1,
            }}
          >
            {headlineWord1}
          </span>
          <span
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: accentBlueColor,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              textShadow: `0 4px 16px ${accentBlueColor}44`,
            }}
          >
            {headlineHero}
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Newsreader', Georgia, serif",
              fontStyle: "italic",
              fontSize: "46px",
              fontWeight: 800,
              color: "#1E293B",
              lineHeight: 1,
            }}
          >
            {headlineWord2}
          </span>
        </div>
      </div>

      {/* ── CENTER SECTION: 4-Step MVP Action Checklist ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          zIndex: 20,
          opacity: cardEntrance,
          transform: `translateY(${interpolate(cardEntrance, [0, 1], [30, 0])}px) scale(${interpolate(cardEntrance, [0, 1], [0.94, 1])})`,
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "26px",
            padding: "26px 24px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
            border: "1.5px solid rgba(0, 0, 0, 0.06)",
            position: "relative",
          }}
        >
          {/* Card Step Badge & Progress */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: `${accentBlueColor}14`,
                border: `1px solid ${accentBlueColor}33`,
              }}
            >
              <span style={{ fontSize: "14px" }}>{currentStep.emoji}</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: accentBlueColor,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Step {currentStep.step} of 0{steps.length}
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#64748B",
              }}
            >
              PRE-CODE CHECKLIST
            </span>
          </div>

          {/* Step Title & Explanation */}
          <h3
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#0F172A",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            {currentStep.title}
          </h3>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.45,
              color: "#475569",
              margin: "0 0 20px 0",
              fontWeight: 500,
            }}
          >
            {currentStep.desc}
          </p>

          {/* Step Pill Indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {steps.map((_, dotIdx) => (
              <div
                key={dotIdx}
                style={{
                  width: dotIdx === computedActiveIndex ? "26px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor:
                    dotIdx === computedActiveIndex ? accentBlueColor : "#E2E8F0",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Golden Rule Banner ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 25,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "16px",
            background: "#0F172A",
            color: "#FFFFFF",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "0.04em" }}>
            Validate first. Build smart. Scale later.
          </span>
        </div>
      </div>
    </div>
  );
};
