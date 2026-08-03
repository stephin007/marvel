import { Bebas_Neue, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Marvel Universe Map — Newcomer Guide",
  description:
    "An interactive constellation of heroes, teams, and events that helps newcomers finally understand how the Marvel Universe fits together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full bg-[#06080f] font-sans text-[#f5f1e8] antialiased">
        {children}
      </body>
    </html>
  );
}
