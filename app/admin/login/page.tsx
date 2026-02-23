"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-drd-bg px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-drd-primary/10">
        <h1 className="text-2xl font-bold font-heading text-drd-text mb-2">
          Dr.Diet Admin
        </h1>
        <p className="text-drd-muted text-sm mb-6">Sign in to manage your site</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-drd-text mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-drd-text focus:border-drd-primary focus:ring-2 focus:ring-drd-primary/20 outline-none transition"
              placeholder="admin@drdiet.sy"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-drd-text mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-drd-text focus:border-drd-primary focus:ring-2 focus:ring-drd-primary/20 outline-none transition"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-drd-primary px-6 py-3 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
