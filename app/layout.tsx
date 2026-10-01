import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Trade Seekerz | Find trusted local tradies", template: "%s | Trade Seekerz" },
  description: "Post your project, compare quotes, and connect with trusted tradespeople across New Zealand.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NZ" className={geist.variable}><body>{children}</body></html>;
}

