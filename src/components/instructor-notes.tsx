import { NotebookPen } from "lucide-react";
import type { InstructorNote } from "@/lib/types";
import { formatClock } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FutureStreamBadge } from "./provenance";

/**
 * Instructor notes — human-entered observations. Deliberately styled as neither
 * source, calculated, nor AI: it's a distinct, fourth kind of input (subjective
 * human judgement), kept visually separate so the three machine tiers stay
 * unambiguous. Only shown when a case carries an `instructorNotes` stream.
 */
export function InstructorNotes({ notes }: { notes: InstructorNote[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <NotebookPen className="h-4 w-4 text-muted-foreground" />
              Instructor notes
            </CardTitle>
            <CardDescription>
              Human observations — not machine-recorded or AI-generated.
            </CardDescription>
          </div>
          <FutureStreamBadge />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {notes.map((n, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="w-12 shrink-0 pt-0.5 text-right font-mono text-xs text-muted-foreground">
                {n.time != null ? formatClock(n.time) : "—"}
              </span>
              <p className="leading-snug">
                {n.text}
                {n.author && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    — {n.author}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
