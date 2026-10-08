"use client";

import React from "react";

export interface AnimatedBeamProps {
  className?: string;
  fromRef?: React.RefObject<HTMLDivElement | null>;
  toRef?: React.RefObject<HTMLDivElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeam({
  className = "",
  duration = 3,
  delay = 0,
  pathColor = "rgba(255, 255, 255, 0.15)",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#FF6D00",
  gradientStopColor = "#FFA726",
}: AnimatedBeamProps) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full stroke-2 ${className}`}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop stopColor={gradientStopColor} />
          <stop stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 20 20 Q 150 10 280 20"
        fill="none"
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
      />
      <path
        d="M 20 20 Q 150 10 280 20"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
