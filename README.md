# Simulation Debrief — Session Review Prototype

A "flight recorder" for healthcare simulation. After a simulation session, this tool
helps an instructor review what happened from the structured events the simulator
recorded — turning memory-and-handwritten-notes debriefs into something concrete.

Built for the Indigo Kite Labs round-two technical exercise.

> **Live demo:** _(added after deploy)_
>
> **Prototype only — not clinical guidance.** The rule-of-thumb flags are a teaching aid.

---

## Overall approach

I treated this as a product problem, not just a rendering problem. The brief asks twice to
**clearly distinguish source events, calculated facts, and AI-generated suggestions**, so I made
that distinction — *provenance* — the spine of the whole app. Every piece of information on the
screen is tagged with where it came from and how much it can be trusted:

| Tier | Colour | What it is | Trust |
|------|--------|-----------|-------|
| **Source events** | blue | Raw, straight from the simulator | Ground truth |
| **Calculated facts** | teal | Derived deterministically from events | Reproducible |
| **AI suggestions** | violet | Generated, advisory | For the instructor to weigh |

The sample data is an adult ALS cardiac-arrest scenario, so the calculated tier computes
clinically meaningful timings (time to CPR, time to first shock, time to ROSC, …) rather than just
echoing the timeline. The AI tier is a **pre-baked debrief** per case — grounded in those
calculated facts, but clearly marked as generated and advisory.

To show this responds to *data* and isn't hardcoded, there are **three contrasting cases** behind a
switcher: a textbook run, a delayed/failed run, and an ambiguous re-arrest. The same engine
produces different metrics, flags, and AI tone for each.

## Deterministic vs. AI-assisted (in a production version)

This is the core design decision, and the app is physically structured around it.

**Deterministic — must be reproducible and auditable. No model involved.**
- Ingesting and ordering source events
- Every calculated fact (`src/lib/metrics.ts` is a pure function of the events)
- The rule-of-thumb pass/review flags — simple named thresholds in code (`THRESHOLDS`)
- The timeline and all numbers an instructor might quote back in a debrief

An instructor needs to trust that "73 seconds to first shock" is exactly that, every time. You would
never want an LLM *computing* it — so in this prototype an LLM never does.

**AI-assisted — inference and language, where judgement and phrasing add value.**
- The natural-language debrief summary
- Suggested discussion points and instructor prompts
- Identifying "moments worth reviewing" from softer signals
- Tone — encouraging for a good run, direct for a poor one, *questioning* for an ambiguous one

In production the AI layer would receive the source events **and the already-computed
deterministic facts**, and generate language grounded in them — exactly how the pre-baked outputs
here are written. The deterministic facts act as guardrails against hallucination. (Case 3's debrief
even points out a limitation of a deterministic metric — that "time to ROSC" only captures the
first ROSC — which is the kind of framing the AI layer is genuinely good at.)

## Technologies

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (Base UI primitives) for a restrained, clinical look
- Deployed on **Vercel**

No backend or database — the prototype is driven by typed case data (`src/data/*.ts`). The schema is
deliberately extensible: future streams (vitals, CPR quality, instructor notes, …) are optional and
additive, and panels render only when a case provides that data.

## AI tools used

Built collaboratively with **Claude Code** (Anthropic) — used for scaffolding, the component work,
and as a thinking partner on the provenance model and the determinism split. Product and
architecture decisions were made deliberately and are recorded in `docs/decisions.md`.

## Assumptions

- The simulator emits clean, timestamped structured events (no video/audio/images), per the brief.
- The sample is an adult ALS VF arrest; I expanded the event vocabulary (rhythm checks, re-arrest,
  PEA, etc.) to author varied cases, keeping it clinically plausible but not authoritative.
- Rule-of-thumb thresholds are illustrative teaching aids, not a clinical standard.
- The AI feature is simulated (pre-baked per case) — no live API call, as the brief permits.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## If I had another day

- **Make the timeline interactive** — click an AI "moment worth reviewing" to scroll/scrub to it.
- **Render the future streams richer** — a vitals sparkline instead of a table; movement/comms once
  available; let instructor notes be added in-app.
- **Wire a real AI call** behind the same interface, passing events + calculated facts as grounding,
  so the deterministic/AI boundary stays intact.
- **Unit tests on the metrics engine** — it's a pure function, so it's the cheapest, highest-value
  place to lock behaviour down.
- **Export/share** a debrief summary (PDF) for the instructor to take into the room.

---

_Project notes and the full decision log live in `docs/`._
