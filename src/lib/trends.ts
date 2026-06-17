/**
 * Cross-session trends — still the CALCULATED tier, one level up. Pure function
 * of the per-session metrics: how a tracked metric moves across a learner's
 * sessions in chronological order. No AI: the numbers and the direction are
 * deterministic. (The natural-language read of the trend is the AI tier — see
 * the student's `aiProgression`.)
 */

import type { SessionData } from "./types";
import { deriveMetrics } from "./metrics";

/** Metrics we track over time. All are "lower is better" durations. */
const TRACKED: { id: string; label: string }[] = [
  { id: "time-to-cpr", label: "Time to CPR" },
  { id: "time-to-defibrillation", label: "Time to first shock" },
];

export type TrendDirection = "improving" | "worsening" | "flat" | "n/a";

export interface TrendPoint {
  sessionId: string;
  title: string;
  value: number;
  display: string;
}

export interface Trend {
  metricId: string;
  label: string;
  points: TrendPoint[];
  /** "lower is better", so a falling value is improving. */
  direction: TrendDirection;
}

export function deriveTrends(orderedSessions: SessionData[]): Trend[] {
  return TRACKED.map(({ id, label }) => {
    const points: TrendPoint[] = [];
    for (const c of orderedSessions) {
      const m = deriveMetrics(c).metrics.find((mm) => mm.id === id);
      if (m && typeof m.value === "number") {
        points.push({
          sessionId: c.session.id,
          title: c.session.title ?? c.session.id,
          value: m.value,
          display: m.display,
        });
      }
    }

    let direction: TrendDirection = "n/a";
    if (points.length >= 2) {
      const first = points[0].value;
      const last = points[points.length - 1].value;
      direction =
        last < first ? "improving" : last > first ? "worsening" : "flat";
    }

    return { metricId: id, label, points, direction };
  });
}
