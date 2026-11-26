import { content, dictionary } from "./content";

export type Q = { kind: "de2ar" | "ar2de" | "article" | "verb"; prompt: string; options: string[]; answer: number; level: "A1" | "A2" };

// Small seeded PRNG so a test can be reproduced.
function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle<T>(arr: T[], r: () => number) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const ART = { m: "der", f: "die", n: "das" } as const;

function build(level: "A1" | "A2", n: number, r: () => number): Q[] {
  const words = dictionary().filter((w) => w.level === level);
  const verbs = content.verbs.filter((v) => v.level === level);
  const pool: Q[] = [];
  const stem = (x: string) => x.replace(/^(der|die|das|sich) /, "");
  const opts = (self: (typeof words)[number], correct: string, pick: (w: (typeof words)[number]) => string) => {
    // exclude look-alikes (same Arabic or same German stem) so only one option is right
    const wrong = shuffle(words.filter((w) => w.ar !== self.ar && stem(w.de) !== stem(self.de) && !stem(w.de).startsWith(stem(self.de)) && !stem(self.de).startsWith(stem(w.de))).map(pick).filter((x, i, a) => x !== correct && a.indexOf(x) === i), r).slice(0, 3);
    const all = shuffle([correct, ...wrong], r);
    return { options: all, answer: all.indexOf(correct) };
  };
  for (const w of words) {
    pool.push({ kind: "de2ar", prompt: w.de, ...opts(w, w.ar, (x) => x.ar), level });
    pool.push({ kind: "ar2de", prompt: w.ar, ...opts(w, w.de, (x) => x.de), level });
    const m = /^(der|die|das) (.+)$/.exec(w.de);
    if (m) pool.push({ kind: "article", prompt: m[2], options: ["der", "die", "das"], answer: ["der", "die", "das"].indexOf(m[1]), level });
    else if (w.gender) pool.push({ kind: "article", prompt: w.de, options: ["der", "die", "das"], answer: ["der", "die", "das"].indexOf(ART[w.gender]), level });
  }
  const pron = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
  for (const v of verbs) {
    const i = Math.floor(r() * 6);
    const correct = v.forms[i];
    const wrong = shuffle(Array.from(new Set(v.forms)).filter((f) => f !== correct), r).slice(0, 3);
    if (wrong.length < 2) continue;
    const all = shuffle([correct, ...wrong], r);
    pool.push({ kind: "verb", prompt: `${pron[i]} ... (${v.inf})`, options: all, answer: all.indexOf(correct), level });
  }
  return shuffle(pool, r).slice(0, n);
}

/** kind: placement (mixed A1+A2) or a level gate test. */
export function makeTest(kind: "placement" | "A1" | "A2", seed = Date.now()): Q[] {
  const r = rng(seed);
  if (kind === "placement") return shuffle([...build("A1", 10, r), ...build("A2", 10, r)], r).sort((a, b) => (a.level < b.level ? -1 : 1));
  return build(kind, 20, r);
}
