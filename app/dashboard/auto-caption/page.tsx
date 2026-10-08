export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AutoCaptionPageClient from "@/components/dashboard/subpages/AutoCaptionPageClient";
import { Loader2 } from "lucide-react";

function AutoCaptionLoading() {
  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center gap-3">
      <Loader2 className="h-7 w-7 animate-spin text-[#FF6D00]" />
      <span className="text-sm font-semibold text-slate-400">Loading Auto Caption Studio...</span>
    </div>
  );
}

export default function AutoCaptionPage() {
  return (
    <Suspense fallback={<AutoCaptionLoading />}>
      <AutoCaptionPageClient />
    </Suspense>
  );
}
