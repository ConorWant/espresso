import { ShotTable } from "@/components/ShotTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getShots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/shots`, { cache: "no-store" });
  return res.json();
}

export default async function ShotsPage() {
  const shots = await getShots();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shot History</h1>
          <p className="text-muted-foreground">{shots.length} shots logged</p>
        </div>
        <Button render={<Link href="/shots/new" />}>+ Log Shot</Button>
      </div>
      <ShotTable shots={shots} />
    </div>
  );
}
