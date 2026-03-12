import { db } from "@/lib/db";
import { beans } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db.select().from(beans).orderBy(desc(beans.created_at));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, producer, region, varietal, process, altitude, roast_date, tasting_notes } = body;

  const [bean] = await db
    .insert(beans)
    .values({
      name,
      producer: producer || null,
      region: region || null,
      varietal: varietal || null,
      process: process || null,
      altitude: altitude || null,
      roast_date: roast_date || null,
      tasting_notes: tasting_notes || null,
      created_at: Date.now(),
    })
    .returning();

  return NextResponse.json(bean, { status: 201 });
}
