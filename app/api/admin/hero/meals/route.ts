import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const MAX_HERO_MEALS = 3;

const createMealSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  calories: z.number().int().min(0).optional().nullable(),
  protein: z.number().int().min(0).optional().nullable(),
  badge: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const meals = await prisma.heroMeal.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(meals);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const count = await prisma.heroMeal.count();
  if (count >= MAX_HERO_MEALS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_HERO_MEALS} hero meals allowed` },
      { status: 400 }
    );
  }
  const body = await req.json();
  const parsed = createMealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const nextOrder = count;
  const meal = await prisma.heroMeal.create({
    data: {
      title: parsed.data.title,
      subtitle: parsed.data.subtitle ?? undefined,
      calories: parsed.data.calories ?? undefined,
      protein: parsed.data.protein ?? undefined,
      badge: parsed.data.badge ?? undefined,
      imageUrl: parsed.data.imageUrl ?? undefined,
      sortOrder: nextOrder,
    },
  });
  revalidateSite();
  return NextResponse.json(meal);
}
