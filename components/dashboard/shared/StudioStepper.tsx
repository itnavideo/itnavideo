"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";

/**
 * StudioStepper — Flexible multi-step progress indicator for all Itnavideo studios.
 *
 * Accepts ANY number of steps — 2, 3, 4, 5, 6, 7, 8 or more.
 * No upper limit. The stepper scrolls horizontally on mobile when steps exceed ~5.
 * Replaces the per-studio hardcoded `useState<1 | 2 | 3 | 4>` pattern with a fully
 * generic `useState<number>` system. Add or remove steps by editing the studio's
 * STEPS array — the component adapts automatically.
 */

export interface StepDefinition {
  step: number;
  title: string;
  desc?: string;
  /** Optional icon to show instead of the step number when upcoming */
  icon?: React.ReactNode;
}

export interface StudioStepperProps {
  steps: StepDefinition[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  /** Allow clicking future (incomplete) steps. Default: false */
  allowJumpAhead?: boolean;
  className?: string;
}

export function StudioStepper({
  steps,
  currentStep,
  onStepClick,
  allowJumpAhead = false,
  className = "",
}: StudioStepperProps) {
  const totalSteps = steps.length;

  const handleClick = (step: number) => {
    if (!onStepClick) return;
    const isCompleted = step < currentStep;
    const isActive = step === currentStep;
    const isFuture = step > currentStep;
    if (isCompleted || isActive || (isFuture && allowJumpAhead)) {
      onStepClick(step);
    }
  };

  return (
    <div
      className={`flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none ${className}`}
      role="tablist"
      aria-label="Studio steps"
    >
      {steps.map((s, idx) => {
        const isActive = currentStep === s.step;
        const isCompleted = currentStep > s.step;
        const isFuture = currentStep < s.step;
        const isClickable = isCompleted || isActive || allowJumpAhead;
        const isLast = idx === totalSteps - 1;

        return (
          <React.Fragment key={s.step}>
            {/* Step button */}
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Step ${s.step}: ${s.title}${s.desc ? ` — ${s.desc}` : ""}`}
              disabled={!isClickable}
              onClick={() => handleClick(s.step)}
              className={[
                "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0",
                "outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1",
                isClickable ? "cursor-pointer" : "cursor-default",
                isActive
                  ? "bg-white text-orange-600 shadow-sm border border-orange-200/70 ring-1 ring-orange-400/25"
                  : isCompleted
                  ? "text-emerald-700 hover:bg-emerald-50/60"
                  : "text-slate-400",
              ].join(" ")}
            >
              {/* Circle indicator */}
              <span
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black transition-all",
                  isActive
                    ? "bg-orange-500 text-white shadow-xs shadow-orange-400/40"
                    : isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-500",
                ].join(" ")}
                aria-hidden="true"
              >
                {isCompleted ? (
                  <Check size={10} strokeWidth={3.5} />
                ) : (
                  s.step
                )}
              </span>

              {/* Title — hidden on mobile, visible on sm+ */}
              <span className="hidden sm:block leading-none whitespace-nowrap">
                {s.title}
              </span>

              {/* On mobile: show title only for active step */}
              {isActive && (
                <span className="sm:hidden leading-none whitespace-nowrap text-orange-600 font-black">
                  {s.title}
                </span>
              )}
            </button>

            {/* Chevron connector between steps (not after last) */}
            {!isLast && (
              <ChevronRight
                size={12}
                className={`shrink-0 ${isCompleted ? "text-emerald-400" : "text-slate-300"}`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * StudioStepperRow — The full header row wrapper that wraps StudioStepper
 * with the standard Studio border-b container.
 * Drop-in replacement for the per-studio stepper div.
 */
export function StudioStepperRow({
  steps,
  currentStep,
  onStepClick,
  allowJumpAhead,
}: StudioStepperProps) {
  return (
    <div className="shrink-0 border-b border-slate-200/90 bg-white px-4 sm:px-8 lg:px-12 py-2.5 flex items-center justify-center">
      <div className="flex items-center gap-0.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl px-2 py-1.5 shadow-2xs overflow-x-auto scrollbar-none max-w-full">
        <StudioStepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={onStepClick}
          allowJumpAhead={allowJumpAhead}
        />
      </div>
    </div>
  );
}

/**
 * StudioBottomBar — Shared sticky bottom navigation bar.
 * Handles Back/Next/Generate button rendering based on currentStep + totalSteps.
 *
 * Usage: replace the per-studio ── ROW 3: Sticky Bottom Action Bar ── div.
 */
export interface StudioBottomBarProps {
  steps: StepDefinition[];
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  /** Replace the Next button on the final step with a render/generate button */
  onGenerate: () => void;
  generateLabel?: string;
  generateDisabled?: boolean;
  isGenerating?: boolean;
  /** Info displayed on the left side of the bar (e.g. credit cost badge) */
  leftContent?: React.ReactNode;
  className?: string;
}

export function StudioBottomBar({
  steps,
  currentStep,
  onBack,
  onNext,
  onGenerate,
  generateLabel = "Generate",
  generateDisabled = false,
  isGenerating = false,
  leftContent,
  className = "",
}: StudioBottomBarProps) {
  const totalSteps = steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const nextStep = steps.find((s) => s.step === currentStep + 1);

  return (
    <div
      className={`shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl px-4 sm:px-8 lg:px-12 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.06)] ${className}`}
    >
      {/* Left: context info (credit cost, file name, etc.) */}
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        {leftContent}
      </div>

      {/* Right: Back + Next/Generate */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            Back
          </button>
        )}

        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-all cursor-pointer shadow-sm shadow-orange-500/20 active:scale-95"
          >
            <span>
              {nextStep ? `Next: ${nextStep.title}` : "Next"}
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onGenerate}
            disabled={generateDisabled || isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <span>Generating…</span>
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>{generateLabel}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default StudioStepper;
