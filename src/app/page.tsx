import { orderedCases, student } from "@/data";
import { deriveTrends } from "@/lib/trends";
import { ParticipantOverview } from "@/components/participant-overview";

export default function Home() {
  const trends = deriveTrends(orderedCases);
  return (
    <ParticipantOverview
      student={student}
      sessions={orderedCases}
      trends={trends}
    />
  );
}
