-- Add mapsEmbedHtml and locationText to SiteSettings
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "mapsEmbedHtml" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "locationText" TEXT;
