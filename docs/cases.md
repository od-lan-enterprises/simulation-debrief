# Scenario Cases

Three data-driven cases, chosen to show **variance in input data and AI output**. Each is a
JSON file fed to the same engine. The point of having more than one is to prove the metrics
and AI suggestions respond to the data, not to hard-coded text.

> Final timings/events are placeholders to refine at authoring time. Keep them clinically
> plausible but remember: prototype, not clinical reference.

## Case 1 — "Textbook" (the provided SIM001)
- **Demonstrates:** the happy path; clean timeline; metrics within rule-of-thumb thresholds.
- **Data:** exactly the brief's sample. VF→CPR 17s, VF→shock 73s, ROSC at 201s.
- **AI output flavour:** positive debrief, reinforces what went well, light improvement note
  (e.g. shaving seconds off time-to-defibrillation). One or two discussion points.
- **Future stream:** none (baseline, shows the minimal data case).

## Case 2 — "Clear failure / delays"
- **Demonstrates:** how metrics + AI surface problems; contrast against Case 1.
- **Data idea:** delayed CPR (long gap VF→CPR), late first shock, later ROSC or no ROSC.
- **AI output flavour:** flags the delay chain, suggests concrete discussion points about
  recognition and defibrillation speed, marks specific moments worth reviewing.
- **Future stream:** include **instructor notes**, shows how human notes sit alongside
  source events and AI suggestions (three voices, clearly tagged).

## Case 3 — "Messy / ambiguous"
- **Demonstrates:** that the tool is useful even when the story isn't clean; AI adds value by
  framing *questions* rather than verdicts.
- **Data idea:** out-of-order or extra events, a rhythm change, maybe a brief deterioration
  after ROSC, or repeated shocks.
- **AI output flavour:** more hedged, "moments worth reviewing" and open questions for the
  debrief rather than firm conclusions. Good for discussing AI's advisory role.
- **Future stream:** include **simulator vital signs**, shows the UI rendering an extra
  optional stream and the metrics/AI referencing it, proving graceful extension.

## Authoring checklist per case
- [ ] Valid against the `SessionData` type
- [ ] Metrics compute correctly (spot-check by hand)
- [ ] AI text references real metric values from THIS case (grounded, not generic)
- [ ] Provenance tags correct on every rendered element
- [ ] Clearly distinct from the other two cases at a glance
