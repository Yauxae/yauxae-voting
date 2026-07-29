import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YAUXAÉ — Vote the Collection",
  description:
    "YAUXAÉ is a luxury fashion voting house. Browse the gallery, cast your vote, and crown the collection's most coveted silhouette.",
  metadataBase: new URL("https://yauxae.vercel.app"),
  openGraph: {
    title: "YAUXAÉ — Vote the Collection",
    description:
      "Browse the gallery, cast your vote, and crown the collection's most coveted silhouette.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#210509",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-burgundy-950 bg-burgundy-grain grain-overlay font-body text-ivory antialiased">
        <div className="mx-auto flex min-h-screen max-w-md flex-col border-x border-burgundy-800/60 sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
