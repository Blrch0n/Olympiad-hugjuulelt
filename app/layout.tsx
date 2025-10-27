import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Project",
  description: "Built from scratch",
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
