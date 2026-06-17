import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TierTag } from "./provenance";

/**
 * AI-tier read of the learner's progress. Pre-baked here; in production it would
 * be generated from the calculated trends. Clearly advisory, not an assessment.
 */
export function ProgressionNote({ text }: { text: string }) {
  return (
    <Card className="border-tier-ai/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-tier-ai" />
              AI progress summary
            </CardTitle>
            <CardDescription>
              How this learner is trending, for the instructor to weigh.
            </CardDescription>
          </div>
          <TierTag tier="ai" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{text}</p>
        <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
          Generated from the calculated trends. Advisory, not a formal
          assessment.
        </p>
      </CardContent>
    </Card>
  );
}
