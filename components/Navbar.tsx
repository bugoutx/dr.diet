"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-drd-primary/20"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-4 lg:px-6">
        <a href="#hero" className="flex items-center">
          <Image
            src="/images/logo-text-green-cut.png"
            alt="Dr.Diet"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#menu" className="text-drd-text hover:text-drd-primary transition-colors">
            Menu
          </a>
          <a href="#categories" className="text-drd-text hover:text-drd-primary transition-colors">
            Categories
          </a>
          <a href="#about" className="text-drd-text hover:text-drd-primary transition-colors">
            About
          </a>
          <a href="#contact" className="text-drd-text hover:text-drd-primary transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

