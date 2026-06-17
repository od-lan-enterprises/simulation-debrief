import type { SessionData } from "@/lib/types";
import { sim001 } from "./sim001";

/**
 * The case registry. The whole app is driven by this list — add a `SessionData`
 * object and it appears as a new tab with metrics + debrief computed for it.
 * More cases (a clear-failure run, an ambiguous run) are added next.
 */
export const cases: SessionData[] = [sim001];
