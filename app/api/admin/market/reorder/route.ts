import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const schema = z.object({
  categoryIds: z.array(z.string()).optional(),
  itemIds: z.array(z.string()).optional(),
});

export async function PATCH(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.categoryIds?.length) {
    await prisma.$transaction(
      parsed.data.categoryIds.map((id, index) =>
        prisma.marketCategory.update({
          where: { id },
          data: { order: index },
        })
      )
    );
  }
  if (parsed.data.itemIds?.length) {
    await prisma.$transaction(
      parsed.data.itemIds.map((id, index) =>
        prisma.marketItem.update({
          where: { id },
          data: { order: index },
        })
      )
    );
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
