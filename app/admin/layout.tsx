import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNavbar from "./AdminNavbar";
import AdminAuthGate from "./AdminAuthGate";
import AdminToaster from "./AdminToaster";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@drdiet.sy";

/** Admin uses `auth()` and all routes expect request-time rendering; never prerender with Prisma. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.email && session.user.email !== ADMIN_EMAIL) {
    redirect("/");
  }
  return (
    <div className="min-h-screen bg-drd-bg">
      <AdminToaster />
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <AdminAuthGate session={session}>{children}</AdminAuthGate>
      </main>
    </div>
  );
}
