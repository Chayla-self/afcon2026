import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Premium modern font
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AFCON 2026 - Road to the Final",
  description: "Predict the roadmap to the AFCON 2026 final! Select your winners and share your champion.",
};

import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-white bg-black`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
