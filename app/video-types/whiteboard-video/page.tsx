import type { Metadata } from "next";
import WhiteboardVideoDetail from "./WhiteboardVideoDetail";

export const metadata: Metadata = {
  title: "AI Whiteboard Explainer Video Generator (9:16 Reels) | Itnavideo",
  description: "Transform voiceover & lectures into high-retention 9:16 whiteboard videos. Spoken yellow highlighter, vector doodle icons, Urdu Nastaliq & Hindi support.",
  alternates: { canonical: "/whiteboard-video" },
};

export default function WhiteboardVideoPage() {
  return <WhiteboardVideoDetail />;
}
