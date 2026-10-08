"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AiAudioCleanerPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/audio-cleaner");
  }, [router]);

  return null;
}
