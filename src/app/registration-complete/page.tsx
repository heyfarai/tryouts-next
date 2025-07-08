"use client";
import { useEffect, useState } from "react";
import ConfirmationInfo from "./ConfirmationInfo";
import ConfirmationStepWrapper from "./ConfirmationStepWrapper";

export default function RegistrationCompletePage() {
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");
    if (!session_id) {
      setError("No payment session found.");
      setLoading(false);
      return;
    }
    fetch(
      `/api/checkout-session-info?session_id=${encodeURIComponent(session_id)}`
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Could not fetch confirmation.");
        setConfirmation(data.confirmation);
      })
      .catch((err) => {
        setError(err.message || "Could not fetch confirmation.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="sectionHero flex flex-col justify-center lg:pl-64">
        <div className="content max-w-3xl mx-7">
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl text-red-600 mb-0">
            Registered.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
            Prepare.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">
            Show up.
          </h1>
          {loading ? (
            <div className="text-lg mt-12">Loading confirmation...</div>
          ) : error ? (
            <div className="text-red-500 text-lg mt-12">{error}</div>
          ) : (
            <ConfirmationStepWrapper
              sessionId={
                new URLSearchParams(window.location.search).get("session_id") ||
                ""
              }
              confirmation={confirmation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
