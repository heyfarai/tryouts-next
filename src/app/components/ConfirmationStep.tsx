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
  return (
    <div>
      <p className="text-xl mb-8"></p>
      <p className="text-xl mb-8">
        Check your email for confirmation: {guardianEmail}
      </p>
      {/* Optionally display receipt info here if available */}
    </div>
  );
};

export default ConfirmationStep;
