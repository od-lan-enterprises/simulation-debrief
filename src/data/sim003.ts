import type { SessionData } from "@/lib/types";

/**
 * Case 3 — "Re-arrest & recovery". A deliberately ambiguous run: ROSC is achieved
 * quickly but not sustained, the patient re-arrests into a non-shockable rhythm,
 * and a second ROSC follows. Carries a `vitals` stream (simulator source data) so
 * the deterioration is visible. The pre-baked AI output is intentionally more
 * hedged here — it raises questions rather than verdicts, and even flags a limit
 * of the deterministic metrics (which only capture the first ROSC).
 */
export const sim003: SessionData = {
  session: {
    id: "SIM003",
    durationSeconds: 600,
    title: "Re-arrest & recovery",
    scenarioType: "Adult ALS — VF arrest with re-arrest",
  },
  participants: [
    { id: "P1", role: "Team Leader" },
    { id: "P2", role: "Airway" },
    { id: "P3", role: "Nurse" },
    { id: "P4", role: "Runner" },
  ],
  events: [
    { time: 0, type: "Scenario Started" },
    { time: 40, type: "Ventricular Fibrillation" },
    { time: 55, type: "CPR Started", participantId: "P3" },
    { time: 95, type: "Shock Delivered", participantId: "P1", detail: "200J biphasic" },
    { time: 110, type: "Adrenaline Given", participantId: "P3", detail: "1mg IV" },
    { time: 150, type: "Return of Spontaneous Circulation" },
    { time: 240, type: "Re-arrest" },
    { time: 248, type: "PEA" },
    { time: 255, type: "CPR Started", participantId: "P2" },
    { time: 360, type: "Adrenaline Given", participantId: "P3", detail: "1mg IV" },
    { time: 420, type: "Return of Spontaneous Circulation" },
    { time: 600, type: "Scenario Finished" },
  ],
  vitals: [
    { time: 155, heartRate: 128, spo2: 86, systolic: 92, diastolic: 58, etco2: 34 },
    { time: 200, heartRate: 138, spo2: 90, systolic: 84, diastolic: 52, etco2: 30 },
    { time: 235, heartRate: 44, spo2: 78, systolic: 58, etco2: 18 },
    { time: 430, heartRate: 96, spo2: 95, systolic: 108, diastolic: 66, etco2: 38 },
  ],
  ai: {
    generated: true,
    summary:
      "This run is harder to read than a clean arrest. ROSC was achieved quickly (1:50 from recognition), but it was not sustained — the patient re-arrested around 4:00 into a non-shockable rhythm before a second ROSC at 7:00. The most useful debrief here is less about timings and more about how the team noticed and responded to the deterioration.",
    discussionPoints: [
      {
        text: "The vital signs were trending down before the re-arrest — falling SpO₂ and blood pressure. Were these signs noticed, and what might have prompted earlier action?",
        atTime: 235,
      },
      {
        text: "The rhythm changed from shockable (VF) to non-shockable (PEA) at the re-arrest. How did the team adapt the algorithm?",
        atTime: 248,
      },
      {
        text: "Two ROSC events occurred, but the calculated 'time to ROSC' reflects only the first. Discuss why a single number can understate a complex resuscitation.",
      },
    ],
    momentsToReview: [
      {
        time: 235,
        reason: "Physiological deterioration in the minutes before re-arrest.",
      },
      {
        time: 240,
        reason: "Re-arrest after an initial ROSC — the turning point of this case.",
      },
      {
        time: 248,
        reason: "Rhythm change to a non-shockable rhythm; the algorithm should switch here.",
      },
    ],
  },
};
