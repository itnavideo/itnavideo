"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function YouTubeSubtitleGeneratorPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/youtube-subtitles");
  }, [router]);

  return null;
}
