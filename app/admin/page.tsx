import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const links = [
  { href: "/admin/settings", label: "Settings", desc: "Phone, Instagram, menu PDF, maps, section toggles" },
  { href: "/admin/categories", label: "Categories", desc: "Menu categories with drag-drop order" },
  { href: "/admin/meals", label: "Meals", desc: "CRUD meals per category" },
  { href: "/admin/hero", label: "Hero", desc: "3 featured meals for hero section" },
  { href: "/admin/loved-plates", label: "Our Most Loved Plates", desc: "Manage signature dishes carousel (EN/AR, tags, images)" },
  { href: "/admin/videos", label: "Videos", desc: "Max 5 videos, autoplay on landing" },
  { href: "/admin/testimonials", label: "Testimonials", desc: "Customer reviews" },
  { href: "/admin/plans", label: "Subscription Plans", desc: "Weekly/monthly plans" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminPageHeader
        title="Admin Dashboard"
        backLabel="Dashboard"
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
            <h2 className="font-semibold text-drd-text">{link.label}</h2>
            <p className="mt-1 text-sm text-drd-muted">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
