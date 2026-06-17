import type { SessionData } from "@/lib/types";
import { deriveMetrics } from "@/lib/metrics";
import { SessionHeader } from "./session-header";
import { MetricsPanel } from "./metrics-panel";
import { Timeline } from "./timeline";
import { AiDebrief } from "./ai-debrief";
import { InstructorNotes } from "./instructor-notes";
import { VitalsPanel } from "./vitals-panel";

/** The full review of a single session — composed from the tier-tagged panels. */
export function SessionView({ data }: { data: SessionData }) {
  const facts = deriveMetrics(data);
  return (
    <div className="space-y-4">
      <SessionHeader data={data} />
      <MetricsPanel facts={facts} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Timeline data={data} />
        {data.ai && <AiDebrief debrief={data.ai} />}
      </div>
      {(data.instructorNotes?.length || data.vitals?.length) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.instructorNotes?.length ? (
            <InstructorNotes notes={data.instructorNotes} />
          ) : null}
          {data.vitals?.length ? <VitalsPanel vitals={data.vitals} /> : null}
        </div>
      )}
    </div>
  );
}
