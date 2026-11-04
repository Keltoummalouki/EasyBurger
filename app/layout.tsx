import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/barlow-condensed/latin-900.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/permanent-marker/latin-400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy Burger — Smash burgers à Casablanca",
  description: "La carte, les moments et l’adresse d’Easy Burger, le spot du smash burger à Casablanca.",
  icons: { icon: "/easy-icon.svg" },
};

export const viewport: Viewport = { themeColor: "#fe4c1e" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
