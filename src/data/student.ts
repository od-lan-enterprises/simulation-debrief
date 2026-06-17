import type { Student } from "@/lib/types";

/**
 * The one mock learner. In production this record would come from a roster, and
 * `aiProgression` would be generated from the learner's metric history. Here it
 * is pre-baked and clearly tagged as AI-tier (advisory) in the UI.
 */
export const student: Student = {
  id: "jordan-lee",
  name: "Jordan Lee",
  descriptor: "Paramedic trainee",
  sessionIds: ["SIM002", "SIM003", "SIM001"], // oldest → newest
  aiProgression:
    "Jordan's time to compressions has improved sharply across the three sessions (48s → 17s), and the first shock is coming faster too — though defibrillation timing is still a little inconsistent. The next session is worth focusing on a fast, confident path to the first shock.",
};
