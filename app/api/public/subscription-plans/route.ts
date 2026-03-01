import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(plans);
  } catch (e) {
    console.error("GET /api/public/subscription-plans:", e);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }
}
