import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@arco-design/web-react/dist/css/arco.css";
import { RootLayoutContent } from "./components/RootLayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "供应商评分管理系统",
  description: "供应商评分管理系统原型",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
