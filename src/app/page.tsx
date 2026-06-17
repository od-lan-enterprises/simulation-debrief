import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Design shell — verifies the clinical palette and the three provenance tiers
 * render before we wire in real data. The actual session-review UI replaces
 * this in the next step.
 */

const TIERS = [
  {
    key: "source",
    label: "Source event",
    blurb: "Raw, straight from the simulator. Ground truth — never altered.",
    example: "Ventricular Fibrillation @ 01:05",
    dot: "bg-tier-source",
    chip: "bg-tier-source-soft text-tier-source",
  },
  {
    key: "calculated",
    label: "Calculated fact",
    blurb: "Deterministically derived from source events. Reproducible.",
    example: "17s from arrest to first compressions",
    dot: "bg-tier-calculated",
    chip: "bg-tier-calculated-soft text-tier-calculated",
  },
  {
    key: "ai",
    label: "AI suggestion",
    blurb: "Generated, advisory. For the instructor to weigh — not fact.",
    example: "Consider discussing the time to defibrillation",
    dot: "bg-tier-ai",
    chip: "bg-tier-ai-soft text-tier-ai",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Activity className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Simulation Debrief
          </h1>
          <p className="text-sm text-muted-foreground">
            A flight-recorder for healthcare simulation sessions
          </p>
        </div>
      </header>

      <Separator className="my-8" />

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Provenance model
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Everything this tool shows is tagged by where it came from. Keeping
            these three apart is the core idea of the prototype.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <Card key={tier.key}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${tier.dot}`} />
                  <CardTitle className="text-base">{tier.label}</CardTitle>
                </div>
                <CardDescription>{tier.blurb}</CardDescription>
              </CardHeader>
              <CardContent>
                <span
                  className={`inline-block rounded-md px-2 py-1 font-mono text-xs ${tier.chip}`}
                >
                  {tier.example}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        Prototype for review of simulated training sessions — not clinical
        guidance.
      </p>
    </main>
  );
}
