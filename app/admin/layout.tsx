import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Login page handles its own layout; middleware redirects unauthenticated users for other admin routes
  return (
    <div className="min-h-screen bg-drd-bg">
      <AdminNav session={session} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
