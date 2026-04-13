/**
 * Centralized site data fetcher for the public landing page.
 * Uses unstable_cache with tag "site" for revalidation when admin makes changes.
 *
 * Fallback static assets: put images in public/images/, videos in public/reels/
 * Primary: upload via admin to Vercel Blob, URLs stored in DB.
 */

import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { MAX_HERO_MEALS } from "./heroMeals";
import type { SectionNavVisibility } from "./sectionNavVisibility";

const CACHE_TAG = "site";

// Hero fallback when DB has no active meals
export const HERO_FALLBACK_MEALS = [
  { id: "fb1", title: "California Salad", subtitle: "Salad", calories: 473, protein: 35, imageUrl: "/images/hero-california-salad.jpg", badge: "Rotating signature meal" },
  { id: "fb2", title: "Dr.Diet Energy Plate", subtitle: "Energy Dish", calories: 350, protein: 48, imageUrl: "/images/hero-energy-plate.jpg", badge: "Rotating signature meal" },
  { id: "fb3", title: "Radiance Smoothie", subtitle: "Smoothie", calories: 343, protein: 12, imageUrl: "/images/hero-radiance-smoothie.jpg", badge: "Rotating signature meal" },
] as const;

async function getHeroContentRaw() {
  const row = await prisma.heroContent.findUnique({ where: { id: "singleton" } });
  return row ?? {
    slogan: "Don't eat less, eat Right.",
    sloganAr: null,
    title: "HEALTHY FOOD, DONE RIGHT.",
    titleAr: null,
    description: "Dr.Diet is a healthy food restaurant offering fresh salads, energy dishes, sandwiches, breakfasts, toast, juices, smoothies, smart snacks, and sauces. Every dish is crafted with nutrition and flavor in mind.",
    descriptionAr: null,
    ctaLabelEn: null,
    ctaLabelAr: null,
    updatedAt: new Date(),
  };
}

async function getHeroMealsRaw() {
  const rows = await prisma.heroMeal.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: MAX_HERO_MEALS,
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    titleAr: r.titleAr ?? undefined,
    subtitle: r.subtitle ?? undefined,
    subtitleAr: r.subtitleAr ?? undefined,
    calories: r.calories ?? undefined,
    protein: r.protein ?? undefined,
    badge: r.badge ?? undefined,
    badgeAr: r.badgeAr ?? undefined,
    imageUrl: r.imageUrl ?? undefined,
    sortOrder: r.sortOrder,
  }));
}

async function getCategoriesWithMealsRaw() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      meals: {
        where: {},
        orderBy: { order: "asc" },
        include: { mealTags: { orderBy: { order: "asc" } } },
      },
    },
  });
}

async function getPlatesRaw() {
  return prisma.plate.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

async function getLovedPlatesRaw() {
  return prisma.lovedPlate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { tags: { orderBy: { sortOrder: "asc" } } },
  });
}

async function getVideosRaw() {
  return prisma.video.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 5,
  });
}

