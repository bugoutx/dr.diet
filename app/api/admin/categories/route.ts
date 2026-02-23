import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional().nullable(),
  order: z.number().optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      meals: { orderBy: { order: "asc" } },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const category = await prisma.category.create({
    data: {
      label: parsed.data.label,
      description: parsed.data.description ?? undefined,
      order: parsed.data.order ?? 0,
    },
  });
  return NextResponse.json(category);
}
