# Itnavideo Master Design System: Modern Studio & Material Design 3 (M3)

## 1. Overview & Vision

Itnavideo follows a clean, professional, high-conversion visual design language combining the crisp clarity of **Modern Studio SaaS (Option 1: Electric Royal Blue)** with the fluid, tactile component architecture of **Material Design 3 (M3 - https://m3.material.io/)**.

This document is the absolute source of truth for all UI components, typography, layout, cards, motion, and colors across the platform.

### Core Principles
1. **Clean Canvas & High-Legibility Structure**: Crisp white backgrounds (`#FFFFFF`) with subtle slate borders (`#E2E8F0`) on light mode; deep obsidian (`#070B14`) on dark mode.
2. **Signature Electric Royal Blue Accent**: Primary focus elements, buttons, active tabs, progress bars, and highlights use Electric Royal Blue (`#0066FF` / `#2563EB`) to inspire creator confidence and trust.
3. **No Arbitrary Clutter or Rainbow Colors**: Individual video types do not use random disconnected brand palettes. All 14 studios live cohesively under the single Itnavideo Electric Royal Blue studio standard.
4. **Material Design 3 (M3) Architecture**: Containers, chips, modals, sheets, and motion follow M3 specifications ([https://m3.material.io/](https://m3.material.io/)).
5. **Purpose-Driven Semantic Feedback**: Only Emerald (`#10B981`) for success marks ("✓ Free", "Render Complete"), Rose (`#EF4444`) for errors, and Warm Amber (`#F59E0B`) for credit balance indicators.
6. **Zero Eyebrow Pill Clutter (Rule 0.7)**: Never place rounded-pill eyebrow tags or kicker spark chips above headlines. Keep headlines bold, uncluttered, and direct.

---

## 2. The Color System (Modern Studio Palette)

### Palette Definition

| Token Name | Hex Code | Tailwind Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| **Electric Royal Blue** | `#0066FF` | `blue-600` / `#0066FF` | Primary brand accent, primary CTA, active states |
| **Deep Cobalt Blue** | `#0052CC` | `blue-700` / `#0052CC` | Interactive hover/press, gradient start |
| **Luminous Accent Blue**| `#3B82F6` | `blue-500` / `#3B82F6` | Gradient tail, subtle glow accents |
| **Deep Jet Black** | `#0F172A` | `slate-900` | Bold titles, high-contrast headings |
| **Slate Body Text** | `#334155` | `slate-700` | Body copy, descriptions |
| **Subtle Slate Border** | `#E2E8F0` | `border-slate-200` | Clean container and input dividers |
| **Pure Crisp White** | `#FFFFFF` | `bg-white` | Light mode canvas and card surfaces |
| **Dark Slate Base** | `#070B14` | `#070B14` | Dashboard canvas (Dark mode) |
| **Elevated Slate** | `#0E1526` | `#0E1526` | Card background (Dark mode) |
| **High Surface Slate** | `#151E30` | `#151E30` | Interactive surfaces, drawers & modals |
| **Emerald Success** | `#10B981` | `emerald-500` | Solely for success indicators & "✓ Free" |

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
- Ambient Illumination: `hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/15`

### C. Motion & Kinetic Micro-Interactions
- **Tactile State Layer**: `active:scale-95 transition-all duration-200`
- **Elevation Lift**: `hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]`
- **Fluid Horizontal Snap Tracks**: `snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar`
- **Ambient Marquee**: `@keyframes m3Marquee` for smooth horizontal looping with pause-on-hover

---

## 4. Typography & Headings

### H1 / H2 Headline Standard
```tsx
<h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl leading-[1.12]">
  Don&apos;t edit,{' '}
  <span className="bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#3B82F6] bg-clip-text text-transparent">
    just speak.
  </span>
</h1>
```

---

## 5. Buttons & CTAs

### Primary Action
```tsx
<button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#2563EB] px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-500/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95">
  <span>Start Creating Free</span>
  <ArrowRight size={17} />
</button>
```

### Secondary Action
```tsx
<a href="#video-types" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white dark:border-white/10 dark:bg-[#151E30] px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-[#E2E8F0] hover:bg-slate-50 dark:hover:bg-[#1C2840] transition shadow-sm">
  <BookOpen size={16} className="text-blue-500" />
  <span>Explore All Studios</span>
</a>
```

---

## 6. Studio & Feature Cards

All video types follow a unified card structure:
- **Shape**: `rounded-[28px]`
- **Border**: `border border-white/10 hover:border-blue-500/50`
- **Surface**: `bg-[#0E1526]/90`
- **Hover Shadow**: `hover:shadow-2xl hover:shadow-blue-500/15`
- **Accent**: Electric Royal Blue icons and links (`text-blue-500`, `text-[#0066FF]`)
