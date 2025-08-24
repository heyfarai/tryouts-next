"use client";

import { useState, useEffect } from "react";

export default function TryoutsBanner() {
  const [isVisible, setIsVisible] = useState(false);

  const checkIfTryoutsDay = () => {
    // Get current date in Eastern timezone
    const now = new Date();
    const easternTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    // Check if it's August 24th, 2025
    const isAugust24 =
      easternTime.getMonth() === 7 && // August is month 7 (0-indexed)
      easternTime.getDate() === 24 &&
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

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="w-full py-3 px-4 text-center"
      style={{ backgroundColor: "var(--precision-red)", color: "#131211" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-sm md:text-base font-semibold text-[#131211]">
          <span className="text-[#131211]">
            Tryouts Day 1, Sun. 24th Aug. at BGC Tomlinson
          </span>{" "}
          (
          <a
            href="https://maps.app.goo.gl/4YFkKQamYPUCXG4m7"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
            style={{ color: "#131211" }}
          >
            map
          </a>
          )
        </p>
      </div>
    </div>
  );
}
