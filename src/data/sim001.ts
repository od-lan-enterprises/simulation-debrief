import type { SessionData } from "@/lib/types";

/**
 * Case 1 — "Textbook". The exact sample data from the brief, with a pre-baked
 * AI debrief grounded in this run's calculated facts. This is the baseline case
 * (minimal data, no future streams) used to validate the metrics engine.
 */
export const sim001: SessionData = {
  session: {
    id: "SIM001",
    durationSeconds: 720,
    title: "Textbook run",
    scenarioType: "Adult ALS — VF cardiac arrest",
    date: "2026-06-12",
  },
  participants: [
    { id: "P1", role: "Team Leader" },
    { id: "P2", role: "Airway" },
    { id: "P3", role: "Nurse" },
    { id: "P4", role: "Runner" },
  ],
  events: [
    { time: 0, type: "Scenario Started" },
    { time: 65, type: "Ventricular Fibrillation" },
    { time: 82, type: "CPR Started", participantId: "P3" },
    { time: 138, type: "Shock Delivered", participantId: "P1", detail: "200J biphasic" },
    { time: 152, type: "Adrenaline Given", participantId: "P3", detail: "1mg IV" },
    { time: 201, type: "Return of Spontaneous Circulation" },
    { time: 720, type: "Scenario Finished" },
  ],
  ai: {
    generated: true,
    summary:
      "A well-run resuscitation. The team recognised VF and established compressions quickly (17s), delivered the first shock at 1:13 into the arrest, and achieved ROSC just over two minutes from recognition. The main coaching opportunity is shaving the short delay between arrest recognition and the start of compressions.",
    discussionPoints: [
      {
        text: "Compressions began 17s after VF was recognised — what caused the gap, and how could the team close it next time?",
        atTime: 82,
      },
      {
        text: "Roles looked clear (leader, airway, nurse, runner). Ask the team how communication felt during the first minute.",
      },
      {
        text: "ROSC was achieved after one shock and one dose of adrenaline — reinforce what went well so the team can repeat it.",
        atTime: 201,
      },
    ],
    momentsToReview: [
      {
        time: 65,
        reason: "Arrest recognition — the clock that every downstream metric is measured against.",
      },
      {
        time: 82,
        reason: "Start of compressions — the 17s gap is the clearest improvement target.",
      },
    ],
  },
};
