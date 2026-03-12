import { ShotForm } from "@/components/ShotForm";
import { notFound } from "next/navigation";

async function getShot(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/shots/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditShotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shot = await getShot(id);
  if (!shot) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <ShotForm
        editId={shot.id}
        defaultValues={{
          bean_id: shot.bean_id ? String(shot.bean_id) : undefined,
          dose_g: shot.dose_g,
          yield_g: shot.yield_g,
          duration_s: shot.duration_s,
          grind_setting: shot.grind_setting ?? undefined,
          rating: shot.rating ?? undefined,
          notes: shot.notes ?? undefined,
        }}
      />
    </div>
  );
}
