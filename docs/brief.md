# Brief — Distilled Requirements

Source: `Round Two Technical Challenge .pdf`. This is the open-ended product brief from
Indigo Kite Labs. Below is the distilled set of hard requirements, soft signals, and how
each maps to what they actually grade.

## The scenario
Healthcare simulation startup. After each sim session, instructors run a **debrief**:
*what happened, what went well, what could be improved.* Today this is done from memory +
handwritten notes. Build the first prototype of a tool to **review a completed session**,
a digital "flight recorder."

## Hard requirements (must hit)
1. **A web application** that helps an instructor review a simulation.
2. Works from **structured event data only**, no video / audio / images stored.
3. **One AI-assisted (or simulated-AI) feature**, e.g. debrief summary, suggested
   discussion points, instructor prompts, or "moments worth reviewing." *Need not call a
   real AI API.*
4. **Clearly distinguish** source events vs calculated facts vs AI-generated suggestions.
5. **README (~1 page)**: approach · technologies · AI tools used · assumptions · "what next."
6. README must explain **which parts should be deterministic vs AI-assisted in production.**
7. Demonstration: ~10 min walkthrough in the second interview.

## Provided sample data
Session `SIM001`, 720s, 4 participants (Team Leader / Airway / Nurse / Runner).
Events: Scenario Started (0) → VF (65) → CPR Started (82) → Shock Delivered (138) →
Adrenaline Given (152) → ROSC (201) → Scenario Finished (720).
We may use or expand this data freely. → This is a **cardiac-arrest / ALS resus**; the
calculated-facts layer can be clinically meaningful (see `data-model.md`).

## "You may assume" (future data — design for, don't build)
participant movement · communication frequency · CPR quality · simulator vital signs ·
instructor notes · AI-generated observations. → Drives our **extensible schema** decision.

## Constraints
- **1–2 hours.** "A thoughtful prototype is far more valuable than a feature-rich one."
- No single correct solution; they want to see how we *think*.
- AI use is encouraged and itself evaluated.

## Deliverables
1. Source code (GitHub repo or ZIP).
2. ~1-page README (see fields above).
3. 10-min live walkthrough.

## Evaluation rubric → our response
| They evaluate… | Where we earn it |
|---|---|
| How you approached the problem | Decision log + README approach section |
| Engineering decisions | Typed, extensible data model; deterministic calc engine |
| Product thinking | 3 contrasting cases; clinical metrics that matter to instructors |
| UI choices | Restrained clinical UI (shadcn); provenance made visually obvious |
| How you used AI | This build (Claude Code) + README "AI tools" section, honestly |
| Trade-offs | Decision log records what we rejected and why |
| What you'd improve | README "what next", wired from the future-data streams |
