import { cases } from "@/data";
import { SessionReview } from "@/components/session-review";

export default function Home() {
  return <SessionReview cases={cases} />;
}
