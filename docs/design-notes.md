# Design Notes

A reader-friendly companion to the README, written for anyone reviewing this prototype before
the walkthrough. It explains the thinking: the one organising idea, the deterministic-vs-AI
split, the key trade-offs, and how the design is meant to evolve. The full append-only decision
log (with rejected alternatives) lives in `decisions.md`; this is the distilled version.

The same content is viewable in the app itself at `/about`.

> Prototype only, not clinical guidance. The rule-of-thumb flags are a teaching aid.

## The one idea: provenance

The brief asks twice to clearly distinguish source events, calculated facts, and AI-generated
suggestions, so I made *provenance* (where each piece of information came from, and how far it
can be trusted) the spine of both the data model and the UI. Every item on screen belongs to
exactly one tier and is tagged accordingly, everywhere, consistently:

| Tier | What it is | Trust |
|------|-----------|-------|
| **Source events** | Raw, straight from the simulator | Ground truth |
| **Calculated facts** | Derived deterministically from those events | Reproducible |
| **AI suggestions** | Generated, advisory | For the instructor to weigh |

Everything else in the build follows from taking that distinction seriously.

## The determinism split (the graded core)

The brief specifically asks which parts should be deterministic and which could be AI-assisted in
production. The app is physically structured around the answer: the two halves live in separate
code, so the boundary is real, not cosmetic.

**Deterministic. Reproducible and auditable, no model involved.**
- Ingesting and ordering the source events.
- Every calculated fact (`src/lib/metrics.ts` is a pure function of the events, and it is
  unit-tested).
- The rule-of-thumb pass/review flags, which are simple named thresholds in code.
- The cross-session trend values and their direction.
- Any number an instructor might quote back in the debrief.

An instructor has to trust that "73 seconds to first shock" is exactly that, every time, so a
model never computes it.

**AI-assisted. Inference and language, where judgement and phrasing add value.**
- The natural-language debrief summary.
- Suggested discussion points and instructor prompts.
- Identifying "moments worth reviewing" from softer signals.
- The plain-language read of a learner's progress trend.
- Tone: encouraging for a strong run, direct for a poor one, questioning for an ambiguous one.

In production the AI layer would receive the source events *and the already-computed deterministic
facts*, and generate language grounded in them. The facts act as guardrails against hallucination.
The pre-baked outputs here are written exactly that way.

## Key decisions and trade-offs

**Provenance made unmissable in the UI.** Each datum carries a coloured tag plus a dot (not colour
alone, for accessibility), there is a legend at the top, and every calculated metric shows a
"derived from" trail back to its source events. *Traded:* a little visual repetition, deliberately,
so the trust model is never ambiguous.

**Pre-baked AI, not a live API call.** The brief permits simulated AI. Pre-baking removes secrets,
latency, cost, and fragility for no evaluative gain, and lets me craft outputs that are grounded in
the calculated facts. *Traded:* it does not demonstrate a live integration, mitigated by designing
the `AiDebrief` interface so a real model call drops in behind it unchanged.

**Moderate clinical depth, not formal scoring.** Rule-of-thumb timings with a disclaimer, not a
named ACLS/ALS standard. *Traded:* less authoritative, on purpose, because any wrong "official"
number is a liability I would have to defend, and the goal is domain insight, not medical authority.

**Three contrasting cases, not one or five.** Textbook, clear failure, and ambiguous re-arrest.
This proves the engine responds to data rather than hardcoded text, and exercises the AI's full
tonal range. *Traded:* the engine is cheap to extend, but believable AI text per case is the real
cost, so three is the variance-to-effort sweet spot.

**Two-level information architecture.** A learner overview (their sessions, a calculated trend, an
AI progress note) leading into the full per-session review. *Why:* the real instructor job is
tracking someone over time, and it reinforces the same three tiers one level up. *Traded:* a little
extra scope, kept in check with one mock learner and a breadcrumb that implies a roster rather than
building an empty selector.

**Static app, no backend.** Typed in-repo case data and a fully static export give a live URL with
zero infrastructure. *Traded:* no persistence, which is correct for a prototype and explicitly out
of scope.

## Designed to evolve

The brief lists future data streams (participant movement, communication frequency, CPR quality,
simulator vital signs, instructor notes, AI observations). The schema absorbs them by demonstration,
not by promise: those streams are optional, additive fields on the case type, and each panel renders
only when its data is present. Two streams are already wired in: instructor notes (a distinct human
"fourth voice") in the delayed-response case, and simulator vital signs in the re-arrest case. The
UI degrades gracefully when a stream is absent.

## Anticipated questions

**Why should I trust the AI summary?** You should not trust it as fact, and that is the design. It
only narrates numbers the deterministic engine computed, those numbers sit next to it with their
provenance, and it is labelled advisory. In production the model receives the events plus the
computed facts as grounding guardrails.

**What is deterministic versus AI, exactly?** Deterministic: ingestion, every metric, the threshold
flags, the trend numbers and direction. AI: the narrative summary, discussion points, moments worth
reviewing, tone, and the plain-language read of the trend. The split is physical in the codebase,
which is why one half can be unit-tested.

**How does it handle the future data streams?** They are optional fields on the case type; the UI
shows only what is present. Vital signs already render in the re-arrest case, instructor notes in the
delayed-response case. Adding a stream is additive, with no rework.

**Where could it mislead an instructor?** A single metric can understate a messy run, which is why
the re-arrest case's AI flags that "time to ROSC" captures only the first ROSC and asks questions
instead of giving verdicts. The thresholds are illustrative, not clinical, and they are disclaimed.

**What changes when you wire a real model?** Nothing structural. The same `AiDebrief` interface, fed
the events plus the computed facts, keeping the label and the disclaimer, with evals so the model
cannot assert a number the engine did not produce.
