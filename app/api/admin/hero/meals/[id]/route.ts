import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const updateMealSchema = z.object({
  title: z.string().min(1).optional(),
  titleAr: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  calories: z.number().int().min(0).optional().nullable(),
  protein: z.number().int().min(0).optional().nullable(),
  badge: z.string().optional().nullable(),
  badgeAr: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).max(2).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const meal = await prisma.heroMeal.findUnique({ where: { id } });
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
  const parsed = updateMealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const meal = await prisma.heroMeal.update({
    where: { id },
    data: parsed.data,
  });
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
  await prisma.heroMeal.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
