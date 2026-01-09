import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokeParty - ポケモンバトルごっこ",
  description: "テーマを指定してポケモンパーティを生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
