import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";
import { getPublicHero } from "@/lib/data";

const updateHeroSchema = z.object({
  slogan: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
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
  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      slogan: parsed.data.slogan ?? "Don't eat less, eat Right.",
      title: parsed.data.title ?? "HEALTHY FOOD, DONE RIGHT.",
      description:
        parsed.data.description ??
        "Dr.Diet is a healthy food restaurant offering fresh salads, energy dishes, sandwiches, breakfasts, toast, juices, smoothies, smart snacks, and sauces. Every dish is crafted with nutrition and flavor in mind.",
    },
    update: {
      ...(parsed.data.slogan !== undefined && { slogan: parsed.data.slogan }),
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
    },
  });
  revalidateSite();
  const data = await getPublicHero();
  return NextResponse.json(data);
}
