import { db } from "@/lib/db";
import { beans, shots } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db
    .select({
      id: shots.id,
      bean_id: shots.bean_id,
      bean_name: beans.name,
      dose_g: shots.dose_g,
      yield_g: shots.yield_g,
      ratio: shots.ratio,
      duration_s: shots.duration_s,
      grind_setting: shots.grind_setting,
      rating: shots.rating,
      notes: shots.notes,
      created_at: shots.created_at,
    })
    .from(shots)
    .leftJoin(beans, eq(shots.bean_id, beans.id))
    .orderBy(desc(shots.created_at));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { bean_id, dose_g, yield_g, duration_s, grind_setting, rating, notes } =
    body;

  const ratio = yield_g && dose_g ? yield_g / dose_g : null;

  const [shot] = await db
    .insert(shots)
    .values({
      bean_id: bean_id || null,
      dose_g: Number(dose_g),
      yield_g: Number(yield_g),
      ratio,
      duration_s: Number(duration_s),
      grind_setting: grind_setting || null,
      rating: rating ? Number(rating) : null,
      notes: notes || null,
      created_at: Date.now(),
    })
    .returning();

  return NextResponse.json(shot, { status: 201 });
}
