"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Plan = {
  id: string;
  title: string;
  includes: string;
  features: string[];
  priceWeekly: number;
  priceMonthly: number;
  isPopular?: boolean;
};

const plans: Plan[] = [
  {
    id: "full-plan",
    title: "Full Plan",
    includes: "Breakfast, Lunch, Dinner + Snack",
    features: [
      "Calories tailored to your needs",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    priceWeekly: 625000,
    priceMonthly: 3000000,
    isPopular: true,
  },
  {
    id: "breakfast-lunch",
    title: "Breakfast + Lunch",
    includes: "Breakfast, Lunch + Snack",
    features: [
      "Balanced meals & clean ingredients",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    priceWeekly: 450000,
    priceMonthly: 2280000,
  },
  {
    id: "lunch-dinner",
    title: "Lunch + Dinner",
    includes: "Lunch, Dinner + Snack",
    features: [
      "High-protein plates for steady energy",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    priceWeekly: 500000,
    priceMonthly: 2400000,
  },
  {
    id: "work-lunch",
    title: "Work Lunch",
    includes: "Lunch + Snack",
    features: [
      "Ideal for busy workdays",
      "5 days/week for 4 weeks",
      "Pause or skip any day anytime",
    ],
    priceWeekly: 250000,
    priceMonthly: 1200000,
  },
];

// Format number with commas
const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US");
};

// Wave SVG for card header with refined gradient and highlight line
const WaveHeader = ({ isPopular = false }: { isPopular?: boolean }) => (
  <div className="relative h-32 w-full overflow-hidden rounded-t-3xl">
    <div
      className={`absolute inset-0 ${
        isPopular
          ? "bg-gradient-to-br from-[#5F9E2F] via-[#79B83E] to-[#CFF6DF]"
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
        {/* Faint highlight line at wave edge */}
        <path
          d="M0,32 Q100,16 200,32 T400,32"
          stroke="url(#waveGradient)"
          strokeWidth="1.5"
          fill="none"
          className="transition-all duration-300"
        />
      </svg>
    </div>
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
          Most Popular
        </span>
      </motion.div>
    )}
  </div>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

type PlanCardProps = {
  plan: Plan;
  billingPeriod: "weekly" | "monthly";
  index: number;
};

function PlanCard({ plan, billingPeriod, index }: PlanCardProps) {
  const isPopular = plan.isPopular || false;

  const displayPrice =
    billingPeriod === "weekly" ? plan.priceWeekly : plan.priceMonthly;
  const periodLabel = billingPeriod === "weekly" ? "per week" : "per month";

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, scale: isPopular ? 1.03 : 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col rounded-3xl w-full overflow-hidden"
    >
      {/* Gradient outline border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-drd-primary/30 via-emerald-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      {/* Glassmorphism card */}
      <div
        className={`relative flex flex-col flex-1 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
          isPopular
            ? "bg-white/90 border-white/60 border-drd-primary/40 shadow-lg shadow-drd-primary/10 xl:scale-[1.05]"
            : "bg-white/80 border-white/60 hover:border-drd-primary/50"
        } group-hover:shadow-[0_0_0_1px_rgba(95,158,47,0.2),0_8px_24px_rgba(95,158,47,0.15)]`}
      >
        {/* Wave Header */}
        <WaveHeader isPopular={isPopular} />

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-6 pt-8 pb-8">
          {/* Plan Title */}
          <h3 className="mb-2.5 text-2xl font-bold font-heading text-drd-text tracking-tight">
            {plan.title}
          </h3>

          {/* Includes */}
          <p className="mb-6 text-sm text-drd-text/70 leading-relaxed">
            {plan.includes}
          </p>

          {/* Features List */}
          <ul className="mb-8 flex-1 space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-drd-text/80 leading-relaxed">
                <span className="mt-0.5 text-drd-primary text-base">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="border-t border-slate-200/60 pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-drd-primary tracking-tight">
                {formatPrice(displayPrice)}{" "}
                <span className="text-sm font-medium opacity-70">SYP</span>
              </p>
              <p className="mt-1.5 text-xs text-drd-text/60 font-medium">
                {periodLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PlanSubscriptionsSection() {
  const [billingPeriod, setBillingPeriod] = useState<"weekly" | "monthly">("weekly");

  return (
    <section id="plans" className="relative bg-white py-16 sm:py-20">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-50/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl md:text-4xl font-bold font-heading text-drd-text tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-lg text-drd-text/70 font-medium">
            Choose the plan that fits your day.
          </p>
        </motion.div>

        {/* Billing Period Toggle */}
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
              Weekly
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
              Monthly
            </button>
          </div>
        </motion.div>

        {/* Plans Grid - 4 in a row desktop, 2 tablet, 1 mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

