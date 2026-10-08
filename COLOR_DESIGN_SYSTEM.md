# Itnavideo — Google Analytics Visual Design & Color System

This document is the **Single Source of Truth for Colors, Design Tokens, and Material Design 3 (M3) UI Patterns** across the entire Itnavideo platform.

---

## 1. Intentional Harmony & Purposeful Variety Policy

> [!IMPORTANT]
> **DESIGN VARIETY & INTENTIONAL HARMONY DIRECTIVE**:
> Modern creators and users find rigid single-color or single-font platforms repetitive and uninspiring. Following top AI video & SaaS platforms (CapCut, Submagic, Descript, Canva, Linear, Stripe), Itnavideo embraces **intentional typography variety and vibrant, feature-specific color palettes** while maintaining cohesive layout structure and visual quality:
> 1. **Intentional Color Accents**: Different studios, preset cards, badges, status indicators, and feature tools can utilize tailored color accents (e.g., GA Warm Orange `#FF6D00`, Emerald Tech `#10B981`, Corporate Blue `#3B82F6`, Cyber Gold `#FFD700`, Impact Crimson `#EF4444`, Neon Mint `#00F5D4`).
> 2. **Rich Typography Pairings**: Studios and caption engines support diverse Google Fonts (`Plus Jakarta Sans`, `Montserrat`, `Impact`, `Komika Axis`, `Bebas Neue`, `Anton`, `Inter`, `Oswald`, `League Spartan`, `Permanent Marker`, `Fraunces`) to match different creator styles and video niches.
> 3. **Harmonious Baseline Structure**: Overall background canvases (`#070B14`), container cards (`#0E1526` / `#141824`), subtle borders (`border-white/10`), and M3 elevation stay clean and unified so multi-color elements pop with purpose.

---

## 2. Core Color Palette Matrix

### A. Brand Accent Colors (Google Analytics Signature Palette)

| Token Name | HEX Code | Tailwind Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Primary Highlight** | `#FF6D00` | `from-[#FF6D00]` / `orange-600` | Signature Google Analytics vibrant deep orange |
| **Midtone Accent** | `#F97316` | `via-[#F97316]` / `orange-500` | Warm midtone for gradients and active states |
| **Warm Amber** | `#FF8F00` | `via-[#FF8F00]` / `amber-500` | Smooth warm transition & active indicator glow |
| **Golden Orange** | `#FFA726` | `to-[#FFA726]` / `amber-400` | Gradient highlight tail & eyebrow kicker text |

### B. Canvas & Container Surfaces (Dark Obsidian Theme)

| Token Name | HEX Code | Tailwind Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Base Canvas** | `#070B14` | `bg-[#070B14]` | Deep obsidian slate background (Never use pure `#000000`) |
| **Surface Container** | `#0E1526` | `bg-[#0E1526]` | Primary card & section background |
| **High Surface Container** | `#151E30` | `bg-[#151E30]` | Interactive elevated surfaces, inputs, hover states |
| **Subtle Border** | `rgba(255,255,255,0.1)` | `border-white/10` | Clean structural separation (Avoid heavy borders) |

### C. Canvas & Container Surfaces (Light Theme)

| Token Name | HEX Code | Tailwind Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Base Light Canvas** | `#FFFFFF` | `bg-white` | Primary clean light canvas |
| **Soft Light Surface** | `#F8FAFC` | `bg-slate-50` | Secondary light section background |
| **Light Border** | `#E2E8F0` | `border-slate-200` | Structural borders for light mode |

### D. Typography & Contrast

| Token Name | HEX / Class | Purpose & Usage |
| :--- | :--- | :--- |
| **Primary Dark Text** | `text-white` / `text-slate-100` | Crisp high-legibility headings & primary labels on dark bg |
| **Secondary Muted Text** | `text-slate-400` / `text-zinc-400` | Subtitles, helper text, metadata |
| **Light Canvas Headings** | `text-slate-900` / `text-slate-800` | High contrast headings on light bg |

