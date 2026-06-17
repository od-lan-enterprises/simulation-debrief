# Data Model

Goal: a typed schema that (a) cleanly represents the provided sample data, (b) makes the
three-tier provenance explicit, and (c) absorbs the "future" data streams *additively*.

## Core shape (sketch — refine at build time)

```ts
type ProvenanceTier = "source" | "calculated" | "ai";

interface Session {
  id: string;
  durationSeconds: number;
  title?: string;          // human label for the case
  scenarioType?: string;   // e.g. "Adult ALS, VF arrest"
}

interface Participant {
  id: string;
  role: string;            // "Team Leader" | "Airway" | "Nurse" | "Runner" | ...
}

// Discriminated union keyed on `type` so new event kinds are additive.
type SimEvent =
  | { time: number; type: "Scenario Started" }
  | { time: number; type: "Ventricular Fibrillation" }
  | { time: number; type: "CPR Started" }
  | { time: number; type: "Shock Delivered" }
  | { time: number; type: "Adrenaline Given" }
  | { time: number; type: "Return of Spontaneous Circulation" }
  | { time: number; type: "Scenario Finished" }
  | { time: number; type: string };   // permissive fallback for unknown events

interface SessionData {
  session: Session;
  participants: Participant[];
  events: SimEvent[];

  // FUTURE STREAMS, all optional, all additive. Cases may omit any of these and the
  // UI must degrade gracefully (render only what's present).
  vitals?: VitalSample[];          // simulator vital signs over time
  cprQuality?: CprQualitySample[]; // rate/depth/recoil
  movement?: MovementSample[];     // participant positions
  comms?: CommsSample[];           // communication frequency
  instructorNotes?: InstructorNote[];
}
```

## Provenance, made explicit
- **Source events** = `events[]` and any future raw streams. Rendered as-is, never altered.
- **Calculated facts** = a `deriveMetrics(sessionData)` pure function. Deterministic,
  unit-tested-able, no I/O, no AI. Output objects carry `tier: "calculated"` + the source
  event(s) they were derived from (so the UI can show "derived from VF@65 and CPR@82").
- **AI suggestions** = a separate `aiDebrief` object per case, hand-authored, tagged
  `tier: "ai"`. References metric ids so it reads as grounded.

## Calculated facts for the sample data (SIM001)
All deterministic, derived purely from event timestamps:

| Metric | Definition | SIM001 value |
|---|---|---|
| Time to CPR | CPR Started − VF onset | 82 − 65 = **17s** |
| Time to first defibrillation | Shock Delivered − VF onset | 138 − 65 = **73s** |
| Time to adrenaline | Adrenaline Given − VF onset | 152 − 65 = **87s** |
| Time to ROSC | ROSC − VF onset | 201 − 65 = **136s** |
| Downtime (no-circulation) | VF onset → ROSC | **136s** |
| CPR-before-shock | Was CPR underway before first shock? | yes (82 < 138) |
| Total scenario length | Scenario Finished − Started | **720s** |

These can be flagged against simple, transparent rule-of-thumb thresholds (e.g. "compressions
ideally within ~10s of arrest recognition"). Thresholds live in code as named constants, NOT
in the AI layer, they must be deterministic and auditable. **Disclaimer: prototype only, not
clinical guidance.**

## Why this shape
- Discriminated union → adding an event type or stream is additive, no rework. Directly
  demonstrates the "future versions" section.
- Pure `deriveMetrics` → the calculated tier is reproducible and testable; we can honestly
  say in the README "an LLM should never compute these."
- Optional future streams → cases can include/omit them to show graceful degradation.
