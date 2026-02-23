import { auth } from "./auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session;
}
