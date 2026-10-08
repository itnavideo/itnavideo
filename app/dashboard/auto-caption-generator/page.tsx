"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoCaptionGeneratorPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/auto-caption");
  }, [router]);

  return null;
}
