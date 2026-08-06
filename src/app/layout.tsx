import { Bebas_Neue, Source_Sans_3 } from "next/font/google";
import type { Metadata, Viewport } from "next";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://marvel-universe-map.vercel.app";

const title = "Marvel Universe Map";
const description =
  "An interactive galaxy map of Marvel heroes, teams, and connections — built so newcomers can finally see how the universe fits together. Powered by Comic Vine.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${title} — Newcomer Guide`,
    template: `%s · ${title}`,
  },
  description,
  applicationName: title,
  authors: [{ name: "Stephin T Reji", url: "https://stephinreji.com" }],
  creator: "Stephin T Reji",
  publisher: "Stephin T Reji",
  keywords: [
    "Marvel",
    "Marvel Universe Map",
    "MCU guide",
    "Comic Vine",
    "superheroes",
    "Avengers",
    "X-Men",
    "interactive map",
    "newcomer guide",
  ],
  category: "entertainment",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: title,
    title: `${title} — Finally understand the Marvel Universe`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — Newcomer Guide`,
    description,
  },
  appleWebApp: {
    title,
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06080f" },
    { media: "(prefers-color-scheme: light)", color: "#e62429" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
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