### E. Semantic & Status Indicators

| Status State | HEX Code | Tailwind Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Success** | `#10B981` | `text-emerald-500`, `bg-emerald-500/10` | Completed renders, verified status |
| **Error / Danger** | `#EF4444` | `text-red-500`, `bg-red-500/10` | Render failures, deletion warnings |
| **Warning / Paywall** | `#F59E0B` | `text-amber-500`, `bg-amber-500/10` | Credit balance warning, upgrade prompt |

---

## 3. Material Design 3 (M3) System Integration

All UI components must adhere to **Google Material Design 3 (M3)** specifications ([m3.material.io](https://m3.material.io/)):

### A. M3 Shape System
- **Extra Large Containers & Cards**: `rounded-[28px]` (Studio cards, video preview stage, modal sheets)
- **Medium Containers & Inputs**: `rounded-2xl` (Input fields, callout banners, action bars)
- **Small Elements & Action Anchors**: `rounded-full` (Filter chips, status badges, primary CTA buttons)

### B. M3 Elevation & Surface Layering
- **Tonal Layering**: Base (`#070B14`) $\rightarrow$ Surface Container (`#0E1526`) $\rightarrow$ High Surface (`#151E30`).
- **Structural Borders**: Subtle 1px tonal border (`border border-white/10`).
- **Ambient Illumination**: On hover, apply a smooth GA Orange radial glow (`hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15`).

### C. M3 Motion & Micro-interactions
- **Tactile State Layer**: Every interactive button and chip must implement active compression (`active:scale-95 transition-all duration-200`).
- **Elevation Lift**: Cards smoothly lift on hover (`hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]`).
- **Kinetic Snap Tracks**: For carousels and toolbars, use `snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar`.

---

## 4. Copy-Paste Code Patterns

### Pattern 1: Page Headline with GA Orange Gradient
```tsx
<h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl font-sans">
  Build High-Converting Videos with{' '}
  <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
    Google Analytics Simplicity
  </span>
</h1>
```

### Pattern 2: Eyebrow / Kicker Badge
```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF9100] backdrop-blur-md">
  <Sparkles size={14} className="text-[#FF8F00]" />
  <span>Studio Feature Name</span>
</div>
```

### Pattern 3: Primary Action CTA Button
```tsx
<button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-3.5 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition-all hover:brightness-110 active:scale-95">
  <span>Start Creating Free</span>
  <ArrowRight size={17} />
</button>
```

### Pattern 4: Secondary Action Button
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#151E30] px-6 py-3.5 text-sm font-bold text-zinc-200 hover:bg-[#1C2840] transition active:scale-95">
  <BookOpen size={16} className="text-[#FF8F00]" />
  <span>View Documentation</span>
</button>
```

### Pattern 5: Studio Card & Category Filter Chips
```tsx
{/* Studio Card */}
<div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15">
  {/* Card Content */}
</div>

{/* Active Category Chip */}
<button className="rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25">
  Active Studio
</button>

{/* Inactive Category Chip */}
<button className="rounded-full border border-white/10 bg-[#0E1526] px-5 py-2 text-xs font-bold text-zinc-300 hover:border-[#FF6D00]/40 hover:text-white transition">
  Inactive Studio
</button>
```

---

## 5. What is Forbidden (Anti-Patterns)

- ❌ **No Random Rainbow Color Schemes**: Do not give individual video types separate neon colors (e.g. green for studio 1, purple for studio 2, cyan for studio 3).
- ❌ **No Pure Black Backgrounds**: Always use obsidian slate (`#070B14`).
- ❌ **No Thick/Harsh Borders**: Always use subtle 1px translucent borders (`border-white/10`).
- ❌ **No High-Contrast Neon Glows**: Keep glows soft and restrained (`shadow-[#FF6D00]/15`).

---

## 6. Approved UI & Animation Pattern Libraries

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

