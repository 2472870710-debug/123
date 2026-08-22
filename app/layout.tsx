import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人物关系网",
  description: "可查阅、可持续维护的人际关系背景库。",
  openGraph: {
    title: "人物关系网",
    description: "事实与推断分开，关系不是资源清单。",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "人物关系网" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "人物关系网",
    description: "事实与推断分开，关系不是资源清单。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
