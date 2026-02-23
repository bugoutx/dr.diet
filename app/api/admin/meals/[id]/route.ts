import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  calories: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  order: z.number().optional(),
  link: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!meal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(meal);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const meal = await prisma.meal.update({
    where: { id },
    data: parsed.data,
    include: { category: true },
  });
  return NextResponse.json(meal);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.meal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
