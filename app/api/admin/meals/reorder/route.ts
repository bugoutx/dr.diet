import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const schema = z.object({
  categoryId: z.string(),
  mealIds: z.array(z.string()),
});

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await prisma.$transaction(
    parsed.data.mealIds.map((id, index) =>
      prisma.meal.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidateSite();
  return NextResponse.json({ ok: true });
}
