"use client";

import React, { useState } from "react";
import LeadCaptureForm from "../components/LeadCaptureForm";
import OptionalRegistrationStep from "../components/OptionalRegistrationStep";

export default function TryoutGuidePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [leadData, setLeadData] = useState<{
    email: string;
    firstName: string;
    userId?: string;
  } | null>(null);

  const handleLeadCaptured = (data: {
    email: string;
    firstName: string;
    userId: string;
  }) => {
    setLeadData(data);
    setCurrentStep(2);
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
            onBack={() => setCurrentStep(1)}
          />
        )}
      </div>
    </div>
  );
}
