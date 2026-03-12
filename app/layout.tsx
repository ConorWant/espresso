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
          {/* Nav */}
          <nav className="border-b border-border/60 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-base font-bold shadow-sm">
                  ☕
                </div>
                <span className="font-semibold text-foreground tracking-tight">
                  Espresso
                </span>
              </Link>

              {/* Nav links */}
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/shots"
                  className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Shots
                </Link>
                <Link
                  href="/beans"
                  className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Beans
                </Link>
                <Link
                  href="/shots/new"
                  className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  + Log Shot
                </Link>
              </div>
            </div>
          </nav>

          {/* Page content */}
          <main className="max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
