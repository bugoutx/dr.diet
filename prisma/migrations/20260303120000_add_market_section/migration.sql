-- CreateTable
CREATE TABLE "MarketCategory" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "slug" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionAr" TEXT,
    "price" INTEGER,
    "image" TEXT NOT NULL,
    "protein" INTEGER,
    "carbs" INTEGER,
    "calories" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketCategory_slug_key" ON "MarketCategory"("slug");

-- CreateIndex
CREATE INDEX "MarketCategory_isActive_idx" ON "MarketCategory"("isActive");

-- CreateIndex
CREATE INDEX "MarketItem_categoryId_order_idx" ON "MarketItem"("categoryId", "order");

-- CreateIndex
CREATE INDEX "MarketItem_isActive_idx" ON "MarketItem"("isActive");

-- AddForeignKey
ALTER TABLE "MarketItem" ADD CONSTRAINT "MarketItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MarketCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
