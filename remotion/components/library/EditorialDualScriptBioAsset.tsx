import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface EditorialDualScriptBioAssetProps {
  topHeaderSans?: string;
  serifEmphasisWord?: string;
  speakerNameLine1?: string;
  speakerNameLine2?: string;
  speakerCredentials?: string;
  insightQuote?: string;
  keyLesson?: string;
  topicTag?: string;
  canvasTone?: "warm-linen" | "sage" | "slate-dark";
  isDark?: boolean;
}

export const EditorialDualScriptBioAsset: React.FC<EditorialDualScriptBioAssetProps> = ({
  topHeaderSans = "AND YOUR MOST ACCURATE",
  serifEmphasisWord = "impersonator.",
  speakerNameLine1 = "Priyanka",
  speakerNameLine2 = "Thakur Vira",
  speakerCredentials = "PSYCHOLOGIST, TWIN MOM",
  insightQuote = "Children are always watching, even when we think they aren't.",
  keyLesson = "Kindness and patience aren't taught through words — they are caught through what they see us do.",
  topicTag = "OBSERVATIONAL LEARNING • CHILD DEVELOPMENT",
  canvasTone = "warm-linen",
  isDark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const typographyEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const cardEntrance = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const lessonEntrance = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  // Soft breathing float
  const floatY = Math.sin(frame / 22) * 5;

  // Aesthetic Editorial Palette
  const bg = isDark
    ? "#121417"
    : canvasTone === "warm-linen"
    ? "#e5e3dc"
    : "#dfe4dc";

  const primaryText = isDark ? "#f8fafc" : "#242320";
  const sansHeaderColor = isDark ? "#94a3b8" : "#4a4742";
  const cardBg = isDark ? "rgba(30, 41, 59, 0.85)" : "rgba(253, 252, 248, 0.94)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "150px 48px 230px 48px", // 9:16 vertical safe margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Editorial Dual-Script Typography Header ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          opacity: typographyEntrance,
          transform: `translateY(${interpolate(typographyEntrance, [0, 1], [-25, 0])}px)`,
        }}
      >
        {/* Sans-Serif Spaced Uppercase Subtitle */}
        <span
          style={{
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: sansHeaderColor,
            marginBottom: "8px",
          }}
        >
          {topHeaderSans}
        </span>

        {/* Hero Luxury Italic Serif Word (e.g. "impersonator.") */}
        <h1
          style={{
            margin: 0,
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', 'Georgia', serif",
            fontSize: "76px",
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1.05,
            color: primaryText,
            letterSpacing: "-0.01em",
            textShadow: isDark
              ? "0 4px 16px rgba(0,0,0,0.8)"
              : "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {serifEmphasisWord}
        </h1>
      </div>

      {/* ── MIDDLE / LOWER SECTION: Floating Credential Card & Insight ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "920px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          zIndex: 10,
        }}
      >
        {/* Observation Insight Card */}
        <div
          style={{
            padding: "24px 30px",
            borderRadius: "22px",
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.7)",
            border: `1px solid ${cardBorder}`,
            backdropFilter: "blur(16px)",
            boxShadow: isDark
              ? "0 14px 35px rgba(0, 0, 0, 0.5)"
              : "0 12px 30px rgba(0, 0, 0, 0.05)",
            opacity: lessonEntrance,
            transform: `translateY(${interpolate(lessonEntrance, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isDark ? "#38bdf8" : "#854d0e",
              marginBottom: "8px",
            }}
          >
            ✦ {topicTag}
          </div>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: 1.45,
              margin: 0,
              color: isDark ? "#f1f5f9" : "#334155",
            }}
          >
            "{keyLesson}"
          </p>
        </div>

        {/* Floating Psychologist Credential Bio Card (Bottom-Right Anchored) */}
        <div
          style={{
            alignSelf: "flex-end",
            padding: "20px 28px",
            borderRadius: "18px",
            backgroundColor: cardBg,
            border: `1.5px solid ${cardBorder}`,
            backdropFilter: "blur(20px)",
            boxShadow: isDark
              ? "0 18px 40px rgba(0, 0, 0, 0.6)"
              : "0 14px 35px rgba(46, 44, 40, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            transform: `translateY(${floatY}px) scale(${interpolate(cardEntrance, [0, 1], [0.92, 1])})`,
            opacity: cardEntrance,
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize: "26px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: primaryText,
            }}
          >
            {speakerNameLine1}
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize: "28px",
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 1.15,
              color: primaryText,
            }}
          >
            {speakerNameLine2}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: isDark ? "#94a3b8" : "#78716c",
              marginTop: "8px",
              paddingTop: "6px",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            {speakerCredentials}
          </div>
        </div>
      </div>
    </div>
  );
};
