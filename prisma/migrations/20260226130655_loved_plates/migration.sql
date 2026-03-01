-- DropIndex
DROP INDEX "LovedPlateTag_plateId_idx";

-- DropIndex
DROP INDEX "MealTag_mealId_idx";

-- AlterTable
ALTER TABLE "LovedPlate" ALTER COLUMN "galleryUrls" DROP DEFAULT;
