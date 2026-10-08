---
name: skill-ui
description: >-
  Provides guidelines, component specifications, and ready-to-use patterns for Generative UI,
  Google Material Design 3 (M3), and Google Analytics Dark theme interfaces in Itnavideo.
  Use when designing or building UI components, video studio pickers, interactive cards,
  action banners, progress bars, carousels, and motion micro-interactions.
---

# Skill UI — Itnavideo Design System & M3 Generative UI

This skill standardizes high-converting, high-performance UI engineering for Itnavideo using **Google Material Design 3 (M3)** principles integrated with the signature **Google Analytics Dark Obsidian + Warm Orange** design system.

---

## 1. Core Visual Tokens & Palette (Strict Google Analytics Standard)

| Element | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Deep Canvas Base** | `#070B14` | `bg-[#070B14]` | Dashboard background, backdrop stages |
| **Elevated Container (Card)** | `#0E1526` | `bg-[#0E1526]` / `bg-[#0E1526]/90` | Video studio cards, modals, sheets |
| **High Elevated Surface** | `#151E30` | `bg-[#151E30]` | Dropzones, nested panels, active pickers |
| **Primary Vibrant Orange** | `#FF6D00` | `from-[#FF6D00]`, `text-[#FF6D00]` | Main CTA gradients, hero highlights |
| **Mid Transition Accent** | `#FF8F00` | `via-[#FF8F00]` | Gradient mid-tones, icons |
| **Warm Gold Highlight** | `#FFA726` | `to-[#FFA726]` | Pill badges, progress sheen tails |
| **Crisp Structural Borders**| `rgba(255,255,255,0.1)` | `border-white/10` | Subtle clean card borders (1px) |
| **Text Primary (Dark)** | `#FFFFFF` | `text-white` | Headings, labels, active items |
| **Text Muted / Subtitle** | `#94A3B8` | `text-slate-400` | Helper text, constraints, descriptions |

---

## 2. Material Design 3 (M3) Shape Hierarchy

- **Extra Large Containers**: `rounded-[28px]` (Studio cards, video stages, modal sheets, hero banners)
- **Medium Inputs & Panels**: `rounded-2xl` (Input boxes, dropzones, spec callouts, action bars)
- **Small Chips & Anchors**: `rounded-full` (Category filters, status badges, primary CTA buttons)

---

## 3. High-Conversion Component Blueprints

### A. Studio Feature Card with GA Orange Glow
```tsx
<div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15">
  {/* Ambient hover light */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#FF6D00]/10 blur-2xl transition-opacity group-hover:opacity-100" />
  {/* Content */}
</div>
```

### B. Interactive Horizontal Snap Carousel
```tsx
<div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4">
  {items.map((item) => (
    <div key={item.id} className="min-w-[280px] max-w-[320px] shrink-0 snap-start rounded-[24px] border border-white/10 bg-[#0E1526] p-4 transition active:scale-95">
      {/* Item Media & Controls */}
    </div>
  ))}
</div>
```

### C. M3 Tactile Primary Action Button
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-3 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95">
  <span>Generate Video</span>
  <ArrowRight size={16} />
</button>
```

---

## 4. UI Rules & Golden Guidelines
1. **Never use generic blue/purple/teal accents** — always stick to GA Orange (`#FF6D00` to `#FFA726`).
2. **Every click must feel tactile** — add `active:scale-95 transition-all duration-200`.
3. **Lazy load media** — use `loading="lazy"` and graceful poster/icon fallbacks.
4. **Cloudinary for visuals** — all website preview media must point to Cloudinary CDN URLs.

---

## 5. Approved UI & Animation Pattern Libraries

When engineering UI components, micro-interactions, and animations across Itnavideo landing pages and dashboard studios, adopt patterns from these three modern component inspiration libraries:

1. **Vengeance UI (`vengenceui.com`)**:
   - **Focus**: High-converting SaaS landing pages, animated hero stages, moving gradient borders, and dynamic spring cards.
   - **Stack**: Next.js + React + Tailwind CSS + Framer Motion.
   - **Itnavideo Usage**: Glowing ambient border cards, hero video stage transitions, and spring card elevation lift.

2. **Skipper UI / Skiper UI (`skiper-ui.com`)**:
   - **Focus**: shadcn/ui-compatible unconventional layout blocks, tactile micro-interactions, distinct form inputs, and interactive tab/pill switchers.
   - **Stack**: React + Tailwind CSS + shadcn/ui primitives.
   - **Itnavideo Usage**: Video type filter chips with count badges, tactile click snap (`active:scale-95`), and clean dashboard form controls.

3. **Animmaster Lib (`animmasterlib.dev`)**:
   - **Focus**: Awwwards-style web animations, kinetic typography reveals, scroll triggers, and physics-based hover states.
   - **Stack**: Pure Tailwind CSS + Framer Motion.
   - **Itnavideo Usage**: Kinetic headline typography reveals, video card micro-progress indicators, and smooth cubic-bezier easing.

