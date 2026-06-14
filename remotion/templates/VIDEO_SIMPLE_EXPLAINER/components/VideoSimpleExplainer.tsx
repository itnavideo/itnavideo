import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Caption = {
  start: number;
  end: number;
  text: string;
};

type Props = {
  title?: string;
  topicTitle?: string;
  mediaSrc?: string;
  mediaType?: "video" | "audio" | "image";
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  explanationImageUrl?: string;
  bottomImageUrl?: string;
  captions?: Caption[];
};

const W = 1080;
const H = 1920;
const SIDE = 54;

const VIDEO_TOP = 54;
const VIDEO_W = W - SIDE * 2;
const VIDEO_H = Math.round(VIDEO_W * 9 / 16);

const SUBTITLE_TOP = VIDEO_TOP + VIDEO_H + 24;
const SUBTITLE_H = 116;

const TITLE_TOP = SUBTITLE_TOP + SUBTITLE_H + 22;
const TITLE_H = 120;

const IMAGE_TOP = TITLE_TOP + TITLE_H + 28;
const IMAGE_H = H - IMAGE_TOP - 70;

function cleanText(value?: string, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function activeCaption(captions: Caption[], time: number) {
  return captions.find((item) => time >= item.start && time <= item.end) || captions[0];
}

export const VideoSimpleExplainer: React.FC<Props> = ({
  title,
  topicTitle,
  mediaSrc,
  mediaType = "video",
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  explanationImageUrl,
  bottomImageUrl,
  captions = [],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const caption = activeCaption(captions, time);
  const safeTitle = cleanText(title || topicTitle, "VIDEO EXPLAINED").toUpperCase();
  const bottomSrc = explanationImageUrl || bottomImageUrl;

  return (
    <AbsoluteFill style={{backgroundColor: "#05070b", fontFamily: "Inter, Arial, sans-serif", color: "white"}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(45,212,191,0.18), transparent 34%), linear-gradient(180deg,#071014 0%,#05070b 48%,#030406 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: SIDE,
          top: VIDEO_TOP,
          width: VIDEO_W,
          height: VIDEO_H,
          borderRadius: 34,
          overflow: "hidden",
          backgroundColor: "#020617",
          border: "2px solid rgba(255,255,255,0.16)",
          boxShadow: "0 28px 80px rgba(0,0,0,0.55), 0 0 45px rgba(45,212,191,0.12)",
        }}
      >
        {mediaSrc && mediaType === "video" ? (
          <OffthreadVideo
            src={mediaSrc}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            volume={sourceAudioVolume}
            style={{width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#000"}}
          />
        ) : mediaSrc && mediaType === "audio" ? (
          <Audio src={mediaSrc} startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))} volume={sourceAudioVolume} />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 34,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: SIDE,
          top: SUBTITLE_TOP,
          width: VIDEO_W,
          height: SUBTITLE_H,
          borderRadius: 28,
          background: "linear-gradient(90deg, rgba(37,99,235,0.95), rgba(168,85,247,0.95), rgba(236,72,153,0.95))",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 42px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 42,
            lineHeight: 1.14,
            fontWeight: 950,
            letterSpacing: "-0.02em",
            textShadow: "0 3px 18px rgba(0,0,0,0.35)",
          }}
        >
          {cleanText(caption?.text, "Real speech captions appear here")}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: SIDE,
          top: TITLE_TOP,
          width: VIDEO_W,
          height: TITLE_H,
          borderRadius: 30,
          background: "rgba(255,255,255,0.075)",
          border: "1px solid rgba(255,255,255,0.13)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 44px",
          textAlign: "center",
          boxShadow: "0 22px 55px rgba(0,0,0,0.32)",
        }}
      >
        <div style={{fontSize: 48, lineHeight: 1.04, fontWeight: 1000, letterSpacing: "-0.035em"}}>
          {safeTitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: SIDE,
          top: IMAGE_TOP,
          width: VIDEO_W,
          height: IMAGE_H,
          borderRadius: 36,
          overflow: "hidden",
          background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))",
          border: "2px solid rgba(255,255,255,0.14)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.52)",
        }}
      >
        {bottomSrc ? (
          <Img
            src={bottomSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "#071014",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 60,
              textAlign: "center",
              fontSize: 42,
              fontWeight: 900,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Upload one bottom explanation image
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
