import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espresso Tracker",
  description: "Log and visualise your espresso shots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-background">
          <nav className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
              <Link href="/" className="font-bold text-lg">
                ☕ Espresso
              </Link>
              <Link href="/shots" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shots
              </Link>
              <Link href="/shots/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                + Log Shot
              </Link>
              <Link href="/beans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Beans
              </Link>
            </div>
          </nav>
          <main className="max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
