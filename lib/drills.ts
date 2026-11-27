import { content, dictionary } from "./content";

export type Drill = "artikel" | "konjugation" | "perfekt" | "kasus" | "satzbau";
export type Item = { prompt: string; options: string[]; answer: number; hint?: string };
export type OrderItem = { words: string[]; ar: string };

function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function shuffle<T>(arr: T[], r: () => number = Math.random) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Authored fill-in items (one correct option each). Drafted for this platform, marked in the UI
// as awaiting review by a German teacher. Format: sentence with ___, options, correct option, Arabic hint.
type Raw = [string, string[], string, string];
const PERFEKT: Raw[] = [
  ["Ich ___ gestern Fußball gespielt.", ["habe", "bin", "hat", "ist"], "habe", "Perfekt مع spielen بياخد haben"],
  ["Sie ___ nach Berlin gefahren.", ["ist", "hat", "habe", "bin"], "ist", "أفعال الحركة (fahren) بتاخد sein"],
  ["Wir ___ einen Film gesehen.", ["haben", "sind", "hat", "ist"], "haben", "sehen بياخد haben"],
  ["Er hat ein Buch ___.", ["gelesen", "gelest", "gelesst", "lesen"], "gelesen", "lesen فعل قوي: gelesen"],
  ["Ich habe Deutsch ___.", ["gelernt", "gelernen", "gelernte", "lernt"], "gelernt", "فعل ضعيف: ge + جذر + t"],
  ["Du bist spät ___.", ["angekommen", "gekommen an", "ankommt", "angekommt"], "angekommen", "فعل منفصل: an + ge + kommen"],
  ["Sie haben Pizza ___.", ["gegessen", "geessen", "gegesst", "essen"], "gegessen", "essen فعل قوي: gegessen"],
  ["Ich bin zu Hause ___.", ["geblieben", "gebleibt", "bleibt", "gebleiben"], "geblieben", "bleiben بياخد sein: geblieben"],
  ["Wir sind ins Kino ___.", ["gegangen", "gegeht", "gegangt", "gehen"], "gegangen", "gehen بياخد sein: gegangen"],
  ["Er hat das Auto ___.", ["gekauft", "gekaufen", "kauft", "gekaufst"], "gekauft", "فعل ضعيف: gekauft"],
];
const KASUS: Raw[] = [
  ["Ich sehe ___ Mann. (der Mann)", ["den", "der", "dem", "des"], "den", "Akkusativ: der ← den"],
  ["Ich kaufe ___ Tasche. (die Tasche)", ["die", "der", "den", "dem"], "die", "Akkusativ: die تفضل die"],
  ["Ich helfe ___ Frau. (die Frau)", ["der", "die", "den", "das"], "der", "helfen + Dativ: die ← der"],
  ["Er gibt ___ Kind ein Buch. (das Kind)", ["dem", "das", "den", "der"], "dem", "Dativ: das ← dem"],
  ["Ich habe ___ Hund. (der Hund)", ["einen", "ein", "einem", "einer"], "einen", "Akkusativ: ein ← einen للمذكر"],
  ["Wir fahren mit ___ Bus. (der Bus)", ["dem", "den", "der", "das"], "dem", "mit + Dativ دايماً"],
  ["Das ist das Auto ___ Lehrers. (der Lehrer)", ["des", "dem", "den", "der"], "des", "Genitiv: der ← des (+ s)"],
  ["Sie wohnt bei ___ Eltern. (die Eltern)", ["den", "die", "der", "dem"], "den", "bei + Dativ، والجمع: den"],
  ["Ich sehe ___ Kinder. (die Kinder)", ["die", "den", "dem", "der"], "die", "Akkusativ جمع: die"],
  ["Ich schreibe ___ Freundin einen Brief. (die Freundin)", ["der", "die", "den", "dem"], "der", "Dativ: die ← der"],
];

const fromRaw = (rows: Raw[], r: () => number): Item[] => rows.map(([prompt, opts, ans, hint]) => { const o = shuffle(opts, r); return { prompt, options: o, answer: o.indexOf(ans), hint }; });

export function makeDrill(kind: Exclude<Drill, "satzbau">, seed = Date.now(), n = 10): Item[] {
  const r = rng(seed);
  if (kind === "perfekt") return fromRaw(shuffle(PERFEKT, r), r).slice(0, n);
  if (kind === "kasus") return fromRaw(shuffle(KASUS, r), r).slice(0, n);
  if (kind === "konjugation") {
    const pron = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
    const out: Item[] = [];
    for (const v of shuffle(content.verbs, r)) {
      const i = Math.floor(r() * 6);
      const wrong = shuffle(Array.from(new Set(v.forms)).filter((f) => f !== v.forms[i]), r).slice(0, 3);
      if (wrong.length < 2) continue;
      const o = shuffle([v.forms[i], ...wrong], r);
      out.push({ prompt: `${pron[i]} ___ (${v.inf})`, options: o, answer: o.indexOf(v.forms[i]), hint: v.ar });
    }
    return out.slice(0, n);
  }
  // artikel
  const words = dictionary().map((w) => ({ m: /^(der|die|das) (.+)$/.exec(w.de), w })).filter((x) => x.m);
  return shuffle(words, r).slice(0, n).map(({ m, w }) => { const opts = ["der", "die", "das"]; return { prompt: m![2], options: opts, answer: opts.indexOf(m![1]), hint: w.ar }; });
}

export function makeOrder(seed = Date.now(), n = 8): OrderItem[] {
  const r = rng(seed);
  const all = content.units.flatMap((u) => u.sentences).filter((s) => { const k = s.de.split(" ").length; return k >= 3 && k <= 7; });
  return shuffle(all, r).slice(0, n).map((s) => ({ words: s.de.split(" "), ar: s.ar }));
}
