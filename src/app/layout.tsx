import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Precision Heat Basketball - Tryout Registration Open",
  description: "Precision Heat Tryouts Registration",
};

import TopNav from "./components/TopNav";
import { getAbsoluteUrl } from "./lib/getAbsoluteUrl";

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
        {/* Social Sharing Meta Tags */}
        <meta
          property="og:title"
          content="Precision Heat Basketball - Tryout Registration Open"
        />
        <meta
          property="og:description"
          content="Precision Heat Tryouts Registration"
        />
        {/* Social Sharing Meta Tags using dynamic absolute URLs */}
        {/* Import getAbsoluteUrl at the top of the file: import { getAbsoluteUrl } from "./lib/getAbsoluteUrl"; */}
        <meta
          property="og:image"
          content={getAbsoluteUrl("/social-image.jpg")}
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:url"
          content={getAbsoluteUrl("/")}
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Precision Heat Basketball - Tryout Registration Open"
        />
        <meta
          name="twitter:description"
          content="Precision Heat Tryouts Registration"
        />
        <meta
          name="twitter:image"
          content={getAbsoluteUrl("/social-image.jpg")}
        />
        <Script
          id="crisp-script"
          type="text/javascript"
        >
          {`window.$crisp=[];window.CRISP_WEBSITE_ID="6358389e-34f1-4b83-b7af-c06223dd1738";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
        </Script>
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
