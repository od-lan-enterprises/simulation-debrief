"use client";

import { Activity } from "lucide-react";
import type { SessionData } from "@/lib/types";
import { deriveMetrics } from "@/lib/metrics";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProvenanceLegend } from "./provenance";
import { SessionHeader } from "./session-header";
import { MetricsPanel } from "./metrics-panel";
import { Timeline } from "./timeline";
import { AiDebrief } from "./ai-debrief";
import { InstructorNotes } from "./instructor-notes";
import { VitalsPanel } from "./vitals-panel";

export function SessionReview({ cases }: { cases: SessionData[] }) {
  const defaultId = cases[0]?.session.id;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Activity className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Simulation Debrief
          </h1>
          <p className="text-sm text-muted-foreground">
            Review a completed session — a flight-recorder for healthcare
            simulation
          </p>
        </div>
      </header>

      <div className="mt-5 rounded-lg border bg-card px-4 py-3">
        <ProvenanceLegend />
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue={defaultId} className="gap-6">
        {cases.length > 1 && (
          <TabsList>
            {cases.map((c) => (
              <TabsTrigger key={c.session.id} value={c.session.id}>
                {c.session.title ?? c.session.id}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {cases.map((c) => {
          const facts = deriveMetrics(c);
          return (
            <TabsContent
              key={c.session.id}
              value={c.session.id}
              keepMounted
              className="space-y-4"
            >
              <SessionHeader data={c} />
              <MetricsPanel facts={facts} />
              <div className="grid gap-4 lg:grid-cols-2">
                <Timeline data={c} />
                {c.ai && <AiDebrief debrief={c.ai} />}
              </div>
              {(c.instructorNotes?.length || c.vitals?.length) && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {c.instructorNotes?.length ? (
                    <InstructorNotes notes={c.instructorNotes} />
                  ) : null}
                  {c.vitals?.length ? <VitalsPanel vitals={c.vitals} /> : null}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <p className="mt-10 text-xs text-muted-foreground">
        Prototype for reviewing simulated training sessions. The rule-of-thumb
        flags are a teaching aid, not clinical guidance.
      </p>
    </main>
  );
}
