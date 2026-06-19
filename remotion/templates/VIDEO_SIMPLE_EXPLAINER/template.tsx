import React from "react";
import {Composition} from "remotion";
import {VideoSimpleExplainer} from "./components/VideoSimpleExplainer";

export const TEMPLATE_NAME = "VIDEO_SIMPLE_EXPLAINER";
export const COMPOSITION_ID = "VIDEO-SIMPLE-EXPLAINER";

const defaultProps = {
  title: "VIDEO EXPLAINED",
  topicTitle: "VIDEO EXPLAINED",
  mediaType: "video",
  mediaSrc: "",
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  bottomImages: [
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop"
  ],
  captions: [
    {start: 0, end: 3, text: "Real speech captions appear here"},
    {start: 3, end: 6, text: "Upload video, title, and multiple images"},
  ],
};

export const VideoSimpleExplainerComposition = () => (
  <Composition
    id={COMPOSITION_ID}
    component={VideoSimpleExplainer}
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const durationSeconds = Math.max(8, Math.min(60, Number((props as any).sourceDurationSeconds) || 60));
      return {
        durationInFrames: Math.ceil(durationSeconds * 30),
        fps: 30,
        width: 1080,
        height: 1920,
      };
    }}
  />
);
