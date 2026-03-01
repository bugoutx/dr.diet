import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";

const reorderSchema = z.object({
  plateIds: z.array(z.string().min(1)),
});

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { plateIds } = parsed.data;
  await prisma.$transaction(
    plateIds.map((id, index) =>
      prisma.lovedPlate.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );
  revalidateSite();
  return NextResponse.json({ ok: true });
}
