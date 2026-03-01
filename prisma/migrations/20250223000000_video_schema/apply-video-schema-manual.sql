-- Run this in Supabase SQL Editor if the Video schema migration hasn't been applied.
-- Idempotent: safe to run if some steps were already done.

-- 1. Rename mp4Url -> videoUrl (if mp4Url exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Video' AND column_name = 'mp4Url') THEN
    ALTER TABLE "Video" RENAME COLUMN "mp4Url" TO "videoUrl";
  END IF;
END $$;

-- 2. Rename isVisible -> isActive (if isVisible exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Video' AND column_name = 'isVisible') THEN
    ALTER TABLE "Video" RENAME COLUMN "isVisible" TO "isActive";
  END IF;
END $$;

-- 3. Rename order -> sortOrder (if order exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Video' AND column_name = 'order') THEN
    ALTER TABLE "Video" RENAME COLUMN "order" TO "sortOrder";
  END IF;
END $$;

-- 4. Add titleEn if missing
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "titleEn" TEXT;

-- 5. Add titleAr if missing
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "titleAr" TEXT;

-- 6. Migrate old title -> titleEn, then drop title
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Video' AND column_name = 'title') THEN
    UPDATE "Video" SET "titleEn" = "title" WHERE "title" IS NOT NULL;
    ALTER TABLE "Video" DROP COLUMN "title";
  END IF;
END $$;
