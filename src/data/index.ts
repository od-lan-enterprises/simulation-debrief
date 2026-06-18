import type { SessionData, Student } from "@/lib/types";
import { sim001 } from "./sim001";
import { sim002 } from "./sim002";
import { sim003 } from "./sim003";
import { student } from "./student";

export { student };

/**
 * The case registry. Add a `SessionData` object and it becomes a reviewable
 * session, routable at /sessions/[id].
 *
 * The three cases show variance in input data and AI output:
 *   - sim001  textbook run (baseline, no future streams)
 *   - sim002  delayed response (+ instructor notes)
 *   - sim003  re-arrest & recovery, ambiguous (+ vital signs)
 */
export const cases: SessionData[] = [sim001, sim002, sim003];

export function getCaseById(id: string): SessionData | undefined {
  return cases.find((c) => c.session.id === id);
}

/**
 * A learner's own sessions, resolved in their declared chronological order
 * (oldest → newest). The overview and trends are scoped to this list rather than
 * the whole registry: in production a roster would hold each learner's sessions.
 */
export function sessionsForStudent(s: Student): SessionData[] {
  return s.sessionIds
    .map((id) => getCaseById(id))
    .filter((c): c is SessionData => c !== undefined);
}
