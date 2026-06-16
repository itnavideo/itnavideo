import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type SubtitleChunk = {
  start: number;
  end: number;
  text: string;
  highlight?: string;
};

type WordTimestamp = {
  word?: string;
  text?: string;
  start?: number;
  end?: number;
};

type AutoCaptionReelProps = {
  videoSrc?: string;
  mediaSrc?: string;
  mediaUrl?: string;
  captionStyle?: "clean" | "yellowPop" | "blackBox";
  captionPosition?: "bottom" | "center" | "top";
  textColor?: string;
  highlightColor?: string;
  fontSize?: "small" | "medium" | "large";
  subtitleChunks?: SubtitleChunk[];
  captions?: SubtitleChunk[];
  wordTimestamps?: WordTimestamp[];
  words?: WordTimestamp[];
};

const cleanText = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\b(uh|um|er|ah|hmm|matlab|dekho|basically|actually)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const wordsToChunks = (words: WordTimestamp[]): SubtitleChunk[] => {
  const usable = words
    .map((item) => ({
      word: cleanText(String(item.word || item.text || "")),
      start: Number(item.start || 0),
      end: Number(item.end || item.start || 0),
    }))
    .filter((item) => item.word && Number.isFinite(item.start));

  const chunks: SubtitleChunk[] = [];
  for (let i = 0; i < usable.length; i += 6) {
    const group = usable.slice(i, i + 6);
    if (!group.length) continue;

    chunks.push({
      start: group[0].start,
      end: group[group.length - 1].end || group[0].start + 2,
      text: cleanText(group.map((item) => item.word).join(" ")),
    });
  }

  return chunks;
};

const getSubtitleChunks = (props: AutoCaptionReelProps): SubtitleChunk[] => {
  const direct = props.subtitleChunks?.length ? props.subtitleChunks : props.captions;
  if (direct?.length) {
    return direct
      .map((item) => ({
        start: Number(item.start || 0),
        end: Number(item.end || item.start || 0),
        text: cleanText(String(item.text || "")),
        highlight: item.highlight,
      }))
      .filter((item) => item.text);
  }

  return wordsToChunks(props.wordTimestamps?.length ? props.wordTimestamps : props.words || []);
};

const getActiveSubtitle = (chunks: SubtitleChunk[], currentTime: number) => {
  return chunks.find((item) => currentTime >= item.start && currentTime <= item.end);
};

const getPositionStyle = (position?: string) => {
  if (position === "top") return {top: 170};
  if (position === "center") return {top: 820};
  return {bottom: 230};
};

const getFontSize = (size?: string) => {
  if (size === "small") return 48;
  if (size === "large") return 72;
  return 60;
};

function CaptionBox({
  chunk,
  styleName,
  position,
  textColor,
  highlightColor,
  fontSize,
}: {
  chunk?: SubtitleChunk;
  styleName?: string;
  position?: string;
  textColor?: string;
  highlightColor?: string;
  fontSize?: string;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (!chunk?.text) return null;

  const currentTime = frame / fps;
  const localProgress = Math.max(0, Math.min(1, (currentTime - chunk.start) / Math.max(0.1, chunk.end - chunk.start)));
  const scale = interpolate(localProgress, [0, 0.14, 1], [0.92, 1, 1], {extrapolateRight: "clamp"});
  const opacity = interpolate(localProgress, [0, 0.08, 1], [0, 1, 1], {extrapolateRight: "clamp"});

  const baseFontSize = getFontSize(fontSize);
  const resolvedTextColor = textColor || "#ffffff";
  const resolvedHighlightColor = highlightColor || "#facc15";
  const positionStyle = getPositionStyle(position);

  if (styleName === "blackBox") {
    return (
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          ...positionStyle,
          display: "flex",
          justifyContent: "center",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            maxWidth: 920,
            borderRadius: 28,
            background: "rgba(0,0,0,0.78)",
            border: "2px solid rgba(255,255,255,0.16)",
            padding: "22px 34px",
            color: resolvedTextColor,
            fontSize: baseFontSize,
            lineHeight: 1.08,
            fontWeight: 950,
            textAlign: "center",
            letterSpacing: "-1px",
            textShadow: "0 4px 16px rgba(0,0,0,0.8)",
          }}
        >
          {chunk.text}
        </div>
      </div>
    );
  }

  if (styleName === "clean") {
    return (
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          ...positionStyle,
          color: resolvedTextColor,
          fontSize: baseFontSize,
          lineHeight: 1.06,
          fontWeight: 950,
          textAlign: "center",
          letterSpacing: "-1px",
          WebkitTextStroke: "8px rgba(0,0,0,0.62)",
          paintOrder: "stroke fill",
          textShadow: "0 5px 18px rgba(0,0,0,0.85)",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {chunk.text}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        ...positionStyle,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          maxWidth: 940,
          color: resolvedTextColor,
          fontSize: baseFontSize,
          lineHeight: 1.06,
          fontWeight: 1000,
          textAlign: "center",
          letterSpacing: "-1.2px",
          textShadow: "0 5px 18px rgba(0,0,0,0.85)",
          WebkitTextStroke: "7px rgba(0,0,0,0.62)",
          paintOrder: "stroke fill",
        }}
      >
        <span
          style={{
            color: resolvedHighlightColor,
          }}
        >
          {chunk.text.split(" ").slice(0, 2).join(" ")}
        </span>
        {chunk.text.split(" ").length > 2 ? ` ${chunk.text.split(" ").slice(2).join(" ")}` : ""}
      </div>
    </div>
  );
}

export function AutoCaptionReel(props: AutoCaptionReelProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTime = frame / fps;

  const videoSrc = props.videoSrc || props.mediaSrc || props.mediaUrl || "";
  const chunks = getSubtitleChunks(props);
  const activeSubtitle = getActiveSubtitle(chunks, currentTime);

  return (
    <AbsoluteFill style={{backgroundColor: "#000000"}}>
      {videoSrc ? (
        <OffthreadVideo
          src={videoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 44,
            fontWeight: 900,
          }}
        >
          Upload a reel to add captions
        </AbsoluteFill>
      )}

      <CaptionBox
        chunk={activeSubtitle}
        fontSize={props.fontSize}
        highlightColor={props.highlightColor}
        position={props.captionPosition}
        styleName={props.captionStyle || "yellowPop"}
        textColor={props.textColor}
      />
    </AbsoluteFill>
  );
}

export const AutoCaptionReelComposition = () => (
  <Composition
    component={AutoCaptionReel}
    defaultProps={{
      captionPosition: "bottom",
      captionStyle: "yellowPop",
      fontSize: "medium",
      highlightColor: "#facc15",
      subtitleChunks: [
        {start: 0.2, end: 2.4, text: "Fresh graduates apply kar sakte hain"},
        {start: 2.4, end: 4.8, text: "Isme forms process karne hote hain"},
        {start: 4.8, end: 7.2, text: "Salary aur growth stable hoti hai"},
      ],
      textColor: "#ffffff",
      videoSrc: "",
    }}
    durationInFrames={1800}
    fps={30}
    height={1920}
    id="AUTO-CAPTION-REEL"
    width={1080}
  />
);

