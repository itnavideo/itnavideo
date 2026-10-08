"use client";

type CompareTextFieldsProps = {
  leftTitle: string;
  rightTitle: string;
  handle?: string;
  onLeftTitleChange: (value: string) => void;
  onRightTitleChange: (value: string) => void;
  onHandleChange?: (value: string) => void;
};

export function CompareTextFields({
  leftTitle,
  rightTitle,
  onLeftTitleChange,
  onRightTitleChange,
}: CompareTextFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FF8F00] shadow-[0_0_8px_rgba(255,143,0,0.6)]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Comparison Labels
          </h3>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Titles appear at the top of the video split-screen.
        </p>
      </div>

      {/* Title inputs */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Left Title */}
        <div className="group relative rounded-2xl border border-white/10 bg-black/40 p-3.5 transition-all focus-within:border-[#FF6D00] focus-within:ring-2 focus-within:ring-[#FF6D00]/20 hover:border-white/20">
          <label className="flex items-center justify-between text-[11px] font-medium text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              Left Title (Option A)
            </span>
            <span
              className={`text-[10px] tabular-nums ${
                leftTitle.length >= 38
                  ? "text-rose-400 font-bold"
                  : leftTitle.length >= 30
                  ? "text-amber-400 font-semibold"
                  : "text-zinc-500"
              }`}
            >
              {leftTitle.length}/40
            </span>
          </label>
          <input
            className="mt-1.5 w-full bg-transparent text-sm font-semibold text-white placeholder-zinc-600 outline-none"
            maxLength={40}
            onChange={(event) => onLeftTitleChange(event.target.value)}
            placeholder="e.g. iPhone 16 Pro"
            value={leftTitle}
          />
        </div>

        {/* Right Title */}
        <div className="group relative rounded-2xl border border-white/10 bg-black/40 p-3.5 transition-all focus-within:border-[#FF6D00] focus-within:ring-2 focus-within:ring-[#FF6D00]/20 hover:border-white/20">
          <label className="flex items-center justify-between text-[11px] font-medium text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
              Right Title (Option B)
            </span>
            <span
              className={`text-[10px] tabular-nums ${
                rightTitle.length >= 38
                  ? "text-rose-400 font-bold"
                  : rightTitle.length >= 30
                  ? "text-amber-400 font-semibold"
                  : "text-zinc-500"
              }`}
            >
              {rightTitle.length}/40
            </span>
          </label>
          <input
            className="mt-1.5 w-full bg-transparent text-sm font-semibold text-white placeholder-zinc-600 outline-none"
            maxLength={40}
            onChange={(event) => onRightTitleChange(event.target.value)}
            placeholder="e.g. Galaxy S25 Ultra"
            value={rightTitle}
          />
        </div>
      </div>
    </div>
  );
}
