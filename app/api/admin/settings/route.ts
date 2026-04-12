import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateSite } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/adminGuard";
import { extractGoogleMapsEmbedSrc } from "@/lib/mapsEmbed";

const settingsSchema = z.object({
  phoneNumber: z.string().optional().nullable(),
  instagramUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  instagramHandle: z.string().optional().nullable(),
  facebookUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  facebookHandle: z.string().optional().nullable(),
  menuPdfUrl: z.string().optional().nullable(), // URL or relative path e.g. /menu.pdf
  orderOnBeeorderUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  orderOnMovoUrl: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  googleMapsEmbedUrl: z.string().optional().nullable(),
  googleMapsLinkUrl: z.string().optional().nullable(),
  mapsEmbedHtml: z.string().optional().nullable(),
  locationText: z.string().optional().nullable(),
  locationEn: z.string().optional().nullable(),
  locationAr: z.string().optional().nullable(),
  showHero: z.boolean().optional(),
  showMenu: z.boolean().optional(),
  showPlates: z.boolean().optional(),
  showScience: z.boolean().optional(),
  showVideos: z.boolean().optional(),
  showTestimonials: z.boolean().optional(),
  showPlans: z.boolean().optional(),
  showContact: z.boolean().optional(),
  scienceContent: z.any().optional().nullable(),
  lovedPlatesTitleEn: z.string().optional().nullable(),
  lovedPlatesTitleAr: z.string().optional().nullable(),
  lovedPlatesSubtitleEn: z.string().optional().nullable(),
  lovedPlatesSubtitleAr: z.string().optional().nullable(),
  marketTitleEn: z.string().optional().nullable(),
  marketTitleAr: z.string().optional().nullable(),
  marketSubtitleEn: z.string().optional().nullable(),
  marketSubtitleAr: z.string().optional().nullable(),
  videosTitleEn: z.string().optional().nullable(),
  videosTitleAr: z.string().optional().nullable(),
  videosSubtitleEn: z.string().optional().nullable(),
  videosSubtitleAr: z.string().optional().nullable(),
  testimonialsTitleEn: z.string().optional().nullable(),
  testimonialsTitleAr: z.string().optional().nullable(),
  testimonialsSubtitleEn: z.string().optional().nullable(),
  testimonialsSubtitleAr: z.string().optional().nullable(),
});

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!settings) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
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
  if (data.facebookUrl !== undefined) update.facebookUrl = data.facebookUrl;
  if (data.facebookHandle !== undefined) update.facebookHandle = data.facebookHandle;
  if (data.menuPdfUrl !== undefined) update.menuPdfUrl = data.menuPdfUrl;
  if (data.orderOnBeeorderUrl !== undefined) update.orderOnBeeorderUrl = data.orderOnBeeorderUrl;
  if (data.orderOnMovoUrl !== undefined) update.orderOnMovoUrl = data.orderOnMovoUrl;
  if (data.googleMapsEmbedUrl !== undefined) update.googleMapsEmbedUrl = data.googleMapsEmbedUrl;
  if (data.googleMapsLinkUrl !== undefined) update.googleMapsLinkUrl = data.googleMapsLinkUrl;
  if (data.mapsEmbedHtml !== undefined) {
    const trimmed = (data.mapsEmbedHtml ?? "").trim() || null;
    if (trimmed && !extractGoogleMapsEmbedSrc(trimmed)) {
      return NextResponse.json(
        { error: "Google Maps embed HTML must contain a valid iframe with src=\"https://www.google.com/maps/embed?..." },
        { status: 400 }
      );
    }
    update.mapsEmbedHtml = trimmed;
  }
  if (data.locationText !== undefined) update.locationText = (data.locationText ?? "").trim() || null;
  if (data.locationEn !== undefined) update.locationEn = (data.locationEn ?? "").trim() || null;
  if (data.locationAr !== undefined) update.locationAr = (data.locationAr ?? "").trim() || null;
  if (data.showHero !== undefined) update.showHero = data.showHero;
  if (data.showMenu !== undefined) update.showMenu = data.showMenu;
  if (data.showPlates !== undefined) update.showPlates = data.showPlates;
  if (data.showScience !== undefined) update.showScience = data.showScience;
  if (data.showVideos !== undefined) update.showVideos = data.showVideos;
  if (data.showTestimonials !== undefined) update.showTestimonials = data.showTestimonials;
  if (data.showPlans !== undefined) update.showPlans = data.showPlans;
  if (data.showContact !== undefined) update.showContact = data.showContact;
  if (data.scienceContent !== undefined) update.scienceContent = data.scienceContent;
  if (data.lovedPlatesTitleEn !== undefined) update.lovedPlatesTitleEn = (data.lovedPlatesTitleEn ?? "").trim() || null;
  if (data.lovedPlatesTitleAr !== undefined) update.lovedPlatesTitleAr = (data.lovedPlatesTitleAr ?? "").trim() || null;
  if (data.lovedPlatesSubtitleEn !== undefined) update.lovedPlatesSubtitleEn = (data.lovedPlatesSubtitleEn ?? "").trim() || null;
  if (data.lovedPlatesSubtitleAr !== undefined) update.lovedPlatesSubtitleAr = (data.lovedPlatesSubtitleAr ?? "").trim() || null;
  if (data.marketTitleEn !== undefined) update.marketTitleEn = (data.marketTitleEn ?? "").trim() || null;
  if (data.marketTitleAr !== undefined) update.marketTitleAr = (data.marketTitleAr ?? "").trim() || null;
  if (data.marketSubtitleEn !== undefined) update.marketSubtitleEn = (data.marketSubtitleEn ?? "").trim() || null;
  if (data.marketSubtitleAr !== undefined) update.marketSubtitleAr = (data.marketSubtitleAr ?? "").trim() || null;
  if (data.videosTitleEn !== undefined) update.videosTitleEn = (data.videosTitleEn ?? "").trim() || null;
  if (data.videosTitleAr !== undefined) update.videosTitleAr = (data.videosTitleAr ?? "").trim() || null;
  if (data.videosSubtitleEn !== undefined) update.videosSubtitleEn = (data.videosSubtitleEn ?? "").trim() || null;
  if (data.videosSubtitleAr !== undefined) update.videosSubtitleAr = (data.videosSubtitleAr ?? "").trim() || null;
  if (data.testimonialsTitleEn !== undefined) update.testimonialsTitleEn = (data.testimonialsTitleEn ?? "").trim() || null;
  if (data.testimonialsTitleAr !== undefined) update.testimonialsTitleAr = (data.testimonialsTitleAr ?? "").trim() || null;
  if (data.testimonialsSubtitleEn !== undefined) update.testimonialsSubtitleEn = (data.testimonialsSubtitleEn ?? "").trim() || null;
  if (data.testimonialsSubtitleAr !== undefined) update.testimonialsSubtitleAr = (data.testimonialsSubtitleAr ?? "").trim() || null;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...update } as never,
    update,
  });
  revalidateSite();
  return NextResponse.json(settings);
}
