"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TryoutsBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const checkIfTryoutsDay = () => {
    // Get current date in Eastern timezone
    const now = new Date();
    const easternTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    // Check if it's August 24th, 2025
    const isAugust24 =
      easternTime.getMonth() === 7 && // August is month 7 (0-indexed)
      easternTime.getDate() === 28 &&
      easternTime.getFullYear() === 2025;

    setIsVisible(isAugust24);
  };

  useEffect(() => {
    // Check immediately on mount
    checkIfTryoutsDay();

    // Set up interval to check every minute (60000ms)
    const interval = setInterval(checkIfTryoutsDay, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || pathname !== "/") {
    return null;
  }

  return (
    <div
      className="w-full py-3 px-2 text-center fixed top-0 z-50 bg-[var(--precision-red)]"
      style={{ backgroundColor: "red", color: "#131211" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-sm md:text-base font-semibold text-[#131211]">
          <span className="text-[#131211]">
            Tryouts Day 2{" "}
            <span className="text-[#131211] px-1 font-bold">·</span> Thu 28th
            Aug <span className="text-[#131211] px-1 font-bold">·</span>{" "}
            <Link
              href="https://maps.app.goo.gl/4YFkKQamYPUCXG4m7"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
              style={{ color: "#131211" }}
            >
              BGC Tomlinson
            </Link>
            <span className="text-[#131211] px-1 font-bold">·</span>{" "}
            <Link
              className="underline hover:no-underline"
              href="/#tryouts"
            >
              Sign up
            </Link>
          </span>{" "}
        </p>
      </div>
    </div>
  );
}
