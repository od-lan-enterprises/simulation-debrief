import { Sparkles } from "lucide-react";
import type { AiDebrief } from "@/lib/types";
import { formatClock } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TierTag } from "./provenance";

/**
 * AI-tier panel. In this prototype the content is pre-baked per case (no live
 * API), but it is grounded in the calculated facts and clearly marked as
 * generated, advisory output — distinct from source and calculated tiers.
 */
export function AiDebrief({ debrief }: { debrief: AiDebrief }) {
  return (
    <Card className="border-tier-ai/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-tier-ai" />
              AI-assisted debrief
            </CardTitle>
            <CardDescription>
              Suggested talking points for the instructor — not a verdict.
            </CardDescription>
          </div>
          <TierTag tier="ai" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed">{debrief.summary}</p>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Suggested discussion points
          </h4>
          <ul className="space-y-2">
            {debrief.discussionPoints.map((dp, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tier-ai" />
                <span className="leading-snug">
                  {dp.text}
                  {dp.atTime !== undefined && (
                    <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                      @ {formatClock(dp.atTime)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {debrief.momentsToReview.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Moments worth reviewing
            </h4>
            <ul className="space-y-1.5">
              {debrief.momentsToReview.map((mo, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="shrink-0 font-mono text-xs text-tier-ai">
                    {formatClock(mo.time)}
                  </span>
                  <span className="leading-snug text-muted-foreground">
                    {mo.reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="border-t pt-3 text-xs text-muted-foreground">
          Generated, advisory content. The instructor decides what matters —
          this is a prompt for discussion, not clinical guidance.
        </p>
      </CardContent>
    </Card>
  );
}
