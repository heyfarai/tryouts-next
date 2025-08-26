import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";
import { isDevOrPreviewEnv } from "./lib/envUtils";

function getTitle() {
  const base = "Precision Heat Basketball - Tryout Registration Open";
  return isDevOrPreviewEnv() ? `[DEV] ${base}` : base;
}

export const metadata: Metadata = {
  title: "Precision Heat - Grade 8/9 Boys Basketball Tryout Registration Open",
  description:
    "Register for tryouts. Ottawa-based AAA+ basketball team for elite players.",
};

import TopNav from "./components/TopNav";
import Footer from "./components/Footer";
import { getAbsoluteUrl } from "./lib/getAbsoluteUrl";
import { ConditionalTopNav } from "./components/ConditionalTopNav";
import TryoutsBanner from "./components/TryoutsBanner";

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
        <link
          rel="canonical"
          href="https://precisionheat.team/"
        />

        <meta
          name="description"
          content={String(metadata.description)}
        />
        <meta
          name="theme-color"
          content="#000"
        />
        <meta
          property="og:title"
          content={String(metadata.title)}
        />
        <meta
          property="og:description"
          content={String(metadata.description)}
        />
        <meta
          property="og:image"
          content="https://precisionheat.team/social-image.jpg"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:url"
          content="https://precisionheat.team"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content={String(metadata.title)}
        />
        <meta
          name="twitter:description"
          content={String(metadata.description)}
        />

        <meta
          name="twitter:image"
          content="https://precisionheat.team/social-image.jpg"
        />
        {/* <Script
          id="crisp-script"
          type="text/javascript"
        >
          {`window.$crisp=[];window.CRISP_WEBSITE_ID="6358389e-34f1-4b83-b7af-c06223dd1738";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
        </Script> */}
        <Script
          id="org-structured-data"
          type="application/ld+json"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: String(metadata.title),
            url: "https://precisionheat.team/",
            logo: "https://precisionheat.team/android-chrome-512x512.png",
            sport: "Basketball",
            memberOf: "Ontario Basketball Association",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Ottawa",
              addressRegion: "ON",
              addressCountry: "CA",
            },
            email: "GM@precisionheat.team",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "General Manager",
              email: "GM@precisionheat.team",
            },
            sameAs: [
              "https://www.facebook.com/precisionheat.team",
              "https://instagram.com/precisionbasketball.team",
            ],
          })}
        </Script>
      </head>
      <body className="bg-black landing">
        <ClerkProvider>
          <TryoutsBanner />
          <main className="min-h-screen">
            <ConditionalTopNav />
            {children}
          </main>
          <Footer />
        </ClerkProvider>
        <script
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
      </body>
    </html>
  );
}
