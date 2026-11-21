import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface QissaverseSpiritualStoryAssetProps {
  surahBadge?: string;
  arabicCalligraphy?: string;
  transliterationQuote?: string;
  englishTranslation?: string;
  divineComfortBadge?: string;
  historicalContext?: string;
  keyStatMetric?: string;
  accentGoldColor?: string;
  accentEmeraldColor?: string;
  narrativePhase?: "hook" | "agony" | "miracle" | "elevation" | "comfort";
  isDark?: boolean;
}

export const QissaverseSpiritualStoryAsset: React.FC<QissaverseSpiritualStoryAssetProps> = ({
  surahBadge = "SURAH MARYAM 19:23",
  arabicCalligraphy = "يَا لَيْتَنِي مِتُّ قَبْلَ هَٰذَا وَكُنتُ نَسْيًا مَّنسِيًّا",
  transliterationQuote = "\"Kaash main mar jaati, aur sab mujhe bhool jaate.\"",
  englishTranslation = "\"Oh, I wish I had died before this and was in oblivion, forgotten.\"",
  divineComfortBadge = "DIVINE RESPONSE: \"GHAM NA KARO\" (19:24)",
  historicalContext = "Qur'an mein sirf ek aurat ka naam aata hai, 34 baar. Jo chahti thin ki sab unhe bhool jaayein, unhe qayaamat tak zinda zikr bana diya.",
  keyStatMetric = "34x In Qur'an",
  accentGoldColor = "#d4af37",
  accentEmeraldColor = "#10b981",
  narrativePhase = "comfort",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrances and spring timings
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const badgeEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const arabicEntrance = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  const quoteEntrance = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 12, stiffness: 95 },
  });

  const comfortEntrance = spring({
    frame: Math.max(0, frame - 32),
    fps,
    config: { damping: 11, stiffness: 90 },
  });

  // Breathing / Ethereal floating shimmer
  const shimmer = Math.sin(frame / 18) * 6;
  const pulseScale = 1 + Math.sin(frame / 24) * 0.015;
  const glowIntensity = interpolate(Math.sin(frame / 15), [-1, 1], [0.3, 0.85]);

  // Color tokens
  const bgColor = isDark ? "#080c14" : "#fdfbf7";
  const cardBg = isDark ? "rgba(15, 23, 42, 0.78)" : "rgba(255, 255, 255, 0.92)";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";
  const borderColor = isDark ? "rgba(212, 175, 55, 0.28)" : "rgba(212, 175, 55, 0.4)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "140px 60px 220px 60px", // 9:16 safe zones (cleared top header & bottom Reels UI)
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bgColor,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Layer 1: Ethereal Ambient Nebula Glows ── */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: `translate(-50%, ${shimmer}px)`,
          width: "720px",
          height: "720px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentGoldColor}22 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentEmeraldColor}1a 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 2: Top Arch Badge & Stat Capsule ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          width: "100%",
          opacity: badgeEntrance,
          transform: `translateY(${interpolate(badgeEntrance, [0, 1], [-25, 0])}px)`,
          zIndex: 10,
        }}
      >
        {/* Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 28px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(212, 175, 55, 0.12)" : "rgba(212, 175, 55, 0.16)",
            border: `1.5px solid ${accentGoldColor}55`,
            backdropFilter: "blur(12px)",
            boxShadow: `0 8px 24px rgba(212, 175, 55, ${glowIntensity * 0.2})`,
          }}
        >
          <span style={{ fontSize: "20px" }}>✨</span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accentGoldColor,
            }}
          >
            {surahBadge}
          </span>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: `${accentGoldColor}28`,
              fontSize: "14px",
              fontWeight: 700,
              color: isDark ? "#ffffff" : "#78350f",
            }}
          >
            {keyStatMetric}
          </span>
        </div>

        {/* Golden Arch Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            width: "360px",
            opacity: 0.8,
          }}
        >
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, transparent, ${accentGoldColor})` }} />
          <span style={{ fontSize: "14px", color: accentGoldColor }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accentGoldColor}, transparent)` }} />
        </div>
      </div>

      {/* ── Layer 3: Central Cinematic Parchment Card (9:16 Vertical Centerpiece) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          borderRadius: "32px",
          padding: "54px 44px",
          backgroundColor: cardBg,
          border: `1.5px solid ${borderColor}`,
          backdropFilter: "blur(24px)",
          boxShadow: isDark
            ? `0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px ${accentGoldColor}18`
            : "0 20px 50px rgba(180, 83, 9, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "36px",
          transform: `scale(${pulseScale})`,
          zIndex: 10,
        }}
      >
        {/* Arabic Calligraphy Typography */}
        <div
          style={{
            opacity: arabicEntrance,
            transform: `translateY(${interpolate(arabicEntrance, [0, 1], [30, 0])}px)`,
            textAlign: "center",
            direction: "rtl",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', 'Geeza Pro', serif",
              fontSize: "52px",
              lineHeight: 1.6,
              margin: 0,
              color: isDark ? "#fff8e7" : "#1c1917",
              textShadow: isDark
                ? `0 0 24px ${accentGoldColor}55, 0 4px 12px rgba(0,0,0,0.8)`
                : "none",
              letterSpacing: "0.02em",
              fontWeight: 700,
            }}
          >
            {arabicCalligraphy}
          </p>
        </div>

        {/* Ornamental Divider with Crescent / Star Motif */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            width: "80%",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: `${accentGoldColor}33` }} />
          <span style={{ fontSize: "16px", color: accentGoldColor }}>۞</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: `${accentGoldColor}33` }} />
        </div>

        {/* Emotionally Charged Spoken Transliteration */}
        <div
          style={{
            opacity: quoteEntrance,
            transform: `translateY(${interpolate(quoteEntrance, [0, 1], [25, 0])}px)`,
            textAlign: "center",
          }}
        >
          <blockquote
            style={{
              fontSize: "36px",
              fontWeight: 800,
              lineHeight: 1.35,
              margin: 0,
              color: isDark ? "#ffffff" : "#0f172a",
              fontStyle: "italic",
              letterSpacing: "-0.01em",
            }}
          >
            {transliterationQuote}
          </blockquote>
          {englishTranslation && (
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: 1.4,
                marginTop: "16px",
                marginBottom: 0,
                color: mutedText,
              }}
            >
              {englishTranslation}
            </p>
          )}
        </div>

        {/* Historical Context Callout */}
        {historicalContext && (
          <div
            style={{
              width: "100%",
              padding: "24px 30px",
              borderRadius: "20px",
              backgroundColor: isDark ? "rgba(2, 6, 23, 0.65)" : "rgba(241, 245, 249, 0.8)",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                fontSize: "21px",
                lineHeight: 1.5,
                margin: 0,
                color: isDark ? "#e2e8f0" : "#334155",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {historicalContext}
            </p>
          </div>
        )}
      </div>

      {/* ── Layer 4: Divine Comfort & Viral Share Callout (Bottom Safe Zone Clearance) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          opacity: comfortEntrance,
          transform: `translateY(${interpolate(comfortEntrance, [0, 1], [30, 0])}px)`,
          zIndex: 10,
        }}
      >
        {/* Divine Comfort Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            padding: "16px 36px",
            borderRadius: "9999px",
            backgroundColor: `${accentEmeraldColor}1a`,
            border: `2px solid ${accentEmeraldColor}`,
            boxShadow: `0 8px 30px ${accentEmeraldColor}33`,
          }}
        >
          <span style={{ fontSize: "22px" }}>🕊️</span>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: accentEmeraldColor,
              textTransform: "uppercase",
            }}
          >
            {divineComfortBadge}
          </span>
        </div>

        {/* Viral Share Directive */}
        <p
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: mutedText,
            margin: 0,
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          Yeh video usko bhejo jo aaj dard mein akela hai 🤍
        </p>
      </div>
    </div>
  );
};
