import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface LogicalFallacyItem {
  name: string;
  category: string;
  explanation: string;
  icon: string;
}

export interface ParadoxDebunkSplitAssetProps {
  questionDoubt?: string;
  paradoxTypeBadge?: string;
  reframingPunchline?: string;
  fallacies?: LogicalFallacyItem[];
  quranicDaleel?: {
    arabic: string;
    reference: string;
    translation: string;
    scholarlyNote: string;
  };
  conclusionVerdict?: string;
  ctaText?: string;
  accentCrimsonColor?: string;
  accentEmeraldColor?: string;
  accentCyanColor?: string;
  isDark?: boolean;
}

const DEFAULT_FALLACIES: LogicalFallacyItem[] = [
  {
    name: "Round Square (Gol Chokor)",
    category: "Category Contradiction",
    explanation: "Koi cheez hi nahi hoti. Gol aur chokor do mutazaad sifaat hain jo wujood mein nahi aa sakti.",
    icon: "⭕",
  },
  {
    name: "2 + 2 = 5",
    category: "Logical Category Error",
    explanation: "Agar calculator 2+2=5 na dikhaye, toh yeh calculator ki kamzori nahi, sawal ki ghalti hai.",
    icon: "🧮",
  },
  {
    name: "Unliftable Stone",
    category: "Semantic Illusion",
    explanation: "Qudrat-e-Ilahi har mumkin cheez par hai. Ghair-mumkin tanaquz (contradiction) cheez hi nahi.",
    icon: "🪨",
  },
];

