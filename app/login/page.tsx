"use client";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import { useApp } from "@/components/Providers";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export default function Login() {
  const { t } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const run = async (mode: "in" | "up") => {
    const sb = getSupabase();
    if (!sb) return;
    const r = mode === "in" ? await sb.auth.signInWithPassword({ email, password }) : await sb.auth.signUp({ email, password });
    setMsg(r.error ? r.error.message : "OK");
  };
  const input = "w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-teal-600 dark:border-white/15 dark:bg-white/5";
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
          <h1 className="mb-4 text-2xl font-extrabold">{t("loginTitle")}</h1>
          {!supabaseConfigured && <p className="mb-4 rounded-xl bg-amber-100 p-3 text-sm text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">{t("notConfigured")}</p>}
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); run("in"); }}>
            <input className={input} type="email" placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} disabled={!supabaseConfigured} required />
            <input className={input} type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} disabled={!supabaseConfigured} required minLength={8} />
            <div className="flex gap-3">
              <button type="submit" disabled={!supabaseConfigured} className="flex-1 rounded-xl bg-teal-600 py-3 font-bold text-white disabled:opacity-40">{t("login")}</button>
              <button type="button" onClick={() => run("up")} disabled={!supabaseConfigured} className="flex-1 rounded-xl border border-teal-600 py-3 font-bold text-teal-700 disabled:opacity-40 dark:text-teal-300">{t("create")}</button>
            </div>
            {msg && <p className="text-sm">{msg}</p>}
          </form>
          <Link href="/" className="mt-5 inline-block text-sm text-teal-700 underline dark:text-teal-300">{t("back")}</Link>
        </div>
      </main>
    </>
  );
}
