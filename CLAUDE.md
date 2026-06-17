# Indigo Kite Labs — Simulation Debrief Tool (Round 2 Technical Challenge)

> **This file is auto-loaded each session. Keep it short. It is the INDEX — detail lives in `/docs`.**

## What this is
A prototype web app that helps a healthcare-simulation **instructor review a completed
session** — a digital "flight recorder." Built for Indigo Kite Labs' round-two technical
challenge. The brief is open-ended on purpose; they grade *thinking, product sense, AI
collaboration, and UI taste* over feature count. Time budget per their brief: **1–2 hours**.

## The single most important concept
Every piece of information shown must be clearly tagged by **provenance**, in three tiers:

| Tier | Meaning | Example | Trust |
|------|---------|---------|-------|
| **Source events** | Raw, from the simulator | `VF at 65s` | Ground truth |
| **Calculated facts** | Deterministically derived | `17s from VF → CPR` | Reproducible |
| **AI suggestions** | Inferred / generated | "Consider discussing the shock delay" | Advisory |

This distinction is requested **twice** in the brief. It is the spine of the build and the UI.

## Current status
- [x] Read brief, agreed approach (see `docs/decisions.md`)
- [x] Project memory / docs scaffolded
- [x] Scaffold Next.js app (Next 16 + React 19 + Tailwind 4 + TS; builds clean)
- [x] Add shadcn/ui (Base UI primitives) + clinical slate/teal palette + tier tokens
- [ ] Build data model + calc engine
- [ ] Build review UI (timeline + metrics + AI debrief card)
- [ ] Author scenario cases
- [ ] Write graded README + deploy to Vercel

## Stack (decided)
Next.js 16 (App Router) · TypeScript · Tailwind 4 · shadcn/ui (**Base UI** primitives,
not Radix — note `delay` not `delayDuration` on TooltipProvider) · deployed on Vercel.
AI feature is **pre-baked per case** — no live API call (brief permits this).

## Design tokens (in `src/app/globals.css`)
Light-default clinical theme; slate base + single medical-teal `--primary`.
Provenance tiers are themed tokens — use the Tailwind utilities directly:
- Source events → `bg-tier-source` / `text-tier-source` / `bg-tier-source-soft`
- Calculated facts → `bg-tier-calculated` / `text-tier-calculated` / `…-soft`
- AI suggestions → `bg-tier-ai` / `text-tier-ai` / `…-soft`
- Rule-of-thumb flags → `text-flag-good` / `text-flag-warn` (+ `-soft` bg)

## Where things are
- `docs/brief.md` — distilled requirements + how each maps to the evaluation rubric
- `docs/decisions.md` — **append-only decision log** (what / why / rejected alternatives)
- `docs/data-model.md` — the typed schema + how it absorbs future data streams
- `docs/cases.md` — the scenarios we author and what each demonstrates
- `notes/` — internal strategy, **gitignored, not delivered**
- `README.md` — the graded deliverable (written last, from `decisions.md`)

## Working rules
- Stay data-driven: build the engine once, feed it JSON per case.
- Never let AI "compute" a fact — metrics are deterministic code; AI only narrates/suggests.
- Restrained, clinical UI. Calm palette, whitespace. Not flashy.
- Add a "prototype, not clinical advice" disclaimer.
