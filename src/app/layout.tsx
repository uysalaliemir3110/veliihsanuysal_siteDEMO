import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import Nav from "./nav";
import BackToTop from "./back-to-top";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Veli̇ İhsan Uysal — Photography",
  description: "Editorial and fashion photography portfolio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 gap-4">
        <p className="text-[11px] tracking-[0.15em] uppercase text-muted">
          &copy; {new Date().getFullYear()} Veli̇ İhsan Uysal
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${openSans.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <span id="top" aria-hidden="true" />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
