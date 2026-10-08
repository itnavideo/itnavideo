"use client";

import React, { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div
      className={`grid w-full auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

export interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
  onClick?: () => void;
}

export function BentoCard({
  name,
  className = "",
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
}: BentoCardProps) {
  return (
    <div
      key={name}
      onClick={onClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0E1526]/90 p-6 transition-all duration-300 hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15 hover:-translate-y-1 cursor-pointer ${className}`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 transition-opacity group-hover:opacity-100">
        {background}
      </div>

      <div className="pointer-events-none z-10 flex flex-col gap-2">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF8F00] border border-[#FF6D00]/20 group-hover:scale-110 transition-transform">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
          {name}
        </h3>
        <p className="max-w-xs text-xs font-medium text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {cta && (
        <div className="pointer-events-none z-10 flex items-center gap-1.5 text-xs font-black text-[#FF8F00] group-hover:text-[#FF6D00] transition-colors">
          <span>{cta}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );
}
