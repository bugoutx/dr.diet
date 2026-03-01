-- Categories: bilingual fields (label -> nameEn, description -> descriptionEn; add nameAr, descriptionAr)
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "nameEn" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "nameAr" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "descriptionAr" TEXT;

UPDATE "Category" SET "nameEn" = "label" WHERE "nameEn" IS NULL AND "label" IS NOT NULL;
UPDATE "Category" SET "nameEn" = '' WHERE "nameEn" IS NULL;
UPDATE "Category" SET "nameAr" = COALESCE("nameEn", "label", '') WHERE "nameAr" IS NULL;
UPDATE "Category" SET "descriptionEn" = "description" WHERE "descriptionEn" IS NULL;
UPDATE "Category" SET "descriptionAr" = "description" WHERE "descriptionAr" IS NULL AND "description" IS NOT NULL;

ALTER TABLE "Category" ALTER COLUMN "nameEn" SET NOT NULL;
ALTER TABLE "Category" ALTER COLUMN "nameAr" SET NOT NULL;

ALTER TABLE "Category" DROP COLUMN IF EXISTS "label";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "description";

-- Meals: bilingual + structured macros (name -> nameEn, description -> descriptionEn; add nameAr, descriptionAr, proteinG, carbsG, calories int)
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "nameEn" TEXT;
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "nameAr" TEXT;
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "descriptionAr" TEXT;
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "proteinG" INTEGER;
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "carbsG" INTEGER;
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "caloriesInt" INTEGER;

UPDATE "Meal" SET "nameEn" = "name" WHERE "nameEn" IS NULL AND "name" IS NOT NULL;
UPDATE "Meal" SET "nameEn" = '' WHERE "nameEn" IS NULL;
UPDATE "Meal" SET "nameAr" = COALESCE("nameEn", "name", '') WHERE "nameAr" IS NULL;
UPDATE "Meal" SET "descriptionEn" = "description" WHERE "descriptionEn" IS NULL;
UPDATE "Meal" SET "descriptionAr" = "description" WHERE "descriptionAr" IS NULL AND "description" IS NOT NULL;

-- Parse old "calories" string (e.g. "35g protein · 473 cal") into proteinG and caloriesInt
-- (substring used instead of regexp_matches because set-returning functions are not allowed in UPDATE)
UPDATE "Meal" SET "proteinG" = substring("calories" from '(\d+)\s*g\s*protein')::integer
WHERE "calories" IS NOT NULL AND "calories" ~ '\d+\s*g\s*protein';

UPDATE "Meal" SET "caloriesInt" = substring("calories" from '(\d+)\s*cal')::integer
WHERE "calories" IS NOT NULL AND "calories" ~ '\d+\s*cal';

ALTER TABLE "Meal" ALTER COLUMN "nameEn" SET NOT NULL;
ALTER TABLE "Meal" ALTER COLUMN "nameAr" SET NOT NULL;

ALTER TABLE "Meal" DROP COLUMN IF EXISTS "name";
ALTER TABLE "Meal" DROP COLUMN IF EXISTS "description";
ALTER TABLE "Meal" DROP COLUMN IF EXISTS "calories";
ALTER TABLE "Meal" RENAME COLUMN "caloriesInt" TO "calories";
