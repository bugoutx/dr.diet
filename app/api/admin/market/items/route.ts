import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const optionalInt = z
  .union([
    z.number().int().min(0),
    z.string().transform((s) => (s === "" ? undefined : Number(s))),
  ])
  .optional()
  .nullable();

const createSchema = z.object({
  categoryId: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  price: optionalInt,
  image: z.string().min(1),
  protein: optionalInt,
  carbs: optionalInt,
  calories: optionalInt,
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const items = await prisma.marketItem.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: { order: "asc" },
    include: { category: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const item = await prisma.marketItem.create({
    data: {
      categoryId: parsed.data.categoryId,
      nameEn: parsed.data.nameEn,
      nameAr: parsed.data.nameAr,
      descriptionEn: parsed.data.descriptionEn ?? undefined,
      descriptionAr: parsed.data.descriptionAr ?? undefined,
      price: parsed.data.price ?? undefined,
      image: parsed.data.image,
      protein: parsed.data.protein ?? undefined,
      carbs: parsed.data.carbs ?? undefined,
      calories: parsed.data.calories ?? undefined,
      order: parsed.data.order ?? 0,
      isActive: parsed.data.isActive ?? true,
    },
    include: { category: true },
  });
  revalidateSite();
  return NextResponse.json(item);
}
