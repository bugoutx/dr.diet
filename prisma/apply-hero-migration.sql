-- Run this in Supabase SQL Editor if you want to apply the hero migration manually
-- (e.g. after "drift" or to avoid migrate reset). Then run in terminal:
--   npx prisma migrate resolve --applied 20250222180000_hero_content_and_meals
--   npx prisma db seed

-- 1. HeroContent table
CREATE TABLE IF NOT EXISTS "HeroContent" (
    "id" TEXT NOT NULL,
    "slogan" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HeroContent_pkey" PRIMARY KEY ("id")
);

-- 2. Order on Beeorder URL on SiteSettings
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "orderOnBeeorderUrl" TEXT;

-- 3. HeroMeal: badge, nullable imageUrl
ALTER TABLE "HeroMeal" ADD COLUMN IF NOT EXISTS "badge" TEXT;
ALTER TABLE "HeroMeal" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- 4. Calories TEXT -> INTEGER
-- Only run this block if "HeroMeal"."calories" is still type TEXT. If it's already INTEGER, skip to step 5.
ALTER TABLE "HeroMeal" ADD COLUMN IF NOT EXISTS "calories_new" INTEGER;
UPDATE "HeroMeal" SET "calories_new" = (regexp_matches("calories", '[0-9]+'))[1]::integer WHERE "calories" IS NOT NULL AND "calories" ~ '[0-9]+';
ALTER TABLE "HeroMeal" DROP COLUMN IF EXISTS "calories";
ALTER TABLE "HeroMeal" RENAME COLUMN "calories_new" TO "calories";

-- 5. Drop old HeroMeal columns
ALTER TABLE "HeroMeal" DROP COLUMN IF EXISTS "ctaLabel";
ALTER TABLE "HeroMeal" DROP COLUMN IF EXISTS "ctaHref";

-- 6. Default hero copy
INSERT INTO "HeroContent" ("id", "slogan", "title", "description", "updatedAt")
VALUES (
  'singleton',
  'Don''t eat less, eat Right.',
  'HEALTHY FOOD, DONE RIGHT.',
  'Dr.Diet is a healthy food restaurant offering fresh salads, energy dishes, sandwiches, breakfasts, toast, juices, smoothies, smart snacks, and sauces. Every dish is crafted with nutrition and flavor in mind.',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
