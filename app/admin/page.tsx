import Link from "next/link";

const links = [
  { href: "/admin/settings", label: "Settings", desc: "Phone, Instagram, menu PDF, maps, section toggles" },
  { href: "/admin/categories", label: "Categories", desc: "Menu categories with drag-drop order" },
  { href: "/admin/meals", label: "Meals", desc: "CRUD meals per category" },
  { href: "/admin/hero", label: "Hero", desc: "3 featured meals for hero section" },
  { href: "/admin/plates", label: "Our Most-Loved Plates", desc: "Signature dishes carousel" },
  { href: "/admin/videos", label: "Videos", desc: "Max 5 videos, autoplay on landing" },
  { href: "/admin/testimonials", label: "Testimonials", desc: "Customer reviews" },
  { href: "/admin/plans", label: "Subscription Plans", desc: "Weekly/monthly plans" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Admin Dashboard
      </h1>
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
