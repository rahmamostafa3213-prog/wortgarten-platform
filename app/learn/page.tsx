"use client";
import Link from "next/link";
import Header from "@/components/Header";
import { useApp } from "@/components/Providers";
import { content } from "@/lib/content";

export default function Learn() {
  const { t } = useApp();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-8">
        <h1 className="text-2xl font-extrabold">{t("navLearn")}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("contentNote")}</p>
        {["A1", "A2"].map((lv) => (
          <section key={lv} className="mt-6">
            <h2 className="mb-2 text-xl font-extrabold">{lv}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.units.filter((u) => u.level === lv).map((u) => (
                <Link key={u.id + lv} href={`/learn/${u.id}`} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
                  <span className="text-3xl" aria-hidden>{u.icon}</span>
                  <span className="min-w-0">
                    <span className="block font-bold">{u.title_ar}</span>
                    <span className="text-sm text-slate-500">{u.words.length} {t("wordsT")} · {u.sentences.length} {t("sentences")}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-extrabold">{t("grammarT")}</h2>
          <div className="space-y-3">
            {content.grammar.map((g, i) => (
              <details key={i} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
                <summary className="cursor-pointer font-bold">{g.title_ar} <span className="ms-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-white/10">{g.level}</span></summary>
                <p className="mt-2 leading-8 text-slate-700 dark:text-slate-200">{g.body_ar}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-extrabold">{t("verbsT")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.verbs.map((v) => (
              <div key={v.inf} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
                <div className="flex items-baseline justify-between"><b lang="de" dir="ltr">{v.inf}</b><span className="text-slate-500">{v.ar}</span></div>
                <dl lang="de" dir="ltr" className="mt-2 grid grid-cols-2 gap-x-3 text-sm">
                  {["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"].map((p, i) => (<div key={p} className="flex gap-2"><dt className="w-16 text-slate-500">{p}</dt><dd className="font-semibold">{v.forms[i]}</dd></div>))}
                </dl>
                <p className="mt-2 text-sm"><span lang="de" dir="ltr">{v.example_de}</span> <span className="text-slate-500">{v.example_ar}</span></p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
