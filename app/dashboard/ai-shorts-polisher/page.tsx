export const dynamic = "force-dynamic";

import AiShortsPolisherPageClient from "@/components/dashboard/subpages/AiShortsPolisherPageClient";

export const metadata = {
  title: "AI Shorts Polisher — Auto Jump-Cuts, Dynamic Zoom & PIP | Itnavideo",
  description:
    "Transform raw smartphone and vertical shoots into polished 9:16 viral shorts with automatic silence removal, +12% dynamic camera punch-ins, and multi-layer picture-in-picture graphics.",
};

export default function AiShortsPolisherPage() {
  return <AiShortsPolisherPageClient />;
}

