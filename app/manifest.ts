import type { MetadataRoute } from "next";
import { BASE } from "@/lib/base";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wortgarten",
    short_name: "Wortgarten",
    description: "Free Arabic-first German learning, A1 to C2",
    start_url: `${BASE}/`,
    scope: `${BASE}/`,
    display: "standalone",
    dir: "rtl",
    lang: "ar",
    background_color: "#f4faf8",
    theme_color: "#0f9d8a",
    icons: [
      { src: `${BASE}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
