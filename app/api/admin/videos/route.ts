import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const MAX_VIDEOS = 5;

const createSchema = z.object({
  videoUrl: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  titleAr: z.string().optional().nullable(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const videos = await prisma.video.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const count = await prisma.video.count();
  if (count >= MAX_VIDEOS) {
    return NextResponse.json(
      { error: "Maximum of 5 videos allowed" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const video = await prisma.video.create({
    data: {
      videoUrl: parsed.data.videoUrl,
      titleEn: parsed.data.titleEn ?? null,
      titleAr: parsed.data.titleAr ?? null,
      sortOrder: count,
    },
  });
  revalidateSite();
  return NextResponse.json(video);
}
