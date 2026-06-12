"use client";

type CompareTextFieldsProps = {
  leftTitle: string;
  rightTitle: string;
  handle: string;
  onLeftTitleChange: (value: string) => void;
  onRightTitleChange: (value: string) => void;
  onHandleChange: (value: string) => void;
};

export function CompareTextFields({
  leftTitle,
  rightTitle,
  handle,
  onLeftTitleChange,
  onRightTitleChange,
  onHandleChange,
}: CompareTextFieldsProps) {
  return (
    <div className="rounded-3xl border border-cyan-300/20 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_rgba(0,0,0,0.50)_48%,_rgba(0,0,0,0.76))] p-5 shadow-[0_0_42px_rgba(56,189,248,0.08)]">
      <div className="mb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">
          Compare text
        </p>
        <p className="mt-1 text-[11px] font-semibold text-zinc-500">
          These labels will appear inside the final comparison reel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-white">
            Left compare text
          </span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/50 focus:bg-black"
            maxLength={34}
            onChange={(event) => onLeftTitleChange(event.target.value)}
            placeholder="Example: Before"
            value={leftTitle}
          />
          <p className="mt-2 text-[10px] font-bold text-zinc-500">
            Fallback: Left
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-white">
            Right compare text
          </span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-300/50 focus:bg-black"
            maxLength={34}
            onChange={(event) => onRightTitleChange(event.target.value)}
            placeholder="Example: After"
            value={rightTitle}
          />
          <p className="mt-2 text-[10px] font-bold text-zinc-500">
            Fallback: Right
          </p>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-white">
          Top handle
        </span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/50 focus:bg-black"
          maxLength={28}
          onChange={(event) => onHandleChange(event.target.value)}
          placeholder="@itnavideo"
          value={handle}
        />
        <p className="mt-2 text-[10px] font-bold text-zinc-500">
          This appears at the top of the reel.
        </p>
      </label>
    </div>
  );
}
