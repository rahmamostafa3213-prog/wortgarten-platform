"use client";
import Link from "next/link";
import { Globe, Moon, Sun, LogIn, Sprout } from "lucide-react";
import { useApp } from "./Providers";
import { LANGS } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t, dark, toggleDark } = useApp();
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#0e1a19]/80">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-teal-700 dark:text-teal-300">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white shadow-sm"><Sprout size={20} /></span>
          <span className="hidden text-lg tracking-tight min-[380px]:inline">{t("brand")}</span>
        </Link>
        <div className="ms-auto flex items-center gap-2">
          <label className="flex items-center gap-1 rounded-xl border border-black/10 bg-white px-2 py-1.5 text-sm dark:border-white/15 dark:bg-white/5">
            <Globe size={16} aria-hidden />
            <span className="sr-only">{t("language")}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as typeof lang)} className="w-20 bg-transparent outline-none sm:w-auto">
              {LANGS.map((l) => (<option key={l.code} value={l.code} className="text-black">{l.label}</option>))}
            </select>
          </label>
          <button onClick={toggleDark} aria-label={t("theme")} title={t("theme")} className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white transition active:scale-95 dark:border-white/15 dark:bg-white/5">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login" aria-label={t("signIn")} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-3 py-2 text-sm font-bold sm:px-4 text-white shadow-sm transition hover:bg-teal-700 active:scale-95">
            <LogIn size={16} aria-hidden /> <span className="hidden sm:inline">{t("signIn")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
