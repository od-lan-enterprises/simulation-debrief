/**
 * The calculated-facts engine.
 *
 * `deriveMetrics` is a PURE function of the source events: same input → same
 * output, no I/O, no randomness, no AI. This is the deterministic heart of the
 * prototype and the reason the calculated tier can be trusted and audited.
 *
 * The rule-of-thumb thresholds below are deliberately simple, named constants:
 * a teaching aid for the debrief, NOT clinical guidance. Keeping them here (and
 * not in any AI layer) is exactly the point: judgements a reviewer must be able
 * to reproduce live should never be left to a model.
 */

import type { DerivedFacts, Metric, SessionData, SimEvent } from "./types";
import { formatClock, formatDuration } from "./format";

/**
 * Rule-of-thumb thresholds (seconds). Plain heuristics for a training debrief,
 * not a clinical standard. Tunable in one place; surfaced with a disclaimer.
 */
export const THRESHOLDS = {
  /** Compressions should start promptly after arrest is recognised. */
  timeToCprGood: 10,
  /** First defibrillation for a shockable rhythm should be early. */
  timeToShockGood: 120,
} as const;

/** Events that represent recognition of a shockable cardiac arrest. */
const ARREST_EVENT_TYPES = new Set([
  "Ventricular Fibrillation",
  "Pulseless VT",
]);

const ROSC_TYPE = "Return of Spontaneous Circulation";

// --- small pure lookups -----------------------------------------------------

function firstEvent(
  events: SimEvent[],
  predicate: (e: SimEvent) => boolean,
): SimEvent | undefined {
  return events.find(predicate);
}

function countEvents(
  events: SimEvent[],
  predicate: (e: SimEvent) => boolean,
): number {
  return events.reduce((n, e) => (predicate(e) ? n + 1 : n), 0);
}

/** "Type@mm:ss" tag for the provenance trail. */
function tag(event: SimEvent): string {
  return `${event.type}@${formatClock(event.time)}`;
}

// --- the engine -------------------------------------------------------------

export function deriveMetrics(data: SessionData): DerivedFacts {
  // Source events sorted by time so lookups are order-independent.
  const events = [...data.events].sort((a, b) => a.time - b.time);

  const arrest = firstEvent(events, (e) => ARREST_EVENT_TYPES.has(e.type));
  const cprStart = firstEvent(events, (e) => e.type === "CPR Started");
  const firstShock = firstEvent(events, (e) => e.type === "Shock Delivered");
  const firstAdrenaline = firstEvent(events, (e) => e.type === "Adrenaline Given");
  const rosc = firstEvent(events, (e) => e.type === ROSC_TYPE);

  const metrics: Metric[] = [];

  // Time from arrest recognition → first compressions.
  if (arrest && cprStart) {
    const dt = cprStart.time - arrest.time;
    metrics.push({
      id: "time-to-cpr",
      label: "Time to CPR",
      tier: "calculated",
      value: dt,
      display: formatDuration(dt),
      status: dt <= THRESHOLDS.timeToCprGood ? "good" : "warn",
      note:
        dt <= THRESHOLDS.timeToCprGood
          ? `Compressions began within ~${THRESHOLDS.timeToCprGood}s of arrest.`
          : `Rule of thumb is to begin compressions within ~${THRESHOLDS.timeToCprGood}s.`,
      derivedFrom: [tag(arrest), tag(cprStart)],
    });
  }

  // Time from arrest recognition → first defibrillation (shockable rhythm).
  if (arrest && firstShock) {
    const dt = firstShock.time - arrest.time;
    metrics.push({
      id: "time-to-defibrillation",
      label: "Time to first shock",
      tier: "calculated",
      value: dt,
      display: formatDuration(dt),
      status: dt <= THRESHOLDS.timeToShockGood ? "good" : "warn",
      note:
        dt <= THRESHOLDS.timeToShockGood
          ? `First shock delivered within ~${formatDuration(THRESHOLDS.timeToShockGood)}.`
          : `Rule of thumb is to defibrillate a shockable rhythm within ~${formatDuration(THRESHOLDS.timeToShockGood)}.`,
      derivedFrom: [tag(arrest), tag(firstShock)],
    });
  }

  // Whether compressions were underway before the first shock (quality check).
  if (cprStart && firstShock) {
    const cprFirst = cprStart.time <= firstShock.time;
    metrics.push({
      id: "cpr-before-shock",
      label: "CPR before first shock",
      tier: "calculated",
      value: cprFirst,
      display: cprFirst ? "Yes" : "No",
      status: cprFirst ? "good" : "warn",
      note: cprFirst
        ? "Compressions were ongoing before the first shock."
        : "First shock preceded compressions.",
      derivedFrom: [tag(cprStart), tag(firstShock)],
    });
  }

  // Time from arrest to first adrenaline (reported, not flagged; dose timing
  // depends on rhythm/algorithm context we deliberately don't assert here).
  if (arrest && firstAdrenaline) {
    const dt = firstAdrenaline.time - arrest.time;
    metrics.push({
      id: "time-to-adrenaline",
      label: "Time to adrenaline",
      tier: "calculated",
      value: dt,
      display: formatDuration(dt),
      status: "neutral",
      derivedFrom: [tag(arrest), tag(firstAdrenaline)],
    });
  }

  // Downtime: arrest → ROSC (or not achieved).
  if (arrest) {
    if (rosc) {
      const dt = rosc.time - arrest.time;
      metrics.push({
        id: "time-to-rosc",
        label: "Time to ROSC",
        tier: "calculated",
        value: dt,
        display: formatDuration(dt),
        status: "neutral",
        note: "Downtime from arrest recognition to return of circulation.",
        derivedFrom: [tag(arrest), tag(rosc)],
      });
    } else {
      metrics.push({
        id: "time-to-rosc",
        label: "Time to ROSC",
        tier: "calculated",
        value: null,
        display: "Not achieved",
        status: "warn",
        note: "No return of spontaneous circulation was recorded.",
        derivedFrom: [tag(arrest)],
      });
    }
  }

  // Counts of key interventions.
  const shockCount = countEvents(events, (e) => e.type === "Shock Delivered");
  if (shockCount > 0) {
    metrics.push({
      id: "shock-count",
      label: "Shocks delivered",
      tier: "calculated",
      value: shockCount,
      display: String(shockCount),
      status: "neutral",
      derivedFrom: events
        .filter((e) => e.type === "Shock Delivered")
        .map(tag),
    });
  }

  const adrenalineCount = countEvents(
    events,
    (e) => e.type === "Adrenaline Given",
  );
  if (adrenalineCount > 0) {
    metrics.push({
      id: "adrenaline-count",
      label: "Adrenaline doses",
      tier: "calculated",
      value: adrenalineCount,
      display: String(adrenalineCount),
      status: "neutral",
      derivedFrom: events
        .filter((e) => e.type === "Adrenaline Given")
        .map(tag),
    });
  }

  // Total scenario length: prefer declared duration, else last event time.
  const lastEvent = events[events.length - 1];
  const totalSeconds =
    data.session.durationSeconds ?? (lastEvent ? lastEvent.time : 0);
  metrics.push({
    id: "scenario-length",
    label: "Scenario length",
    tier: "calculated",
    value: totalSeconds,
    display: formatDuration(totalSeconds),
    status: "neutral",
    derivedFrom: lastEvent ? [tag(lastEvent)] : [],
  });

  return { metrics, roscAchieved: Boolean(rosc) };
}
