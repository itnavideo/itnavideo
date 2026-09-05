import React from 'react';
import { Briefcase, GraduationCap, Megaphone, ShoppingBag, UserRound, Sparkles } from 'lucide-react';

const audiences = [
  { label: 'Shorts creators', icon: UserRound },
  { label: 'Course educators', icon: GraduationCap },
  { label: 'Agencies', icon: Briefcase },
  { label: 'E-commerce brands', icon: ShoppingBag },
  { label: 'Social media teams', icon: Megaphone },
];

export default function BrandWall() {
  return (
    <section className="border-t border-slate-900 bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-xs font-bold uppercase tracking-[0.25em] text-slate-500 flex items-center gap-2">
            <Sparkles size={12} className="text-amber-500 animate-pulse" />
            <span>Built for people who publish often</span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {audiences.map((audience) => {
              const Icon = audience.icon;

              return (
                <div
                  key={audience.label}
                  className="flex items-center gap-2.5 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-xs font-bold text-muted-foreground backdrop-blur-md"
                >
                  <Icon size={14} className="text-amber-500 dark:text-amber-400" />
                  <span>{audience.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

