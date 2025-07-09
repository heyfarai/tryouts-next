import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  amount: number; // in cents
  registrationId: string;
  onSuccess: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  registrationId,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }

    // 1. Create PaymentIntent on the server
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, registrationId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create payment intent");
      setLoading(false);
      return;
    }

    // 2. Confirm payment on the client
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
    } else if (result.paymentIntent?.status === "succeeded") {
      onSuccess();
    } else {
      setError("Payment not successful");
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        style={{
          background: "#222",
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <CardElement
          options={{ style: { base: { color: "#fff", fontSize: "18px" } } }}
        />
      </div>
      {error && (
        <div style={{ color: "#ff2222", marginBottom: 12 }}>{error}</div>
      )}
      <button
        type="button"
        style={{
          background: "#ff2222",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: 6,
          border: "none",
          fontWeight: 700,
          fontSize: "1.1rem",
          width: "100%",
          opacity: loading ? 0.5 : 1,
        }}
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </div>
  );
};

export default StripePaymentForm;
