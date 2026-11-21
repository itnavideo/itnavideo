import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface LuxuryEditorialCaptionAssetProps {
  prefixText?: string;
  heroWord?: string;
  profileHandle?: string;
  profileTitle?: string;
  followerCount?: string;
  profileAvatarUrl?: string;
  textColor?: string;
  showProfileCard?: boolean;
  isOverlayMode?: boolean;
}

export const LuxuryEditorialCaptionAsset: React.FC<LuxuryEditorialCaptionAssetProps> = ({
  prefixText = "this is",
  heroWord = "Emily",
  profileHandle = "@emilyemig",
  profileTitle = "Emily Emig | OC Realtor + Creator",
  followerCount = "58.2K",
  profileAvatarUrl,
  textColor = "#FFFFFF",
  showProfileCard = true,
  isOverlayMode = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for floating 3D profile card
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Entrance spring for typography burst
  const textEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Floating gentle motion
  const floatOffset = Math.sin(frame / 15) * 4;

  // Active scale pulse on hero word
  const heroPulse = 1 + Math.sin(frame / 12) * 0.03;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "140px 36px 210px 36px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isOverlayMode ? "transparent" : "#1A1A1E",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── UPPER STAGE: Floating 3D Instagram Profile Card (Vault Visuals Style) ── */}
      {showProfileCard && (
        <div
          style={{
            zIndex: 15,
            opacity: cardEntrance,
            transform: `translateY(${interpolate(cardEntrance, [0, 1], [-40, 0]) + floatOffset}px) perspective(900px) rotateX(12deg) rotateY(-6deg)`,
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 25px 40px rgba(0, 0, 0, 0.45))",
          }}
        >
          <div
            style={{
              width: "320px",
              background: "rgba(18, 18, 22, 0.88)",
              borderRadius: "26px",
              border: "1.5px solid rgba(255, 255, 255, 0.15)",
              padding: "20px 22px",
              boxSizing: "border-box",
              backdropFilter: "blur(20px)",
              color: "#FFFFFF",
            }}
          >
            {/* Top Bar: Handle & Notification Bell */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                {profileHandle.replace("@", "")}
              </span>
              <span style={{ fontSize: "14px" }}>🔔</span>
            </div>

            {/* Profile Avatar & Stats */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "12px",
              }}
            >
              {/* Circular Story Avatar */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  padding: "2.5px",
                  background: "linear-gradient(45deg, #F59E0B, #EC4899, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "#27272A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    overflow: "hidden",
                  }}
                >
                  {profileAvatarUrl ? (
                    <img
                      src={profileAvatarUrl}
                      alt="Avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    "👩"
                  )}
                </div>
              </div>

              {/* Stats: Posts, Followers, Following */}
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  textAlign: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 800, display: "block" }}>
                    1,137
                  </span>
                  <span style={{ fontSize: "10px", color: "#A1A1AA" }}>posts</span>
                </div>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 800, display: "block" }}>
                    {followerCount}
                  </span>
                  <span style={{ fontSize: "10px", color: "#A1A1AA" }}>followers</span>
                </div>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 800, display: "block" }}>
                    1,332
                  </span>
                  <span style={{ fontSize: "10px", color: "#A1A1AA" }}>following</span>
                </div>
              </div>
            </div>

            {/* Bio Title & Profession */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700 }}>{profileTitle}</span>
              <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                luxury coastal living • home inspo
              </span>
            </div>

            {/* Follow Button */}
            <div
              style={{
                marginTop: "12px",
                width: "100%",
                height: "30px",
                borderRadius: "8px",
                background: "#3B82F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              Follow
            </div>
          </div>
        </div>
      )}

      {/* ── LOWER STAGE: High-Contrast Luxury Swash Serif Kinetic Typography ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 25,
          opacity: textEntrance,
          transform: `translateY(${interpolate(textEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        {/* Line 1: Clean, delicate lowercase prefix word */}
        <span
          style={{
            fontSize: "36px",
            fontWeight: 600,
            color: textColor,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            textShadow: "0 4px 16px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)",
            marginBottom: "-8px",
          }}
        >
          {prefixText}
        </span>

        {/* Line 2: Giant Luxury Italic Swash Serif Hero Word */}
        <span
          style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', Georgia, serif",
            fontStyle: "italic",
            fontSize: "108px",
            fontWeight: 800,
            color: textColor,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textShadow:
              "0 8px 30px rgba(0, 0, 0, 0.9), 0 3px 10px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.95)",
            transform: `scale(${heroPulse})`,
            display: "inline-block",
            transformOrigin: "center center",
          }}
        >
          {heroWord}
        </span>
      </div>
    </div>
  );
};