export const ParadoxDebunkSplitAsset: React.FC<ParadoxDebunkSplitAssetProps> = ({
  questionDoubt = "SAWAL: Kya Allah aisa patthar bana sakta hai jo woh khud na utha sake?",
  paradoxTypeBadge = "LOGICAL FALLACY DEBUNK • OMNIPOTENCE PARADOX",
  reframingPunchline = "Kamzori Allah mein nahi, sawal ke logic mein hai.",
  fallacies = DEFAULT_FALLACIES,
  quranicDaleel = {
    arabic: "إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    reference: "SURAH AL-BAQARAH 2:20",
    translation: "Beshak Allah har cheez par qadir hai.",
    scholarlyNote: "Ulama samjhate hain: 'Shay' (cheez) woh hai jo wujood mein aa sakti ho.",
  },
  conclusionVerdict = "Woh patthar kabhi bana hi nahi — woh sirf alfaaz ka be-maani jod tha.",
  ctaText = "Apna agla sawal comments mein likho 💬",
  accentCrimsonColor = "#f43f5e",
  accentEmeraldColor = "#10b981",
  accentCyanColor = "#06b6d4",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const cardEntrance = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 13, stiffness: 90 },
  });

  const daleelEntrance = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 12, stiffness: 85 },
  });

  const footerEntrance = spring({
    frame: Math.max(0, frame - 32),
    fps,
    config: { damping: 11, stiffness: 100 },
  });

  // Floating shimmer effect
  const pulseScale = 1 + Math.sin(frame / 22) * 0.012;

  // Theming tokens
  const bgColor = isDark ? "#090d16" : "#f8fafc";
  const cardBg = isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.95)";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";
  const borderColor = isDark ? "rgba(6, 182, 212, 0.3)" : "rgba(6, 182, 212, 0.35)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "130px 48px 230px 48px", // 9:16 safe vertical margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bgColor,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Layer 1: Ambient High-Tech / Logic Nebulae ── */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "720px",
          height: "720px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentCyanColor}1f 0%, ${accentEmeraldColor}12 50%, transparent 75%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 2: Top Question Callout & Paradox Pill ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          width: "100%",
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-25, 0])}px)`,
          zIndex: 10,
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            borderRadius: "9999px",
            backgroundColor: `${accentCyanColor}18`,
            border: `1.5px solid ${accentCyanColor}`,
            boxShadow: `0 8px 24px ${accentCyanColor}22`,
          }}
        >
          <span style={{ fontSize: "18px" }}>🧠</span>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accentCyanColor,
            }}
          >
            {paradoxTypeBadge}
          </span>
        </div>

        {/* The Doubt Question Box (Styled like a user comment bubble) */}
        <div
          style={{
            width: "100%",
            maxWidth: "960px",
            padding: "20px 28px",
            borderRadius: "20px",
            backgroundColor: isDark ? "rgba(244, 63, 94, 0.12)" : "rgba(244, 63, 94, 0.08)",
            border: `1.5px solid ${accentCrimsonColor}44`,
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span style={{ fontSize: "28px" }}>❓</span>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: 1.35,
              margin: 0,
              color: isDark ? "#ffe4e6" : "#9f1239",
            }}
          >
            {questionDoubt}
          </p>
        </div>
      </div>

      {/* ── Layer 3: Central Logical Breakdown Stage (Cards & Mental Models) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          borderRadius: "28px",
          padding: "36px 36px",
          backgroundColor: cardBg,
          border: `1.5px solid ${borderColor}`,
          backdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(6, 182, 212, 0.15)"
            : "0 20px 50px rgba(15, 23, 42, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          transform: `scale(${pulseScale})`,
          zIndex: 10,
        }}
      >
        {/* Core Reframing Header */}
        <div style={{ textAlign: "center", opacity: cardEntrance }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: accentEmeraldColor,
            }}
          >
            ⚡ THE LOGICAL REFRAME
          </span>
          <h3
            style={{
              fontSize: "28px",
              fontWeight: 800,
              lineHeight: 1.3,
              margin: "8px 0 0 0",
              color: textColor,
            }}
          >
            {reframingPunchline}
          </h3>
        </div>

        {/* 3 Mental Models / Analogies */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {fallacies.map((item, idx) => {
            const itemEntrance = spring({
              frame: Math.max(0, frame - (12 + idx * 6)),
              fps,
              config: { damping: 12, stiffness: 95 },
            });
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  backgroundColor: isDark ? "rgba(2, 6, 23, 0.65)" : "rgba(241, 245, 249, 0.8)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  opacity: itemEntrance,
                  transform: `translateX(${interpolate(itemEntrance, [0, 1], [-20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${accentCyanColor}1f`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: textColor }}>{item.name}</span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: `${accentCrimsonColor}22`,
                        color: accentCrimsonColor,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", color: mutedText, margin: "4px 0 0 0", lineHeight: 1.4 }}>
                    {item.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scriptural Daleel Box (Surah Al-Baqarah 2:20) */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: "18px",
            backgroundColor: `${accentEmeraldColor}12`,
            border: `1.5px solid ${accentEmeraldColor}44`,
            opacity: daleelEntrance,
            transform: `translateY(${interpolate(daleelEntrance, [0, 1], [15, 0])}px)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: accentEmeraldColor,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              📖 DALEEL: {quranicDaleel.reference}
            </span>
          </div>
          <div
            style={{
              fontFamily: "'Traditional Arabic', 'Amiri', serif",
              fontSize: "32px",
              textAlign: "right",
              direction: "rtl",
              color: isDark ? "#ecfdf5" : "#065f46",
              fontWeight: 700,
              lineHeight: 1.4,
              marginBottom: "8px",
            }}
          >
            {quranicDaleel.arabic}
          </div>
          <p style={{ fontSize: "15px", color: textColor, fontWeight: 600, margin: "0 0 4px 0" }}>
            {quranicDaleel.translation}
          </p>
          <p style={{ fontSize: "13px", color: mutedText, margin: 0, fontStyle: "italic" }}>
            💡 {quranicDaleel.scholarlyNote}
          </p>
        </div>
      </div>

      {/* ── Layer 4: Punchline Verdict & Engagement CTA (Bottom Safe Zone Clearance) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          opacity: footerEntrance,
          transform: `translateY(${interpolate(footerEntrance, [0, 1], [25, 0])}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: "14px 28px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.12)"}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: textColor,
              margin: 0,
            }}
          >
            {conclusionVerdict}
          </p>
        </div>

        <p
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: accentCyanColor,
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          {ctaText}
        </p>
      </div>
    </div>
  );
};
