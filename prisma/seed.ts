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
      menuPdfUrl: null,
      orderOnBeeorderUrl: null,
      orderOnMovoUrl: null,
      googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4152.1623094196175!2d36.25385544105741!3d33.503343381899114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6fc344fceac893aa!2sG733%2B8G5%2C%20Damas%2C%20Syria!5e0!3m2!1sen!2sus!4v1766573200924!5m2!1sen!2sus",
      googleMapsLinkUrl: "https://maps.google.com/?q=G733+8G5+Damascus+Syria",
      mapsEmbedHtml: null,
      locationText: "G733+8G5, Damascus, Syria",
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

  // Hero content (singleton)
  const defaultHeroDescription =
    "Dr.Diet is a healthy food restaurant offering fresh salads, energy dishes, sandwiches, breakfasts, toast, juices, smoothies, smart snacks, and sauces. Every dish is crafted with nutrition and flavor in mind.";
  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      slogan: "Don't eat less, eat Right.",
      title: "HEALTHY FOOD, DONE RIGHT.",
      description: defaultHeroDescription,
    },
    update: {},
  });

  // Hero meals: create 3 placeholders if none exist
  const heroMealCount = await prisma.heroMeal.count();
  if (heroMealCount === 0) {
    await prisma.heroMeal.createMany({
      data: [
        { title: "California Salad", subtitle: "Salad", calories: 473, protein: 35, sortOrder: 0, badge: "Rotating signature meal", imageUrl: null },
        { title: "Dr.Diet Energy Plate", subtitle: "Energy Dish", calories: 350, protein: 48, sortOrder: 1, badge: "Rotating signature meal", imageUrl: null },
        { title: "Radiance Smoothie", subtitle: "Smoothie", calories: 343, protein: 12, sortOrder: 2, badge: "Rotating signature meal", imageUrl: null },
      ],
    });
  }

  // Loved plates: create 3 demo plates if none exist
  const lovedPlateCount = await prisma.lovedPlate.count();
  if (lovedPlateCount === 0) {
    await prisma.lovedPlate.createMany({
      data: [
        { titleEn: "Dr.Diet Energy Plate", titleAr: "طبق الطاقة", subtitleEn: "Energy Dish · Chicken", subtitleAr: "طبق طاقة · دجاج", imageUrl: "/images/hero-energy-plate.jpg", sortOrder: 0 },
        { titleEn: "California Salad", titleAr: "سلطة كاليفورنيا", subtitleEn: "Salad · High Protein", subtitleAr: "سلطة · بروتين عالي", imageUrl: "/images/hero-california-salad.jpg", sortOrder: 1 },
        { titleEn: "Radiance Smoothie", titleAr: "سموذي الإشراق", subtitleEn: "Smoothie · Energy", subtitleAr: "سموذي · طاقة", imageUrl: "/images/hero-radiance-smoothie.jpg", sortOrder: 2 },
      ],
    });
    const created = await prisma.lovedPlate.findMany({ orderBy: { sortOrder: "asc" }, take: 3 });
    if (created.length > 0) {
      await prisma.lovedPlateTag.createMany({
        data: [
          { plateId: created[0].id, labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green", sortOrder: 0 },
          { plateId: created[0].id, labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange", sortOrder: 1 },
        ],
      });
    }
  }

  // Testimonials: create 3–4 starter testimonials if none exist
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: "Sarah Johnson", role: "Gym Member", text: "Dr.Diet has transformed my relationship with food. Every meal is delicious and perfectly balanced for my fitness goals. I've never felt better! The consistency and quality are unmatched.", rating: 5, sortOrder: 0 },
        { name: "Michael Chen", role: "Office Worker", text: "I love that they show protein and calories on every meal. It makes tracking so easy, and the food actually tastes amazing. Perfect for my busy lifestyle.", rating: 5, sortOrder: 1 },
        { name: "Emily Rodriguez", role: "Health Coach", text: "As a nutritionist, I recommend Dr.Diet to all my clients. The meal plans are scientifically sound, delicious, and the macros are always transparent.", rating: 5, sortOrder: 2 },
        { name: "Ahmed Al-Mahmoud", role: "Fitness Enthusiast", text: "The consistency is incredible. Every meal is fresh, perfectly portioned, and the high-protein options keep me full and energized throughout the day.", rating: 5, sortOrder: 3 },
      ],
    });
  }

  // Subscription plans: create 4 default plans if none exist
  const subscriptionPlanCount = await prisma.subscriptionPlan.count();
  if (subscriptionPlanCount === 0) {
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          order: 0,
          isActive: true,
          isPopular: true,
          titleEn: "Full Plan",
          titleAr: "الخطة الكاملة",
          subtitleEn: "Breakfast, Lunch, Dinner + Snack",
          subtitleAr: "فطور، غداء، عشاء + وجبة خفيفة",
          featuresEn: ["Calories tailored to your needs", "5 days/week for 4 weeks", "Pause or skip any day anytime"],
          featuresAr: ["سعرات مصممة لاحتياجاتك", "5 أيام في الأسبوع لمدة 4 أسابيع", "إيقاف أو تخطي أي يوم في أي وقت"],
          weeklyPrice: 625000,
          monthlyPrice: 3000000,
        },
        {
          order: 1,
          isActive: true,
          isPopular: false,
          titleEn: "Breakfast + Lunch",
          titleAr: "فطور + غداء",
          subtitleEn: "Breakfast, Lunch + Snack",
          subtitleAr: "فطور، غداء + وجبة خفيفة",
          featuresEn: ["Balanced meals & clean ingredients", "5 days/week for 4 weeks", "Pause or skip any day anytime"],
          featuresAr: ["وجبات متوازنة ومكونات نظيفة", "5 أيام في الأسبوع لمدة 4 أسابيع", "إيقاف أو تخطي أي يوم في أي وقت"],
          weeklyPrice: 450000,
          monthlyPrice: 2280000,
        },
        {
          order: 2,
          isActive: true,
          isPopular: false,
          titleEn: "Lunch + Dinner",
          titleAr: "غداء + عشاء",
          subtitleEn: "Lunch, Dinner + Snack",
          subtitleAr: "غداء، عشاء + وجبة خفيفة",
          featuresEn: ["High-protein plates for steady energy", "5 days/week for 4 weeks", "Pause or skip any day anytime"],
          featuresAr: ["أطباق غنية بالبروتين لطاقة ثابتة", "5 أيام في الأسبوع لمدة 4 أسابيع", "إيقاف أو تخطي أي يوم في أي وقت"],
          weeklyPrice: 500000,
          monthlyPrice: 2400000,
        },
        {
          order: 3,
          isActive: true,
          isPopular: false,
          titleEn: "Work Lunch",
          titleAr: "غداء العمل",
          subtitleEn: "Lunch + Snack",
          subtitleAr: "غداء + وجبة خفيفة",
          featuresEn: ["Ideal for busy workdays", "5 days/week for 4 weeks", "Pause or skip any day anytime"],
          featuresAr: ["مثالي لأيام العمل المزدحمة", "5 أيام في الأسبوع لمدة 4 أسابيع", "إيقاف أو تخطي أي يوم في أي وقت"],
          weeklyPrice: 250000,
          monthlyPrice: 1200000,
        },
      ],
    });
  }

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
