"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DICTS, LANGS, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; dark: boolean; toggleDark: () => void };
const C = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(C);
  if (!c) throw new Error("Providers missing");
  return c;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const l = (localStorage.getItem("wg_lang") as Lang) || "ar";
    const q = new URLSearchParams(location.search).get("lang") as Lang | null;
    const d = localStorage.getItem("wg_dark");
    const qd = new URLSearchParams(location.search).get("dark");
    // restoring saved preferences after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(q && DICTS[q] ? q : DICTS[l] ? l : "ar");
    setDark(qd ? qd === "1" : d ? d === "1" : matchMedia("(prefers-color-scheme: dark)").matches);
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    const meta = LANGS.find((x) => x.code === lang)!;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
  }, [lang]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("wg_lang", l);
  }, []);
  const toggleDark = useCallback(() => {
    setDark((d) => {
      localStorage.setItem("wg_dark", d ? "0" : "1");
      return !d;
    });
  }, []);
  const t = useCallback((k: string) => DICTS[lang][k] ?? k, [lang]);
  return <C.Provider value={{ lang, setLang, t, dark, toggleDark }}>{children}</C.Provider>;
}
