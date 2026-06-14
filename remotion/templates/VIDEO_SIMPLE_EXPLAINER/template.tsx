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
  explanationImageUrl: "",
  bottomImageUrl: "",
  captions: [
    {start: 0, end: 3, text: "Real speech captions appear here"},
    {start: 3, end: 6, text: "Upload video, title, and one image"},
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
