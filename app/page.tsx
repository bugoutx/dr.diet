import { getSiteData } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import SignatureDishesSection from "@/components/SignatureDishesSection";
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
      {settings.showPlates && <SignatureDishesSection plates={data.lovedPlates} />}
      {settings.showScience && <SmartEatingSection />}
      {settings.showVideos && <GallerySection videos={data.videos} />}
      {settings.showTestimonials && <TestimonialsSection testimonials={data.testimonials} />}
      {settings.showPlans && <PlanSubscriptionsSection plans={data.plans} />}
      {settings.showContact && <LocationContactSection settings={settings} />}
      <FooterSection settings={settings} />
    </>
  );
}
