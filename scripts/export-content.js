/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
// Exports the real Wortgarten Android app content to data/content.json.
// usage: node scripts/export-content.js /path/to/wortgarten/assets
const vm = require("vm"), fs = require("fs"), path = require("path");
const dir = process.argv[2];
const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of ["data.js", "data2.js", "data3.js", "data4.js", "data5.js"])
  vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8").replace(/^(const|let) /gm, "var "), ctx);
const g = (n) => vm.runInContext(n, ctx);
const art = { m: "der", f: "die", n: "das" };
const units = [];
const add = (arr, level) => arr.forEach((u) => units.push({
  id: u.id, level, icon: u.icon, title_ar: u.t, note_ar: u.g,
  words: u.w.map(([de, ar, gnd]) => ({ de, ar, gender: gnd || null })),
  sentences: (u.p || []).map(([de, ar]) => ({ de, ar })),
}));
add(g("UNITS"), "A1"); add(g("UNITS2"), "A2"); add(g("UNITS3"), "A2");
const dialogs = [...g("DIALOGS").map((d) => ({ ...d, level: "A1" })), ...g("DIALOGS3").map((d) => ({ ...d, level: "A2" }))]
  .map((d) => ({ icon: d.icon, title_ar: d.t, level: d.level, lines: d.lines.map(([de, ar, who]) => ({ de, ar, who })) }));
const verbs = [...g("VERBS").map((v) => [v, "A1"]), ...g("VERBS3").map((v) => [v, "A2"])]
  .map(([v, level]) => ({ inf: v[0], ar: v[1], forms: v[2], example_de: v[3][0], example_ar: v[3][1], level }));
const grammar = [...g("GRAM").map((x) => [x, "A1"]), ...g("GRAM2").map((x) => [x, "A2"]), ...g("GRAM3").map((x) => [x, "A2"])]
  .map(([x, level]) => ({ title_ar: x[0], body_ar: x[1], level }));
fs.writeFileSync("data/content.json", JSON.stringify({ units, dialogs, verbs, grammar }, null, 1));
console.log({ units: units.length, words: units.reduce((a, u) => a + u.words.length, 0), sentences: units.reduce((a, u) => a + u.sentences.length, 0), dialogs: dialogs.length, verbs: verbs.length, grammar: grammar.length });
