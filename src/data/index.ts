import type { SessionData } from "@/lib/types";
import { sim001 } from "./sim001";
import { sim002 } from "./sim002";
import { sim003 } from "./sim003";

/**
 * The case registry. The whole app is driven by this list — add a `SessionData`
 * object and it appears as a new tab with metrics + debrief computed for it.
 *
 * The three cases are chosen to show variance in input data and AI output:
 *   - sim001  textbook run (baseline, no future streams)
 *   - sim002  delayed response (+ instructor notes)
 *   - sim003  re-arrest & recovery, ambiguous (+ vital signs)
 */
export const cases: SessionData[] = [sim001, sim002, sim003];
