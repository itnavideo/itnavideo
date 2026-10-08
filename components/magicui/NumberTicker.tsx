"use client";

import React, { useEffect, useState } from "react";

export interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  className = "",
  delay = 0,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(direction === "up" ? 0 : value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s smooth ticker
    const startVal = direction === "up" ? 0 : value;
    const endVal = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      const current = startVal + (endVal - startVal) * easeOutQuad(progress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, direction, delay]);

  return (
    <span className={`inline-block tabular-nums tracking-tight ${className}`}>
      {displayValue.toFixed(decimalPlaces)}
    </span>
  );
}
