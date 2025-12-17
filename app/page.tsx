import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import SignatureDishesSection from "@/components/SignatureDishesSection";
import SmartEatingSection from "@/components/SmartEatingSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PlanSubscriptionsSection from "@/components/PlanSubscriptionsSection";
import LocationContactSection from "@/components/LocationContactSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MenuSection />
      <SignatureDishesSection />
      <SmartEatingSection />
      <GallerySection />
      <TestimonialsSection />
      <PlanSubscriptionsSection />
      <LocationContactSection />
      <FooterSection />
    </>
  );
}
