import React, { useEffect, useState } from "react";
import ConfirmationStep from "../components/ConfirmationStep";

interface ConfirmationStepWrapperProps {
  sessionId: string;
  confirmation: any;
}

const ConfirmationStepWrapper: React.FC<ConfirmationStepWrapperProps> = ({
  sessionId,
  confirmation,
}) => {
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    async function fetchReceiptUrl() {
      if (!sessionId) return;
      // Get the Stripe Checkout Session, expand payment_intent
      const res = await fetch(
        `/api/checkout-session-info?session_id=${encodeURIComponent(sessionId)}`
      );
      const data = await res.json();
      if (data.confirmation && data.confirmation.paymentIntentId) {
        // Call a backend endpoint to get the receipt_url for this paymentIntentId
        const receiptRes = await fetch(
          `/api/stripe-receipt-url?payment_intent_id=${encodeURIComponent(
            data.confirmation.paymentIntentId
          )}`
        );
        const receiptData = await receiptRes.json();
        setReceiptUrl(receiptData.receipt_url);
      }
    }
    fetchReceiptUrl();
  }, [sessionId]);

  return (
    <ConfirmationStep
      guardianEmail={confirmation.guardianEmail}
      guardianPhone={confirmation.guardianPhone}
      players={confirmation.players}
      paymentStatus={confirmation.paymentStatus}
      paymentReceiptUrl={receiptUrl}
    />
  );
};

export default ConfirmationStepWrapper;
