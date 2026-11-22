
import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";

import "./globals.css";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SalonBook | Your Beauty, Your Moment",
    template: "%s | SalonBook",
  },
  description:
    "Discover exceptional beauty treatments, explore salon services and manage your appointments with SalonBook.",
  applicationName: "SalonBook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${manrope.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <SiteHeader />

        <div className="flex-1">{children}</div>

        <SiteFooter />
      </body>
    </html>
  );
}
