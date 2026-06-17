import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SessionData } from "@/lib/types";
import { deriveMetrics } from "@/lib/metrics";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/** A clickable summary of one session on the learner overview. */
export function SessionCard({ data }: { data: SessionData }) {
  const facts = deriveMetrics(data);
  const cpr = facts.metrics.find((m) => m.id === "time-to-cpr");
  const rosc = facts.roscAchieved;
  const { session } = data;

  return (
    <Link href={`/sessions/${session.id}`} className="group block">
      <Card className="h-full gap-3 p-4 transition-colors hover:border-primary/40 hover:bg-accent/30">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {session.date ? formatDate(session.date) : session.id}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              rosc
                ? "bg-flag-good-soft text-flag-good"
                : "bg-flag-warn-soft text-flag-warn",
            )}
          >
            {rosc ? "ROSC" : "No ROSC"}
          </span>
        </div>

        <div>
          <h3 className="font-medium">{session.title ?? session.id}</h3>
          {session.scenarioType && (
            <p className="text-xs text-muted-foreground">
              {session.scenarioType}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Time to CPR{" "}
            <span className="ml-1 font-mono text-sm tabular-nums text-foreground">
              {cpr?.display ?? "—"}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </Card>
    </Link>
  );
}
