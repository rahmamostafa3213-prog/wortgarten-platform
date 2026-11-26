"use client";
import { Volume2 } from "lucide-react";
import { useApp } from "./Providers";

export default function Speak({ text, className = "" }: { text: string; className?: string }) {
  const { t } = useApp();
  const go = () => {
    if (typeof speechSynthesis === "undefined") return alert(t("noVoice"));
    const voices = speechSynthesis.getVoices();
    const v = voices.find((x) => x.lang.toLowerCase().startsWith("de"));
    if (!v && voices.length) return alert(t("noVoice"));
    const u = new SpeechSynthesisUtterance(text.replace(/^(der|die|das) /, "$1 "));
    u.lang = "de-DE";
    if (v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };
  return (
    <button onClick={go} aria-label={`${t("speak")}: ${text}`} title={t("speak")} className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-600/10 text-teal-700 transition active:scale-90 dark:text-teal-300 ${className}`}>
      <Volume2 size={18} />
    </button>
  );
}
