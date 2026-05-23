"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/formatNumber";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import DecorativeVeggies from "@/components/DecorativeVeggies";

export type Plan = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  featuresEn: string[];
  featuresAr: string[];
  priceWeekly?: number | null;
  priceMonthly?: number | null;
  isPopular?: boolean;
  pdfUrl?: string | null;
  pdfFileName?: string | null;
  subscribeUrl?: string | null;
};

// Copy for section labels (EN/AR)
const LABELS = {
  sectionTitle: { en: "Subscription Plans", ar: "خطط الاشتراك" },
  sectionSubtitle: { en: "Choose the plan that fits your day.", ar: "اختر الخطة التي تناسب يومك." },
  weekly: { en: "Weekly", ar: "أسبوعي" },
  monthly: { en: "Monthly", ar: "شهري" },
  mostPopular: { en: "Most Popular", ar: "الأكثر شعبية" },
  perWeek: { en: "per week", ar: "للأسبوع" },
  perMonth: { en: "per month", ar: "للشهر" },
  emptyWeekly: { en: "No weekly plans available right now.", ar: "لا توجد خطط أسبوعية متاحة حالياً." },
  emptyMonthly: { en: "No monthly plans available right now.", ar: "لا توجد خطط شهرية متاحة حالياً." },
  subscribeNow: { en: "Subscribe Now", ar: "اشترك الآن" },
  viewPlan: { en: "View Plan", ar: "عرض الخطة" },
  downloadPdf: { en: "Download Plan PDF", ar: "تحميل ملف الخطة" },
} as const;

