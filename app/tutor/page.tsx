"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Trash2, KeyRound } from "lucide-react";
import Header from "@/components/Header";
import Speak from "@/components/Speak";
import { useApp } from "@/components/Providers";
import { ask, KEY_STORE, type Msg } from "@/lib/tutor";

export default function Tutor() {
  const { t, lang } = useApp();
  const [key, setKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setKey(localStorage.getItem(KEY_STORE) || ""); }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy || !key) return;
    const next = [...msgs, { role: "user" as const, text }];
    setMsgs(next); setInput(""); setBusy(true);
    const r = await ask(key, next, lang);
    setMsgs([...next, r.ok ? { role: "model", text: r.text } : { role: "model", text: t("tutorErr_" + r.err), err: true }]);
    if (!r.ok && r.err === "key") { /* keep the key so she can see it is wrong; she can remove it */ }
    setBusy(false);
  };
  const input$ = "w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-teal-600 dark:border-white/15 dark:bg-white/5";
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-8">
        <h1 className="text-2xl font-extrabold">{t("navTutor")}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("tutorIntro")}</p>
        {key === null ? null : !key ? (
          <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
            <label className="mb-2 flex items-center gap-2 font-bold"><KeyRound size={18} /> {t("tutorKeyLabel")}</label>
            <input className={input$} dir="ltr" type="password" autoComplete="off" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="AIza…" />
            <button onClick={() => { const k = draft.trim(); if (k) { localStorage.setItem(KEY_STORE, k); setKey(k); setDraft(""); } }} disabled={!draft.trim()} className="mt-3 w-full rounded-2xl bg-teal-600 py-3 font-bold text-white disabled:opacity-40">{t("tutorSaveKey")}</button>
            <p className="mt-3 text-sm text-slate-500">{t("tutorHow")}</p>
            <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">{t("tutorLimits")}</p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex gap-2 text-sm">
              <button onClick={() => setMsgs([])} className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 font-semibold dark:bg-white/10"><Trash2 size={14} /> {t("tutorReset")}</button>
              <button onClick={() => { localStorage.removeItem(KEY_STORE); setKey(""); setMsgs([]); }} className="rounded-xl bg-white px-3 py-1.5 font-semibold dark:bg-white/10">{t("tutorClearKey")}</button>
            </div>
            <div className="mt-4 space-y-3" aria-live="polite">
              {msgs.length === 0 && <div className="rounded-2xl bg-white p-5 text-center text-slate-600 dark:bg-[#172a28] dark:text-slate-300">{t("tutorEmpty")}</div>}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div dir="auto" className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-teal-600 text-white" : m.err ? "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300" : "bg-white shadow-sm dark:bg-[#172a28]"}`}>
                    {m.text}
                    {m.role === "model" && !m.err && <div className="mt-2"><Speak text={m.text.split("\n")[0]} /></div>}
                  </div>
                </div>
              ))}
              {busy && <div className="text-slate-500">…</div>}
              <div ref={end} />
            </div>
            <div className="fixed inset-x-0 bottom-0 border-t border-black/5 bg-white/90 p-3 backdrop-blur dark:border-white/10 dark:bg-[#0e1a19]/90">
              <div className="mx-auto flex max-w-2xl gap-2">
                <input className={input$} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={t("tutorPlaceholder")} aria-label={t("tutorPlaceholder")} />
                <button onClick={send} disabled={busy || !input.trim()} aria-label={t("tutorSend")} className="grid w-14 shrink-0 place-items-center rounded-xl bg-teal-600 text-white disabled:opacity-40"><Send size={20} className="rtl:-scale-x-100" /></button>
              </div>
              <p className="mx-auto mt-1 max-w-2xl text-center text-xs text-slate-500">{t("tutorLimits")}</p>
            </div>
          </>
        )}
      </main>
    </>
  );
}
