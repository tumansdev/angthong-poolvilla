import type { Metadata } from "next";
import { Noto_Sans_Thai, Sarabun } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const sarabun = Sarabun({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Angthong Poolvilla | พูลวิลล่าหรูริมทะเล",
  description:
    "จองพูลวิลล่าหรูริมทะเลอ่างทอง สระว่ายน้ำส่วนตัว วิวทะเลสวยงาม เหมาะสำหรับครอบครัวและกลุ่มเพื่อน",
  keywords: ["pool villa", "angthong", "จองที่พัก", "พูลวิลล่า", "ที่พักอ่างทอง"],
  openGraph: {
    title: "Angthong Poolvilla | พูลวิลล่าหรูริมทะเล",
    description: "จองพูลวิลล่าหรูริมทะเลอ่างทอง สระว่ายน้ำส่วนตัว",
    type: "website",
    locale: "th_TH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${notoSansThai.variable} ${sarabun.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
