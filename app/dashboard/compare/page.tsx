"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ComparePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/compare-explainer");
  }, [router]);

  return null;
}
