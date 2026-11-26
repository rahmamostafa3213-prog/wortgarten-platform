"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useApp } from "./Providers";
import Speak from "./Speak";
import type { Entry } from "@/lib/content";

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g, "").replace(/[ä]/g, "a").replace(/[ö]/g, "o").replace(/[ü]/g, "u").replace(/ß/g, "ss").replace(/[\u0300-\u036f]/g, "");
const GCLS = { m: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300", f: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300", n: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300" };
const ART = { m: "der", f: "die", n: "das" };

export default function DictionaryView({ entries }: { entries: Entry[] }) {
  const { t } = useApp();
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState("all");
  const list = useMemo(() => {
    const n = norm(q.trim());
    return entries.filter((e) => (lvl === "all" || e.level === lvl) && (!n || norm(e.de).includes(n) || norm(e.ar).includes(n)));
  }, [q, lvl, entries]);
  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-8">
      <h1 className="text-2xl font-extrabold">{t("navDict")}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("dictNote")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/15 dark:bg-white/5">
          <Search size={18} aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="min-w-0 flex-1 bg-transparent outline-none" aria-label={t("search")} />
        </label>
        <div className="flex gap-1" role="group">
          {["all", "A1", "A2"].map((l) => (
            <button key={l} onClick={() => setLvl(l)} aria-pressed={lvl === l} className={`rounded-xl px-4 py-2 text-sm font-bold ${lvl === l ? "bg-teal-600 text-white" : "bg-white dark:bg-white/5"}`}>{l === "all" ? t("all") : l}</button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500" aria-live="polite">{list.length} {t("entries")}</p>
      <ul className="mt-2 divide-y divide-black/5 rounded-3xl bg-white shadow-sm dark:divide-white/10 dark:bg-[#172a28]">
        {list.length === 0 && <li className="p-6 text-center text-slate-500">{t("noResults")}</li>}
        {list.slice(0, 200).map((e) => (
          <li key={e.de} className="flex items-center gap-3 px-4 py-3">
            <Speak text={e.de} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span lang="de" dir="ltr" className="font-bold">{e.de}</span>
                {e.gender && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${GCLS[e.gender]}`}>{ART[e.gender]}</span>}
              </div>
              <div lang="ar" className="text-slate-600 dark:text-slate-300">{e.ar}</div>
            </div>
            <Link href={`/learn/${e.unitId}`} className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-white/10">{e.level}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
