import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Precision Heat Basketball",
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
