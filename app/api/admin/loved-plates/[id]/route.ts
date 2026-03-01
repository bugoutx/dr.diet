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

const updateSchema = z.object({
  titleEn: z.string().min(1).optional(),
  titleAr: z.string().min(1).optional(),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const plate = await prisma.lovedPlate.findUnique({
    where: { id },
    include: { tags: { orderBy: { sortOrder: "asc" } } },
  });
  if (!plate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plate);
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
  const { tags: tagsInput, galleryUrls, ...rest } = parsed.data;
  const plate = await prisma.lovedPlate.update({
    where: { id },
    data: { ...rest, ...(galleryUrls !== undefined && { galleryUrls }) },
    include: { tags: { orderBy: { sortOrder: "asc" } } },
  });
  if (tagsInput !== undefined) {
    await prisma.lovedPlateTag.deleteMany({ where: { plateId: id } });
    if (tagsInput.length > 0) {
      await prisma.lovedPlateTag.createMany({
        data: tagsInput.map((t, i) => ({
          plateId: id,
          labelEn: t.labelEn,
          labelAr: t.labelAr,
          tone: t.tone,
          sortOrder: t.sortOrder ?? i,
        })),
      });
    }
    const updated = await prisma.lovedPlate.findUnique({
      where: { id },
      include: { tags: { orderBy: { sortOrder: "asc" } } },
    });
    revalidateSite();
    return NextResponse.json(updated ?? plate);
  }
  revalidateSite();
  return NextResponse.json(plate);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.lovedPlate.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
