# Decision Log

Append-only. One block per decision. Newest at the bottom. This is the raw material the
graded README is later written from, so keep the *why* honest and specific.

Format:
```
## YYYY-MM-DD — <short title>
**Decision:** ...
**Why:** ...
**Rejected:** ...
```

---

## 2026-06-17 — Next.js on Vercel as the stack
**Decision:** Next.js (App Router) + TypeScript + Tailwind, deployed to Vercel.
**Why:** Gives the reviewers a live clickable URL; signals fluency with the modern stack;
deploy is trivial. TypeScript lets the three-tier provenance model be enforced by types.
**Rejected:** Plain static HTML (under-sells engineering); heavier framework (overkill for
1–2 hrs).

## 2026-06-17 — AI feature is pre-baked per case, not a live API call
**Decision:** Ship hand-authored AI outputs (debrief summary + discussion points + "moments
worth reviewing") stored per scenario. UI labels them clearly as AI-generated.
**Why:** The brief explicitly permits simulated AI. Avoids API keys/latency/cost in a
prototype. Lets us craft outputs that are **grounded in the calculated facts**, which
demonstrates we understand hallucination/grounding without being asked.
**Rejected:** Live LLM call (adds fragility + secrets for zero evaluative gain here).

## 2026-06-17 — Three-tier provenance is a first-class UI concept
**Decision:** Every datum rendered is visually tagged as Source event / Calculated fact /
AI suggestion (colour + badge), consistently across the app.
**Why:** The brief asks for this distinction twice; it's the spine of the exercise and the
clearest way to show we understood the trust model. Likely the main differentiator.
**Rejected:** Burying provenance in tooltips or text (too easy to miss).

## 2026-06-17 — Clinical metrics as the calculated-facts differentiator
**Decision:** The sample data is an ALS cardiac-arrest resus; compute clinically meaningful,
deterministic metrics (time-to-CPR, time-to-defibrillation, time-to-adrenaline, time-to-ROSC,
CPR/no-flow timing) and frame them against resus expectations.
**Why:** Turns a generic timeline into something an instructor would actually use; shows
domain insight, which is strong product-thinking signal. Gives the AI feature real facts to
summarise. Add a "prototype, not clinical advice" disclaimer.
**Rejected:** A bare event timeline with no derived insight (renders JSON, shows no thinking).

## 2026-06-17 — Three contrasting cases, not one or five
**Decision:** Author 3 data-driven scenarios: (1) textbook success = given SIM001,
(2) clear failure = delayed CPR / late defibrillation, (3) messy/ambiguous.
**Why:** Demonstrates variance in input data and AI output while respecting the 1–2 hr
budget. Engine is data-driven so adding cases is cheap; the real cost is authoring believable
AI text per case, which caps the sensible number.
**Rejected:** 1 case (no variance shown); 5 cases (diminishing returns vs time budget).

## 2026-06-17 — Extensible, typed data model designed for future streams
**Decision:** Model events as a discriminated union and structure the schema so future data
(vitals, CPR quality, movement, comms, instructor notes) is *additive*. Ship 1–2 cases that
already include an extra stream so the UI visibly degrades gracefully when it's absent.
**Why:** Directly answers the "you may assume… future versions" section by demonstration
rather than prose. Shows engineering foresight.
**Rejected:** Flat/loose schema (would need rework to extend; weaker signal).

## 2026-06-17 — shadcn/ui for a restrained clinical look
**Decision:** Use shadcn/ui + a calm palette (slate/teal), generous whitespace, a clear
timeline component. No flashy effects.
**Why:** Clinical software reads as restrained and trustworthy; shadcn gives high-quality
neutral components fast without fighting a heavy theme.
**Rejected:** A random downloaded template (risk of off-brand/flashy, harder to control).

## 2026-06-17 — Project memory in-repo (CLAUDE.md + docs), strategy gitignored
**Decision:** Keep durable project context in `CLAUDE.md` (auto-loaded) + `/docs`. Internal
strategy lives in `/notes`, which is gitignored and excluded from the deliverable.
**Why:** Lets a fresh session pick up the specifics instantly and travels with the repo;
keeps internal framing out of what Indigo Kite receives.
**Rejected:** Single scratch file (doesn't auto-load, mixes client-facing with internal).

## 2026-06-17 — Locked: 3 cases + moderate/grounded clinical depth
**Decision:** Confirmed the case set at **3** (Textbook / Clear-failure / Messy-ambiguous)
and the clinical-metrics level at **moderate/grounded**: compute meaningful time-metrics with
rule-of-thumb green/amber flags (named constants in deterministic code) + a visible
"prototype, not clinical guidance" disclaimer.
**Why:** Best variance-to-effort ratio within the 1–2 hr budget; strong domain signal without
claiming medical authority we'd have to defend in the interview.
**Rejected:** 2/5/1 cases (see prior block); Light depth (reads as a smarter timeline);
Heavy named-standard ACLS/ALS scoring (authority risk + any wrong number is a liability).
