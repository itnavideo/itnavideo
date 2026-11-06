import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface BlogKeyTakeawaysProps {
  takeaways?: string[];
  summary?: string;
}

export function BlogKeyTakeaways({ takeaways, summary }: BlogKeyTakeawaysProps) {
  const hasItems = Array.isArray(takeaways) && takeaways.length > 0;
  if (!hasItems && !summary) return null;

  return (
    <aside className="my-8 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-50/60 via-[#FFFBF9] to-amber-50/30 p-5 sm:p-6 shadow-xs select-none">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-[#FF5722]">
          <Lightbulb size={16} />
        </div>
        <span className="font-sans text-xs font-black uppercase tracking-wider text-orange-950">
          Key Takeaways (TL;DR)
        </span>
      </div>

      {summary && (
        <p className="font-sans text-sm sm:text-[15px] font-medium leading-relaxed text-slate-700 mb-3">
          {summary}
        </p>
      )}

      {hasItems && (
        <ul className="space-y-2.5 mt-2 font-sans text-xs sm:text-sm text-slate-800">
          {takeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-snug">
              <CheckCircle2 size={15} className="text-[#FF5722] mt-0.5 shrink-0" />
              <span className="font-medium text-slate-800">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

