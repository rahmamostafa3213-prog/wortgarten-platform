"use client";
import Link from "next/link";
import { Type, ListChecks, History, Scale, ArrowDownUp } from "lucide-react";
import Header from "@/components/Header";
import { useApp } from "@/components/Providers";

const CARDS = [
  { k: "artikel", Icon: Type, key: "dr_artikel", d: "dr_artikelD" },
  { k: "konjugation", Icon: ListChecks, key: "dr_konj", d: "dr_konjD" },
  { k: "perfekt", Icon: History, key: "dr_perfekt", d: "dr_perfektD" },
  { k: "kasus", Icon: Scale, key: "dr_kasus", d: "dr_kasusD" },
  { k: "satzbau", Icon: ArrowDownUp, key: "dr_satz", d: "dr_satzD" },
];
export default function Practice() {
  const { t } = useApp();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-8">
        <h1 className="text-2xl font-extrabold">{t("navPractice")}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("practiceNote")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CARDS.map(({ k, Icon, key, d }) => (
            <Link key={k} href={`/practice/${k}`} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-600/10 text-teal-700 dark:text-teal-300"><Icon size={24} /></span>
              <span><span className="block font-bold">{t(key)}</span><span className="text-sm text-slate-500">{t(d)}</span></span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
