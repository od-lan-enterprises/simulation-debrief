import { Sparkles } from "lucide-react";
import type { SessionData } from "@/lib/types";
import { formatClock } from "@/lib/format";
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

/**
 * Source-tier timeline. Each row is a raw event, rendered as-is. Where the AI
 * has flagged a moment for review, a clearly-tagged AI marker sits alongside.
 * The event stays source-tier; only the flag is AI.
 */
export function Timeline({ data }: { data: SessionData }) {
  const events = [...data.events].sort((a, b) => a.time - b.time);
  const roleById = new Map(data.participants.map((p) => [p.id, p.role]));
  const aiMoments = new Map(
    (data.ai?.momentsToReview ?? []).map((mo) => [mo.time, mo.reason]),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Session timeline</CardTitle>
            <CardDescription>
              Every event the simulator recorded, in order.
            </CardDescription>
          </div>
          <TierTag tier="source" />
        </div>
      </CardHeader>
      <CardContent>
        <ol className="relative">
          {events.map((e, i) => {
            const role = e.participantId
              ? roleById.get(e.participantId)
              : undefined;
            const meta = [role, e.detail].filter(Boolean).join(" · ");
            const aiReason = aiMoments.get(e.time);
            const isLast = i === events.length - 1;
            return (
              <li
                key={`${e.time}-${e.type}-${i}`}
                className="relative grid grid-cols-[3rem_1rem_1fr] gap-3 pb-5 last:pb-0"
              >
                <time className="pt-px text-right font-mono text-xs text-muted-foreground">
                  {formatClock(e.time)}
                </time>
                <div className="relative flex justify-center">
                  <span className="z-10 mt-1 h-2.5 w-2.5 rounded-full bg-tier-source ring-4 ring-card" />
                  {!isLast && (
                    <span className="absolute top-1.5 bottom-[-1.25rem] w-px bg-border" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{e.type}</span>
                    {aiReason && (
                      <Tooltip>
                        <TooltipTrigger
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                            "bg-tier-ai-soft text-tier-ai",
                          )}
                        >
                          <Sparkles className="h-2.5 w-2.5" />
                          Worth reviewing
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          {aiReason}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {meta && (
                    <p className="text-xs text-muted-foreground">{meta}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
