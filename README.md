# Deal Intelligence Workspace

A sales + engineering collaboration tool that turns each deal into a mini project workspace — tracking customer requirements, technical blockers, and feature gaps, then surfacing **"build this → close $X"** ROI signals for engineering teams.

## Features

- **Deal Board** — Kanban-style pipeline across Prospect → Active → At Risk → Closed Won/Lost
- **Deal Workspace** — Per-deal slide-over with 4 tabs:
  - Overview (notes, quick stats, weighted value)
  - Requirements (checklist with progress bar)
  - Tech Blockers (severity-tiered, assignable, status-tracked)
  - Feature Gaps (T-shirt sized effort, revenue-at-risk tagging)
- **Eng ROI Leaderboard** — Cross-deal feature aggregation ranked by `$/dev-day`
- **Stats Bar** — Live pipeline total, weighted pipeline, unlockable revenue, open blockers
- **Local persistence** — All data stored in `localStorage`, seeded with realistic sample deals

## Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite 5** build tool
- **CSS Modules** — zero runtime CSS-in-JS
- **Lucide React** icons
- No backend — fully client-side with localStorage

## Architecture

```
src/
  types/          — Domain types and enums (single source of truth)
  utils/
    formatters.ts — Display formatting (currency, dates, labels)
    calculations.ts — Business logic (weighted pipeline, ROI aggregation)
    sampleData.ts  — Seed data
  services/
    storage.ts    — localStorage read/write abstraction
  hooks/
    useDeals.ts   — All CRUD operations, state management
  components/
    layout/       — Header
    dashboard/    — StatsBar, DealBoard, DealCard
    workspace/    — WorkspacePanel + tabs (Requirements, Blockers, Features)
    roi/          — ROIView (engineering leaderboard)
    modals/       — AddDealModal
    ui/           — Badge (shared primitives)
  styles/
    global.css    — Design tokens, reset, layout
```

## Getting Started

```bash
npm install
npm run dev         # http://localhost:5173
npm run build       # production build → dist/
npm run preview     # preview production build
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com/new)
3. Framework: **Vite** (auto-detected)
4. No environment variables needed
5. Deploy ✓

The included `vercel.json` handles SPA routing automatically.

## Design Decisions

- **Feature gap deduplication** — Features with the same title across multiple deals are merged in the ROI view, showing combined revenue unlock (e.g., SAML SSO blocking both Acme $80K and Umbrella $38K shows as "$118K unlock").
- **ROI ranking** — Sorted by `totalRevenue / effortDays` so the highest-value-per-day features float to the top.
- **Immutable IDs** — All entities use `crypto.randomUUID()` and IDs never change, making updates safe across renders.
