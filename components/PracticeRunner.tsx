"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Undo2 } from "lucide-react";
import { useApp } from "./Providers";
import { makeDrill, makeOrder, type Drill, type Item, type OrderItem } from "@/lib/drills";
import { recordPractice } from "@/lib/progress";

const TITLE: Record<Drill, string> = { artikel: "dr_artikel", konjugation: "dr_konj", perfekt: "dr_perfekt", kasus: "dr_kasus", satzbau: "dr_satz" };
const norm = (s: string) => s.replace(/[.,!?]/g, "").toLowerCase();

export default function PracticeRunner({ kind }: { kind: Drill }) {
  const { t } = useApp();
  const [items, setItems] = useState<Item[] | OrderItem[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [chosen, setChosen] = useState<number[]>([]); // order drill: indexes of tapped words
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shuf, setShuf] = useState<string[]>([]);

  const load = (idx: number, list: Item[] | OrderItem[]) => {
    setI(idx); setPicked(null); setChosen([]); setChecked(false);
    if (kind === "satzbau") { const it = (list as OrderItem[])[idx]; let s = it.words; for (let k = 0; k < 5 && s.join(" ") === it.words.join(" "); k++) s = [...it.words].sort(() => Math.random() - 0.5); setShuf(s); }
  };
  const start = () => { const l = kind === "satzbau" ? makeOrder() : makeDrill(kind); setItems(l); setScore(0); setDone(false); load(0, l); };
  const finish = (s: number) => { recordPractice(s); setDone(true); };
  const advance = (gained: boolean) => {
    const s = score + (gained ? 1 : 0);
    setScore(s);
    if (i + 1 >= items!.length) finish(s); else load(i + 1, items!);
  };
  const title = t(TITLE[kind]);

  if (!items) return (
    <main className="mx-auto max-w-xl px-4 py-10"><div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="mt-3 leading-8">{t(kind === "satzbau" ? "dr_satzD" : "practiceIntro")}</p>
      {(kind === "perfekt" || kind === "kasus") && <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">{t("authoredNote")}</p>}
      <button onClick={start} className="mt-5 w-full rounded-2xl bg-teal-600 py-3 text-lg font-bold text-white active:scale-95">{t("startTest")}</button>
    </div></main>
  );
  if (done) return (
    <main className="mx-auto max-w-xl px-4 py-10"><div className="rounded-3xl bg-white p-6 text-center shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <div className="mt-4 text-6xl font-extrabold text-teal-700 dark:text-teal-300">{score}/{items.length}</div>
      <p className="mt-2 text-slate-500">+{score * 2} XP</p>
      <div className="mt-6 flex gap-3">
        <button onClick={start} className="flex-1 rounded-2xl border border-teal-600 py-3 font-bold text-teal-700 dark:text-teal-300">{t("retry")}</button>
        <Link href="/practice" className="flex-1 rounded-2xl bg-teal-600 py-3 font-bold text-white">{t("navPractice")}</Link>
      </div></div></main>
  );

  const head = (<>
    <div className="mb-3 flex items-center justify-between text-sm text-slate-500"><span>{title}</span><span>{t("questionOf")} {i + 1} {t("ofWord")} {items.length}</span></div>
    <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full bg-teal-600 transition-all" style={{ width: `${((i + 1) / items.length) * 100}%` }} /></div>
  </>);

  if (kind === "satzbau") {
    const it = (items as OrderItem[])[i];
    const built = chosen.map((k) => shuf[k]);
    const ok = norm(built.join(" ")) === norm(it.words.join(" "));
    return (
      <main className="mx-auto max-w-xl px-4 py-8">{head}
        <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-semibold text-slate-500">{t("orderPrompt")}</p>
          <p className="mt-1 text-xl font-bold">{it.ar}</p>
          <div dir="ltr" lang="de" className="mt-4 flex min-h-[3.5rem] flex-wrap gap-2 rounded-2xl border-2 border-dashed border-black/15 p-3 dark:border-white/20" aria-live="polite">
            {built.map((w, k) => (<button key={k} disabled={checked} onClick={() => setChosen(chosen.filter((_, x) => x !== k))} className="rounded-xl bg-teal-600 px-3 py-1.5 font-semibold text-white">{w}</button>))}
          </div>
          <div dir="ltr" lang="de" className="mt-3 flex flex-wrap gap-2">
            {shuf.map((w, k) => (<button key={k} disabled={checked || chosen.includes(k)} onClick={() => setChosen([...chosen, k])} className="rounded-xl border-2 border-black/10 px-3 py-1.5 font-semibold disabled:opacity-30 dark:border-white/15">{w}</button>))}
          </div>
          {checked && <p className={`mt-4 flex items-center gap-2 font-bold ${ok ? "text-emerald-600" : "text-rose-600"}`}>{ok ? <CheckCircle2 size={20} /> : <XCircle size={20} />} {ok ? "✓" : <span dir="ltr" lang="de">{it.words.join(" ")}</span>}</p>}
          <div className="mt-5 flex gap-3">
            {!checked && <button onClick={() => setChosen([])} aria-label="reset" className="grid w-14 place-items-center rounded-2xl border border-black/10 dark:border-white/15"><Undo2 size={20} /></button>}
            {!checked
              ? <button onClick={() => setChecked(true)} disabled={chosen.length !== shuf.length} className="flex-1 rounded-2xl bg-teal-600 py-3 text-lg font-bold text-white disabled:opacity-40">{t("check")}</button>
              : <button onClick={() => advance(ok)} className="flex-1 rounded-2xl bg-teal-600 py-3 text-lg font-bold text-white">{i + 1 === items.length ? t("finishQ") : t("nextQ")}</button>}
          </div>
        </div>
      </main>
    );
  }
  const it = (items as Item[])[i];
  const lat = kind === "artikel" || kind === "konjugation" || kind === "perfekt" || kind === "kasus";
  return (
    <main className="mx-auto max-w-xl px-4 py-8">{head}
      <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
        <h1 dir="ltr" lang={lat ? "de" : undefined} className="text-start text-2xl font-extrabold">{it.prompt}</h1>
        {it.hint && (kind === "artikel" || kind === "konjugation") && <p className="mt-1 text-sm text-slate-500">{it.hint}</p>}
        <div className="mt-5 grid gap-3">
          {it.options.map((o, n) => {
            const st = picked === null ? "" : n === it.answer ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-400/10" : n === picked ? "border-rose-500 bg-rose-50 dark:bg-rose-400/10" : "opacity-60";
            return (<button key={n} dir="ltr" lang="de" disabled={picked !== null} onClick={() => setPicked(n)} className={`flex items-center justify-between rounded-2xl border-2 border-black/10 px-4 py-3 text-start text-lg font-semibold dark:border-white/15 ${st}`}>
              <span>{o}</span>{picked !== null && n === it.answer && <CheckCircle2 className="text-emerald-600" size={20} />}{picked !== null && n === picked && n !== it.answer && <XCircle className="text-rose-600" size={20} />}</button>);
          })}
        </div>
        {picked !== null && it.hint && (kind === "perfekt" || kind === "kasus") && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-400/10">{it.hint}</p>}
        <button onClick={() => advance(picked === it.answer)} disabled={picked === null} className="mt-5 w-full rounded-2xl bg-teal-600 py-3 text-lg font-bold text-white disabled:opacity-40">{i + 1 === items.length ? t("finishQ") : t("nextQ")}</button>
      </div>
    </main>
  );
}
