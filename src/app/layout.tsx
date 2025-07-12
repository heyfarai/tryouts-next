import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Precision Heat Basketball - Tryout Registration Open",
  description: "Precision Heat Tryouts Registration",
};

import TopNav from "./components/TopNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          href="/favicon.ico?v=1"
          sizes="any"
        />
        <link
          rel="icon"
          href="/favicon.svg?v=1"
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png?v=1"
        />
        <link
          rel="manifest"
          href="/site.webmanifest?v=1"
        />
        <meta
          name="theme-color"
          content="#e80707"
        />
      </head>
      <body className="bg-black text-[#cccccc]">
        <ClerkProvider>
          <main className="min-h-screen text-[#cccccc]">
            <TopNav />
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
