import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

const createSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional().nullable(),
  text: z.string().min(10, "Quote must be at least 10 characters"),
  rating: z.number().int().min(1).max(5).default(5),
  avatarColor: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const count = await prisma.testimonial.count();
  const testimonial = await prisma.testimonial.create({
    data: {
      name: parsed.data.name.trim(),
      role: parsed.data.role?.trim() || null,
      text: parsed.data.text.trim(),
      rating: parsed.data.rating,
      avatarColor: parsed.data.avatarColor?.trim() || null,
      isActive: parsed.data.isActive ?? true,
      sortOrder: count,
    },
  });
  const { revalidateSite } = await import("@/lib/revalidate");
  revalidateSite();
  return NextResponse.json(testimonial);
}
