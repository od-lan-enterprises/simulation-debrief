import type { SessionData, Student } from "@/lib/types";
import type { Trend } from "@/lib/trends";
import { Breadcrumb } from "./breadcrumb";
import { TrendStrip } from "./trend-strip";
import { ProgressionNote } from "./progression-note";
import { SessionCard } from "./session-card";

/**
 * The learner overview — the app's home. One mock student, their sessions, and a
 * cross-session view: a calculated trend strip and an AI progress summary. Each
 * session card routes into the full review. (A roster sits above this in
 * production; the breadcrumb implies it without building an empty selector.)
 */
export function ParticipantOverview({
  student,
  sessions,
  trends,
}: {
  student: Student;
  sessions: SessionData[]; // oldest → newest
  trends: Trend[];
}) {
  const newestFirst = [...sessions].reverse();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Roster" }, { label: student.name }]} />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {student.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {student.descriptor} · {sessions.length} sessions reviewed
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TrendStrip trends={trends} />
        <ProgressionNote text={student.aiProgression} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Sessions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {newestFirst.map((c) => (
            <SessionCard key={c.session.id} data={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
