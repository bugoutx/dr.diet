import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.string().optional().nullable(),
  text: z.string().min(10).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  avatarColor: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }
  return NextResponse.json(testimonial);
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

  const data: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name.trim();
  if (parsed.data.role !== undefined) data.role = parsed.data.role?.trim() || null;
  if (parsed.data.text !== undefined) data.text = parsed.data.text.trim();
  if (parsed.data.rating !== undefined) data.rating = parsed.data.rating;
  if (parsed.data.avatarColor !== undefined) data.avatarColor = parsed.data.avatarColor?.trim() || null;
  if (parsed.data.isActive !== undefined) data.isActive = parsed.data.isActive;

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data,
  });
  const { revalidateSite } = await import("@/lib/revalidate");
  revalidateSite();
  return NextResponse.json(testimonial);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  const { revalidateSite } = await import("@/lib/revalidate");
  revalidateSite();
  return NextResponse.json({ ok: true });
}
