import { sessionsForStudent, student } from "@/data";
import { deriveTrends } from "@/lib/trends";
import { ParticipantOverview } from "@/components/participant-overview";

export default function Home() {
  const sessions = sessionsForStudent(student);
  const trends = deriveTrends(sessions);
  return (
    <ParticipantOverview student={student} sessions={sessions} trends={trends} />
  );
}
