import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  calories: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().min(1),
  order: z.number().optional(),
  link: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const meals = await prisma.meal.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: { order: "asc" },
    include: { category: true },
  });
  return NextResponse.json(meals);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const meal = await prisma.meal.create({
    data: {
      categoryId: parsed.data.categoryId,
      name: parsed.data.name,
      description: parsed.data.description ?? undefined,
      calories: parsed.data.calories ?? undefined,
      price: parsed.data.price ?? undefined,
      tags: parsed.data.tags ?? [],
      imageUrl: parsed.data.imageUrl,
      order: parsed.data.order ?? 0,
      link: parsed.data.link ?? undefined,
    },
    include: { category: true },
  });
  return NextResponse.json(meal);
}
