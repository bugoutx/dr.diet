import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)),
});

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.testimonial.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );
  const { revalidateSite } = await import("@/lib/revalidate");
  revalidateSite();
  return NextResponse.json({ ok: true });
}
