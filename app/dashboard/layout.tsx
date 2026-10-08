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
  return <div className="bg-[#F8FAFC] text-slate-900 min-h-screen selection:bg-[#FF6D00]/20 selection:text-[#FF6D00]">{children}</div>;
}
