import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export type CutType = "j-cut" | "l-cut";

export interface VideoEditingTimelineSplitAssetProps {
  headlineHindiPre?: string;
  headlineHindiPost?: string;
  cutType?: CutType;
  speakerName?: string;
  explainerText?: string;
  accentRedColor?: string;
  waveformGoldColor?: string;
  waveformCyanColor?: string;
  isWarmTheme?: boolean;
}

export const VideoEditingTimelineSplitAsset: React.FC<VideoEditingTimelineSplitAssetProps> = ({
  headlineHindiPre = "हर cut पे",
  headlineHindiPost = "झटका?",
  cutType = "j-cut",
  speakerName = "@taalcut",
  explainerText = "Audio pehle shuru hota hai, video baad me change hoti hai",
  accentRedColor = "#E11D48",
  waveformGoldColor = "#F59E0B",
  waveformCyanColor = "#06B6D4",
  isWarmTheme = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for top headline
  const headlineEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Entrance for monitor and timeline cards
  const monitorEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const timelineEntrance = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const labelEntrance = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 13, stiffness: 115 },
  });

  // Timeline scrubber moving playhead (cycles across 90 frames / 3 seconds)
  const scrubberProgress = (frame % 90) / 90;
  const scrubberX = interpolate(scrubberProgress, [0, 1], [40, 480]);

  // J-curve pulse glow
  const jCurveGlow = 0.7 + Math.sin(frame / 8) * 0.3;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "130px 40px 210px 40px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isWarmTheme ? "#F6F4EE" : "#0F172A",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Hindi Hook Headline ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          opacity: headlineEntrance,
          transform: `translateY(${interpolate(headlineEntrance, [0, 1], [-25, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: "44px",
            fontWeight: 900,
            color: isWarmTheme ? "#18181B" : "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {headlineHindiPre}
        </span>
        <span
          style={{
            fontSize: "52px",
            fontWeight: 950,
            color: accentRedColor,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginTop: "2px",
          }}
        >
          {headlineHindiPost}
        </span>
      </div>

      {/* ── UPPER MONITOR STAGE: 16:9 Podcaster Scene Preview ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          height: "285px",
          borderRadius: "22px",
          background: "linear-gradient(180deg, #2D1B14 0%, #1A100C 100%)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.25), inset 0 0 30px rgba(0, 0, 0, 0.5)",
          border: "4px solid #3F2B22",
          overflow: "hidden",
          position: "relative",
          zIndex: 15,
          opacity: monitorEntrance,
          transform: `scale(${interpolate(monitorEntrance, [0, 1], [0.93, 1])})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Bookshelf Background in studio */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "140px",
            height: "70px",
            borderBottom: "4px solid #5C3D2E",
            display: "flex",
            alignItems: "flex-end",
            gap: "6px",
            paddingBottom: "4px",
          }}
        >
          {/* Books */}
          <div style={{ width: "12px", height: "45px", background: "#EF4444", borderRadius: "2px" }} />
          <div style={{ width: "14px", height: "55px", background: "#F59E0B", borderRadius: "2px" }} />
          <div style={{ width: "10px", height: "40px", background: "#10B981", borderRadius: "2px" }} />
          <div style={{ width: "15px", height: "50px", background: "#3B82F6", borderRadius: "2px" }} />
          {/* Plant */}
          <div
            style={{
              width: "24px",
              height: "20px",
              background: "#15803D",
              borderRadius: "50% 50% 0 0",
              marginLeft: "10px",
            }}
          />
        </div>

        {/* 2D Vector Podcaster Character with Glasses & Headphones */}
        <div
          style={{
            position: "relative",
            width: "160px",
            height: "190px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "35px",
          }}
        >
          {/* Head & Hair */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#8D5B4C",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Dark Curly Hair */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "40px",
                background: "#241814",
                borderRadius: "50% 50% 0 0",
              }}
            />
            {/* Glasses */}
            <div
              style={{
                position: "absolute",
                top: "42px",
                left: "14px",
                right: "14px",
                height: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "20px",
                  border: "3px solid #18181B",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.15)",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "20px",
                  border: "3px solid #18181B",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.15)",
                }}
              />
            </div>
            {/* Beard */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "10px",
                right: "10px",
                height: "30px",
                background: "#241814",
                borderRadius: "0 0 45px 45px",
              }}
            />
          </div>

          {/* Headphones around neck */}
          <div
            style={{
              width: "115px",
              height: "24px",
              borderRadius: "12px",
              background: "#18181B",
              marginTop: "-8px",
              border: "3px solid #E11D48",
              zIndex: 3,
            }}
          />

          {/* Yellow Shirt / Shoulders */}
          <div
            style={{
              width: "150px",
              height: "70px",
              background: "#EAB308",
              borderRadius: "45px 45px 0 0",
              marginTop: "-6px",
            }}
          />
        </div>

        {/* Studio Boom Microphone */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "100px",
            width: "170px",
            height: "140px",
            pointerEvents: "none",
          }}
        >
          {/* Boom Arm line */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: 0,
              width: "160px",
              height: "3px",
              background: "#18181B",
              transform: "rotate(-35deg)",
              transformOrigin: "top right",
            }}
          />
          {/* Mic Capsule */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              width: "30px",
              height: "45px",
              borderRadius: "15px",
              background: "#1E293B",
              border: "2px solid #64748B",
            }}
          />
        </div>
      </div>

      {/* ── LOWER STAGE: NLE Video & Audio Timeline (J-Cut / L-Cut) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#1C1C24",
          borderRadius: "18px",
          padding: "16px 20px 20px 20px",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
          border: "2px solid #2D2D38",
          boxSizing: "border-box",
          zIndex: 20,
          opacity: timelineEntrance,
          transform: `translateY(${interpolate(timelineEntrance, [0, 1], [30, 0])}px)`,
          position: "relative",
        }}
      >
        {/* Timecode Ruler */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            fontWeight: 700,
            color: "#71717A",
            fontFamily: "monospace",
            borderBottom: "1px solid #2D2D38",
            paddingBottom: "8px",
            marginBottom: "12px",
            position: "relative",
          }}
        >
          <span>00:00</span>
          <span>00:01</span>
          <span>00:02</span>
          <span>00:03</span>
          <span>00:04</span>

          {/* Animated Scrubber Head */}
          <div
            style={{
              position: "absolute",
              left: `${scrubberX}px`,
              top: "-4px",
              width: "2px",
              height: "170px",
              backgroundColor: "#38BDF8",
              boxShadow: "0 0 8px #38BDF8",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#38BDF8",
                position: "absolute",
                top: 0,
                left: "-3px",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </div>
        </div>

        {/* Video Track V1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            position: "relative",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#A1A1AA", width: "22px" }}>
            V1
          </span>
          <div
            style={{
              flex: 1,
              height: "50px",
              display: "flex",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #3F3F46",
            }}
          >
            {/* Clip 1: Podcaster Scene */}
            <div
              style={{
                width: "65%",
                height: "100%",
                background: "linear-gradient(90deg, #422006, #78350F)",
                display: "flex",
                alignItems: "center",
                paddingLeft: "12px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#FDE68A",
                borderRight: "2px solid #000000",
              }}
            >
              🎬 Scene A (Podcaster)
            </div>
            {/* Clip 2: Cut Target Scene */}
            <div
              style={{
                width: "35%",
                height: "100%",
                background: "linear-gradient(90deg, #1E293B, #0F172A)",
                display: "flex",
                alignItems: "center",
                paddingLeft: "12px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#94A3B8",
              }}
            >
              🎬 Scene B
            </div>
          </div>
        </div>

        {/* Audio Track A1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            position: "relative",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#A1A1AA", width: "22px" }}>
            A1
          </span>
          <div
            style={{
              flex: 1,
              height: "46px",
              display: "flex",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #3F3F46",
              position: "relative",
            }}
          >
            {/* Audio Waveform Clip 1 (Gold) */}
            <div
              style={{
                width: cutType === "j-cut" ? "52%" : "72%",
                height: "100%",
                backgroundColor: "#78350F",
                backgroundImage: `repeating-linear-gradient(90deg, ${waveformGoldColor} 0px, ${waveformGoldColor} 3px, transparent 3px, transparent 6px)`,
                opacity: 0.9,
              }}
            />
            {/* Audio Waveform Clip 2 (Cyan) - J-Cut starts EARLIER than video cut! */}
            <div
              style={{
                width: cutType === "j-cut" ? "48%" : "28%",
                height: "100%",
                backgroundColor: "#0E7490",
                backgroundImage: `repeating-linear-gradient(90deg, ${waveformCyanColor} 0px, ${waveformCyanColor} 3px, transparent 3px, transparent 6px)`,
                opacity: 0.9,
              }}
            />

            {/* Glowing J-Curve Overlay Highlight */}
            {cutType === "j-cut" && (
              <div
                style={{
                  position: "absolute",
                  left: "52%",
                  top: "-52px",
                  height: "100px",
                  width: "40px",
                  pointerEvents: "none",
                }}
              >
                {/* Custom SVG J-Hook */}
                <svg width="40" height="100" viewBox="0 0 40 100" fill="none">
                  <path
                    d="M 28 0 V 78 C 28 92, 10 92, 6 82"
                    stroke={accentRedColor}
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0 0 8px ${accentRedColor})`,
                      opacity: jCurveGlow,
                    }}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Signature Italic Serif "J-cut" Script Label ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 25,
          opacity: labelEntrance,
          transform: `translateY(${interpolate(labelEntrance, [0, 1], [25, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', 'Newsreader', Georgia, serif",
            fontStyle: "italic",
            fontSize: "64px",
            fontWeight: 800,
            color: accentRedColor,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textShadow: `0 4px 20px ${accentRedColor}33`,
            margin: "0 0 6px 0",
          }}
        >
          {cutType === "j-cut" ? "J-cut" : "L-cut"}
        </span>

        {/* Explainer Pill Subtitle */}
        <div
          style={{
            padding: "8px 22px",
            borderRadius: "999px",
            background: isWarmTheme ? "rgba(24, 24, 27, 0.06)" : "rgba(255, 255, 255, 0.08)",
            border: `1px solid ${isWarmTheme ? "rgba(24, 24, 27, 0.12)" : "rgba(255, 255, 255, 0.15)"}`,
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: isWarmTheme ? "#52525B" : "#CBD5E1",
              letterSpacing: "0.02em",
            }}
          >
            {explainerText}
          </span>
        </div>
      </div>
    </div>
  );
};
