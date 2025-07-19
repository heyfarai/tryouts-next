"use client";
import { useEffect, useState } from "react";
import useClearRegistrationForm from "./useClearRegistrationForm";
import ConfirmationStepWrapper from "./ConfirmationStepWrapper";

export default function RegistrationCompletePage() {
  useClearRegistrationForm();
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
      <div className="sectionHero flex flex-col items-center  sm:min-h-[calc(100vh)]">
        <div className="sectionContent w-full lg:w-[68%] lg:ml-48 max-w-[640px] px-6 lg:pt-52 pt-36 pb-32 mb-12">
          <h1 className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl text-red-600 mb-0">
            Registered.
          </h1>
          <h1 className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
            Get ready.
          </h1>
          <h1 className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">
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
          <h2 className=" font-extrabold text-xl mt-0 mb-0">Remember</h2>
          <ul>
            <li>
              Tryout Day 1 (All welcome):
              <br />
              Sunday, August 24, 2025
              <br />
              3:00pm - 5:00pm <br />
              BGC Taggart Parkes (
              <a href="https://maps.app.goo.gl/fcace5GkineLFBK69">map</a>){" "}
              <br />
              <br />
              <br />
            </li>
            <li>
              Tryout Day 2 (Invitation only):
              <br />
              Thursday, August 28, 2025
              <br />
              5:30pm - 7:30pm <br />
              BGC Taggart Parkes (
              <a href="https://maps.app.goo.gl/fcace5GkineLFBK69">map</a>){" "}
              <br />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
