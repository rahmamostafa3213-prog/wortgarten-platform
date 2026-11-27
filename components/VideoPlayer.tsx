"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useApp } from "./Providers";
import { pick, type VideoItem } from "@/lib/videos";

const SPEEDS = [0.75, 1, 1.25, 1.5];
export default function VideoPlayer({ v }: { v: VideoItem }) {
  const { t, lang } = useApp();
  const ref = useRef<HTMLVideoElement>(null);
  const [rate, setRate] = useState(1);
  const [cap, setCap] = useState<"off" | "de" | "ar">(v.captions.includes("ar") ? "ar" : "off");
  const setCaption = (c: "off" | "de" | "ar") => {
    setCap(c);
    const tracks = ref.current?.textTracks;
    if (tracks) for (let i = 0; i < tracks.length; i++) tracks[i].mode = tracks[i].language === c ? "showing" : "hidden";
  };
  const setSpeed = (r: number) => { setRate(r); if (ref.current) ref.current.playbackRate = r; };
  return (
    <main className="mx-auto max-w-md px-4 pb-20 pt-6">
      <Link href="/videos" className="mb-3 inline-flex items-center gap-1 text-sm text-teal-700 dark:text-teal-300"><ArrowRight size={16} className="ltr:rotate-180" /> {t("navVideos")}</Link>
      <h1 className="text-xl font-extrabold" dir="auto">{pick(v.title, lang)}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300" dir="auto">{pick(v.desc, lang)}</p>
      <video ref={ref} controls playsInline preload="metadata" poster={v.poster} src={v.file} onLoadedMetadata={() => { setSpeed(rate); setCaption(cap); }} className="mt-4 w-full rounded-2xl bg-teal-900" crossOrigin="anonymous">
        {v.captions.includes("ar") && <track kind="captions" srcLang="ar" label="العربية" src={v.file.replace(".mp4", ".ar.vtt")} default={cap === "ar"} />}
        {v.captions.includes("de") && <track kind="captions" srcLang="de" label="Deutsch" src={v.file.replace(".mp4", ".de.vtt")} />}
      </video>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">{t("speed")}</span>
        {SPEEDS.map((s) => (<button key={s} onClick={() => setSpeed(s)} aria-pressed={rate === s} className={`rounded-xl px-3 py-1.5 text-sm font-bold ${rate === s ? "bg-teal-600 text-white" : "bg-white dark:bg-white/10"}`}>{s}x</button>))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {v.captions.length === 0 ? <span className="text-sm text-slate-500">{t("noCaps")}</span> : (
          <>
            {(["off", ...v.captions] as const).map((c) => (<button key={c} onClick={() => setCaption(c)} aria-pressed={cap === c} className={`rounded-xl px-3 py-1.5 text-sm font-bold ${cap === c ? "bg-teal-600 text-white" : "bg-white dark:bg-white/10"}`}>{c === "off" ? "CC ✕" : c === "de" ? t("capDe") : t("capAr")}</button>))}
          </>
        )}
      </div>
      <p className="mt-5 text-xs text-slate-500">{t("licenseT")}: {t("licenseOwn")}</p>
    </main>
  );
}
