import UploadBox from "@/components/dashboard/UploadBox";
import { AudioLines, Gauge, PauseCircle, Video } from "lucide-react";

export const metadata = {
  title: "Create 720p Video | Itnavideo",
  description: "Create MVP-ready 720p typography videos from voiceover audio.",
};

export default function CreatePage() {
  return (
    <main className="brand-surface min-h-screen px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Create Shorts</p>
          <h1 className="text-5xl font-black leading-tight md:text-6xl">Create a stable 720p short from voiceover audio.</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Upload one clear audio file, choose the style, and track live progress while Itnavideo generates a typography-first MVP video.
          </p>
        </div>

        <UploadBox />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Feature icon={AudioLines} title="Audio-only mode" body="MP3, WAV, or M4A narration starts the render." />
          <Feature icon={PauseCircle} title="Media paused" body="Images, screenshots, clips, and camera uploads return after MVP stabilization." />
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
