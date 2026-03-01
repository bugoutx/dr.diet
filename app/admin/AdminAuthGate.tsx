"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminAuthGate({
  session,
  children,
}: {
  session: { user?: { email?: string | null } } | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!session?.user?.email) {
      const loginUrl = `/admin/login?callbackUrl=${encodeURIComponent(pathname ?? "/admin")}`;
      router.replace(loginUrl);
      return;
    }
  }, [session, pathname, isLoginPage, router]);

  return <>{children}</>;
}
