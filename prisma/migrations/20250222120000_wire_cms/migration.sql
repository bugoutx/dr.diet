-- Add HeroMeal model
CREATE TABLE "HeroMeal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "calories" TEXT,
    "protein" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "ctaLabel" TEXT DEFAULT 'Order Now',
    "ctaHref" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroMeal_pkey" PRIMARY KEY ("id")
);

-- Add isActive to Plate
ALTER TABLE "Plate" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Add isActive to Testimonial
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Add isActive to Plan
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
