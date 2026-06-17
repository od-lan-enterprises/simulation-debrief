import { HeartPulse } from "lucide-react";
import type { VitalSample } from "@/lib/types";
import { formatClock } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FutureStreamBadge, TierTag } from "./provenance";

/**
 * Simulator vital signs: source-tier data (it comes from the simulator, like
 * events), rendered raw with no judgement applied. Only shown when a case
 * carries a `vitals` stream.
 */
export function VitalsPanel({ vitals }: { vitals: VitalSample[] }) {
  const rows = [...vitals].sort((a, b) => a.time - b.time);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <HeartPulse className="h-4 w-4 text-tier-source" />
              Vital signs
            </CardTitle>
            <CardDescription>
              Recorded by the simulator over the session.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <TierTag tier="source" />
            <FutureStreamBadge />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm [&_td]:py-1.5 [&_th]:pb-2 [&_th]:text-left [&_th]:font-medium">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th>Time</th>
              <th>HR</th>
              <th>SpO₂</th>
              <th>BP</th>
              <th>EtCO₂</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {rows.map((v, i) => (
              <tr key={i} className="border-t border-border">
                <td className="text-muted-foreground">{formatClock(v.time)}</td>
                <td>{v.heartRate ?? "—"}</td>
                <td>{v.spo2 != null ? `${v.spo2}%` : "—"}</td>
                <td>
                  {v.systolic != null
                    ? `${v.systolic}/${v.diastolic ?? "—"}`
                    : "—"}
                </td>
                <td>{v.etco2 ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
