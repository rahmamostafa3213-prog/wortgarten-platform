import raw from "@/data/videos.json";

export type VideoItem = {
  id: number; file: string; poster: string; level: string; source_kind: "own" | "youtube_embed";
  title: { ar: string; en: string | null; de: string | null };
  desc: { ar: string; en: string | null; de: string | null };
  series: "basics" | "pronunciation"; seconds: number; captions: ("de" | "ar")[];
};
export const videos = raw as VideoItem[];
export const pick = (o: { ar: string; en: string | null; de: string | null }, lang: "ar" | "en" | "de") => o[lang] ?? o.ar;
