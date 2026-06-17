import { Info } from "lucide-react";
import type { DerivedFacts, Metric } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TierTag } from "./provenance";

function StatusPill({ status }: { status: Metric["status"] }) {
  if (status === "neutral") return null;
  const good = status === "good";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        good
          ? "bg-flag-good-soft text-flag-good"
          : "bg-flag-warn-soft text-flag-warn",
      )}
    >
      {good ? "On track" : "Review"}
    </span>
  );
}

function MetricCell({ m }: { m: Metric }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-muted-foreground">{m.label}</span>
        {m.derivedFrom.length > 0 && (
          <Tooltip>
            <TooltipTrigger
              aria-label={`How ${m.label} was derived`}
              className="-m-1 rounded p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <Info className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="mb-1 font-medium">Derived from source events</p>
              <ul className="space-y-0.5">
                {m.derivedFrom.map((d, i) => (
                  <li key={i} className="font-mono opacity-90">
                    {d}
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="mt-1 font-mono text-2xl tabular-nums">{m.display}</div>
      <div className="mt-1.5 flex items-center gap-2">
        <StatusPill status={m.status} />
      </div>
      {m.note && (
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {m.note}
        </p>
      )}
    </div>
  );
}

/** Calculated-tier panel: deterministic facts derived from the source events. */
export function MetricsPanel({ facts }: { facts: DerivedFacts }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Calculated facts</CardTitle>
            <CardDescription>
              Computed deterministically from the timeline: reproducible, no AI.
            </CardDescription>
          </div>
          <TierTag tier="calculated" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {facts.metrics.map((m) => (
            <MetricCell key={m.id} m={m} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
