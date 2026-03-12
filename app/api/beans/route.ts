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
  const { name, roaster, origin, roast_date, notes } = body;

  const [bean] = await db
    .insert(beans)
    .values({
      name,
      roaster: roaster || null,
      origin: origin || null,
      roast_date: roast_date || null,
      notes: notes || null,
      created_at: Date.now(),
    })
    .returning();

  return NextResponse.json(bean, { status: 201 });
}
