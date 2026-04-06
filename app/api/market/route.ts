import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.marketCategory.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });
  const filtered = categories
    .filter((c) => c.items.length > 0)
    .map((c) => ({
      id: c.id,
      nameEn: c.nameEn,
      nameAr: c.nameAr,
      order: c.order,
      items: c.items.map((i) => ({
        id: i.id,
        nameEn: i.nameEn,
        nameAr: i.nameAr,
        descriptionEn: i.descriptionEn ?? undefined,
        descriptionAr: i.descriptionAr ?? undefined,
        price: i.price ?? undefined,
        image: i.image,
        protein: i.protein ?? undefined,
        carbs: i.carbs ?? undefined,
        calories: i.calories ?? undefined,
        order: i.order,
      })),
    }));
  return NextResponse.json({ categories: filtered });
}
