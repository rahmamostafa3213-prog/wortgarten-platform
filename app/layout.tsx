import type { Metadata, Viewport } from "next";
import { Noto_Sans_Arabic, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });
const latin = Inter({ subsets: ["latin"], variable: "--font-latin", display: "swap" });

export const metadata: Metadata = {
  title: "Wortgarten",
  description: "Free Arabic-first German learning, A1 to C2",
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: "#0f9d8a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${latin.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: `try{var d=localStorage.getItem("wg_dark");var q=new URLSearchParams(location.search).get("dark");if(q?q==="1":d?d==="1":matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark")}catch(e){}` }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
