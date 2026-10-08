"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ImageToVideoAiPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/image-to-video");
  }, [router]);

  return null;
}
