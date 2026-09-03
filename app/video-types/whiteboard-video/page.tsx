import type { Metadata } from "next";
import WhiteboardVideoDetail from "./WhiteboardVideoDetail";

export const metadata: Metadata = {
  title: "Whiteboard AI Video Generator — Educational Notes & Reels | Itnavideo",
  description: "Generate animated whiteboard explainer videos from speech with our AI video maker. Perfect for teachers, courses, and summary reels.",
  alternates: { canonical: "/whiteboard-video" },
};

export default function WhiteboardVideoPage() {
  return <WhiteboardVideoDetail />;
}
