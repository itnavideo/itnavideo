export const dynamic = "force-dynamic";

import { Suspense } from "react";
import KineticMotionPageClient from "@/components/dashboard/subpages/KineticMotionPageClient";
import { Loader2 } from "lucide-react";

function KMLoading() {
  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center gap-3">
      <Loader2 className="h-7 w-7 animate-spin text-[#FF6D00]" />
      <span className="text-sm font-semibold text-slate-400">Loading Kinetic Motion Studio...</span>
    </div>
  );
}

export default function KineticMotionPage() {
  return (
    <Suspense fallback={<KMLoading />}>
      <KineticMotionPageClient />
    </Suspense>
  );
}
