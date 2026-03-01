-- AlterTable Testimonial: optional role, add avatarColor, rename order -> sortOrder
ALTER TABLE "Testimonial" ALTER COLUMN "role" DROP NOT NULL;
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "avatarColor" TEXT;
ALTER TABLE "Testimonial" RENAME COLUMN "order" TO "sortOrder";
