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

const updateSchema = z.object({
  categoryId: z.string().optional(),
  nameEn: z.string().min(1).optional(),
  nameAr: z.string().min(1).optional(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  proteinG: z.number().int().min(0).optional().nullable(),
  carbsG: z.number().int().min(0).optional().nullable(),
  calories: z.number().int().min(0).optional().nullable(),
  price: z.string().optional().nullable(),
  tags: z.array(tagSchema).optional(),
  imageUrl: z.string().optional(),
  order: z.number().optional(),
  link: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: { category: true, mealTags: { orderBy: { order: "asc" } } },
  });
  if (!meal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(meal);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { tags: tagsInput, ...rest } = parsed.data;
  const meal = await prisma.meal.update({
    where: { id },
    data: rest,
    include: { category: true, mealTags: { orderBy: { order: "asc" } } },
  });
  if (tagsInput !== undefined) {
    await prisma.mealTag.deleteMany({ where: { mealId: id } });
    if (tagsInput.length > 0) {
      await prisma.mealTag.createMany({
        data: tagsInput.map((t, i) => ({
          mealId: id,
          labelEn: t.labelEn,
          labelAr: t.labelAr,
          tone: t.tone,
          order: i,
        })),
      });
    }
    const updated = await prisma.meal.findUnique({
      where: { id },
      include: { category: true, mealTags: { orderBy: { order: "asc" } } },
    });
    revalidateSite();
    return NextResponse.json(updated ?? meal);
  }
  revalidateSite();
  return NextResponse.json(meal);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.meal.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
