import UploadBox from "@/components/dashboard/UploadBox";
import { AudioLines, Camera, Gauge, Video } from "lucide-react";

export const metadata = {
  title: "Create 720p Video | Itnavideo",
  description: "Create faceless videos from audio or face-camera Shorts from uploaded video.",
};

export default function CreatePage() {
  return (
    <main className="brand-surface min-h-screen px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Create Shorts</p>
          <h1 className="text-5xl font-black leading-tight md:text-6xl">Create a stable 720p short from audio or camera video.</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Use the dashboard to choose faceless video or face camera video, upload the required source, and track live progress.
          </p>
        </div>

        <UploadBox />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Feature icon={AudioLines} title="Faceless mode" body="MP3, WAV, or M4A narration with optional visuals." />
          <Feature icon={Camera} title="Face camera mode" body="Upload one talking-head video for automatic editing." />
          <Feature icon={Gauge} title="Fast pipeline" body="Planning and rendering start in the background." />
          <Feature icon={Video} title="720p MP4" body="Portrait output for Reels, Shorts, and TikTok." />
        </div>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, title, body }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-5">
      <Icon className="mb-4 text-brand-mint" size={22} />
      <p className="font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
    </div>
  );
}
