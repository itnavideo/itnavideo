"use client";

type StickerStyle = "2d" | "cartoon" | "explainer";

type StickerStylePickerProps = {
  value: StickerStyle;
  onChange: (value: StickerStyle) => void;
};

const STICKERS: Array<{
  id: StickerStyle;
  name: string;
  image: string;
}> = [
  {
    id: "2d",
    name: "2D Teacher",
    image: "/visuals/stickers/2d-teacher.png",
  },
  {
    id: "cartoon",
    name: "Cartoon Teacher",
    image: "/visuals/stickers/cartoon-teacher.png",
  },
  {
    id: "explainer",
    name: "Stickman Explainer",
    image: "/visuals/stickers/stickman-explainer.png",
  },
];

export function StickerStylePicker({value, onChange}: StickerStylePickerProps) {
  return (
    <div className="rounded-3xl border border-emerald-300/20 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_rgba(0,0,0,0.42)_48%,_rgba(0,0,0,0.7))] p-5 shadow-[0_0_42px_rgba(45,212,191,0.12)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-200">
            Choose sticker style
          </p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">
            User jo pick karega, wahi video me use hoga.
          </p>
        </div>

        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-100">
          {value === "cartoon" ? "Cartoon" : value === "explainer" ? "Explainer" : "2D"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STICKERS.map((sticker) => {
          const selected = value === sticker.id;

          return (
            <button
              key={sticker.id}
              type="button"
              onClick={() => onChange(sticker.id)}
              className={`group relative overflow-hidden rounded-3xl border p-4 text-center transition-all duration-300 ${
                selected
                  ? "scale-[1.03] border-emerald-300 bg-emerald-400/15 shadow-[0_0_34px_rgba(45,212,191,0.30)]"
                  : "border-white/10 bg-white/[0.035] hover:-translate-y-1 hover:scale-[1.02] hover:border-emerald-300/45 hover:bg-white/[0.06]"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.18),_transparent_62%)]" />

              {selected ? (
                <div className="absolute left-1/2 top-4 h-28 w-28 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-xl" />
              ) : null}

              <div
                className={`relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border bg-white transition-all duration-300 ${
                  selected
                    ? "border-emerald-300 shadow-[0_0_30px_rgba(45,212,191,0.45)]"
                    : "border-white/20 group-hover:border-emerald-300/60"
                }`}
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white via-emerald-50 to-zinc-100" />
                <img
                  src={sticker.image}
                  alt={sticker.name}
                  className={`relative z-10 h-20 w-auto object-contain transition-transform duration-300 ${
                    selected ? "animate-bounce" : "group-hover:-translate-y-1 group-hover:scale-110"
                  }`}
                />
              </div>

              <p className="relative mt-3 text-xs font-black text-white">{sticker.name}</p>

              {selected ? (
                <span className="absolute right-3 top-3 rounded-full bg-emerald-300 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black">
                  Selected
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

