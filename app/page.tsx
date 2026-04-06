import { getSiteData } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import SignatureDishesSection from "@/components/SignatureDishesSection";
import MarketSection from "@/components/MarketSection";
import SmartEatingSection from "@/components/SmartEatingSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PlanSubscriptionsSection from "@/components/PlanSubscriptionsSection";
import LocationContactSection from "@/components/LocationContactSection";
import FooterSection from "@/components/FooterSection";

export default async function Home() {
  const data = await getSiteData();
  const { settings } = data;

  return (
    <>
      {settings.showHero && (
        <HeroSection
          heroContent={data.heroContent}
          meals={data.heroMeals}
          settings={settings}
        />
      )}
      {settings.showMenu && <MenuSection categories={data.categories} />}
      {settings.showPlates && (
        <SignatureDishesSection
          plates={data.lovedPlates}
          sectionTitle={{
            titleEn: settings.lovedPlatesTitleEn ?? "Our Most-Loved Plates",
            titleAr: settings.lovedPlatesTitleAr ?? undefined,
            subtitleEn: settings.lovedPlatesSubtitleEn ?? "Top sellers and crowd favorites that keep our customers coming back for more.",
            subtitleAr: settings.lovedPlatesSubtitleAr ?? undefined,
          }}
        />
      )}
      {data.market && data.market.length > 0 && (
        <MarketSection
          categories={data.market}
          sectionTitle={{
            titleEn: settings.marketTitleEn ?? "Dr.Diet Market",
            titleAr: settings.marketTitleAr ?? undefined,
            subtitleEn: settings.marketSubtitleEn ?? "Healthy snacks and products to support your goals.",
            subtitleAr: settings.marketSubtitleAr ?? undefined,
          }}
        />
      )}
      {settings.showScience && <SmartEatingSection />}
      {settings.showVideos && (
        <GallerySection
          videos={data.videos}
          sectionTitle={{
            titleEn: settings.videosTitleEn ?? "See the Real Plates",
            titleAr: settings.videosTitleAr ?? undefined,
            subtitleEn: settings.videosSubtitleEn ?? "Real, freshly prepared meals — straight from our kitchen. Tap any reel to watch full screen.",
            subtitleAr: settings.videosSubtitleAr ?? undefined,
          }}
        />
      )}
      {settings.showTestimonials && <TestimonialsSection testimonials={data.testimonials} />}
      {settings.showPlans && <PlanSubscriptionsSection plans={data.plans} />}
      {settings.showContact && <LocationContactSection settings={settings} />}
      <FooterSection settings={settings} />
    </>
  );
}
