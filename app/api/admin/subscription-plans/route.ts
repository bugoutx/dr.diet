import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const featuresSchema = z.array(z.string());
const createSchema = z.object({
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  featuresEn: z.union([z.array(z.string()), featuresSchema]).default([]),
  featuresAr: z.union([z.array(z.string()), featuresSchema]).default([]),
  weeklyPrice: z.number().int().min(0).optional().nullable(),
  monthlyPrice: z.number().int().min(0).optional().nullable(),
  order: z.number().int().min(0).optional(),
  isPopular: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
}).refine((d) => d.weeklyPrice != null || d.monthlyPrice != null, {
  message: "At least one of weeklyPrice or monthlyPrice must be provided",
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const count = await prisma.subscriptionPlan.count();
  const plan = await prisma.subscriptionPlan.create({
    data: {
      titleEn: parsed.data.titleEn.trim(),
      titleAr: parsed.data.titleAr.trim(),
      subtitleEn: parsed.data.subtitleEn?.trim() || null,
      subtitleAr: parsed.data.subtitleAr?.trim() || null,
      featuresEn: Array.isArray(parsed.data.featuresEn) ? parsed.data.featuresEn : [],
      featuresAr: Array.isArray(parsed.data.featuresAr) ? parsed.data.featuresAr : [],
      weeklyPrice: parsed.data.weeklyPrice ?? null,
      monthlyPrice: parsed.data.monthlyPrice ?? null,
      order: parsed.data.order ?? count,
      isPopular: parsed.data.isPopular ?? false,
      isActive: parsed.data.isActive ?? true,
    },
  });
  revalidateSite();
  return NextResponse.json(plan);
}
