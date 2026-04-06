"use client";

import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

const links: { href: string; labelEn: string; labelAr: string; descEn: string; descAr: string }[] = [
  { href: "/admin/settings", labelEn: "Settings", labelAr: "الإعدادات", descEn: "Phone, Instagram, menu PDF, maps, section toggles", descAr: "الهاتف، إنستغرام، قائمة PDF، الخرائط، إظهار الأقسام" },
  { href: "/admin/categories", labelEn: "Categories", labelAr: "الفئات", descEn: "Menu categories with drag-drop order", descAr: "فئات القائمة مع ترتيب السحب والإفلات" },
  { href: "/admin/meals", labelEn: "Meals", labelAr: "الوجبات", descEn: "CRUD meals per category", descAr: "إدارة الوجبات لكل فئة" },
  { href: "/admin/hero", labelEn: "Hero", labelAr: "الهيرو", descEn: "3 featured meals for hero section", descAr: "3 وجبات مميزة لقسم الهيرو" },
  { href: "/admin/loved-plates", labelEn: "Our Most Loved Plates", labelAr: "أطباقنا المفضلة", descEn: "Manage signature dishes carousel (EN/AR, tags, images)", descAr: "إدارة سلسلة الأطباق المميزة (عربي/إنجليزي، وسوم، صور)" },
  { href: "/admin/market", labelEn: "Market", labelAr: "السوق", descEn: "Dr.Diet Market categories and items (EN/AR, images, macros)", descAr: "فئات ومنتجات سوق Dr.Diet (عربي/إنجليزي، صور، قيم غذائية)" },
  { href: "/admin/videos", labelEn: "Videos", labelAr: "الفيديوهات", descEn: "Max 5 videos, autoplay on landing", descAr: "حد أقصى 5 فيديوهات، تشغيل تلقائي" },
  { href: "/admin/testimonials", labelEn: "Testimonials", labelAr: "الشهادات", descEn: "Customer reviews", descAr: "آراء العملاء" },
  { href: "/admin/plans", labelEn: "Subscription Plans", labelAr: "خطط الاشتراك", descEn: "Weekly/monthly plans", descAr: "خطط أسبوعية/شهرية" },
];

export default function AdminDashboardPage() {
  const { lang } = useLang();
  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Admin Dashboard", "لوحة تحكم الأدمن")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-drd-primary/40 hover:shadow-md"
          >
            <h2 className="font-semibold text-drd-text">{tField(lang, link.labelEn, link.labelAr)}</h2>
            <p className="mt-1 text-sm text-drd-muted">{tField(lang, link.descEn, link.descAr)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
