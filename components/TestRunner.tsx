"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Award } from "lucide-react";
import { useApp } from "./Providers";
import Speak from "./Speak";
import { makeTest, type Q } from "@/lib/quiz";
import { recordTest } from "@/lib/progress";

type Kind = "placement" | "A1" | "A2";
export default function TestRunner({ kind }: { kind: Kind }) {
  const { t } = useApp();
  const [qs, setQs] = useState<Q[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState<{ correct: number; newBadges: string[] } | null>(null);

  const start = () => { setQs(makeTest(kind)); setI(0); setPicked(null); setAnswers([]); setDone(null); };
  const title = kind === "placement" ? t("placementTitle") : `${t("gateTitle")} ${kind}`;
  const label = { de2ar: "qDe2Ar", ar2de: "qAr2De", article: "qArticle", verb: "qVerb" } as const;

  if (!qs) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="mt-3 leading-8">{t("testIntro")}</p>
          <p className="mt-2 text-sm text-slate-500">{t("deviceNote")}</p>
          <button onClick={start} className="mt-5 w-full rounded-2xl bg-teal-600 py-3 text-lg font-bold text-white active:scale-95">{t("startTest")}</button>
        </div>
      </main>
    );
  }
  const q = qs[i];
  const choose = (n: number) => { if (picked === null) setPicked(n); };
  const next = () => {
    const a = [...answers, picked!];
    setAnswers(a);
    if (i + 1 < qs.length) { setI(i + 1); setPicked(null); return; }
    const correct = a.filter((x, k) => x === qs[k].answer).length;
    const { newBadges } = recordTest(kind, correct, qs.length);
    setDone({ correct, newBadges });
  };

  if (done) {
    const pct = Math.round((done.correct / qs.length) * 100);
    const pass = pct >= 70;
    const wrong = qs.map((x, k) => ({ x, a: answers[k], k })).filter((r) => r.a !== r.x.answer);
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <div className="mt-4 text-center">
            <div className="text-6xl font-extrabold tabular-nums text-teal-700 dark:text-teal-300">{pct}%</div>
            <div className="text-slate-500">{t("score")}: {done.correct} {t("ofWord")} {qs.length}</div>
            {kind === "placement"
              ? <p className="mt-3 text-lg font-bold">{t("placedAt")}: {pct >= 60 ? "A2" : "A1"} — {pct >= 60 ? t("placeA2") : t("placeA1")}</p>
              : <p className={`mt-3 text-lg font-bold ${pass ? "text-emerald-600" : "text-amber-600"}`}>{pass ? t("passedT") : t("failedT")}</p>}
            {done.newBadges.length > 0 && <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800"><Award size={16} /> {done.newBadges.map((b) => t("b_" + b)).join(" · ")}</p>}
          </div>
          {wrong.length > 0 && (<>
            <h2 className="mb-2 mt-6 font-extrabold">{t("reviewT")}</h2>
            <ul className="space-y-2 text-sm">
              {wrong.map(({ x, a, k }) => (
                <li key={k} className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                  <div className="font-bold" dir="auto">{x.prompt}</div>
                  <div className="text-rose-600">{t("yourAns")}: <span dir="auto">{x.options[a]}</span></div>
                  <div className="text-emerald-600">{t("correctAns")}: <span dir="auto">{x.options[x.answer]}</span></div>
                </li>
              ))}
            </ul>
          </>)}
          <div className="mt-6 flex gap-3">
            <button onClick={start} className="flex-1 rounded-2xl border border-teal-600 py-3 font-bold text-teal-700 dark:text-teal-300">{t("retry")}</button>
            <Link href="/learn" className="flex-1 rounded-2xl bg-teal-600 py-3 text-center font-bold text-white">{t("navLearn")}</Link>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500"><span>{title}</span><span>{t("questionOf")} {i + 1} {t("ofWord")} {qs.length}</span></div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10" role="progressbar" aria-valuenow={i + 1} aria-valuemax={qs.length}><div className="h-full bg-teal-600 transition-all" style={{ width: `${((i + 1) / qs.length) * 100}%` }} /></div>
      <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
        <p className="text-sm font-semibold text-slate-500">{t(label[q.kind])}</p>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-3xl font-extrabold" dir="auto" lang={q.kind === "ar2de" ? "ar" : "de"}>{q.prompt}</h1>
          {(q.kind === "de2ar" || q.kind === "article") && <Speak text={q.prompt} />}
        </div>
        <div className="mt-5 grid gap-3">
          {q.options.map((o, n) => {
            const state = picked === null ? "" : n === q.answer ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-400/10" : n === picked ? "border-rose-500 bg-rose-50 dark:bg-rose-400/10" : "opacity-60";
            return (
              <button key={n} onClick={() => choose(n)} disabled={picked !== null} dir="auto" className={`flex items-center justify-between rounded-2xl border-2 border-black/10 px-4 py-3 text-start text-lg font-semibold transition dark:border-white/15 ${state}`}>
                <span>{o}</span>
                {picked !== null && n === q.answer && <CheckCircle2 className="text-emerald-600" size={20} />}
                {picked !== null && n === picked && n !== q.answer && <XCircle className="text-rose-600" size={20} />}
              </button>
            );
          })}
        </div>
        <button onClick={next} disabled={picked === null} className="mt-5 w-full rounded-2xl bg-teal-600 py-3 text-lg font-bold text-white disabled:opacity-40">{i + 1 === qs.length ? t("finishQ") : t("nextQ")}</button>
      </div>
    </main>
  );
}
