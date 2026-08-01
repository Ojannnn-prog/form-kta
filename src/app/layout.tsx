import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generator KTA Ekskul KaDigi x KKA — SDN 231 Sukaasih",
  description:
    "Aplikasi pembuatan Kartu Tanda Anggota (KTA) mandiri untuk Ekstrakurikuler KaDigi x KKA (Kelas Digital • Koding & Kecerdasan Artifisial) SDN 231 Sukaasih.",
  icons: {
    icon: "/logo-kodigi-kka.png",
    shortcut: "/logo-kodigi-kka.png",
    apple: "/logo-kodigi-kka.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
