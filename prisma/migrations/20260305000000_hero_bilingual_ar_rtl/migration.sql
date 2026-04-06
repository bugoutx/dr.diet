-- HeroContent: add Arabic and CTA label fields
ALTER TABLE "HeroContent" ADD COLUMN "sloganAr" TEXT;
ALTER TABLE "HeroContent" ADD COLUMN "titleAr" TEXT;
ALTER TABLE "HeroContent" ADD COLUMN "descriptionAr" TEXT;
ALTER TABLE "HeroContent" ADD COLUMN "ctaLabelEn" TEXT;
ALTER TABLE "HeroContent" ADD COLUMN "ctaLabelAr" TEXT;

-- HeroMeal: add Arabic fields
ALTER TABLE "HeroMeal" ADD COLUMN "titleAr" TEXT;
ALTER TABLE "HeroMeal" ADD COLUMN "subtitleAr" TEXT;
ALTER TABLE "HeroMeal" ADD COLUMN "badgeAr" TEXT;
