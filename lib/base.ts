/** Sub-path when hosted on GitHub Pages (e.g. /wortgarten-platform). Empty locally. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => BASE + p;
