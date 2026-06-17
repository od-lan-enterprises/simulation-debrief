import { notFound } from "next/navigation";
import { cases, getCaseById, student } from "@/data";
import { Breadcrumb } from "@/components/breadcrumb";
import { SessionView } from "@/components/session-view";

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.session.id }));
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = getCaseById(id);
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Roster" },
          { label: student.name, href: "/" },
          { label: data.session.title ?? data.session.id },
        ]}
      />
      <SessionView data={data} />
    </div>
  );
}
