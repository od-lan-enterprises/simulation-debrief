import { describe, it, expect } from "vitest";
import { deriveMetrics, THRESHOLDS } from "./metrics";
import type { Metric } from "./types";
import { sim001 } from "@/data/sim001";
import { sim002 } from "@/data/sim002";

const byId = (metrics: Metric[], id: string) => metrics.find((m) => m.id === id);

/**
 * The calculated tier is the deterministic heart of the prototype: same events
 * in, same facts out, no AI. These tests lock that behaviour to the brief's
 * known sample (SIM001) and to a contrasting failure run (SIM002), and prove the
 * function is order-independent. This is what lets the README claim the facts
 * are reproducible and auditable, and that an LLM should never compute them.
 */
describe("deriveMetrics", () => {
  it("computes the known SIM001 timings from the brief's sample data", () => {
    const { metrics, roscAchieved } = deriveMetrics(sim001);
    expect(byId(metrics, "time-to-cpr")?.value).toBe(17); // 82 - 65
    expect(byId(metrics, "time-to-defibrillation")?.value).toBe(73); // 138 - 65
    expect(byId(metrics, "time-to-adrenaline")?.value).toBe(87); // 152 - 65
    expect(byId(metrics, "time-to-rosc")?.value).toBe(136); // 201 - 65
    expect(roscAchieved).toBe(true);
  });

  it("is order-independent: shuffled events derive the same facts", () => {
    const shuffled = { ...sim001, events: [...sim001.events].reverse() };
    expect(deriveMetrics(shuffled).metrics).toEqual(deriveMetrics(sim001).metrics);
  });

  it("flags a slow time-to-CPR and marks a run with no ROSC", () => {
    const { metrics, roscAchieved } = deriveMetrics(sim002);
    const cpr = byId(metrics, "time-to-cpr");
    expect(cpr?.value).toBe(48); // 98 - 50
    expect(cpr?.value as number).toBeGreaterThan(THRESHOLDS.timeToCprGood);
    expect(cpr?.status).toBe("warn");
    expect(roscAchieved).toBe(false);
    expect(byId(metrics, "time-to-rosc")?.display).toBe("Not achieved");
  });

  it("counts repeated interventions across the run", () => {
    const { metrics } = deriveMetrics(sim002);
    expect(byId(metrics, "shock-count")?.value).toBe(2);
    expect(byId(metrics, "adrenaline-count")?.value).toBe(2);
  });
});
