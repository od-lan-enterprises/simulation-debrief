import Link from "next/link";
import { Activity } from "lucide-react";
import { ProvenanceLegend } from "./provenance";

/** Shared top-of-page chrome: product title (links home) + provenance legend. */
export function AppHeader() {
  return (
    <div>
      <Link href="/" className="flex w-fit items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Activity className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Simulation Debrief
          </h1>
          <p className="text-sm text-muted-foreground">
            Review completed healthcare-simulation sessions
          </p>
        </div>
      </Link>
      <div className="mt-5 rounded-lg border bg-card px-4 py-3">
        <ProvenanceLegend />
      </div>
    </div>
  );
}
