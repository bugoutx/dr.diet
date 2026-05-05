import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const featuresSchema = z.array(z.string());
const updateSchema = z.object({
  titleEn: z.string().min(1).optional(),
  titleAr: z.string().min(1).optional(),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  featuresEn: z.union([z.array(z.string()), featuresSchema]).optional(),
  featuresAr: z.union([z.array(z.string()), featuresSchema]).optional(),
  weeklyPrice: z.number().int().min(0).optional().nullable(),
  monthlyPrice: z.number().int().min(0).optional().nullable(),
  order: z.number().int().min(0).optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  pdfUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  pdfFileName: z.string().optional().nullable(),
  subscribeUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
}).refine(
  (d) => {
    if (d.weeklyPrice === undefined && d.monthlyPrice === undefined) return true;
    const w = d.weeklyPrice;
    const m = d.monthlyPrice;
    return w != null || m != null;
  },
  { message: "At least one of weeklyPrice or monthlyPrice must be set" }
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id } });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PATCH(
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

  const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (parsed.data.titleEn !== undefined) data.titleEn = parsed.data.titleEn.trim();
  if (parsed.data.titleAr !== undefined) data.titleAr = parsed.data.titleAr.trim();
  if (parsed.data.subtitleEn !== undefined) data.subtitleEn = parsed.data.subtitleEn?.trim() || null;
  if (parsed.data.subtitleAr !== undefined) data.subtitleAr = parsed.data.subtitleAr?.trim() || null;
  if (parsed.data.featuresEn !== undefined) data.featuresEn = Array.isArray(parsed.data.featuresEn) ? parsed.data.featuresEn : existing.featuresEn;
  if (parsed.data.featuresAr !== undefined) data.featuresAr = Array.isArray(parsed.data.featuresAr) ? parsed.data.featuresAr : existing.featuresAr;
  if (parsed.data.weeklyPrice !== undefined) data.weeklyPrice = parsed.data.weeklyPrice;
  if (parsed.data.monthlyPrice !== undefined) data.monthlyPrice = parsed.data.monthlyPrice;
  if (parsed.data.order !== undefined) data.order = parsed.data.order;
  if (parsed.data.isPopular !== undefined) data.isPopular = parsed.data.isPopular;
  if (parsed.data.isActive !== undefined) data.isActive = parsed.data.isActive;
  if (parsed.data.pdfUrl !== undefined) data.pdfUrl = (parsed.data.pdfUrl ?? "").trim() || null;
  if (parsed.data.pdfFileName !== undefined) data.pdfFileName = (parsed.data.pdfFileName ?? "").trim() || null;
  if (parsed.data.subscribeUrl !== undefined) data.subscribeUrl = (parsed.data.subscribeUrl ?? "").trim() || null;

  const finalWeekly = (data.weeklyPrice !== undefined ? data.weeklyPrice : existing.weeklyPrice) ?? null;
  const finalMonthly = (data.monthlyPrice !== undefined ? data.monthlyPrice : existing.monthlyPrice) ?? null;
  if (finalWeekly == null && finalMonthly == null) {
    return NextResponse.json({ error: "At least one of weeklyPrice or monthlyPrice must be set" }, { status: 400 });
  }

  const plan = await prisma.subscriptionPlan.update({
    where: { id },
    data,
  });
  revalidateSite();
  return NextResponse.json(plan);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.subscriptionPlan.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
