-- Create MealTag table
CREATE TABLE "MealTag" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealTag_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MealTag" ADD CONSTRAINT "MealTag_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing Meal.tags (string array) to MealTag rows only if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Meal' AND column_name = 'tags'
  ) THEN
    INSERT INTO "MealTag" ("id", "mealId", "labelEn", "labelAr", "tone", "order", "updatedAt")
    SELECT
      gen_random_uuid()::text,
      m.id,
      t.tag,
      t.tag,
      'green',
      row_number() OVER (PARTITION BY m.id ORDER BY ordinality) - 1,
      CURRENT_TIMESTAMP
    FROM "Meal" m,
      unnest(m.tags) WITH ORDINALITY AS t(tag, ordinality)
    WHERE m.tags IS NOT NULL AND array_length(m.tags, 1) > 0;
    ALTER TABLE "Meal" DROP COLUMN "tags";
  END IF;
END $$;

-- Create index for faster lookups by mealId
CREATE INDEX IF NOT EXISTS "MealTag_mealId_idx" ON "MealTag"("mealId");
