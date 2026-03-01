import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const updateSchema = z.object({
  titleEn: z.string().optional().nullable(),
  titleAr: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  return NextResponse.json(video);
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

  // If toggling isActive to true, ensure we don't exceed 5 active
  if (parsed.data.isActive === true) {
    const activeCount = await prisma.video.count({ where: { isActive: true } });
    const current = await prisma.video.findUnique({ where: { id } });
    if (current && !current.isActive && activeCount >= 5) {
      return NextResponse.json(
        { error: "Maximum of 5 active videos allowed" },
        { status: 400 }
      );
    }
  }

  const video = await prisma.video.update({
    where: { id },
    data: {
      ...(parsed.data.titleEn !== undefined && { titleEn: parsed.data.titleEn }),
      ...(parsed.data.titleAr !== undefined && { titleAr: parsed.data.titleAr }),
      ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
      ...(parsed.data.sortOrder !== undefined && { sortOrder: parsed.data.sortOrder }),
    },
  });
  revalidateSite();
  return NextResponse.json(video);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;
  await prisma.video.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
