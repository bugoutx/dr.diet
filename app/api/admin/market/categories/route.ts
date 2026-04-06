import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const createSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const categories = await prisma.marketCategory.findMany({
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
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
  const category = await prisma.marketCategory.create({
    data: {
      nameEn: parsed.data.nameEn,
      nameAr: parsed.data.nameAr,
      slug: parsed.data.slug ?? undefined,
      order: parsed.data.order ?? 0,
      isActive: parsed.data.isActive ?? true,
    },
  });
  revalidateSite();
  return NextResponse.json(category);
}
