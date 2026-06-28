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
  return <>{children}</>;
}
