/**
 * Centralized site data fetcher for the public landing page.
 * Uses unstable_cache with tag "site" for revalidation when admin makes changes.
 *
 * Fallback static assets: put images in public/images/, videos in public/reels/
 * Primary: upload via admin to Vercel Blob, URLs stored in DB.
 */

import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

const CACHE_TAG = "site";

// Hero fallback when DB has < 3 active meals
export const HERO_FALLBACK_MEALS = [
  { id: "fb1", title: "California Salad", subtitle: "Salad", calories: 473, protein: 35, imageUrl: "/images/hero-california-salad.jpg", badge: "Rotating signature meal" },
  { id: "fb2", title: "Dr.Diet Energy Plate", subtitle: "Energy Dish", calories: 350, protein: 48, imageUrl: "/images/hero-energy-plate.jpg", badge: "Rotating signature meal" },
  { id: "fb3", title: "Radiance Smoothie", subtitle: "Smoothie", calories: 343, protein: 12, imageUrl: "/images/hero-radiance-smoothie.jpg", badge: "Rotating signature meal" },
] as const;

async function getHeroContentRaw() {
  const row = await prisma.heroContent.findUnique({ where: { id: "singleton" } });
  return row ?? { slogan: "Don't eat less, eat Right.", title: "HEALTHY FOOD, DONE RIGHT.", description: "Dr.Diet is a healthy food restaurant offering fresh salads, energy dishes, sandwiches, breakfasts, toast, juices, smoothies, smart snacks, and sauces. Every dish is crafted with nutrition and flavor in mind." };
}

async function getHeroMealsRaw() {
  const rows = await prisma.heroMeal.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    calories: r.calories ?? undefined,
    protein: r.protein ?? undefined,
    badge: r.badge ?? undefined,
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

async function getPlansRaw() {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: { features: { orderBy: { order: "asc" } } },
  });
}

async function getSettingsRaw() {
  return prisma.siteSettings.findUnique({ where: { id: "singleton" } });
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
  ]);

  // Hero: use DB if >= 3, else fallback
  const formatMacros = (cal: number | undefined, pro: number | undefined) =>
    [pro != null ? `${pro}g protein` : null, cal != null ? `${cal} cal` : null].filter(Boolean).join(" · ") || "";
  const heroItems =
    heroMeals.length >= 3
      ? heroMeals.map((m) => ({
          id: m.id,
          name: m.title,
          subtitle: m.subtitle ?? "",
          macros: formatMacros(m.calories, m.protein),
          description: m.subtitle ?? m.title,
          image: m.imageUrl ?? "/images/hero-california-salad.jpg",
          badge: m.badge ?? undefined,
        }))
      : HERO_FALLBACK_MEALS.map((m) => ({
          id: m.id,
          name: m.title,
          subtitle: m.subtitle,
          macros: formatMacros(m.calories, m.protein),
          description: m.subtitle,
          image: m.imageUrl,
          badge: m.badge,
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

  return {
    heroContent: { slogan: heroContent.slogan, title: heroContent.title, description: heroContent.description },
    heroMeals: heroItems,
    categories: menuCategories,
    plates: platesMapped,
    lovedPlates: lovedPlatesMapped,
    videos: videosMapped,
    testimonials: testimonialsMapped,
    plans: plansMapped,
    settings: settings ?? {
      phoneNumber: null,
      instagramUrl: null,
      instagramHandle: null,
      menuPdfUrl: null,
      orderOnBeeorderUrl: null,
      googleMapsEmbedUrl: null,
      googleMapsLinkUrl: null,
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
      name: m.title,
      subtitle: m.subtitle ?? "",
      calories: m.calories ?? null,
      protein: m.protein ?? null,
      badge: m.badge ?? null,
      imageUrl: m.imageUrl ?? null,
      sortOrder: m.sortOrder,
    }));
  return {
    hero: { slogan: heroContent.slogan, title: heroContent.title, description: heroContent.description },
    meals,
    settings: { orderOnBeeorderUrl: settings?.orderOnBeeorderUrl ?? null, menuPdfUrl: settings?.menuPdfUrl ?? null },
  };
}

export { CACHE_TAG };
