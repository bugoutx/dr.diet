import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";
import { getPublicHero } from "@/lib/data";

const updateHeroSchema = z.object({
  slogan: z.string().optional(),
  sloganAr: z.string().optional().nullable(),
  title: z.string().optional(),
  titleAr: z.string().optional().nullable(),
  description: z.string().optional(),
  descriptionAr: z.string().optional().nullable(),
  ctaLabelEn: z.string().optional().nullable(),
  ctaLabelAr: z.string().optional().nullable(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const data = await getPublicHero();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = updateHeroSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      slogan: d.slogan ?? "Don't eat less, eat Right.",
      sloganAr: d.sloganAr ?? undefined,
      title: d.title ?? "HEALTHY FOOD, DONE RIGHT.",
      titleAr: d.titleAr ?? undefined,
      description: d.description ?? "Dr.Diet is a healthy food restaurant offering fresh salads, energy dishes, sandwiches, breakfasts, toast, juices, smoothies, smart snacks, and sauces. Every dish is crafted with nutrition and flavor in mind.",
      descriptionAr: d.descriptionAr ?? undefined,
      ctaLabelEn: d.ctaLabelEn ?? undefined,
      ctaLabelAr: d.ctaLabelAr ?? undefined,
    },
    update: {
      ...(d.slogan !== undefined && { slogan: d.slogan }),
      ...(d.sloganAr !== undefined && { sloganAr: d.sloganAr }),
      ...(d.title !== undefined && { title: d.title }),
      ...(d.titleAr !== undefined && { titleAr: d.titleAr }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.descriptionAr !== undefined && { descriptionAr: d.descriptionAr }),
      ...(d.ctaLabelEn !== undefined && { ctaLabelEn: d.ctaLabelEn }),
      ...(d.ctaLabelAr !== undefined && { ctaLabelAr: d.ctaLabelAr }),
    },
  });
  revalidateSite();
  const data = await getPublicHero();
  return NextResponse.json(data);
}
