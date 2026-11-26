// Real content counts, taken from the Wortgarten mobile app data (v2.4):
// A1 = 12 units / 153 words / 41 sentences, A2 = 16 units / 206 words / 56 sentences.
// B1-C2 have no lessons yet. Nothing here is user data.
export type Level = { code: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; units: number; words: number; written: boolean };
export const LEVELS: Level[] = [
  { code: "A1", units: 12, words: 153, written: true },
  { code: "A2", units: 16, words: 206, written: true },
  { code: "B1", units: 0, words: 0, written: false },
  { code: "B2", units: 0, words: 0, written: false },
  { code: "C1", units: 0, words: 0, written: false },
  { code: "C2", units: 0, words: 0, written: false },
];
export type Status = "ready" | "building" | "planned" | "needsYou";
export const FEATURES: { id: string; ar: string; en: string; de: string; status: Status }[] = [
  { id: "mobile", ar: "تطبيق أندرويد (A1 وA2، بدون إنترنت)", en: "Android app (A1 and A2, offline)", de: "Android-App (A1 und A2, offline)", status: "ready" },
  { id: "home", ar: "الصفحة الرئيسية وهيكل المنصة (RTL، ليلي/نهاري، PWA)", en: "Home page and platform structure (RTL, dark/light, PWA)", de: "Startseite und Plattformstruktur (RTL, Dunkel/Hell, PWA)", status: "ready" },
  { id: "db", ar: "مخطط قاعدة البيانات والصلاحيات (Postgres)", en: "Database schema and permissions (Postgres)", de: "Datenbankschema und Berechtigungen (Postgres)", status: "ready" },
  { id: "accounts", ar: "حسابات حقيقية وحفظ التقدم", en: "Real accounts and progress saving", de: "Echte Konten und Fortschritt speichern", status: "needsYou" },
  { id: "lessons", ar: "الدروس والتمارين على الويب (استيراد محتوى A1 وA2)", en: "Lessons and exercises on the web (import A1 and A2 content)", de: "Lektionen und Übungen im Web (A1- und A2-Inhalte importieren)", status: "building" },
  { id: "gating", ar: "بوابات المستويات بالاختبارات", en: "Level gates by tests", de: "Niveau-Schranken durch Tests", status: "planned" },
  { id: "dict", ar: "قاموس ألماني-عربي", en: "German-Arabic dictionary", de: "Deutsch-Arabisch-Wörterbuch", status: "planned" },
  { id: "grammar", ar: "مكتبة القواعد مع تمارين", en: "Grammar library with exercises", de: "Grammatikbibliothek mit Übungen", status: "planned" },
  { id: "videos", ar: "مكتبة فيديو (روابط مسموحة + فيديوهاتنا) مع ترجمة وتحكم في السرعة", en: "Video library (permitted links + our own videos) with captions and speed control", de: "Videobibliothek (erlaubte Links + eigene Videos) mit Untertiteln und Tempo", status: "planned" },
  { id: "tutor", ar: "معلم ذكي بمفتاح مجاني (حدود يومية)", en: "AI tutor with a free key (daily limits)", de: "KI-Tutor mit kostenlosem Schlüssel (Tageslimits)", status: "planned" },
  { id: "exams", ar: "تحضير الامتحانات (تدريب مستقل، مش رسمي)", en: "Exam preparation (independent practice, not official)", de: "Prüfungsvorbereitung (unabhängiges Training, nicht offiziell)", status: "planned" },
  { id: "admin", ar: "لوحة الإدارة بأدوار آمنة", en: "Admin dashboard with secure roles", de: "Admin-Dashboard mit sicheren Rollen", status: "planned" },
];
