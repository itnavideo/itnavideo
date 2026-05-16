import React from 'react';
import { Briefcase, GraduationCap, Megaphone, ShoppingBag, UserRound } from 'lucide-react';

const audiences = [
  { label: 'Shorts creators', icon: UserRound },
  { label: 'Course educators', icon: GraduationCap },
  { label: 'Agencies', icon: Briefcase },
  { label: 'E-commerce brands', icon: ShoppingBag },
  { label: 'Social media teams', icon: Megaphone },
];

export default function BrandWall() {
  return (
    <section className="border-y border-white/8 bg-[#080809] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Built for people who publish often
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {audiences.map((audience) => {
              const Icon = audience.icon;

              return (
                <div
                  key={audience.label}
                  className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-300"
                >
                  <Icon size={16} className="text-emerald-300" />
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

