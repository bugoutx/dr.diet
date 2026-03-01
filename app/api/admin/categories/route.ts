import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const createSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  order: z.number().optional(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      meals: { orderBy: { order: "asc" } },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const category = await prisma.category.create({
    data: {
      nameEn: parsed.data.nameEn,
      nameAr: parsed.data.nameAr,
      descriptionEn: parsed.data.descriptionEn ?? undefined,
      descriptionAr: parsed.data.descriptionAr ?? undefined,
      order: parsed.data.order ?? 0,
    },
  });
  revalidateSite();
  return NextResponse.json(category);
}
