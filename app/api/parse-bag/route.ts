import { parseBagImage } from "@/lib/anthropic";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { image, mimeType } = await request.json();

  if (!image || !mimeType) {
    return NextResponse.json(
      { error: "image and mimeType are required" },
      { status: 400 }
    );
  }

  const result = await parseBagImage(image, mimeType);
  return NextResponse.json(result);
}
