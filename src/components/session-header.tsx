import type { SessionData } from "@/lib/types";
import { formatDuration } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TierTag } from "./provenance";

function Fact({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={`mt-0.5 text-sm font-medium ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

/** Source-tier session facts — straight from the simulator, never altered. */
export function SessionHeader({ data }: { data: SessionData }) {
  const { session, participants } = data;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {session.title ?? session.id}
            </CardTitle>
            {session.scenarioType && (
              <CardDescription>{session.scenarioType}</CardDescription>
            )}
          </div>
          <TierTag tier="source" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Fact label="Session ID" value={session.id} mono />
          <Fact
            label="Duration"
            value={formatDuration(session.durationSeconds)}
          />
          <Fact label="Participants" value={String(participants.length)} />
          <Fact label="Recorded events" value={String(data.events.length)} />
        </dl>
        <div className="flex flex-wrap gap-2">
          {participants.map((p) => (
            <span
              key={p.id}
              className="rounded-md bg-muted px-2 py-1 text-xs"
            >
              <span className="font-medium">{p.role}</span>{" "}
              <span className="font-mono text-muted-foreground">{p.id}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
