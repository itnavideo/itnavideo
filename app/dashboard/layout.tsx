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
  return <div className="bg-[#070B14] text-white min-h-screen selection:bg-[#0066FF]/25 selection:text-[#3B82F6]">{children}</div>;
}
