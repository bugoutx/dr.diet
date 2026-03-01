"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type Lang = "en" | "ar";

const STORAGE_KEY = "drdiet_lang";

function getStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ar" || stored === "en") return stored;
  const params = new URLSearchParams(window.location.search);
  const q = params.get("lang");
  if (q === "ar" || q === "en") return q;
  return "en";
}

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
} | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const next = getStoredLang();
    setLangState(next);
  }, [mounted]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  return ctx ?? { lang: "en" as Lang, setLang: () => {} };
}
