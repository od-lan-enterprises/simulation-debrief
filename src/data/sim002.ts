import type { SessionData } from "@/lib/types";

/**
 * Case 2 — "Delayed response". A run that goes poorly: compressions start late,
 * defibrillation is delayed, and no ROSC is achieved. Carries an `instructorNotes`
 * stream (human input) to show how a future data source slots in alongside the
 * source / calculated / AI tiers. Contrast this case's metrics + AI output with
 * the textbook run to see the engine respond to the data.
 */
export const sim002: SessionData = {
  session: {
    id: "SIM002",
    durationSeconds: 600,
    title: "Delayed response",
    scenarioType: "Adult ALS — VF cardiac arrest",
  },
  participants: [
    { id: "P1", role: "Team Leader" },
    { id: "P2", role: "Airway" },
    { id: "P3", role: "Nurse" },
    { id: "P4", role: "Runner" },
  ],
  events: [
    { time: 0, type: "Scenario Started" },
    { time: 50, type: "Ventricular Fibrillation" },
    { time: 98, type: "CPR Started", participantId: "P3" },
    { time: 215, type: "Shock Delivered", participantId: "P1", detail: "200J biphasic" },
    { time: 230, type: "Adrenaline Given", participantId: "P3", detail: "1mg IV" },
    { time: 300, type: "Rhythm Check" },
    { time: 305, type: "Shock Delivered", participantId: "P1", detail: "200J biphasic" },
    { time: 320, type: "Adrenaline Given", participantId: "P3", detail: "1mg IV" },
    { time: 420, type: "Rhythm Check" },
    { time: 600, type: "Scenario Finished" },
  ],
  instructorNotes: [
    {
      text: "No one clearly took the team-leader role in the first two minutes; tasks overlapped and the airway was managed before compressions began.",
      author: "Instructor",
    },
    {
      time: 98,
      text: "Long pause before compressions — the team waited for the monitor instead of starting hands-on straight away.",
      author: "Instructor",
    },
    {
      time: 215,
      text: "Defibrillation was late: pads were applied slowly and charging was hesitant.",
      author: "Instructor",
    },
  ],
  ai: {
    generated: true,
    summary:
      "A difficult resuscitation with several avoidable delays. Compressions did not begin until 48s after VF was recognised, and the first shock was delayed to 2:45 into the arrest. No return of spontaneous circulation was achieved during the scenario. The priorities for the debrief are early, high-quality compressions and a faster route to defibrillation.",
    discussionPoints: [
      {
        text: "Compressions started 48s after arrest was recognised — what got in the way of going hands-on immediately?",
        atTime: 98,
      },
      {
        text: "The first shock came 2:45 after VF. Walk through the defibrillation workflow — pad placement, charging, clearing — to find where the time was lost.",
        atTime: 215,
      },
      {
        text: "Role allocation looked unclear early on. How could the team establish a clear leader faster next time?",
      },
    ],
    momentsToReview: [
      {
        time: 98,
        reason: "48s delay to first compressions — the single biggest time loss in this run.",
      },
      {
        time: 215,
        reason: "First defibrillation at 2:45 from arrest — well beyond the rule-of-thumb window.",
      },
    ],
  },
};
