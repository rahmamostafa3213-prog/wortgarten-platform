// AI tutor client. Calls Google's Gemini API directly from the browser with the learner's own key.
// The key stays in localStorage and is never sent to our servers (we have none).
export const TUTOR_MODELS = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"];
export type Msg = { role: "user" | "model"; text: string; err?: boolean };
export const KEY_STORE = "wg_gemini_key";

export function system(uiLang: "ar" | "en" | "de") {
  const lng = { ar: "Egyptian Arabic", en: "English", de: "simple German" }[uiLang];
  return `You are a friendly, patient German tutor inside a language-learning web app. The learner is an Arabic speaker at level A1-A2. Always: (1) answer first in short, simple German (2-3 sentences, A1-A2 words); (2) then explain in ${lng} in 1-3 short lines; (3) if the learner wrote German with mistakes, show the corrected sentence and explain the mistake briefly; (4) end with one small question or mini exercise. Keep answers short. Do not ask for personal data. If you are not sure about a grammar rule, say so.`;
}

export type Result = { ok: true; text: string } | { ok: false; err: "key" | "net" | "limit" | "fail" };

export async function ask(key: string, history: Msg[], uiLang: "ar" | "en" | "de", fetchFn: typeof fetch = fetch): Promise<Result> {
  const contents = history.filter((m) => !m.err).slice(-10).map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
  const body = JSON.stringify({ systemInstruction: { parts: [{ text: system(uiLang) }] }, contents, generationConfig: { temperature: 0.7, maxOutputTokens: 700 } });
  let last = 0;
  for (const m of TUTOR_MODELS) {
    let r: Response;
    try {
      r = await fetchFn(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body });
    } catch { return { ok: false, err: "net" }; }
    last = r.status;
    if (r.status === 200) {
      try {
        const j = await r.json();
        const text = ((j.candidates?.[0]?.content?.parts ?? []) as { text?: string }[]).map((p) => p.text ?? "").join("").trim();
        return text ? { ok: true, text } : { ok: false, err: "fail" };
      } catch { return { ok: false, err: "fail" }; }
    }
    if (r.status === 400 || r.status === 401 || r.status === 403) return { ok: false, err: "key" };
    // 404 (model unavailable), 429 or 5xx: try the next model
  }
  return { ok: false, err: last === 429 ? "limit" : "fail" };
}
