import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js + Supabase Auth",
  description: "Authentication example with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <div className="flex min-h-screen flex-col items-center">
          {children}
        </div>
      </body>
    </html>
  );
}
