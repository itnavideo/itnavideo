import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Itnavideo",
  description: "Create AI-powered reels from your video, audio, or images.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="dark bg-[#07090E] text-zinc-100 min-h-screen selection:bg-amber-500/30 selection:text-amber-200">{children}</div>;
}
