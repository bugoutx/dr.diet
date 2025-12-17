import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-white text-drd-text antialiased`}
      >
        <Navbar />
        <main className="w-full">
        {children}
        </main>
      </body>
    </html>
  );
}
