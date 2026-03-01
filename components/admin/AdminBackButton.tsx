"use client";

import Link from "next/link";

type Props = {
  label: string;
  href: string;
};

export default function AdminBackButton({ label, href }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-drd-text/80 hover:text-drd-primary hover:underline transition-colors mb-4 rounded-md outline-none focus:ring-2 focus:ring-drd-primary/40 focus:ring-offset-1"
    >
      <span aria-hidden>←</span>
      <span>Back to {label}</span>
    </Link>
  );
}
