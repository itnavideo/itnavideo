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
    <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
            Choose sticker style
          </p>
          <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
            User jo pick karega, wahi video me use hoga.
          </p>
        </div>

        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
          {STICKERS.find(s => s.id === value)?.name || value}
        </span>
      </div>

      <div className="space-y-5">
        {STICKER_CATEGORY_ORDER.map((category) => {
          const items = STICKERS.filter((s) => s.category === category);
          if (!items.length) return null;
          return (
            <div key={category}>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{category}</p>
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
                          ? "scale-[1.03] border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-muted/40 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/50 hover:bg-accent"
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08),_transparent_62%)]" />

                      {selected ? (
                        <div className="absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full bg-primary/15 blur-xl" />
                      ) : null}

                      <div
                        className={`relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border bg-card transition-all duration-300 ${
                          selected
                            ? "border-primary shadow-sm"
                            : "border-border group-hover:border-primary/60"
                        }`}
                      >
                        <div className="absolute inset-1 rounded-full bg-muted/30" />
                        <img
                          src={sticker.image}
                          alt={sticker.name}
                          className="relative z-10 h-[70px] w-auto object-contain transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                        />
                      </div>

                      <p className="relative mt-3 text-xs font-black text-foreground">{sticker.name}</p>

                      {selected ? (
                        <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-primary-foreground">
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
