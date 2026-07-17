"use client";

type StickerStyle = "2d" | "cartoon" | "explainer" | "girl-teacher" | "girl-teacher-3d" | "grandpa-teacher-3d" | "young-presenter-3d" | "teacher-2d-pro" | "chibi-boy-3d" | "corporate-woman-3d" | "indian-teacher-woman" | "doctor-3d-half" | "banker-3d-half" | "news-anchor-3d-half" | "lawyer-girl-3d" | "shia-moulana-3d";

type StickerStylePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

type StickerCategory = "Teachers" | "3D Characters" | "Professionals" | "Faith";

const STICKERS: Array<{
  id: StickerStyle;
  name: string;
  image: string;
  category: StickerCategory;
}> = [
  { id: "2d", name: "2D Teacher", image: "/visuals/stickers/previews/2d-teacher.png", category: "Teachers" },
  { id: "cartoon", name: "Cartoon Teacher", image: "/visuals/stickers/previews/cartoon-teacher.png", category: "Teachers" },
  { id: "explainer", name: "Stickman Explainer", image: "/visuals/stickers/previews/stickman-explainer.png", category: "Teachers" },
  { id: "girl-teacher", name: "Girl Teacher", image: "/visuals/stickers/previews/girl-teacher.png", category: "Teachers" },
  { id: "teacher-2d-pro", name: "2D Pro", image: "/visuals/stickers/previews/teacher-2d-pro.png", category: "Teachers" },
  { id: "indian-teacher-woman", name: "Indian Teacher", image: "/visuals/stickers/previews/indian-teacher-woman.png", category: "Teachers" },
  { id: "girl-teacher-3d", name: "Girl 3D", image: "/visuals/stickers/previews/girl-teacher-3d.png", category: "3D Characters" },
  { id: "grandpa-teacher-3d", name: "Grandpa 3D", image: "/visuals/stickers/previews/grandpa-teacher-3d.png", category: "3D Characters" },
  { id: "young-presenter-3d", name: "Young Presenter", image: "/visuals/stickers/previews/young-presenter-3d.png", category: "3D Characters" },
  { id: "chibi-boy-3d", name: "Chibi Boy", image: "/visuals/stickers/previews/chibi-boy-3d.png", category: "3D Characters" },
  { id: "corporate-woman-3d", name: "Corporate Woman", image: "/visuals/stickers/previews/corporate-woman-3d.png", category: "3D Characters" },
  { id: "doctor-3d-half", name: "Doctor 3D", image: "/visuals/stickers/previews/doctor-3d-half.png", category: "Professionals" },
  { id: "banker-3d-half", name: "Banker 3D", image: "/visuals/stickers/previews/banker-3d-half.png", category: "Professionals" },
  { id: "news-anchor-3d-half", name: "News Anchor", image: "/visuals/stickers/previews/news-anchor-3d-half.png", category: "Professionals" },
  { id: "lawyer-girl-3d", name: "Lawyer Girl", image: "/visuals/stickers/previews/lawyer-girl-3d.png", category: "Professionals" },
  { id: "shia-moulana-3d", name: "Islamic Scholar", image: "/visuals/stickers/previews/shia-moulana-3d.png", category: "Faith" },
];

const STICKER_CATEGORY_ORDER: StickerCategory[] = ["Teachers", "3D Characters", "Professionals", "Faith"];

export function StickerStylePicker({value, onChange}: StickerStylePickerProps) {
  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.16),_rgba(0,0,0,0.42)_48%,_rgba(0,0,0,0.7))] p-5 shadow-[0_0_42px_rgba(124,58,237,0.12)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300">
            Choose sticker style
          </p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">
            User jo pick karega, wahi video me use hoga.
          </p>
        </div>

        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-200">
          {STICKERS.find(s => s.id === value)?.name || value}
        </span>
      </div>

      <div className="space-y-5">
        {STICKER_CATEGORY_ORDER.map((category) => {
          const items = STICKERS.filter((s) => s.category === category);
          if (!items.length) return null;
          return (
            <div key={category}>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">{category}</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {items.map((sticker) => {
                  const selected = value === sticker.id;
                  return (
                    <button
                      key={sticker.id}
                      type="button"
                      onClick={() => onChange(sticker.id)}
                      className={`group relative overflow-hidden rounded-3xl border p-4 text-center transition-all duration-300 ${
                        selected
                          ? "scale-[1.03] border-emerald-400 bg-emerald-500/15 shadow-[0_0_34px_rgba(124,58,237,0.30)]"
                          : "border-white/10 bg-white/[0.035] hover:-translate-y-1 hover:scale-[1.02] hover:border-emerald-400/45 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.18),_transparent_62%)]" />

                      {selected ? (
                        <div className="absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-xl" />
                      ) : null}

                      <div
                        className={`relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border bg-white transition-all duration-300 ${
                          selected
                            ? "border-emerald-400 shadow-[0_0_30px_rgba(124,58,237,0.45)]"
                            : "border-white/20 group-hover:border-emerald-400/60"
                        }`}
                      >
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white via-blue-50 to-zinc-100" />
                        <img
                          src={sticker.image}
                          alt={sticker.name}
                          className="relative z-10 h-[70px] w-auto object-contain transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                        />
                      </div>

                      <p className="relative mt-3 text-xs font-black text-white">{sticker.name}</p>

                      {selected ? (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-400 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black">
                          ✓
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
