"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LeadCaptureForm from "../components/LeadCaptureForm";
import OptionalRegistrationStep from "../components/OptionalRegistrationStep";

export default function TryoutGuidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leadData, setLeadData] = useState<{
    email: string;
    firstName: string;
    userId?: string;
  } | null>(null);

  // Get current step from URL params, default to 1
  const currentStep = parseInt(searchParams?.get("step") || "1") as 1 | 2;

  // Load lead data from sessionStorage on mount
  useEffect(() => {
    const savedLeadData = sessionStorage.getItem("leadData");
    if (savedLeadData) {
      try {
        setLeadData(JSON.parse(savedLeadData));
      } catch (error) {
        console.error("Failed to parse saved lead data:", error);
        sessionStorage.removeItem("leadData");
      }
    }
  }, []);

  // Redirect to step 1 if trying to access step 2 without lead data
  useEffect(() => {
    if (currentStep === 2 && !leadData) {
      router.replace("/tryout-guide?step=1");
    }
  }, [currentStep, leadData, router]);

  const handleLeadCaptured = (data: {
    email: string;
    firstName: string;
    userId: string;
  }) => {
    setLeadData(data);
    // Save to sessionStorage for persistence across page refreshes
    sessionStorage.setItem("leadData", JSON.stringify(data));
    // Navigate to step 2 using URL params
    router.push("/tryout-guide?step=2");
  };

  const handleBack = () => {
    router.push("/tryout-guide?step=1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden">
      {/* Background mountain image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAxMDgwSDE5MjBWNjAwTDE2MDBMMTQwMCA0MDBMMTI0MCA1MjBMMTAwMCAzMDBMODAwIDQ4MEw2MDAgMjgwTDQwMCA0MDBMMCA2MDBWMTA4MFoiIGZpbGw9IiMxRjJBMzciLz4KPC9zdmc+Cg==')",
        }}
      />

      <div className="relative z-10">
        {currentStep === 1 && (
          <LeadCaptureForm onLeadCaptured={handleLeadCaptured} />
        )}

        {currentStep === 2 && leadData && (
          <OptionalRegistrationStep
            leadData={leadData}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
