import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "World Cup 2026",
  description: "Live bracket and tournament intelligence for the FIFA World Cup 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="mx-auto min-h-screen max-w-lg md:max-w-2xl lg:max-w-4xl">
          {children}
        </div>
      </body>
    </html>
  );
}
