import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import PublicNavWrapper from "@/components/PublicNavWrapper";
import OverflowDebugWrapper from "@/components/OverflowDebugWrapper";
import SessionProvider from "@/components/providers/SessionProvider";
import { LangProvider } from "@/lib/LangContext";
import { SectionNavProvider } from "@/lib/SectionNavContext";
import { getSectionNavVisibility } from "@/lib/data";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Dr. Diet - Healthy Eating Made Simple",
  description: "Discover delicious, nutritious meals designed for your wellness journey",
};

/** Root layout loads section nav visibility (Prisma). Avoid static prerender / build-time DB access. */
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sectionNavVisibility = await getSectionNavVisibility();

  return (
    <html lang="en" className="h-full bg-white" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-white text-drd-text antialiased`}
      >
        <SessionProvider>
          <SectionNavProvider value={sectionNavVisibility}>
            <LangProvider>
              <PublicNavWrapper />
              <OverflowDebugWrapper />
              <main className="w-full">
                {children}
              </main>
            </LangProvider>
          </SectionNavProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
