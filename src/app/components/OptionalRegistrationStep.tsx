"use client";

import React, { useState } from "react";
import Link from "next/link";

interface OptionalRegistrationStepProps {
  leadData: {
    email: string;
    firstName: string;
    userId?: string;
  };
  onBack: () => void;
}

export default function OptionalRegistrationStep({
  leadData,
  onBack,
}: OptionalRegistrationStepProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="container mx-auto px-6 lg:pt-32 pt-48 max-w-5xl">
      {!showSuccess ? (
        <div className="text-center text-white">
          {/* Success message for PDF download */}
          <div className="mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="hidden text-3xl font-bold mb-4">
              Check Your Email, {leadData.firstName}!
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Your free Tryout Guide has been sent to{" "}
              <span>{leadData.email}</span>
            </p>
          </div>

          {/* Step 2 Progress Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">
                  ✓
                </div>
                <span className="ml-2 text-sm text-gray-400 font-medium">
                  Download Guide
                </span>
              </div>
              <div className="w-8 h-px bg-gray-100"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--precision-red)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <span className="ml-2 text-sm text-[var(--precision-red)] font-medium">
                  Register for Tryouts
                </span>
              </div>
            </div>
          </div>

          {/* Registration Upsell */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Looking for a U14 boys competitive tryout?
            </h3>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Secure a spot at our upcoming tryouts today.
            </p>

            <div className="bg-black backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
              <h4 className="text-xl text-left font-bold text-[var(--precision-red)] mb-4">
                What you get at Precision Heat
              </h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
                  <span>
                    Customized player development with a consultant coach
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
                  <span>3 practices a week (2 hours each)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
                  <span>Comprehensive skills assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
                  <span>
                    High level competition games throughout the season
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/#tryouts"
                className="block w-full py-4 bg-gradient-to-b from-[var(--precision-red)] to-[#D8202B] hover:from-[#D8202B] hover:to-[#A81A23] text-white font-bold rounded transition-all duration-200 text-center"
              >
                Yes! Register {leadData.firstName} for Tryouts
              </Link>

              <button
                onClick={() => setShowSuccess(true)}
                className="w-full py-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                No thanks, maybe later
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              *Registration spots are limited and filling quickly. Secure your
              spot today to avoid disappointment.
            </p>
          </div>
        </div>
      ) : (
        // Final success state
        <div className="text-center text-white max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Thanks, {leadData.firstName}!
          </h2>

          <p className="text-lg text-gray-300 mb-8">
            Enjoy your free Tryout Guide. We&apos;re here when you&apos;re ready
            to take the next step!
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block py-3 px-8 bg-white/10 hover:bg-white/20 text-white rounded transition-all duration-200"
            >
              Return to Home
            </Link>

            <div className="text-sm text-gray-400">
              <p>
                Questions? Contact us at{" "}
                <a
                  href="mailto:GM@precisionheat.team"
                  className="text-blue-400 hover:text-blue-300"
                >
                  GM@precisionheat.team
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
