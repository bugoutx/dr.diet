import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  ids: z.array(z.string()),
});

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
