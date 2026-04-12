-- AlterTable (additive — existing rows keep all data; new columns default to NULL)
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "facebookHandle" TEXT;
