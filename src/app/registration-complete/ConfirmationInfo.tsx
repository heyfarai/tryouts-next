import React from "react";
import ConfirmationStep from "../components/ConfirmationStep";

interface ConfirmationInfoProps {
  confirmation: {
    guardianEmail: string;
    guardianPhone: string;
    players: any[];
    paymentStatus: string;
  } | null;
}

const ConfirmationInfo: React.FC<ConfirmationInfoProps> = ({ confirmation }) => {
  if (!confirmation) return null;
  return (
    <>
      <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl text-red-600 mb-0">Done.</h1>
      <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">Prepare.</h1>
      <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">Show up.</h1>
      <ConfirmationStep {...confirmation} />
      <h2 className="dela font-extrabold text-xl lg:text-2xl md:text-xl mt-0 mb-4">Remember.</h2>
      <ul className="mb-8 text-lg">
        <li>
          <strong> Tryouts Day 1 (All welcome)</strong> <br />
          Sunday, 24 August, 3:00pm-5:00pm <br />
          BGC Taggart Parkes.
        </li>
        <li className="mt-4">
          <strong>Tryouts Day 2 (Invitation only)</strong> <br />
          Thursday, 28 August, 5:30pm-7:30pm <br />
          BGC Taggart Parkes.
        </li>
      </ul>
    </>
  );
};

export default ConfirmationInfo;
