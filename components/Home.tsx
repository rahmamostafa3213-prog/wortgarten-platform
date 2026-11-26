"use client";
import { Award, BookOpen, Headphones, Pencil, Mic, Lock, CheckCircle2, Hammer, CalendarClock, KeyRound, Flame, Star, Languages, ArrowRight, Target } from "lucide-react";
import { useApp } from "./Providers";
import Link from "next/link";
import { useProgress, a2Unlocked } from "@/lib/progress";
import { FEATURES, LEVELS, type Status } from "@/lib/levels";

const STATUS: Record<Status, { key: string; cls: string; Icon: typeof CheckCircle2 }> = {
  ready: { key: "ready", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300", Icon: CheckCircle2 },
  building: { key: "building", cls: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300", Icon: Hammer },
  planned: { key: "planned", cls: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300", Icon: CalendarClock },
  needsYou: { key: "needsYou", cls: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300", Icon: KeyRound },
};

export default function Home() {
  const { t, lang } = useApp();
  const p = useProgress();
  const skills = [
    { k: "reading", d: "readingD", Icon: BookOpen },
    { k: "listening", d: "listeningD", Icon: Headphones },
    { k: "writing", d: "writingD", Icon: Pencil },
    { k: "speaking", d: "speakingD", Icon: Mic },
  ];
  const card = "rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(18,48,46,.05),0_8px_24px_rgba(18,48,46,.07)] dark:bg-[#172a28] dark:shadow-none dark:ring-1 dark:ring-white/10";
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-500 to-teal-800 p-7 text-white shadow-xl sm:p-12">
        <div className="pointer-events-none absolute -end-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 start-1/3 h-56 w-56 rounded-full bg-white/5" />
        <p className="relative mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold"><Languages size={16} /> {t("tagline")}</p>
        <h1 className="relative max-w-3xl text-3xl font-extrabold leading-snug sm:text-5xl sm:leading-tight">{t("heroTitle")}</h1>
        <p className="relative mt-4 max-w-2xl text-base text-white/90 sm:text-lg">{t("heroText")}</p>
        <div className="relative mt-7 flex flex-wrap items-center gap-3">
          <a href="#roadmap" className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 font-extrabold text-teal-950 shadow transition hover:bg-amber-300 active:scale-95">
            {t("start")} <ArrowRight size={18} className="rtl:rotate-180" />
          </a>
          <Link href="/test/placement" className="inline-flex items-center gap-2 rounded-2xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><Target size={16} /> {t("placement")}</Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-extrabold">{t("yourDay")}</h2>
        <div className="grid grid-cols-3 gap-3">
          {[{ k: "xp", Icon: Star, v: p.xp }, { k: "streak", Icon: Flame, v: p.streak }, { k: "words", Icon: BookOpen, v: p.tests }].map(({ k, Icon, v }) => (
            <div key={k} className={card}>
              <Icon className="mb-2 text-amber-500" size={22} />
              <div className="text-3xl font-extrabold tabular-nums">{v}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{t(k)}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("guestNote")}</p>
        <div className={`${card} mt-3`}>
          <div className="mb-2 font-bold">{t("badgesT")}</div>
          {p.badges.length === 0 ? <span className="text-sm text-slate-500">{t("noBadges")}</span> : <div className="flex flex-wrap gap-2">{p.badges.map((b) => (<span key={b} className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300"><Award size={14} /> {t("b_" + b)}</span>))}</div>}
        </div>
      </section>

      <section id="roadmap" className="mt-10 scroll-mt-20">
        <h2 className="text-xl font-extrabold">{t("roadmapTitle")}</h2>
        <p className="mb-4 mt-1 max-w-3xl text-slate-600 dark:text-slate-300">{t("roadmapText")}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((lv, i) => (
            <div key={lv.code} className={`${card} ${lv.written ? "" : "opacity-80"}`}>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-600/10 text-xl font-extrabold text-teal-700 dark:text-teal-300">{lv.code}</span>
                {i === 0 || (i === 1 && a2Unlocked(p)) ? <CheckCircle2 className="text-emerald-500" /> : <Lock className="text-slate-400" size={20} />}
              </div>
              <div className="mt-3 font-bold">{lv.written ? `${lv.units} ${t("units")} · ${lv.words} ${lang === "ar" ? "كلمة" : lang === "de" ? "Wörter" : "words"}` : t("notYet")}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lv.written ? t("available") : "—"}</div>
              <div className="mt-3 border-t border-black/5 pt-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                <span className="font-semibold">{t("gate")}:</span> {i === 0 ? t("gateA1") : `${t("gateNext")} ${LEVELS[i - 1].code}`}
                {(i === 1 || i === 2) && (<Link href={i === 1 ? "/test/A1" : "/test/A2"} className="ms-2 font-bold text-teal-700 underline dark:text-teal-300">{i === 1 ? t("openGate") : t("openGate2")}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-extrabold">{t("skillsTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map(({ k, d, Icon }) => (
            <div key={k} className={card}>
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-teal-600/10 text-teal-700 dark:text-teal-300"><Icon size={22} /></span>
              <div className="font-bold">{t(k)}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(d)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold">{t("statusTitle")}</h2>
        <p className="mb-4 mt-1 text-slate-600 dark:text-slate-300">{t("statusText")}</p>
        <ul className={`${card} divide-y divide-black/5 p-0 dark:divide-white/10`}>
          {FEATURES.map((f) => {
            const s = STATUS[f.status];
            return (
              <li key={f.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <span className="text-sm sm:text-base">{f[lang]}</span>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}><s.Icon size={14} /> {t(s.key)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="mt-12 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">{t("footerHonest")}</footer>
    </main>
  );
}
