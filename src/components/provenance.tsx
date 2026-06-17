import { cn } from "@/lib/utils";
import type { ProvenanceTier } from "@/lib/types";

/**
 * Single source of truth for how each provenance tier looks. Keeping the three
 * tiers visually distinct and consistent everywhere is the core idea of the UI.
 */
export const TIER_META: Record<
  ProvenanceTier,
  {
    label: string;
    short: string;
    description: string;
    dot: string;
    text: string;
    soft: string;
    border: string;
  }
> = {
  source: {
    label: "Source events",
    short: "Source",
    description: "raw, from the simulator",
    dot: "bg-tier-source",
    text: "text-tier-source",
    soft: "bg-tier-source-soft",
    border: "border-tier-source",
  },
  calculated: {
    label: "Calculated facts",
    short: "Calculated",
    description: "derived deterministically",
    dot: "bg-tier-calculated",
    text: "text-tier-calculated",
    soft: "bg-tier-calculated-soft",
    border: "border-tier-calculated",
  },
  ai: {
    label: "AI suggestions",
    short: "AI",
    description: "generated, advisory",
    dot: "bg-tier-ai",
    text: "text-tier-ai",
    soft: "bg-tier-ai-soft",
    border: "border-tier-ai",
  },
};

/** Compact pill used as a section header tag, e.g. on each panel. */
export function TierTag({
  tier,
  className,
}: {
  tier: ProvenanceTier;
  className?: string;
}) {
  const m = TIER_META[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        m.soft,
        m.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.short}
    </span>
  );
}

/**
 * Marks a panel fed by a data stream the brief lists as "future" (vitals,
 * instructor notes, …). Signals the schema already absorbs it: the design
 * evolving, shown rather than described.
 */
export function FutureStreamBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      Future stream
    </span>
  );
}

/** Explains the colour code once, near the top of the page. */
export function ProvenanceLegend() {
  const order: ProvenanceTier[] = ["source", "calculated", "ai"];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">How to read this</span>
      {order.map((t) => {
        const m = TIER_META[t];
        return (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", m.dot)} />
            <span className="font-medium text-foreground">{m.label}</span>
            <span className="text-muted-foreground">: {m.description}</span>
          </span>
        );
      })}
    </div>
  );
}
