import { db } from "@/lib/db";
import { shots } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [shot] = await db
    .select()
    .from(shots)
    .where(eq(shots.id, Number(id)));

  if (!shot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(shot);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { bean_id, dose_g, yield_g, duration_s, grind_setting, rating, notes } =
    body;

  const ratio = yield_g && dose_g ? yield_g / dose_g : null;

  const [shot] = await db
    .update(shots)
    .set({
      bean_id: bean_id || null,
      dose_g: Number(dose_g),
      yield_g: Number(yield_g),
      ratio,
      duration_s: Number(duration_s),
      grind_setting: grind_setting || null,
      rating: rating ? Number(rating) : null,
      notes: notes || null,
    })
    .where(eq(shots.id, Number(id)))
    .returning();

  if (!shot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(shot);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(shots).where(eq(shots.id, Number(id)));
  return NextResponse.json({ success: true });
}
