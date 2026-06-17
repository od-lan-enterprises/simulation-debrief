import { Fragment } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Trend, TrendDirection } from "@/lib/trends";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TierTag } from "./provenance";

function DirectionChip({ direction }: { direction: TrendDirection }) {
  if (direction === "improving") {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-flag-good-soft text-flag-good">
        <TrendingDown className="h-3 w-3" />
        Improving
      </span>
    );
  }
  if (direction === "worsening") {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-flag-warn-soft text-flag-warn">
        <TrendingUp className="h-3 w-3" />
        Worsening
      </span>
    );
  }
  if (direction === "flat") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Minus className="h-3 w-3" />
        Flat
      </span>
    );
  }
  return null;
}

/**
 * Calculated-tier trend across sessions (oldest → newest). Lower is better for
 * these duration metrics, so a falling series is "improving".
 */
export function TrendStrip({ trends }: { trends: Trend[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Progress across sessions</CardTitle>
            <CardDescription>
              Tracked metrics over time, oldest to newest.
            </CardDescription>
          </div>
          <TierTag tier="calculated" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {trends.map((t) => (
          <div
            key={t.metricId}
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5"
          >
            <span className="w-32 shrink-0 text-sm text-muted-foreground">
              {t.label}
            </span>
            <div className="flex items-center gap-2 font-mono text-sm">
              {t.points.map((p, i) => (
                <Fragment key={p.sessionId}>
                  {i > 0 && (
                    <span className="text-muted-foreground/40">▸</span>
                  )}
                  <span
                    className={cn(
                      "tabular-nums",
                      i === t.points.length - 1 && "font-semibold",
                    )}
                  >
                    {p.display}
                  </span>
                </Fragment>
              ))}
            </div>
            <DirectionChip direction={t.direction} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
