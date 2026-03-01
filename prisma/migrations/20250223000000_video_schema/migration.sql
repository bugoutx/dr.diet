-- AlterTable Video: rename columns and add bilingual titles
-- From: mp4Url, posterUrl, title, isVisible, order
-- To: videoUrl, posterUrl, titleEn, titleAr, isActive, sortOrder

ALTER TABLE "Video" RENAME COLUMN "mp4Url" TO "videoUrl";
ALTER TABLE "Video" RENAME COLUMN "isVisible" TO "isActive";
ALTER TABLE "Video" RENAME COLUMN "order" TO "sortOrder";

ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "titleEn" TEXT;
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "titleAr" TEXT;

-- Migrate existing title to titleEn where present, then drop title
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Video' AND column_name = 'title') THEN
    UPDATE "Video" SET "titleEn" = "title" WHERE "title" IS NOT NULL;
    ALTER TABLE "Video" DROP COLUMN "title";
  END IF;
END $$;
