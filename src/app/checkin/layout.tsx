import type { Metadata } from "next";

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
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
