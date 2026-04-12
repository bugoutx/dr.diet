import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";
import { MAX_HERO_MEALS } from "@/lib/heroMeals";

const reorderSchema = z.object({
  ids: z.array(z.string()).min(1).max(MAX_HERO_MEALS),
});

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const ids = parsed.data.ids;
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.heroMeal.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );
  revalidateSite();
  return NextResponse.json({ ok: true });
}
