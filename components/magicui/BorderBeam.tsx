"use client";

import React from "react";

export interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className = "",
  size = 200,
  duration = 10,
  borderWidth = 1.5,
  colorFrom = "#FF6D00",
  colorTo = "#FFA726",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--anchor": "90deg",
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width))_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size))] after:animate-border-beam after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:100%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)))] ${className}`}
    />
  );
}
