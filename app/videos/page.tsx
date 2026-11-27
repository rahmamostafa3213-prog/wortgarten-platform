"use client";
import Link from "next/link";
import { Play, Captions } from "lucide-react";
import Header from "@/components/Header";
import { useApp } from "@/components/Providers";
import { asset } from "@/lib/base";
import { videos, pick } from "@/lib/videos";

export default function Videos() {
  const { t, lang } = useApp();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8">
        <h1 className="text-2xl font-extrabold">{t("navVideos")}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("videosNote")}</p>
        {(["basics", "pronunciation"] as const).map((s) => (
          <section key={s} className="mt-6">
            <h2 className="mb-3 text-xl font-extrabold">{t("series_" + s)}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {videos.filter((v) => v.series === s).map((v) => (
                <Link key={v.id} href={`/videos/${v.id}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md dark:bg-[#172a28] dark:ring-1 dark:ring-white/10">
                  <div className="relative aspect-[9/16] max-h-64 w-full overflow-hidden bg-teal-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(v.poster)} alt="" loading="lazy" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 grid place-items-center bg-black/10 transition group-hover:bg-black/20"><span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-teal-800"><Play size={22} fill="currentColor" /></span></span>
                    {v.captions.length > 0 && <span className="absolute end-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-bold text-white"><Captions size={12} /> CC</span>}
                  </div>
                  <div className="p-3">
                    <div className="line-clamp-2 text-sm font-bold" dir="auto">{pick(v.title, lang)}</div>
                    <div className="mt-1 text-xs text-slate-500">{Math.max(1, Math.round(v.seconds / 60))} {t("min")} · {v.level}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
        <p className="mt-8 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">{t("ytNone")}</p>
      </main>
    </>
  );
}
