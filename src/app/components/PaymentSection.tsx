import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";

interface PaymentSectionProps {
  amount: number;
  registrationId: string;
  paymentComplete: boolean;
  setPaymentComplete: (v: boolean) => void;
  expanded: boolean;
  onExpand: () => void;
  onBack: () => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentSection: React.FC<PaymentSectionProps> = ({
  amount,
  registrationId,
  paymentComplete,
  setPaymentComplete,
  expanded,
  onExpand,
  onBack,
}) => {
  return (
    <div className={`mt-0 pb-24 ${expanded ? '' : 'opacity-60 pointer-events-none'}`}>
      <button
        type="button"
        className="w-full text-left py-4 px-2 bg-neutral-900 text-white focus:outline-none flex items-center justify-between"
        onClick={onExpand}
        aria-expanded={expanded}
      >
        <span className="dela text-xl font-bold">2. The Money</span>
        <span className="ml-2">{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <>
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              amount={amount}
              registrationId={registrationId}
              onSuccess={() => setPaymentComplete(true)}
            />
          </Elements>
          {!paymentComplete && (
            <div className="text-red-500 text-sm mt-2">
              Payment required to complete registration.
            </div>
          )}
          
        </>
      )}
    </div>
  );
};

export default PaymentSection;
