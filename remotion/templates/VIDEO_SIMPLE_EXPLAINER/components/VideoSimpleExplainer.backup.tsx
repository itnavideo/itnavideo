import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type AnyCaption = {
  start?: number;
  end?: number;
  text?: string;
  word?: string;
};

export type VideoSimpleExplainerProps = {
  title?: string;
  mediaSrc?: string;
  mediaType?: string;
  audioSrc?: string;
  explanationImageUrl?: string;
  bottomImageUrl?: string;
  captions?: AnyCaption[];
  words?: AnyCaption[];
  transcriptWords?: AnyCaption[];
  wordTimestamps?: AnyCaption[];
};

const cleanText = (value: string) => {
  return value
    .replace(/\s+/g, " ")
    .replace(/\buh\b|\bum\b|\ber\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getWords = (props: VideoSimpleExplainerProps): AnyCaption[] => {
  const possible =
    props.wordTimestamps ||
    props.transcriptWords ||
    props.words ||
    props.captions ||
    [];

  return Array.isArray(possible) ? possible : [];
};

const getActiveSubtitle = (words: AnyCaption[], currentTime: number) => {
  if (!words.length) return "";

  const activeIndex = words.findIndex((item) => {
    const start = Number(item.start ?? 0);
    const end = Number(item.end ?? start + 0.6);
    return currentTime >= start && currentTime <= end + 0.25;
  });

  if (activeIndex >= 0) {
    const from = Math.max(0, activeIndex - 3);
    const to = Math.min(words.length, activeIndex + 6);
    const line = words
      .slice(from, to)
      .map((item) => item.word || item.text || "")
      .join(" ");

    return cleanText(line);
  }

  const activeChunk = words.find((item) => {
    const start = Number(item.start ?? 0);
    const end = Number(item.end ?? start + 2);
    return currentTime >= start && currentTime <= end;
  });

  if (activeChunk?.text) {
    return cleanText(activeChunk.text).split(" ").slice(0, 9).join(" ");
  }

  return "";
};

const getShortTitle = (title?: string) => {
  const value = cleanText(title || "AI Video Explained");
  if (value.length <= 34) return value;
  return `${value.slice(0, 31).trim()}...`;
};

const getKeyword = (subtitle: string) => {
  const words = subtitle
    .split(" ")
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""))
    .filter((w) => w.length >= 4);

  return words.slice(0, 3).join(" ") || "Key Point";
};

export function VideoSimpleExplainer(props: VideoSimpleExplainerProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const currentTime = frame / fps;
  const words = getWords(props);
  const subtitle = getActiveSubtitle(words, currentTime);
  const title = getShortTitle(props.title);

  const bottomImage = props.explanationImageUrl || props.bottomImageUrl;
  const mediaSrc = props.mediaSrc;
  const audioSrc = props.audioSrc;

  const isVideo = props.mediaType === "video" || Boolean(mediaSrc);

  const bottomProgress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const bottomScale = interpolate(bottomProgress, [0, 1], [1.04, 1.13]);
  const bottomTranslateY = interpolate(bottomProgress, [0, 1], [0, -28]);

  return (
    <AbsoluteFill style={{backgroundColor: "#050506", fontFamily: "Inter, Arial, sans-serif"}}>
      {audioSrc && !isVideo ? <Audio src={audioSrc} /> : null}

      {/* Top uploaded video */}
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 54,
          width: 1028,
          height: 578,
          borderRadius: 34,
          overflow: "hidden",
          border: "4px solid rgba(255,255,255,0.95)",
          boxShadow: "0 26px 80px rgba(0,0,0,0.55)",
          backgroundColor: "#111",
        }}
      >
        {mediaSrc ? (
          isVideo ? (
            <OffthreadVideo
              src={mediaSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          ) : (
            <Audio src={mediaSrc} />
          )
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            Uploaded Video
          </div>
        )}
      </div>

      {/* Subtitle strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 668,
          width: 1080,
          height: 132,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 54px",
          textAlign: "center",
          background:
            "linear-gradient(90deg, #5667ff 0%, #8964ff 48%, #ff5fb7 100%)",
          borderTop: "6px solid #fff24a",
          borderBottom: "6px solid #fff24a",
          color: "white",
          fontSize: 48,
          lineHeight: 1.08,
          fontWeight: 950,
          letterSpacing: "-1.3px",
          textShadow: "0 4px 14px rgba(0,0,0,0.35)",
        }}
      >
        {subtitle || "Your subtitle appears here"}
      </div>

      {/* Dynamic title strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 800,
          width: 1080,
          height: 106,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 44px",
          background: "#050506",
          color: "#ffffff",
          borderBottom: "2px solid rgba(255,255,255,0.14)",
          fontSize: 38,
          fontWeight: 950,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {title}
      </div>

      {/* Bottom image full section */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 906,
          width: 1080,
          height: 1014,
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {bottomImage ? (
          <Img
            src={bottomImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: `scale(${bottomScale}) translateY(${bottomTranslateY}px)`,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(circle at center, rgba(46,213,189,0.22), rgba(0,0,0,1) 68%)",
            }}
          />
        )}

        {/* readability overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.62) 100%)",
          }}
        />

        {/* keyword callout */}
        <div
          style={{
            position: "absolute",
            left: 46,
            bottom: 76,
            maxWidth: 820,
            padding: "24px 34px",
            borderRadius: 28,
            background: "rgba(0,0,0,0.78)",
            border: "2px solid rgba(255,255,255,0.22)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              color: "#fff24a",
              fontSize: 25,
              fontWeight: 950,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Key Point
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: 44,
              lineHeight: 1.05,
              fontWeight: 950,
              letterSpacing: "-0.8px",
              textTransform: "uppercase",
            }}
          >
            {getKeyword(subtitle)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export default VideoSimpleExplainer;
