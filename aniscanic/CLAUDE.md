# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.



## Skills — When & How to Use

Both skills **must respect the "Design System Rules — Aniscanic" section below as hard constraints**. Never suggest or generate UI that violates those rules (e.g. no 1px borders, no default Tailwind shadows, no sharp corners, no `#000000`).

### `frontend-design` (build)
- **Invoke before** creating new components, new pages, or making significant visual changes (layout shifts, new interaction patterns, new sections).
- **Do NOT invoke** for trivial edits: padding tweaks, copy changes, translation fixes, import reordering, bug fixes that don't alter visual output.

### `ui-ux-pro-max` (plan + review)
- **Invoke to plan** before building any new feature or page — define UX flow, layout strategy, interaction states, responsive breakpoints, and accessibility requirements first.
- **Invoke to review** after building — audit for accessibility (WCAG AA), responsive consistency, animation quality, color contrast, and Modern Griot conformance.
- **Invoke to improve** existing pages when asked to polish, optimize, or fix UX issues.

### Ideal workflow for new features
1. `ui-ux-pro-max` → **plan** (UX flow, layout, states, a11y)
2. `frontend-design` → **build** (distinctive, production-grade code)
3. `ui-ux-pro-max` → **review** (audit output against design system + UX best practices)


## Commands

- `pnpm dev` - Start dev server with Turbopack (http://localhost:3000)
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint via `next lint`

Package manager is **pnpm**.

## Architecture

Next.js 15 app (App Router) with React 19, TypeScript, and Tailwind CSS v4. Uses `src/` directory layout.

### Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Key directories

- `src/app/` - App Router pages: home (`/`), manga, movie, quiz, ranking
- `src/components/` - Shared components (header, footer, heroBanner)
- `src/components/hero-sections-home/` - Homepage hero section variants (HeroSectionOne, HeroSectionTwo)
- `src/components/ui/` - Reusable UI primitives (button, input) built with CVA + tailwind-merge
- `src/lib/utils.ts` - `cn()` helper for merging Tailwind classes
- `src/constants.tsx` - Centralized route definitions (`routes` object)

### Styling

- Tailwind CSS v4 with `tw-animate-css` for animations
- Dark mode via `.dark` class toggle (CSS custom properties in `globals.css`)
- Brand colors: `#FF4655` (red accent), `#FFD369` (gold accent), `#1F1F1F` (dark bg)
- UI components use shadcn/ui pattern (CVA + Radix UI + tailwind-merge)

### External images

Remote images from `images.unsplash.com` are allowed in `next.config.ts`.

### Conventions

- Pages are client components (`'use client'`) with Header/Footer composed at the page level
- Components accept `isDarkMode` prop for theme-aware rendering
- Navigation uses the `routes` object from `@/constants` for all internal links
- Lucide React for icons
- Framer Motion available for animations

## Skills — When & How to Use

Both skills **must respect the "Design System Rules — Aniscanic" section below as hard constraints**. Never suggest or generate UI that violates those rules (e.g. no 1px borders, no default Tailwind shadows, no sharp corners, no `#000000`).

### `frontend-design` (build)
- **Invoke before** creating new components, new pages, or making significant visual changes (layout shifts, new interaction patterns, new sections).
- **Do NOT invoke** for trivial edits: padding tweaks, copy changes, translation fixes, import reordering, bug fixes that don't alter visual output.

### `ui-ux-pro-max` (plan + review)
- **Invoke to plan** before building any new feature or page — define UX flow, layout strategy, interaction states, responsive breakpoints, and accessibility requirements first.
- **Invoke to review** after building — audit for accessibility (WCAG AA), responsive consistency, animation quality, color contrast, and Modern Griot conformance.
- **Invoke to improve** existing pages when asked to polish, optimize, or fix UX issues.

### Ideal workflow for new features
1. `ui-ux-pro-max` → **plan** (UX flow, layout, states, a11y)
2. `frontend-design` → **build** (distinctive, production-grade code)
3. `ui-ux-pro-max` → **review** (audit output against design system + UX best practices)
