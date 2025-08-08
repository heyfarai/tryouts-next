"use client";

import React, { useState } from "react";
import Image from "next/image";

interface LeadCaptureFormProps {
  onLeadCaptured: (data: {
    email: string;
    firstName: string;
    userId: string;
  }) => void;
}

export default function LeadCaptureForm({
  onLeadCaptured,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/create-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create lead");
      }

      // Call parent callback with lead data
      onLeadCaptured({
        email: email.trim(),
        firstName: firstName.trim(),
        userId: data.userId,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 lg:pt-48 pt-48 max-w-5xl">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left side - Content */}
        <div className="lg:w-1/2 text-white">
          <div className="mb-8">
            <div className="w-20 h-20  flex items-center justify-center mb-6">
              <Image
                src="/downloads/tryout-guide-thumb.png"
                alt="Profile"
                className="object-cover"
                width={124}
                height={178}
              />
            </div>
          </div>

          <h1 className="text-5xl lg:text-4xl font-bold mb-6 leading-tight">
            <span className="text-[var(--precision-red)] alexandria">
              Tryout Mindset Guide
            </span>
          </h1>
          <h2 className="text-2xl font-bold mb-8 text-white">
            No matter what team you&apos;re trying to get into, you need to get
            in the right mindset.
          </h2>
          <p className="text-lg mb-8 text-gray-300 leading-relaxed">
            Tryouts are about preparation. This mindset guide covers what you
            need to know about locking in for competitive basketball tryouts.
            Use these cheatcodes to give yourself the competitive edge.
          </p>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
              <span>9 ways to stay present and locked in</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
              <span>9 tips on playing smart, hustle, and helping.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
              <span>8 tips on being respectful on and off the court.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--precision-red)] rounded-full"></div>
              <span>
                8 tips for your Grown-Ups. They need to know this too.
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 ">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Get Your Free Guide
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Player's First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/90 text-gray-700 focus:text-white rounded border-0 focus:outline-none placeholder-gray-600"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/90 text-gray-700 focus:text-white rounded border-0 focus:outline-none placeholder-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[var(--precision-red)] to-[#D8202B] hover:from-[var(--precision-red)] hover:to-[#D8202B] text-white font-bold rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Sending Guide..." : "Get My Free Guide Now!"}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">
              We respect your privacy. The guide will be emailed to you
              instantly.
              <br />
              Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
