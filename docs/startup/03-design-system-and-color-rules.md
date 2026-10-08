# Itnavideo Master Design System: Google Analytics & Material Design 3 (M3)

## 1. Overview & Vision

Itnavideo follows a high-conversion, analytical visual design language combining the clarity of **Google Analytics** with the fluid, tactile component architecture of **Material Design 3 (M3 - https://m3.material.io/)**.

This document is the absolute source of truth for all UI components, typography, layout, cards, motion, and colors across the platform.

### Core Principles
1. **Clean Google White & Slate Canvas**: Keep backgrounds uncluttered, professional, and readable.
2. **Signature Google Analytics Warm Orange / Amber Headings**: Headings command attention with warmth and vitality without visual chaos.
3. **No Arbitrary Rainbow Colors**: Individual video types or features do NOT get random unique brand colors. All studios live cohesively under the single Itnavideo Google Analytics brand.
4. **Material Design 3 (M3) Architecture**: Containers, chips, modals, sheets, and motion follow M3 specifications ([https://m3.material.io/](https://m3.material.io/)).
5. **Purpose-Driven Semantic Feedback**: Only Emerald (`#10B981`) for success, Rose (`#EF4444`) for errors, and Warm Amber (`#F59E0B`) for paywall/credit gating.

---

## 2. The Color System

### Palette Definition

| Token Name | Hex Code | Tailwind Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| **Deep Orange** | `#FF6D00` | `orange-600` / `#FF6D00` | Primary brand accent, gradient start |
| **Vibrant Orange** | `#F97316` | `orange-500` | Midtone accent |
| **Warm Amber** | `#FF8F00` | `amber-500` / `#FF8F00` | Gradient midpoint, active indicators |
| **Golden Orange** | `#FFA726` | `amber-400` / `#FFA726` | Gradient tail, glowing highlights |
| **Dark Slate Base** | `#070B14` | `#070B14` | Page background (Dark) |
| **Elevated Slate** | `#0E1526` | `#0E1526` | Card background (Dark) |
| **High Surface Slate** | `#151E30` | `#151E30` | Interactive surfaces & modals |
| **Border Subtle** | `#E2E8F0` / `rgba(255,255,255,0.1)` | `border-slate-200` / `border-white/10` | Container outlines |

---

## 3. Material Design 3 (M3) Architecture (https://m3.material.io/)

Whenever designing or building UI components, layouts, containers, sheets, navigation, and micro-interactions, **ALWAYS apply Google Material Design 3 (M3) specifications**:

### A. Shape System
- **Extra Large Containers & Cards**: `rounded-[28px]` (Studio cards, video preview stages, modal sheets)
- **Medium Containers & Inputs**: `rounded-2xl` (Input fields, spec callout boxes, banners, action bars)
- **Small Elements & Action Anchors**: `rounded-full` (Filter chips, category badges, primary CTA buttons, floating icon buttons)

### B. Elevation & Surface Tonal Hierarchy
- Base Surface: `bg-[#070B14]`
- Surface Container: `bg-[#0E1526]/90` with `border border-white/10`
- High Surface Container: `bg-[#151E30]/90`
- Ambient Illumination: `hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15`

### C. Motion & Kinetic Micro-Interactions
- **Tactile State Layer**: `active:scale-95 transition-all duration-200`
- **Elevation Lift**: `hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]`
- **Fluid Horizontal Snap Tracks**: `snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar`
- **Ambient Marquee**: `@keyframes m3Marquee` for smooth horizontal looping with pause-on-hover

---

## 4. Typography & Headings

### H1 / H2 Headline Standard
```tsx
<h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.12]">
  Create Professional Studio Videos with{' '}
  <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
    One-Click Simplicity
  </span>
</h1>
```

### Eyebrow Kicker Pill
```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF9100] backdrop-blur-md">
  <Sparkles size={14} className="text-[#FF8F00]" />
  <span>Studio Category Name</span>
</div>
```

---

## 5. Buttons & CTAs

### Primary Action
```tsx
<button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-3.5 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95">
  <span>Start Creating Free</span>
  <ArrowRight size={17} />
</button>
```

### Secondary Action
```tsx
<a href="#guide" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white dark:border-white/10 dark:bg-[#151E30] px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-[#E2E8F0] hover:bg-slate-50 dark:hover:bg-[#1C2840] transition shadow-sm">
  <BookOpen size={16} className="text-[#FF8F00]" />
  <span>Read Full Guide</span>
</a>
```

---

## 6. Studio & Feature Cards

All video types follow a unified card structure:
- **Shape**: `rounded-[28px]`
- **Border**: `border border-white/10 hover:border-[#FF6D00]/50`
- **Surface**: `bg-[#0E1526]/90`
- **Hover Shadow**: `hover:shadow-2xl hover:shadow-[#FF6D00]/15`
- **Accent**: Warm Orange icons and links (`text-[#FF9100]`, `text-[#FF8F00]`)

