import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Олимпиад Бүртгэл | Монголын Оюутны Олимпиад 2025",
  description:
    "Монголын оюутны олимпиадад бүртгүүлж, мэдлэг чадвараа дэлгэрүүлээрэй. 1000+ оролцогчтой, улс хоорондын түвшний тэмцээн. Шагналын сан 9.5 сая төгрөг.",
  keywords: [
    "олимпиад",
    "оюутан",
    "монгол",
    "бүртгэл",
    "тэмцээн",
    "мэдлэгийн тэмцээн",
    "шагнал",
  ],
  authors: [{ name: "SYSCO Mongolia" }],
  creator: "SYSCO Team",
  openGraph: {
    title: "Монголын Оюутны Олимпиад 2025",
    description:
      "Авьяасаа дэлгэрүүлж, мэдлэгээ батлах боломж. 1000+ оролцогчтой тэмцээн.",
    siteName: "Олимпиад",
    locale: "mn_MN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/textures/syslogo.svg",
    apple: "/textures/syslogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
