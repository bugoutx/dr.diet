import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const tagSchema = z.object({
  labelEn: z.string().min(1),
  labelAr: z.string().min(1),
  tone: z.enum(["green", "orange"]),
});

const createSchema = z.object({
  categoryId: z.string(),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  proteinG: z.number().int().min(0).optional().nullable(),
  carbsG: z.number().int().min(0).optional().nullable(),
  calories: z.number().int().min(0).optional().nullable(),
  price: z.string().optional().nullable(),
  tags: z.array(tagSchema).optional(),
  imageUrl: z.string().min(1),
  order: z.number().optional(),
  link: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const meals = await prisma.meal.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: { order: "asc" },
    include: { category: true, mealTags: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(meals);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const meal = await prisma.meal.create({
    data: {
      categoryId: parsed.data.categoryId,
      nameEn: parsed.data.nameEn,
      nameAr: parsed.data.nameAr,
      descriptionEn: parsed.data.descriptionEn ?? undefined,
      descriptionAr: parsed.data.descriptionAr ?? undefined,
      proteinG: parsed.data.proteinG ?? undefined,
      carbsG: parsed.data.carbsG ?? undefined,
      calories: parsed.data.calories ?? undefined,
      price: parsed.data.price ?? undefined,
      imageUrl: parsed.data.imageUrl,
      order: parsed.data.order ?? 0,
      link: parsed.data.link ?? undefined,
    },
    include: { category: true, mealTags: true },
  });
  if (parsed.data.tags?.length) {
    await prisma.mealTag.createMany({
      data: parsed.data.tags.map((t, i) => ({
        mealId: meal.id,
        labelEn: t.labelEn,
        labelAr: t.labelAr,
        tone: t.tone,
        order: i,
      })),
    });
    const withTags = await prisma.meal.findUnique({
      where: { id: meal.id },
      include: { category: true, mealTags: { orderBy: { order: "asc" } } },
    });
    revalidateSite();
    return NextResponse.json(withTags ?? meal);
  }
  revalidateSite();
  return NextResponse.json(meal);
}
