import type { NavItem } from "@/lib/navLinks";

/** Same booleans used to decide which `#section` anchors exist on the home page. */
export type SectionNavVisibility = {
  menu: boolean;
  lovedPlates: boolean;
  market: boolean;
  science: boolean;
  reels: boolean;
  testimonials: boolean;
  plans: boolean;
  contact: boolean;
};

const NAV_ID_TO_KEY: Record<string, keyof SectionNavVisibility> = {
  menu: "menu",
  "loved-plates": "lovedPlates",
  market: "market",
  science: "science",
  reels: "reels",
  testimonials: "testimonials",
  plans: "plans",
  contact: "contact",
};

/** Keep NAV_ITEMS order; drop items whose section is not on the page. */
export function filterNavItemsByVisibility(items: NavItem[], v: SectionNavVisibility): NavItem[] {
  return items.filter((item) => {
    const key = NAV_ID_TO_KEY[item.id];
    if (!key) return true;
    return v[key];
  });
}
