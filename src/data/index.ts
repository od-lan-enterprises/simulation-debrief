import type { SessionData } from "@/lib/types";
import { sim001 } from "./sim001";
import { sim002 } from "./sim002";
import { sim003 } from "./sim003";

export { student } from "./student";

/**
 * The case registry. Add a `SessionData` object and it becomes a reviewable
 * session, listed on the learner's overview and routable at /sessions/[id].
 *
 * The three cases show variance in input data and AI output:
 *   - sim001  textbook run (baseline, no future streams)
 *   - sim002  delayed response (+ instructor notes)
 *   - sim003  re-arrest & recovery, ambiguous (+ vital signs)
 */
export const cases: SessionData[] = [sim001, sim002, sim003];

/** Sessions oldest → newest, for chronological trends and listings. */
export const orderedCases: SessionData[] = [...cases].sort((a, b) =>
  (a.session.date ?? "").localeCompare(b.session.date ?? ""),
);

export function getCaseById(id: string): SessionData | undefined {
  return cases.find((c) => c.session.id === id);
}
