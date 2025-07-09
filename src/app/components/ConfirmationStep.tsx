import React, { useEffect, useState, useRef } from "react";

interface Player {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
}

interface ConfirmationStepProps {
  guardianEmail: string;
  guardianPhone: string;
  players: Player[];
  paymentStatus: string;
  paymentReceiptUrl?: string;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  guardianEmail,
  guardianPhone,
  players,
  paymentStatus,
  paymentReceiptUrl,
}) => {
  // DEBUG LOGS
  console.log("DEBUG paymentStatus", paymentStatus);
  console.log("DEBUG players", players, "guardianEmail", guardianEmail);
  // Debug: Log when paymentReceiptUrl arrives via props
  React.useEffect(() => {}, [paymentReceiptUrl, players]);
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const lastPaymentStatus = useRef<string>("");

  useEffect(() => {
    // Only send if paymentStatus transitions from not 'complete' to 'complete'
    // Prevent duplicate email on refresh: check localStorage for flag
    const alreadySent =
      typeof window !== "undefined" &&
      localStorage.getItem("confirmationEmailSent") === "true";
    const isPaymentComplete =
      paymentStatus === "paid" ||
      paymentStatus === "succeeded" ||
      paymentStatus === "complete";
    // Granular debug logs for each condition
    console.log("[DEBUG] isPaymentComplete:", isPaymentComplete);
    console.log("[DEBUG] lastPaymentStatus.current:", lastPaymentStatus.current);
    console.log("[DEBUG] emailSent:", emailSent);
    console.log("[DEBUG] sending:", sending);
    console.log("[DEBUG] alreadySent:", alreadySent);
    if (
      isPaymentComplete &&
      !lastPaymentStatus.current?.match(/paid|succeeded|complete/) &&
      !emailSent &&
      !sending &&
      !alreadySent
    ) {
      setSending(true);
      // 1. Create Clerk user and send magic link
      fetch("/api/create-clerk-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: guardianEmail,
          phone: guardianPhone,
          players,
        }),
      })
        .then(async (res) => {
          let rawBody;
          try {
            rawBody = await res.clone().text();
          } catch {
            rawBody = "[Could not read body]";
          }
          if (!res.ok) {
            let errorMsg = "Failed to create Clerk user";
            try {
              const data = JSON.parse(rawBody);
              errorMsg = data.error || errorMsg;
    
            } catch {
              errorMsg = rawBody || errorMsg;
            }

            throw new Error(errorMsg);
          }
          let userData = null;
          try {
            userData = JSON.parse(rawBody);
          } catch {}
          // 2. Send confirmation/receipt email (registration already exists)
          const emailPayload = {
            email: guardianEmail,
            phone: guardianPhone,
            players,
            paymentReceiptUrl,
          };
          return fetch("/api/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
          }).then(async (emailRes) => {
            let body;
            try {
              body = await emailRes.clone().json();
            } catch {
              body = await emailRes.clone().text();
            }
            if (!emailRes.ok) {
              let errorMsg = "Failed to send email";
              try {
                const data = await emailRes.clone().json();
                errorMsg = data.error || errorMsg;
              } catch {
                try {
                  const text = await emailRes.clone().text();
                  errorMsg = text || errorMsg;
                } catch {}
              }
              throw new Error(errorMsg);
            }
            setEmailSent(true);
            // Mark in localStorage that confirmation email has been sent
            if (typeof window !== "undefined") {
              localStorage.setItem("confirmationEmailSent", "true");
              localStorage.removeItem("registrationFormData");
            }
          });
        })
        .catch((err) => {

          setError(
            err.message?.includes("404")
              ? "A required server endpoint was not found (404). Please contact support."
              : err.message || "Failed to send email"
          );
        })
        .finally(() => setSending(false));
      lastPaymentStatus.current = paymentStatus;
    }
    // Always update the ref to the latest paymentStatus
    else {
      lastPaymentStatus.current = paymentStatus;
    }
  }, [
    paymentStatus,
    emailSent,
    sending,
    guardianEmail,
    players,
    guardianPhone,
    paymentReceiptUrl,
  ]);

  return (
    <div>
      <p className="text-xl mb-8">
        {sending && <span>Sending confirmation email...</span>}
        {emailSent && <span>&nbsp;Confirmation email sent.</span>}
      </p>
      <p className="text-xl mb-8">
        Check your email for confirmation: {guardianEmail}
      </p>
      {error && <p>{error}</p>}
      {/* Optionally display receipt info here if available */}
    </div>
  );
};

export default ConfirmationStep;
