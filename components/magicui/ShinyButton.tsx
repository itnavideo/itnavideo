"use client";

import React from "react";

export interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ShinyButton({
  children,
  className = "",
  type = "button",
  ...props
}: ShinyButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-6 py-3 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition-all hover:brightness-110 active:scale-95 cursor-pointer group ${className}`}
    >
      {/* Shimmer Light Beam Overlay */}
      <span
        className="absolute inset-0 block -translate-x-full animate-shiny-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all group-hover:animate-none"
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
