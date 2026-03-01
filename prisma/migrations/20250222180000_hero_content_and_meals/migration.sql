-- Create HeroContent (singleton row for hero copy)
CREATE TABLE "HeroContent" (
    "id" TEXT NOT NULL,
    "slogan" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroContent_pkey" PRIMARY KEY ("id")
);

-- Add orderOnBeeorderUrl to SiteSettings
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "orderOnBeeorderUrl" TEXT;

-- HeroMeal: add badge, make imageUrl nullable, change calories to Int, remove ctaLabel/ctaHref
ALTER TABLE "HeroMeal" ADD COLUMN IF NOT EXISTS "badge" TEXT;
ALTER TABLE "HeroMeal" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- Migrate calories from TEXT to INTEGER (nullable)
ALTER TABLE "HeroMeal" ADD COLUMN IF NOT EXISTS "calories_new" INTEGER;
UPDATE "HeroMeal" SET "calories_new" = NULLIF(regexp_replace("calories", '[^0-9]', '', 'g'), '')::integer WHERE "calories" IS NOT NULL AND regexp_replace("calories", '[^0-9]', '', 'g') ~ '^[0-9]+$';
ALTER TABLE "HeroMeal" DROP COLUMN IF EXISTS "calories";
ALTER TABLE "HeroMeal" RENAME COLUMN "calories_new" TO "calories";

ALTER TABLE "HeroMeal" DROP COLUMN IF EXISTS "ctaLabel";
ALTER TABLE "HeroMeal" DROP COLUMN IF EXISTS "ctaHref";

-- Insert default HeroContent row
INSERT INTO "HeroContent" ("id", "slogan", "title", "description", "updatedAt")
VALUES (
  'singleton',
  'Don''t eat less, eat Right.',
  'HEALTHY FOOD, DONE RIGHT.',
  'Dr.Diet is a healthy food restaurant offering fresh salads, energy dishes, sandwiches, breakfasts, toast, juices, smoothies, smart snacks, and sauces. Every dish is crafted with nutrition and flavor in mind.',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
