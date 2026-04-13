-- AlterTable (additive)
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "pdfUrl" TEXT;
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "pdfFileName" TEXT;
