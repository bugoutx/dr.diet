-- AlterTable (additive — existing SiteSettings rows unchanged; new columns NULL until set in admin)
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "testimonialsTitleEn" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "testimonialsTitleAr" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "testimonialsSubtitleEn" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "testimonialsSubtitleAr" TEXT;
