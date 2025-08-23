import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConditionalTopNav } from "../components/ConditionalTopNav";

export const metadata: Metadata = {
  title: "Player Check-In",
  description: "Check-in system for tryout players",
};

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
      >
        <body>
          <ConditionalTopNav />
          <div className="min-h-screen">
            <main className="container mx-auto px-4 py-6">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
