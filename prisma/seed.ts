import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin (password: admin123 - CHANGE IN PRODUCTION)
  const hashedPassword = await hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@drdiet.sy" },
    create: {
      email: "admin@drdiet.sy",
      password: hashedPassword,
      name: "Admin",
    },
    update: {},
  });

  // Create default site settings
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      phoneNumber: "0997 920 789",
      instagramUrl: "https://instagram.com/dr.diet.sy",
      instagramHandle: "@dr.diet.sy",
      googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4152.1623094196175!2d36.25385544105741!3d33.503343381899114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6fc344fceac893aa!2sG733%2B8G5%2C%20Damas%2C%20Syria!5e0!3m2!1sen!2sus!4v1766573200924!5m2!1sen!2sus",
      googleMapsLinkUrl: "https://maps.google.com/?q=G733+8G5+Damascus+Syria",
      showHero: true,
      showMenu: true,
      showPlates: true,
      showScience: true,
      showVideos: true,
      showTestimonials: true,
      showPlans: true,
      showContact: true,
    },
    update: {},
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
