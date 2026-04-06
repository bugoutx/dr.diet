import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const optionalInt = z.union([
  z.number().int().min(0),
  z.string().transform((s) => (s === "" ? undefined : Number(s))),
]).optional().nullable();

const updateSchema = z.object({
  categoryId: z.string().optional(),
  nameEn: z.string().min(1).optional(),
  nameAr: z.string().min(1).optional(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  price: optionalInt,
  image: z.string().min(1).optional(),
  protein: optionalInt,
  carbs: optionalInt,
  calories: optionalInt,
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const item = await prisma.marketItem.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
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
  const item = await prisma.marketItem.update({
    where: { id },
    data: parsed.data,
    include: { category: true },
  });
  revalidateSite();
  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.marketItem.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
