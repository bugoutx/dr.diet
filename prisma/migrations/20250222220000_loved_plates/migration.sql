-- CreateTable
CREATE TABLE "LovedPlate" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "subtitleEn" TEXT,
    "subtitleAr" TEXT,
    "descriptionEn" TEXT,
    "descriptionAr" TEXT,
    "imageUrl" TEXT NOT NULL,
    "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "proteinG" INTEGER,
    "carbsG" INTEGER,
    "calories" INTEGER,
    "ingredientsEn" TEXT,
    "ingredientsAr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LovedPlate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LovedPlateTag" (
    "id" TEXT NOT NULL,
    "plateId" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LovedPlateTag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LovedPlateTag" ADD CONSTRAINT "LovedPlateTag_plateId_fkey" FOREIGN KEY ("plateId") REFERENCES "LovedPlate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "LovedPlateTag_plateId_idx" ON "LovedPlateTag"("plateId");