async function getTestimonialsRaw() {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

async function getSubscriptionPlansRaw() {
  return prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

async function getSettingsRaw() {
  return prisma.siteSettings.findUnique({ where: { id: "singleton" } });
}

async function getMarketRaw() {
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
  return categories
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
}

export async function getSiteData() {
  const [
    heroContent,
    heroMeals,
    categories,
    plates,
    lovedPlates,
    videos,
    testimonials,
    subscriptionPlans,
    settings,
    market,
  ] = await Promise.all([
    unstable_cache(getHeroContentRaw, ["hero-content"], { tags: [CACHE_TAG] })(),
    unstable_cache(getHeroMealsRaw, ["hero-meals"], { tags: [CACHE_TAG] })(),
    unstable_cache(getCategoriesWithMealsRaw, ["categories-meals"], { tags: [CACHE_TAG] })(),
    unstable_cache(getPlatesRaw, ["plates"], { tags: [CACHE_TAG] })(),
    unstable_cache(getLovedPlatesRaw, ["loved-plates"], { tags: [CACHE_TAG] })(),
    unstable_cache(getVideosRaw, ["videos"], { tags: [CACHE_TAG] })(),
    unstable_cache(getTestimonialsRaw, ["testimonials"], { tags: [CACHE_TAG] })(),
    unstable_cache(getSubscriptionPlansRaw, ["subscription-plans"], { tags: [CACHE_TAG] })(),
    unstable_cache(getSettingsRaw, ["settings"], { tags: [CACHE_TAG] })(),
    unstable_cache(getMarketRaw, ["market"], { tags: [CACHE_TAG] })(),
  ]);

  // Hero: use DB if any active meals (up to MAX_HERO_MEALS), else fallback (bilingual: nameEn/nameAr, subtitleEn/Ar, badgeEn/Ar; macros formatted in component by lang)
  const heroItems =
    heroMeals.length > 0
      ? heroMeals.map((m) => ({
          id: m.id,
          nameEn: m.title,
          nameAr: m.titleAr ?? m.title,
          subtitleEn: m.subtitle ?? undefined,
          subtitleAr: m.subtitleAr ?? undefined,
          descriptionEn: m.subtitle ?? m.title,
          descriptionAr: m.subtitleAr ?? m.titleAr ?? m.title,
          protein: m.protein ?? undefined,
          calories: m.calories ?? undefined,
          image: m.imageUrl ?? "/images/hero-california-salad.jpg",
          badgeEn: m.badge ?? undefined,
          badgeAr: m.badgeAr ?? undefined,
        }))
      : HERO_FALLBACK_MEALS.map((m) => ({
          id: m.id,
          nameEn: m.title,
          nameAr: m.title,
          subtitleEn: m.subtitle,
          subtitleAr: undefined,
          descriptionEn: m.subtitle,
          descriptionAr: undefined,
          protein: m.protein,
          calories: m.calories,
          image: m.imageUrl,
          badgeEn: m.badge,
          badgeAr: undefined,
        }));

  // Map categories to MenuSection shape (bilingual + macros)
  const menuCategories = categories.map((cat) => ({
    id: cat.id,
    nameEn: cat.nameEn,
    nameAr: cat.nameAr,
    descriptionEn: cat.descriptionEn ?? undefined,
    descriptionAr: cat.descriptionAr ?? undefined,
    items: cat.meals.map((m) => ({
      id: m.id,
      nameEn: m.nameEn,
      nameAr: m.nameAr,
      descriptionEn: m.descriptionEn ?? undefined,
      descriptionAr: m.descriptionAr ?? undefined,
      proteinG: m.proteinG ?? undefined,
      carbsG: m.carbsG ?? undefined,
      calories: m.calories ?? undefined,
      price: m.price ?? undefined,
      tags: ("mealTags" in m && Array.isArray(m.mealTags)
        ? m.mealTags.map((t: { labelEn: string; labelAr: string; tone: string }) => ({
            labelEn: t.labelEn,
            labelAr: t.labelAr,
            tone: t.tone as "green" | "orange",
          }))
        : []) as { labelEn: string; labelAr: string; tone: "green" | "orange" }[],
      image: m.imageUrl,
    })),
  }));

  // Map plates to SignatureDishesSection shape (legacy Plate model - kept for backward compat if needed)
  const platesMapped = plates.map((p) => ({
    id: p.id,
    name: p.title,
    subtitle: p.subtitle ?? "",
    description: p.description ?? "",
    image: p.imageUrl,
    protein: p.protein,
    calories: p.calories,
    carbs: p.carbs ?? undefined,
    tags: p.tags,
    ingredients: p.ingredients,
    nutritionFacts: p.nutritionFacts as { fat?: number; fiber?: number; sugar?: number } | undefined,
    isMostLoved: p.isMostLoved,
  }));

  // Map loved plates to section shape (bilingual + tags with tone)
  const lovedPlatesMapped = lovedPlates.map((p) => ({
    id: p.id,
    nameEn: p.titleEn,
    nameAr: p.titleAr,
    subtitleEn: p.subtitleEn ?? undefined,
    subtitleAr: p.subtitleAr ?? undefined,
    descriptionEn: p.descriptionEn ?? undefined,
    descriptionAr: p.descriptionAr ?? undefined,
    image: p.imageUrl,
    galleryUrls: p.galleryUrls ?? [],
    proteinG: p.proteinG ?? undefined,
    carbsG: p.carbsG ?? undefined,
    calories: p.calories ?? undefined,
    tags: p.tags.map((t) => ({ labelEn: t.labelEn, labelAr: t.labelAr, tone: t.tone as "green" | "orange" })),
    ingredientsEn: p.ingredientsEn ?? undefined,
    ingredientsAr: p.ingredientsAr ?? undefined,
  }));

  // Map subscription plans to PlanSubscriptionsSection shape (bilingual)
  const plansMapped = subscriptionPlans.map((p) => {
    const featuresEn = Array.isArray(p.featuresEn) ? (p.featuresEn as string[]) : [];
    const featuresAr = Array.isArray(p.featuresAr) ? (p.featuresAr as string[]) : [];
    return {
      id: p.id,
      titleEn: p.titleEn,
      titleAr: p.titleAr,
      subtitleEn: p.subtitleEn ?? undefined,
      subtitleAr: p.subtitleAr ?? undefined,
      featuresEn,
      featuresAr,
      priceWeekly: p.weeklyPrice ?? undefined,
      priceMonthly: p.monthlyPrice ?? undefined,
      isPopular: p.isPopular,
      pdfUrl: p.pdfUrl ?? undefined,
      pdfFileName: p.pdfFileName ?? undefined,
    };
  });

  // Map videos to ReelsArcCarousel shape { id, src, poster, titleEn?, titleAr? }
  const videosMapped = videos.map((v) => ({
    id: v.id,
    src: v.videoUrl,
    poster: v.posterUrl ?? "",
    titleEn: v.titleEn ?? undefined,
    titleAr: v.titleAr ?? undefined,
  }));

  // Map testimonials to TestimonialsSection shape (tag = role, single language)
  const testimonialsMapped = testimonials.map((t) => ({
    name: t.name,
    tag: t.role ?? "",
    content: t.text,
    rating: t.rating,
    avatarUrl: t.avatarUrl ?? undefined,
  }));

  const heroContentRow = heroContent as { slogan: string; sloganAr?: string | null; title: string; titleAr?: string | null; description: string; descriptionAr?: string | null; ctaLabelEn?: string | null; ctaLabelAr?: string | null };
  return {
    heroContent: {
      slogan: heroContentRow.slogan,
      sloganAr: heroContentRow.sloganAr ?? undefined,
      title: heroContentRow.title,
      titleAr: heroContentRow.titleAr ?? undefined,
      description: heroContentRow.description,
      descriptionAr: heroContentRow.descriptionAr ?? undefined,
      ctaLabelEn: heroContentRow.ctaLabelEn ?? undefined,
      ctaLabelAr: heroContentRow.ctaLabelAr ?? undefined,
    },
    heroMeals: heroItems,
    categories: menuCategories,
    plates: platesMapped,
    lovedPlates: lovedPlatesMapped,
    market,
    videos: videosMapped,
    testimonials: testimonialsMapped,
    plans: plansMapped,
    settings: settings ?? {
      phoneNumber: null,
      instagramUrl: null,
      instagramHandle: null,
      facebookUrl: null,
      facebookHandle: null,
      menuPdfUrl: null,
      orderOnBeeorderUrl: null,
      orderOnMovoUrl: null,
      googleMapsEmbedUrl: null,
      googleMapsLinkUrl: null,
      mapsEmbedHtml: null,
      locationText: null,
      locationEn: null,
      locationAr: null,
      lovedPlatesTitleEn: null,
      lovedPlatesTitleAr: null,
      lovedPlatesSubtitleEn: null,
      lovedPlatesSubtitleAr: null,
      marketTitleEn: null,
      marketTitleAr: null,
      marketSubtitleEn: null,
      marketSubtitleAr: null,
      videosTitleEn: null,
      videosTitleAr: null,
      videosSubtitleEn: null,
      videosSubtitleAr: null,
      testimonialsTitleEn: null,
      testimonialsTitleAr: null,
      testimonialsSubtitleEn: null,
      testimonialsSubtitleAr: null,
      showHero: true,
      showMenu: true,
      showPlates: true,
      showScience: true,
      showVideos: true,
      showTestimonials: true,
      showPlans: true,
      showContact: true,
    },
  };
}

/** Public hero payload for GET /api/public/hero and server-side landing. */
export async function getPublicHero() {
  const [heroContent, heroMeals, settings] = await Promise.all([
    unstable_cache(getHeroContentRaw, ["hero-content"], { tags: [CACHE_TAG] })(),
    unstable_cache(getHeroMealsRaw, ["hero-meals"], { tags: [CACHE_TAG] })(),
    unstable_cache(getSettingsRaw, ["settings"], { tags: [CACHE_TAG] })(),
  ]);
  const meals = heroMeals
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => ({
      id: m.id,
      title: m.title,
      titleAr: m.titleAr ?? null,
      subtitle: m.subtitle ?? null,
      subtitleAr: m.subtitleAr ?? null,
      calories: m.calories ?? null,
      protein: m.protein ?? null,
      badge: m.badge ?? null,
      badgeAr: m.badgeAr ?? null,
      imageUrl: m.imageUrl ?? null,
      sortOrder: m.sortOrder,
    }));
  const h = heroContent as { slogan: string; sloganAr?: string | null; title: string; titleAr?: string | null; description: string; descriptionAr?: string | null; ctaLabelEn?: string | null; ctaLabelAr?: string | null };
  return {
    hero: {
      slogan: h.slogan,
      sloganAr: h.sloganAr ?? null,
      title: h.title,
      titleAr: h.titleAr ?? null,
      description: h.description,
      descriptionAr: h.descriptionAr ?? null,
      ctaLabelEn: h.ctaLabelEn ?? null,
      ctaLabelAr: h.ctaLabelAr ?? null,
    },
    meals,
    settings: {
      orderOnBeeorderUrl: settings?.orderOnBeeorderUrl ?? null,
      orderOnMovoUrl: settings?.orderOnMovoUrl ?? null,
      menuPdfUrl: settings?.menuPdfUrl ?? null,
      instagramUrl: settings?.instagramUrl ?? null,
      instagramHandle: settings?.instagramHandle ?? null,
      facebookUrl: settings?.facebookUrl ?? null,
      facebookHandle: settings?.facebookHandle ?? null,
    },
  };
}

/**
 * Which section anchors exist on the home page — matches `app/page.tsx` conditions
 * (settings toggles + market only when there is at least one active market category with items).
 */
export const getSectionNavVisibility = unstable_cache(
  async (): Promise<SectionNavVisibility> => {
    const [settings, market] = await Promise.all([
      unstable_cache(getSettingsRaw, ["settings"], { tags: [CACHE_TAG] })(),
      unstable_cache(getMarketRaw, ["market"], { tags: [CACHE_TAG] })(),
    ]);
    const s = settings;
    return {
      menu: s?.showMenu ?? true,
      lovedPlates: s?.showPlates ?? true,
      market: market.length > 0,
      science: s?.showScience ?? true,
      reels: s?.showVideos ?? true,
      testimonials: s?.showTestimonials ?? true,
      plans: s?.showPlans ?? true,
      contact: s?.showContact ?? true,
    };
  },
  ["section-nav-visibility"],
  { tags: [CACHE_TAG] }
);

export { CACHE_TAG };
