import type { Metadata } from "next";
import type { ProvenanceTier } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { TierTag, TIER_META } from "@/components/provenance";

export const metadata: Metadata = {
  title: "Design notes — Simulation Debrief",
  description:
    "The thinking behind the prototype: provenance, the deterministic-vs-AI split, key trade-offs, and how the design evolves.",
};

const TIER_ORDER: ProvenanceTier[] = ["source", "calculated", "ai"];

const DETERMINISTIC = [
  "Ingesting and ordering the source events.",
  "Every calculated fact (the metrics engine is a pure, unit-tested function of the events).",
  "The rule-of-thumb pass / review flags: simple named thresholds in code.",
  "The cross-session trend values and their direction.",
  "Any number an instructor might quote back in the debrief.",
];

const AI_ASSISTED = [
  "The natural-language debrief summary.",
  "Suggested discussion points and instructor prompts.",
  'Identifying "moments worth reviewing" from softer signals.',
  "The plain-language read of a learner's progress trend.",
  "Tone: encouraging for a strong run, direct for a poor one, questioning for an ambiguous one.",
];

const DECISIONS: { decision: string; why: string; traded: string }[] = [
  {
    decision: "Provenance made unmissable in the UI.",
    why: "Each datum carries a coloured tag plus a dot (not colour alone, for accessibility), a legend sits at the top, and every calculated metric shows a trail back to the source events it came from.",
    traded:
      "A little visual repetition, deliberately, so the trust model is never ambiguous.",
  },
  {
    decision: "Pre-baked AI, not a live API call.",
    why: "The brief permits simulated AI. Pre-baking removes secrets, latency, cost, and fragility for no evaluative gain, and lets the outputs be grounded in the calculated facts.",
    traded:
      "It does not demonstrate a live integration, mitigated by an interface a real model call drops in behind unchanged.",
  },
  {
    decision: "Moderate clinical depth, not formal scoring.",
    why: "Rule-of-thumb timings with a disclaimer, not a named clinical standard. The goal is domain insight, not medical authority.",
    traded:
      "Less authoritative, on purpose: any wrong official number is a liability to defend.",
  },
  {
    decision: "Three contrasting cases, not one or five.",
    why: "Textbook, clear failure, and ambiguous re-arrest prove the engine responds to data rather than hardcoded text, and exercise the AI's full tonal range.",
    traded:
      "The engine is cheap to extend, but believable AI text per case is the real cost, so three is the sweet spot.",
  },
  {
    decision: "Two-level information architecture.",
    why: "A learner overview leads into the per-session review, because the real instructor job is tracking someone over time, and it reinforces the same tiers one level up.",
    traded:
      "A little extra scope, kept in check with one mock learner and a breadcrumb that implies a roster.",
  },
  {
    decision: "Static app, no backend.",
    why: "Typed in-repo case data and a fully static export give a live URL with zero infrastructure.",
    traded: "No persistence, which is correct for a prototype and out of scope.",
  },
];

const QA: { q: string; a: string }[] = [
  {
    q: "Why should I trust the AI summary?",
    a: "You should not trust it as fact, and that is the design. It only narrates numbers the deterministic engine computed, those numbers sit next to it with their provenance, and it is labelled advisory. In production the model receives the events plus the computed facts as grounding guardrails.",
  },
  {
    q: "What is deterministic versus AI, exactly?",
    a: "Deterministic: ingestion, every metric, the threshold flags, the trend numbers and direction. AI: the summary, discussion points, moments worth reviewing, tone, and the plain-language read of the trend. The split is physical in the codebase, which is why one half can be unit-tested.",
  },
  {
    q: "How does it handle the future data streams?",
    a: "They are optional fields on the case type; the UI shows only what is present. Vital signs already render in the re-arrest case and instructor notes in the delayed-response case. Adding a stream is additive, with no rework.",
  },
  {
    q: "Where could it mislead an instructor?",
    a: "A single metric can understate a messy run, which is why the re-arrest case's AI flags that 'time to ROSC' captures only the first ROSC and asks questions instead of giving verdicts. The thresholds are illustrative, not clinical, and are disclaimed.",
  },
  {
    q: "What changes when you wire a real model?",
    a: "Nothing structural. The same interface, fed the events plus the computed facts, keeping the label and the disclaimer, with evals so the model cannot assert a number the engine did not produce.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Overview", href: "/" }, { label: "Design notes" }]}
      />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Design notes</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          The thinking behind this prototype: the organising idea, the
          deterministic-versus-AI split, the key trade-offs, and how the design
          is meant to evolve. Written to read before the walkthrough.
        </p>
      </div>

      {/* The one idea: provenance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">The one idea: provenance</CardTitle>
          <CardDescription>
            The brief asks twice to distinguish source events, calculated facts,
            and AI suggestions. So every item on screen belongs to exactly one
            tier and is tagged that way, consistently, everywhere.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {TIER_ORDER.map((t) => (
            <div key={t} className="flex items-start gap-3">
              <TierTag tier={t} className="mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {TIER_META[t].label}:
                </span>{" "}
                {TIER_META[t].description}.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* The determinism split */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          The determinism split (the graded core)
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-tier-calculated/30">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">Deterministic</CardTitle>
                  <CardDescription>
                    Reproducible and auditable. No model involved.
                  </CardDescription>
                </div>
                <TierTag tier="calculated" />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {DETERMINISTIC.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tier-calculated" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-tier-ai/30">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">AI-assisted</CardTitle>
                  <CardDescription>
                    Inference and language, where judgement adds value.
                  </CardDescription>
                </div>
                <TierTag tier="ai" />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {AI_ASSISTED.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tier-ai" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          In production the AI layer would receive the source events and the
          already-computed deterministic facts, and generate language grounded
          in them. The facts act as guardrails against hallucination. The
          pre-baked outputs here are written exactly that way.
        </p>
      </div>

      {/* Decisions and trade-offs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key decisions and trade-offs</CardTitle>
          <CardDescription>
            What I chose, why, and what each choice traded away.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {DECISIONS.map((d, i) => (
              <li
                key={i}
                className="border-t pt-4 first:border-t-0 first:pt-0"
              >
                <p className="text-sm font-medium">{d.decision}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d.why}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-medium uppercase tracking-wide">
                    Traded:
                  </span>{" "}
                  {d.traded}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Designed to evolve */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Designed to evolve</CardTitle>
          <CardDescription>
            The future data streams the brief lists are absorbed by
            demonstration, not by promise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Participant movement, communication frequency, CPR quality, vital
            signs, instructor notes, and AI observations are optional, additive
            fields on the case type, and each panel renders only when its data is
            present. Two are already wired in: instructor notes (a distinct human
            &ldquo;fourth voice&rdquo;) in the delayed-response case, and
            simulator vital signs in the re-arrest case. The UI degrades
            gracefully when a stream is absent.
          </p>
        </CardContent>
      </Card>

      {/* Anticipated questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Anticipated questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {QA.map((item, i) => (
              <li key={i} className="border-t pt-4 first:border-t-0 first:pt-0">
                <p className="text-sm font-medium">{item.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
