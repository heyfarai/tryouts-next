import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";
import { validatePlayerInfo } from "./validation";
import { PAYMENT_AMOUNT_PER_PLAYER } from "./constants";
import { Player, PlayerErrors } from "./PlayerForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface UnifiedRegistrationFormProps {
  onSuccess: () => void;
  registrationLoading: boolean;
}

const UnifiedRegistrationForm: React.FC<UnifiedRegistrationFormProps> = ({
  onSuccess,
  registrationLoading,
}) => {
  // Players
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerErrors, setPlayerErrors] = useState<PlayerErrors[]>([
    { firstName: "", lastName: "", birthdate: "", gender: "" },
  ]);

  // Guardian fields
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  // Guardian errors
  const [guardianNameError, setGuardianNameError] = useState("");
  const [guardianPhoneError, setGuardianPhoneError] = useState("");
  const [guardianEmailError, setGuardianEmailError] = useState("");

  // Waiver fields
  const [waiverLiability, setWaiverLiability] = useState(false);
  const [waiverPhoto, setWaiverPhoto] = useState(false);
  const [waiverLiabilityError, setWaiverLiabilityError] = useState("");
  const [waiverPhotoError, setWaiverPhotoError] = useState("");

  // Payment
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  // Validate all fields
  const validateAll = () => {
    let valid = true;
    // Player validation
    const errors = validatePlayerInfo(players);
    setPlayerErrors(errors);
    if (
      !errors.every(
        (e) => !e.firstName && !e.lastName && !e.birthdate && !e.gender
      )
    ) {
      valid = false;
    }
    // Guardian
    setGuardianNameError("");
    setGuardianPhoneError("");
    setGuardianEmailError("");
    if (!guardianName.trim()) {
      setGuardianNameError("Guardian name is required.");
      valid = false;
    }
    if (!guardianPhone.trim()) {
      setGuardianPhoneError("Emergency contact phone is required.");
      valid = false;
    } else if (!/^\+?[0-9\-\s]{7,15}$/.test(guardianPhone)) {
      setGuardianPhoneError("Enter a valid phone number.");
      valid = false;
    }
    if (!guardianEmail.trim()) {
      setGuardianEmailError("Guardian email is required.");
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guardianEmail)) {
      setGuardianEmailError("Enter a valid email.");
      valid = false;
    }
    // Waivers
    setWaiverLiabilityError("");
    setWaiverPhotoError("");
    if (!waiverLiability) {
      setWaiverLiabilityError("You must agree to the liability waiver.");
      valid = false;
    }
    if (!waiverPhoto) {
      setWaiverPhotoError("You must consent to photo/video release.");
      valid = false;
    }
    return valid;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll() || !paymentComplete) return;
    // TODO: Registration API call
    onSuccess();
  };

  // Add/remove player logic
  const handleInputChange = (
    idx: number,
    field: keyof Player,
    value: string
  ) => {
    const updatedPlayers = players.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setPlayers(updatedPlayers);
  };
  const handleAddPlayer = () => {
    setPlayers([
      ...players,
      { firstName: "", lastName: "", birthdate: "", gender: "" },
    ]);
    setPlayerErrors([
      ...playerErrors,
      { firstName: "", lastName: "", birthdate: "", gender: "" },
    ]);
  };
  const handleRemovePlayer = (idx: number) => {
    setPlayers(players.filter((_, i) => i !== idx));
    setPlayerErrors(playerErrors.filter((_, i) => i !== idx));
  };

  // Payment section logic
  const handlePaymentSuccess = (id: string) => {
    setPaymentComplete(true);
    setRegistrationId(id);
  };

  const totalAmount = players.length * PAYMENT_AMOUNT_PER_PLAYER;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Player Info Section (reuse code from PlayerForm) */}
      <div>
        <h2 className="dela text-xl font-bold mb-4 text-white">
          Player Information
        </h2>
        {players.map((player, idx) => (
          <div
            key={idx}
            className="flex gap-4 mb-2"
          >
            <div style={{ flex: 1 }}>
              <label
                htmlFor={`firstName-${idx}`}
                className="uppercase text-sm font-bold text-gray-300"
              >
                First Name
              </label>
              <input
                id={`firstName-${idx}`}
                type="text"
                value={player.firstName}
                onChange={(e) =>
                  handleInputChange(idx, "firstName", e.target.value)
                }
                required
                style={{ width: "100%" }}
              />
              {playerErrors[idx]?.firstName && (
                <span style={{ color: "#ff2222" }}>
                  {playerErrors[idx].firstName}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor={`lastName-${idx}`}
                className="uppercase text-sm font-bold text-gray-300"
              >
                Last Name
              </label>
              <input
                id={`lastName-${idx}`}
                type="text"
                value={player.lastName}
                onChange={(e) =>
                  handleInputChange(idx, "lastName", e.target.value)
                }
                required
                style={{ width: "100%" }}
              />
              {playerErrors[idx]?.lastName && (
                <span style={{ color: "#ff2222" }}>
                  {playerErrors[idx].lastName}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor={`birthdate-${idx}`}
                className="uppercase text-sm font-bold text-gray-300"
              >
                Birthdate
              </label>
              <input
                id={`birthdate-${idx}`}
                type="date"
                value={player.birthdate}
                onChange={(e) =>
                  handleInputChange(idx, "birthdate", e.target.value)
                }
                required
                style={{ width: "100%" }}
              />
              {playerErrors[idx]?.birthdate && (
                <span style={{ color: "#ff2222" }}>
                  {playerErrors[idx].birthdate}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor={`gender-${idx}`}
                className="uppercase text-sm font-bold text-gray-300"
              >
                Gender
              </label>
              <select
                id={`gender-${idx}`}
                value={player.gender}
                onChange={(e) =>
                  handleInputChange(idx, "gender", e.target.value)
                }
                required
                style={{ width: "100%" }}
              >
                <option value="">Select</option>
                <option value="male">NBA</option>
                <option value="female">WNBA</option>
                <option value="other">Other</option>
              </select>
              {playerErrors[idx]?.gender && (
                <span style={{ color: "#ff2222" }}>
                  {playerErrors[idx].gender}
                </span>
              )}
            </div>
            <div
              style={{ display: "flex", alignItems: "flex-end", marginLeft: 8 }}
            >
              {players.length > 1 && (
                <button
                  type="button"
                  style={{
                    background: "#444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "8px 16px",
                  }}
                  onClick={() => handleRemovePlayer(idx)}
                >
                  Remove
                </button>
              )}
              {idx === players.length - 1 && (
                <button
                  type="button"
                  style={{
                    marginLeft: 8,
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "8px 16px",
                  }}
                  onClick={handleAddPlayer}
                >
                  Add Player
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Guardian Section */}
      <div>
        <h2 className="dela text-xl font-bold mb-4 text-white">
          Guardian & Emergency Contact
        </h2>
        <label
          htmlFor="guardianName"
          className="block font-bold mb-1 text-gray-300"
        >
          Guardian/Emergency Contact Name
        </label>
        <input
          id="guardianName"
          type="text"
          value={guardianName}
          onChange={(e) => setGuardianName(e.target.value)}
          required
          style={{ width: "100%" }}
        />
        {guardianNameError && (
          <span style={{ color: "#ff2222" }}>{guardianNameError}</span>
        )}
        <label
          htmlFor="guardianPhone"
          className="block font-bold mb-1 text-gray-300 mt-4"
        >
          Phone
        </label>
        <input
          id="guardianPhone"
          type="text"
          value={guardianPhone}
          onChange={(e) => setGuardianPhone(e.target.value)}
          required
          style={{ width: "100%" }}
        />
        {guardianPhoneError && (
          <span style={{ color: "#ff2222" }}>{guardianPhoneError}</span>
        )}
        <label
          htmlFor="guardianEmail"
          className="block font-bold mb-1 text-gray-300 mt-4"
        >
          Email
        </label>
        <input
          id="guardianEmail"
          type="email"
          value={guardianEmail}
          onChange={(e) => setGuardianEmail(e.target.value)}
          required
          style={{ width: "100%" }}
        />
        {guardianEmailError && (
          <span style={{ color: "#ff2222" }}>{guardianEmailError}</span>
        )}
      </div>
      {/* Waivers Section */}
      <div>
        <h2 className="dela text-xl font-bold mb-4 text-white">Waivers</h2>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={waiverLiability}
            onChange={(e) => setWaiverLiability(e.target.checked)}
            required
          />
          <span style={{ marginLeft: 8 }}>
            I agree to the <b>Liability Waiver</b> (required)
          </span>
        </label>
        {waiverLiabilityError && (
          <span style={{ color: "#ff2222", display: "block" }}>
            {waiverLiabilityError}
          </span>
        )}
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={waiverPhoto}
            onChange={(e) => setWaiverPhoto(e.target.checked)}
            required
          />
          <span style={{ marginLeft: 8 }}>
            I consent to <b>Photo/Video Release</b> (required)
          </span>
        </label>
        {waiverPhotoError && (
          <span style={{ color: "#ff2222", display: "block" }}>
            {waiverPhotoError}
          </span>
        )}
      </div>
      {/* Payment Section */}
      <div>
        <h2 className="dela text-xl font-bold mb-4 text-white">Payment</h2>
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            amount={totalAmount}
            registrationId={registrationId || "temp"}
            onSuccess={() => handlePaymentSuccess("temp")}
          />
        </Elements>
        {!paymentComplete && (
          <div style={{ color: "#ff2222", marginTop: 8 }}>
            Payment required to complete registration.
          </div>
        )}
      </div>
      <button
        type="submit"
        className="hidden bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded text-lg mt-6 w-full"
        disabled={registrationLoading || !paymentComplete}
      >
        {registrationLoading ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
};

export default UnifiedRegistrationForm;
