import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  phoneNumber: z.string().optional().nullable(),
  instagramUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  instagramHandle: z.string().optional().nullable(),
  menuPdfUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  googleMapsEmbedUrl: z.string().optional().nullable(),
  googleMapsLinkUrl: z.string().optional().nullable(),
  showHero: z.boolean().optional(),
  showMenu: z.boolean().optional(),
  showPlates: z.boolean().optional(),
  showScience: z.boolean().optional(),
  showVideos: z.boolean().optional(),
  showTestimonials: z.boolean().optional(),
  showPlans: z.boolean().optional(),
  showContact: z.boolean().optional(),
  scienceContent: z.any().optional().nullable(),
});

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!settings) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const update: Record<string, unknown> = {};
  if (data.phoneNumber !== undefined) update.phoneNumber = data.phoneNumber;
  if (data.instagramUrl !== undefined) update.instagramUrl = data.instagramUrl;
  if (data.instagramHandle !== undefined) update.instagramHandle = data.instagramHandle;
  if (data.menuPdfUrl !== undefined) update.menuPdfUrl = data.menuPdfUrl;
  if (data.googleMapsEmbedUrl !== undefined) update.googleMapsEmbedUrl = data.googleMapsEmbedUrl;
  if (data.googleMapsLinkUrl !== undefined) update.googleMapsLinkUrl = data.googleMapsLinkUrl;
  if (data.showHero !== undefined) update.showHero = data.showHero;
  if (data.showMenu !== undefined) update.showMenu = data.showMenu;
  if (data.showPlates !== undefined) update.showPlates = data.showPlates;
  if (data.showScience !== undefined) update.showScience = data.showScience;
  if (data.showVideos !== undefined) update.showVideos = data.showVideos;
  if (data.showTestimonials !== undefined) update.showTestimonials = data.showTestimonials;
  if (data.showPlans !== undefined) update.showPlans = data.showPlans;
  if (data.showContact !== undefined) update.showContact = data.showContact;
  if (data.scienceContent !== undefined) update.scienceContent = data.scienceContent;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...update } as never,
    update,
  });
  return NextResponse.json(settings);
}
