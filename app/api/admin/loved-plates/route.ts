import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const tagSchema = z.object({
  labelEn: z.string().min(1),
  labelAr: z.string().min(1),
  tone: z.enum(["green", "orange"]),
  sortOrder: z.number().int().min(0).optional(),
});

const createSchema = z.object({
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().min(1),
  galleryUrls: z.array(z.string()).max(6).optional(),
  proteinG: z.number().int().min(0).optional().nullable(),
  carbsG: z.number().int().min(0).optional().nullable(),
  calories: z.number().int().min(0).optional().nullable(),
  ingredientsEn: z.string().optional().nullable(),
  ingredientsAr: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  tags: z.array(tagSchema).optional(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const plates = await prisma.lovedPlate.findMany({
    orderBy: { sortOrder: "asc" },
    include: { tags: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(plates);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { tags: tagsInput, galleryUrls, ...rest } = parsed.data;
  const plate = await prisma.lovedPlate.create({
    data: {
      ...rest,
      galleryUrls: galleryUrls ?? [],
    },
    include: { tags: true },
  });
  if (tagsInput?.length) {
    await prisma.lovedPlateTag.createMany({
      data: tagsInput.map((t, i) => ({
        plateId: plate.id,
        labelEn: t.labelEn,
        labelAr: t.labelAr,
        tone: t.tone,
        sortOrder: t.sortOrder ?? i,
      })),
    });
    const withTags = await prisma.lovedPlate.findUnique({
      where: { id: plate.id },
      include: { tags: { orderBy: { sortOrder: "asc" } } },
    });
    revalidateSite();
    return NextResponse.json(withTags ?? plate);
  }
  revalidateSite();
  return NextResponse.json(plate);
}
