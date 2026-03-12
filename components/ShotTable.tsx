"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ShotRow {
  id: number;
  bean_name: string | null;
  dose_g: number;
  yield_g: number;
  ratio: number | null;
  duration_s: number;
  grind_setting: string | null;
  rating: number | null;
  created_at: number;
}

interface ShotTableProps {
  shots: ShotRow[];
}

function ratingColor(r: number) {
  if (r >= 8) return "default";
  if (r >= 5) return "secondary";
  return "destructive";
}

export function ShotTable({ shots }: ShotTableProps) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this shot?")) return;
    await fetch(`/api/shots/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Bean</TableHead>
            <TableHead className="text-right">Dose</TableHead>
            <TableHead className="text-right">Yield</TableHead>
            <TableHead className="text-right">Ratio</TableHead>
            <TableHead className="text-right">Time</TableHead>
            <TableHead>Grind</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {shots.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No shots logged yet.{" "}
                <Link href="/shots/new" className="underline">
                  Log your first shot
                </Link>
              </TableCell>
            </TableRow>
          )}
          {shots.map((shot) => (
            <TableRow key={shot.id}>
              <TableCell className="whitespace-nowrap text-sm">
                {new Date(shot.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm">
                {shot.bean_name ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {shot.dose_g}g
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {shot.yield_g}g
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {shot.ratio ? `1:${shot.ratio.toFixed(2)}` : "—"}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {shot.duration_s}s
              </TableCell>
              <TableCell className="text-sm">
                {shot.grind_setting ?? "—"}
              </TableCell>
              <TableCell className="text-center">
                {shot.rating != null ? (
                  <Badge variant={ratingColor(shot.rating)}>
                    {shot.rating}/10
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button variant="ghost" size="sm" render={<Link href={`/shots/${shot.id}`} />}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(shot.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
