import { NextResponse } from "next/server";
import { getPublicHero } from "@/lib/data";

export async function GET() {
  try {
    const data = await getPublicHero();
    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/public/hero:", e);
    return NextResponse.json({ error: "Failed to load hero" }, { status: 500 });
  }
}