// Fallback when DB has no plans
const FALLBACK_PLANS: Plan[] = [
  {
    id: "full-plan",
    titleEn: "Full Plan",
    titleAr: "الخطة الكاملة",
    subtitleEn: "Breakfast, Lunch, Dinner + Snack",
    subtitleAr: "فطور، غداء، عشاء + وجبة خفيفة",
    featuresEn: [
      "Calories tailored to your needs",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    featuresAr: [
      "سعرات مصممة لاحتياجاتك",
      "5 أيام في الأسبوع لمدة 4 أسابيع",
      "إيقاف أو تخطي أي يوم في أي وقت",
    ],
    priceWeekly: 625000,
    priceMonthly: 3000000,
    isPopular: true,
  },
  {
    id: "breakfast-lunch",
    titleEn: "Breakfast + Lunch",
    titleAr: "فطور + غداء",
    subtitleEn: "Breakfast, Lunch + Snack",
    subtitleAr: "فطور، غداء + وجبة خفيفة",
    featuresEn: [
      "Balanced meals & clean ingredients",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    featuresAr: [
      "وجبات متوازنة ومكونات نظيفة",
      "5 أيام في الأسبوع لمدة 4 أسابيع",
      "إيقاف أو تخطي أي يوم في أي وقت",
    ],
    priceWeekly: 450000,
    priceMonthly: 2280000,
  },
  {
    id: "lunch-dinner",
    titleEn: "Lunch + Dinner",
    titleAr: "غداء + عشاء",
    subtitleEn: "Lunch, Dinner + Snack",
    subtitleAr: "غداء، عشاء + وجبة خفيفة",
    featuresEn: [
      "High-protein plates for steady energy",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    featuresAr: [
      "أطباق غنية بالبروتين لطاقة ثابتة",
      "5 أيام في الأسبوع لمدة 4 أسابيع",
      "إيقاف أو تخطي أي يوم في أي وقت",
    ],
    priceWeekly: 500000,
    priceMonthly: 2400000,
  },
  {
    id: "work-lunch",
    titleEn: "Work Lunch",
    titleAr: "غداء العمل",
    subtitleEn: "Lunch + Snack",
    subtitleAr: "غداء + وجبة خفيفة",
    featuresEn: [
      "Ideal for busy workdays",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    featuresAr: [
      "مثالي لأيام العمل المزدحمة",
      "5 أيام في الأسبوع لمدة 4 أسابيع",
      "إيقاف أو تخطي أي يوم في أي وقت",
    ],
    priceWeekly: 250000,
    priceMonthly: 1200000,
  },
];

const WaveHeader = ({ isPopular = false }: { isPopular?: boolean }) => (
  <div className="relative h-32 w-full overflow-hidden rounded-t-3xl">
    <div
      className={`absolute inset-0 ${
        isPopular
          ? "bg-gradient-to-br from-[#4a7c25] via-[#5F9E2F] to-[#9ed4a8]"
          : "bg-gradient-to-br from-[#5F9E2F]/70 via-[#79B83E]/60 to-[#CFF6DF]/50"
      }`}
    >
      <svg
        className="absolute bottom-0 h-12 w-full"
        viewBox="0 0 400 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CFF6DF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#BFF3D6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CFF6DF" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,32 Q100,16 200,32 T400,32 L400,48 L0,48 Z"
          fill="white"
          className="transition-all duration-300"
        />
        <path
          d="M0,32 Q100,16 200,32 T400,32"
          stroke="url(#waveGradient)"
          strokeWidth="1.5"
          fill="none"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

type PlanCardProps = {
  plan: Plan;
  billingPeriod: "weekly" | "monthly";
};

function PlanCard({ plan, billingPeriod }: PlanCardProps) {
  const { lang } = useLang();
  const isPopular = plan.isPopular ?? false;
  const displayPrice =
    billingPeriod === "weekly" ? plan.priceWeekly : plan.priceMonthly;
  const periodLabel =
    billingPeriod === "weekly"
      ? tField(lang, LABELS.perWeek.en, LABELS.perWeek.ar)
      : tField(lang, LABELS.perMonth.en, LABELS.perMonth.ar);
  const title = tField(lang, plan.titleEn, plan.titleAr);
  const subtitle = tField(lang, plan.subtitleEn ?? "", plan.subtitleAr ?? "");
  const features =
    lang === "ar" ? plan.featuresAr : plan.featuresEn;
  const fileIsImage = /\.(png|jpe?g|webp|gif|avif|svg|bmp)(\?|$)/i.test(plan.pdfFileName || plan.pdfUrl || "");

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, scale: isPopular ? 1.03 : 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col rounded-3xl w-full overflow-hidden flex-shrink-0"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-drd-primary/30 via-emerald-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      <div
        className={`relative flex flex-col flex-1 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
          isPopular
            ? "bg-white/90 border-white/60 border-drd-primary/40 shadow-lg shadow-drd-primary/10 xl:scale-[1.05]"
            : "bg-white/80 border-white/60 hover:border-drd-primary/50"
        } group-hover:shadow-[0_0_0_1px_rgba(95,158,47,0.2),0_8px_24px_rgba(95,158,47,0.15)]`}
      >
        <div className="relative">
          <WaveHeader isPopular={isPopular} />
          {isPopular && (
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(95, 158, 47, 0.4)",
                  "0 0 12px 4px rgba(95, 158, 47, 0.3)",
                  "0 0 0 0 rgba(95, 158, 47, 0.4)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="relative rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#5F9E2F] shadow-lg border border-[#5F9E2F]/20">
                {tField(lang, LABELS.mostPopular.en, LABELS.mostPopular.ar)}
              </span>
            </motion.div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 pt-8 pb-8">
          <h3 className="mb-2.5 text-2xl font-bold font-heading text-drd-text tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mb-6 text-sm text-drd-text/70 leading-relaxed">
              {subtitle}
            </p>
          )}
          <ul className="mb-8 flex-1 space-y-3">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-drd-text/80 leading-relaxed"
              >
                <span className="mt-0.5 text-drd-primary text-base">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-200/60 pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-drd-primary tracking-tight">
                {formatNumber(displayPrice ?? 0)}{" "}
                <span className="text-sm font-medium opacity-70">{lang === "ar" ? "ل.س" : "SYP"}</span>
              </p>
              <p className="mt-1.5 text-xs text-drd-text/60 font-medium">
                {periodLabel}
              </p>
            </div>
            {plan.subscribeUrl ? (
              <div className="mt-5 text-center">
                <a
                  href={plan.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-drd-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-drd-primary-dark"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <span>{tField(lang, LABELS.subscribeNow.en, LABELS.subscribeNow.ar)}</span>
                  <svg
                    className="h-4 w-4 shrink-0"
                    style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            ) : null}
            {plan.pdfUrl ? (
              <div className="mt-3 text-center">
                <a
                  href={plan.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...(fileIsImage ? {} : { download: plan.pdfFileName || "plan.pdf" })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-drd-primary/35 bg-white/90 px-4 py-2.5 text-sm font-semibold text-drd-primary shadow-sm transition hover:border-drd-primary/60 hover:bg-drd-primary/5"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <svg className="h-4 w-4 shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    {fileIsImage ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    )}
                  </svg>
                  <span>
                    {fileIsImage
                      ? tField(lang, LABELS.viewPlan.en, LABELS.viewPlan.ar)
                      : tField(lang, LABELS.downloadPdf.en, LABELS.downloadPdf.ar)}
                  </span>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PlanSubscriptionsSection({ plans: propPlans }: { plans?: Plan[] }) {
  const { lang } = useLang();
  const plans = propPlans && propPlans.length > 0 ? propPlans : FALLBACK_PLANS;
  const [billingPeriod, setBillingPeriod] = useState<"weekly" | "monthly">("weekly");

  const filteredPlans = useMemo(() => {
    if (billingPeriod === "weekly") {
      return plans.filter((p) => p.priceWeekly != null);
    }
    return plans.filter((p) => p.priceMonthly != null);
  }, [plans, billingPeriod]);

  const sectionTitle = tField(lang, LABELS.sectionTitle.en, LABELS.sectionTitle.ar);
  const sectionSubtitle = tField(lang, LABELS.sectionSubtitle.en, LABELS.sectionSubtitle.ar);
  const weeklyLabel = tField(lang, LABELS.weekly.en, LABELS.weekly.ar);
  const monthlyLabel = tField(lang, LABELS.monthly.en, LABELS.monthly.ar);
  const emptyMessage =
    billingPeriod === "weekly"
      ? tField(lang, LABELS.emptyWeekly.en, LABELS.emptyWeekly.ar)
      : tField(lang, LABELS.emptyMonthly.en, LABELS.emptyMonthly.ar);

  return (
    <section id="plans" className="relative overflow-hidden bg-white py-16 sm:py-20">
      <DecorativeVeggies section="plans" />
      <div className="absolute inset-0 bg-gradient-radial from-emerald-50/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl md:text-4xl font-bold font-heading text-drd-text tracking-tight">
            {sectionTitle}
          </h2>
          <p className="text-lg text-drd-text/70 font-medium">
            {sectionSubtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex rounded-full border border-slate-200/60 bg-white/80 backdrop-blur-sm p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingPeriod("weekly")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                billingPeriod === "weekly"
                  ? "bg-drd-primary text-white shadow-md"
                  : "text-drd-text/70 hover:text-drd-primary"
              }`}
            >
              {weeklyLabel}
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                billingPeriod === "monthly"
                  ? "bg-drd-primary text-white shadow-md"
                  : "text-drd-text/70 hover:text-drd-primary"
              }`}
            >
              {monthlyLabel}
            </button>
          </div>
        </motion.div>

        {filteredPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 py-12 px-6 text-center"
          >
            <p className="text-drd-text/70 font-medium">{emptyMessage}</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className={`
              lg:overflow-x-auto lg:snap-x lg:snap-mandatory
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              lg:pb-2
            `}
          >
            {/* Inner track: stacked grid on small screens, a centered flex row on lg.
                lg:w-max + lg:mx-auto centers the row when it fits and scrolls from the
                left (no clipping) when the plans overflow the viewport. */}
            <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:flex lg:w-max lg:mx-auto">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="lg:snap-center lg:shrink-0 lg:w-[320px]"
                >
                  <PlanCard
                    plan={plan}
                    billingPeriod={billingPeriod}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
