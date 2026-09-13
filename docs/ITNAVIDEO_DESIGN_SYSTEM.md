# Itnavideo AI Design System & Visual Guidelines
**Version**: 2.0 (Cinematic Midnight Studio + Material Design 3)  
**Standard Authority**: Official Itnavideo Specification  
**Reference**: Google Material Design 3 (M3: https://m3.material.io/) & Tailwind CSS

---

## 1. Core Principles

1. **Video-First Dark Canvas**: Itnavideo is an AI Video Creation Platform, not a spreadsheet or analytics tool. Users preview videos, inspect subtitles, and tweak keyframes for 15–30 minutes at a time. Pure white canvases cause eye glare and wash out video previews. The canvas must always be **Deep Midnight Studio (`#0B0F19`)**.
2. **Material Design 3 (M3) Tonal Surfaces**: Depth is created using tonal elevation layers (`Surface Container Lowest` through `Surface Container Highest`) rather than flat heavy borders or muddy grays.
3. **Radiant Blaze Orange Signature Accent (`#F97316` / `#EA580C`)**: High energy, confident, creator-focused. Orange signifies speed, creative rendering, and productivity. Amber (`#F59E0B`) is reserved for subtle gradients and secondary badges.
4. **Clean Modern Grotesque Typography**: Clean `font-sans` (Geist Sans) for all UI, buttons, body copy, and navigation. `font-serif` is **strictly prohibited** across platform, dashboard, and blog pages.

---

## 2. Color Palette & M3 Tonal Roles

| Token Role | Hex Code | Tailwind Equivalent | Usage / Purpose |
| :--- | :--- | :--- | :--- |
| **Surface (Canvas / Level 0)** | `#0B0F19` | `bg-[#0B0F19]` | Root background for all pages, dashboards, and studios. |
| **Surface Container Lowest** | `#070A11` | `bg-[#070A11]` | Inset inputs, code boxes, video canvas well. |
| **Surface Container Low** | `#0D121F` | `bg-[#0D121F]` | Desktop Sidebars, Mobile Navigation Rails. |
| **Surface Container (Level 1)** | `#111827` | `bg-[#111827]` | Standard Cards, Feature Containers, Modal Dialogs. |
| **Surface Container High (Level 2)** | `#162032` | `bg-[#162032]` | Hover state for cards, dropdown menus, popovers. |
| **Surface Container Highest (Level 3)** | `#1E2B42` | `bg-[#1E2B42]` | Active toolbars, floating palettes. |
| **Primary** | `#F97316` | `bg-orange-500` / `text-orange-500` | Primary buttons, active tabs, progress indicators. |
| **Primary Hover / Pressed** | `#EA580C` | `hover:bg-orange-600` | Hover state for primary action buttons. |
| **Primary Container (Tonal)** | `rgba(249, 115, 22, 0.12)` | `bg-orange-500/12` / `bg-orange-500/15` | Active nav pills, category chips, highlight badges. |
| **On Primary Container** | `#FB923C` / `#FED7AA` | `text-orange-400` | Text and icons inside primary container pills. |
| **Outline / Outline Variant** | `rgba(255, 255, 255, 0.08)` | `border-white/10` | Subtle, crisp hairline separation borders. |
| **Success / Operational** | `#34D399` | `text-emerald-400` | 30 FPS rendering status, connected states. |

---

## 3. M3 Component Specifications

### A. Action Buttons
- **Primary CTA (Filled / Gradient)**:
  `bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl shadow-lg shadow-orange-500/25 transition active:scale-[0.98]`
- **Tonal / Assist Button**:
  `bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/10 transition`
- **Ghost / Outlined Button**:
  `border border-white/10 bg-transparent hover:bg-white/[0.04] text-slate-300 hover:text-white rounded-2xl transition`

### B. M3 Navigation Pills & Chips
- **Active Pill Tab**:
  `bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-2xl font-bold shadow-sm`
- **Inactive Pill Tab**:
  `text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent rounded-2xl font-medium transition`
- **Assist / Filter Chip**:
  `rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400`

### C. M3 Cards & Containers
- **Standard Card**:
  `rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl transition-all duration-200 hover:border-orange-500/30`
- **Hero / Spotlight Card**:
  `rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-[#111827] to-[#0B0F19] p-8 shadow-2xl`

---

## 4. Mandatory Developer Rules for Future Features

1. **NO Neon Greens (`#00FF9D`) or Random Blues**: All feature highlights and badges must strictly use M3 Blaze Orange tokens (`text-orange-400`, `bg-orange-500/15`, `border-orange-500/30`).
2. **NO `font-serif`**: All copy must use Tailwind `font-sans` (Geist Sans).
3. **NO Pure White Full Page Backgrounds (`bg-white` / `#FFFFFF`)**: Landing pages, blog articles, tools, and dashboards must all share the Midnight Studio canvas (`bg-[#0B0F19]`).
4. **Hairline Clean Borders**: Use `border-white/10` or `border-white/5`. Avoid heavy gray borders.
5. **State Layers**: Interactive elements must include smooth feedback: `hover:bg-white/[0.06]` and `active:scale-[0.98]`.
