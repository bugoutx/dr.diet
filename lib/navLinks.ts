/** Same offset as Navbar so footer scroll matches in-page navigation */
export const NAV_OFFSET_PX = 88;
export const NAV_OFFSET_MOBILE_PX = 72;

export type NavItem = {
  id: string;
  labelEn: string;
  labelAr: string;
};

/** Section ids match landing page `<section id="...">` anchors */
export const NAV_ITEMS: NavItem[] = [
  { id: "menu", labelEn: "Menu", labelAr: "القائمة" },
  { id: "loved-plates", labelEn: "Loved Plates", labelAr: "أطباقنا المفضلة" },
  { id: "market", labelEn: "Market", labelAr: "السوق" },
  { id: "science", labelEn: "Science", labelAr: "الجانب العلمي" },
  { id: "reels", labelEn: "Reels", labelAr: "الفيديوهات" },
  { id: "testimonials", labelEn: "Testimonials", labelAr: "آراء العملاء" },
  { id: "plans", labelEn: "Plans", labelAr: "الباقات" },
  { id: "contact", labelEn: "Contact", labelAr: "تواصل معنا" },
];

export function scrollToSection(sectionId: string, isMobile?: boolean) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const offset = isMobile ? NAV_OFFSET_MOBILE_PX : NAV_OFFSET_PX;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}
