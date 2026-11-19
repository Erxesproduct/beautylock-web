import { Bad_Script, Nunito_Sans, Playpen_Sans } from "next/font/google";

// All three have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Rounded, hand-drawn headings: the «cute» voice. */
export const display = Playpen_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["500", "600", "700", "800"], variable: "--font-display", display: "swap" });
/** Soft body text. */
export const body = Nunito_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "600", "700", "800"], variable: "--font-body", display: "swap" });
/** Thin script, like the Beauty Lock logo. */
export const script = Bad_Script({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-script", display: "swap" });
