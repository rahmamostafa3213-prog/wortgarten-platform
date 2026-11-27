"use client";
import { useEffect, useState, useCallback } from "react";

export type Progress = { xp: number; streak: number; lastDay: string; words: number; badges: string[]; gates: { A1: boolean; A2: boolean }; placed: "A1" | "A2" | null; tests: number };
const KEY = "wg_progress_v1";
const empty: Progress = { xp: 0, streak: 0, lastDay: "", words: 0, badges: [], gates: { A1: false, A2: false }, placed: null, tests: 0 };
const day = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function load(): Progress {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return empty; }
}
export function save(p: Progress) { localStorage.setItem(KEY, JSON.stringify(p)); window.dispatchEvent(new Event("wg_progress")); }

/** Record a finished test. Returns the updated progress and any new badges. */
export function recordTest(kind: "placement" | "A1" | "A2", correct: number, total: number): { p: Progress; newBadges: string[] } {
  const p = load();
  const pct = Math.round((correct / total) * 100);
  p.xp += correct * 5;
  p.tests += 1;
  const today = day();
  if (p.lastDay !== today) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    p.streak = p.lastDay === day(y) ? p.streak + 1 : 1;
    p.lastDay = today;
  }
  if (kind === "placement") p.placed = pct >= 60 ? "A2" : "A1";
  if (kind === "A1" && pct >= 70) p.gates.A1 = true;
  if (kind === "A2" && pct >= 70) p.gates.A2 = true;
  const have = new Set(p.badges);
  const add = (id: string, ok: boolean) => ok && have.add(id);
  add("first", p.tests >= 1); add("a1", p.gates.A1); add("a2", p.gates.A2); add("xp100", p.xp >= 100); add("streak3", p.streak >= 3);
  const newBadges = [...have].filter((b) => !p.badges.includes(b));
  p.badges = [...have];
  save(p);
  return { p, newBadges };
}
/** Record a finished practice drill (no pass mark, smaller XP than tests). */
export function recordPractice(correct: number): { p: Progress; newBadges: string[] } {
  const p = load();
  p.xp += correct * 2;
  const today = day();
  if (p.lastDay !== today) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    p.streak = p.lastDay === day(y) ? p.streak + 1 : 1;
    p.lastDay = today;
  }
  const have = new Set(p.badges);
  if (p.xp >= 100) have.add("xp100");
  if (p.streak >= 3) have.add("streak3");
  const newBadges = [...have].filter((b) => !p.badges.includes(b));
  p.badges = [...have];
  save(p);
  return { p, newBadges };
}
export const a2Unlocked = (p: Progress) => p.gates.A1 || p.placed === "A2";

export function useProgress(): Progress {
  const [p, setP] = useState<Progress>(empty);
  const refresh = useCallback(() => setP(load()), []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    window.addEventListener("wg_progress", refresh);
    return () => window.removeEventListener("wg_progress", refresh);
  }, [refresh]);
  return p;
}
