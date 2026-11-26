import raw from "@/data/content.json";

export type Word = { de: string; ar: string; gender: "m" | "f" | "n" | null };
export type Unit = { id: number; level: "A1" | "A2"; icon: string; title_ar: string; note_ar: string; words: Word[]; sentences: { de: string; ar: string }[] };
export type Dialog = { icon: string; title_ar: string; level: string; lines: { de: string; ar: string; who: number }[] };
export type Verb = { inf: string; ar: string; forms: string[]; example_de: string; example_ar: string; level: string };
export type Grammar = { title_ar: string; body_ar: string; level: string };

export const content = raw as unknown as { units: Unit[]; dialogs: Dialog[]; verbs: Verb[]; grammar: Grammar[] };

export type Entry = Word & { level: string; unitId: number; unit: string };
/** One dictionary entry per German headword (first occurrence wins). */
export function dictionary(): Entry[] {
  const seen = new Set<string>();
  const out: Entry[] = [];
  for (const u of content.units)
    for (const w of u.words) {
      if (seen.has(w.de)) continue;
      seen.add(w.de);
      out.push({ ...w, level: u.level, unitId: u.id, unit: u.title_ar });
    }
  return out;
}
