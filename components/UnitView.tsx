"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useApp } from "./Providers";
import Speak from "./Speak";
import type { Unit } from "@/lib/content";

const ART = { m: "der", f: "die", n: "das" };
export default function UnitView({ units }: { units: Unit[] }) {
  const { t } = useApp();
  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1 text-sm text-teal-700 dark:text-teal-300"><ArrowRight size={16} className="ltr:rotate-180" /> {t("navLearn")}</Link>
      {units.map((u) => (
        <article key={u.level + u.id}>
          <h1 className="text-2xl font-extrabold"><span aria-hidden>{u.icon}</span> {u.title_ar} <span className="ms-2 rounded-full bg-teal-600/10 px-2 py-0.5 text-sm">{u.level}</span></h1>
          <p className="mt-3 rounded-2xl bg-amber-50 p-4 leading-8 dark:bg-amber-400/10">{u.note_ar}</p>
          <h2 className="mb-2 mt-6 text-lg font-extrabold">{t("wordsT")}</h2>
          <ul className="divide-y divide-black/5 rounded-3xl bg-white dark:divide-white/10 dark:bg-[#172a28]">
            {u.words.map((w) => (
              <li key={w.de} className="flex items-center gap-3 px-4 py-3">
                <Speak text={w.de} />
                <span lang="de" dir="ltr" className="font-bold">{w.de}</span>
                {w.gender && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-white/10">{ART[w.gender]}</span>}
                <span className="ms-auto text-slate-600 dark:text-slate-300">{w.ar}</span>
              </li>
            ))}
          </ul>
          {u.sentences.length > 0 && (<>
            <h2 className="mb-2 mt-6 text-lg font-extrabold">{t("sentences")}</h2>
            <ul className="space-y-2">
              {u.sentences.map((s) => (
                <li key={s.de} className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-[#172a28]">
                  <Speak text={s.de} />
                  <div><div lang="de" dir="ltr" className="font-semibold">{s.de}</div><div className="text-slate-600 dark:text-slate-300">{s.ar}</div></div>
                </li>
              ))}
            </ul>
          </>)}
        </article>
      ))}
    </main>
  );
}
