import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validatePlayerInfo } from "./validation";
import { DEFAULT_PLAYER } from "./constants";
import { Player, PlayerErrors } from "./PlayerForm";

interface UnifiedRegistrationFormProps {
  onSuccess: () => void;
  registrationLoading: boolean;
}

const UnifiedRegistrationForm: React.FC<UnifiedRegistrationFormProps> = ({
  onSuccess,
  registrationLoading,
}) => {
  // Local loading state for Pay button
  const [payLoading, setPayLoading] = useState(false);

  // Persisted registration form state keys
  const FORM_STORAGE_KEY = "registrationFormData";

  // Initialize state from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("confirmationEmailSent");
      localStorage.removeItem("registrationConfirmation");
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.players) setPlayers(data.players);
          if (data.guardianName) setGuardianName(data.guardianName);
          if (data.guardianPhone) setGuardianPhone(data.guardianPhone);
          if (data.guardianEmail) setGuardianEmail(data.guardianEmail);
          if (typeof data.waiverLiability === "boolean") setWaiverLiability(data.waiverLiability);
          if (typeof data.waiverPhoto === "boolean") setWaiverPhoto(data.waiverPhoto);
          if (typeof data.accordionStep === "number") setAccordionStep(data.accordionStep);
        } catch {}
      }
    }
  }, []);

  // Players
  const [players, setPlayers] = useState<Player[]>([DEFAULT_PLAYER]);
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

  // Waivers
  const [waiverLiability, setWaiverLiability] = useState(true);
  const [waiverPhoto, setWaiverPhoto] = useState(true);
  const [waiverLiabilityError, setWaiverLiabilityError] = useState("");
  const [waiverPhotoError, setWaiverPhotoError] = useState("");

  // Accordion step state: 1 = player, 2 = guardian, 3 = payment
  const [accordionStep, setAccordionStep] = useState(1);

  // Save form data to localStorage whenever relevant state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = {
        players,
        guardianName,
        guardianPhone,
        guardianEmail,
        waiverLiability,
        waiverPhoto,
        accordionStep,
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    }
  }, [players, guardianName, guardianPhone, guardianEmail, waiverLiability, waiverPhoto, accordionStep]);


  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  // Handler for player input changes
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

  // Validation logic
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

  // Form submit handler (finalize registration)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    // TODO: Registration API call
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "registrationConfirmation",
        JSON.stringify({
          guardianEmail,
          guardianPhone,
          players,
          paymentStatus: "complete",
        })
      );
    }
    router.push("/registration-complete");
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
    >
      {/* Accordion Step 1: Player & Guardian */}
      <div
        className={`border-b border-gray-700 ${
          accordionStep === 1 ? "" : "opacity-60 pointer-events-none"
        }`}
      >
        <div className="w-full flex items-center justify-between py-4 px-6 bg-neutral-900 text-white border-0">
          <button
            type="button"
            className="text-left flex-1 bg-transparent border-none text-white focus:outline-none flex items-center"
            onClick={() => setAccordionStep(1)}
            aria-expanded={accordionStep === 1}
          >
            <span className="text-2xl dela font-bold">
              1. The Player & Guardian
            </span>
            <span className="ml-2">{accordionStep === 1 ? "▼" : "▶"}</span>
          </button>
          {accordionStep !== 1 && (
            <button
              type="button"
              className="hidden ml-4 text-blue-400 underline text-sm bg-transparent border-none cursor-pointer"
              onClick={() => setAccordionStep(1)}
              tabIndex={0}
            >
              Edit
            </button>
          )}
        </div>
        {accordionStep === 1 && (
          <div className="pb-12 px-6">
            <h2 className="dela text-xl font-bold mb-12 pt-8">The Player </h2>
            {players.map((player, idx) => (
              <div
                key={idx}
                className="mb-8"
              >
                <div className="flex gap-3 flex-col md:flex-row">
                  <div className="flex-1">
                    <label
                      className="uppercase text-xs font-bold text-gray-300"
                      htmlFor={`firstName-${idx}`}
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
                      className="w-full px-2 py-2 mt-2 border-gray-900 bg-neutral-900 text-white focus:outline-none"
                    />
                    {playerErrors[idx]?.firstName && (
                      <span className="text-red-500 text-xs block mt-1">
                        {playerErrors[idx].firstName}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor={`lastName-${idx}`}
                      className="uppercase text-xs font-bold text-gray-300"
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
                      className="w-full px-2 py-2 mt-2 border-gray-900 bg-neutral-900   text-white focus:outline-none"
                    />
                    {playerErrors[idx]?.lastName && (
                      <span className="text-red-500 text-xs block mt-1">
                        {playerErrors[idx].lastName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 flex-col md:flex-row mt-6">
                  <div className="flex-1">
                    <label
                      htmlFor={`birthdate-${idx}`}
                      className="uppercase text-xs font-bold text-gray-300"
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
                      className="w-full px-2 py-2 mt-2 border-gray-900 bg-neutral-900 text-white focus:outline-none"
                      max="2012-12-31"
                    />
                    {playerErrors[idx]?.birthdate && (
                      <span className="text-red-500 text-xs block mt-1">
                        {playerErrors[idx].birthdate}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor={`gender-${idx}`}
                      className="uppercase text-xs font-bold text-gray-300"
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
                      className="w-full px-2 py-2 mt-2 border-gray-900 bg-neutral-900 text-white focus:outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {playerErrors[idx]?.gender && (
                      <span className="text-red-500 text-xs block mt-1">
                        {playerErrors[idx].gender}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  {players.length > 1 && (
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 hover:underline mt-2 text-sm font-semibold cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
                      onClick={() => handleRemovePlayer(idx)}
                      aria-label="Remove player"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          strokeWidth="2"
                        />
                        <line
                          x1="8"
                          y1="12"
                          x2="16"
                          y2="12"
                          strokeWidth="2"
                        />
                      </svg>
                      Remove player
                    </button>
                  )}
                  {idx === players.length - 1 && (
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 hover:underline mt-2 text-sm font-semibold cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
                      onClick={handleAddPlayer}
                      tabIndex={0}
                      aria-label="Add player"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          strokeWidth="2"
                        />
                        <line
                          x1="12"
                          y1="8"
                          x2="12"
                          y2="16"
                          strokeWidth="2"
                        />
                        <line
                          x1="8"
                          y1="12"
                          x2="16"
                          y2="12"
                          strokeWidth="2"
                        />
                      </svg>
                      Add another player (optional)
                    </button>
                  )}
                </div>
              </div>
            ))}
            <h2 className="dela text-xl font-bold mb-4 pt-6">The Guardian</h2>
            <label
              htmlFor="guardianName"
              className="uppercase text-xs mt-2 font-bold text-gray-300"
            >
              Guardian/Emergency Contact Name
            </label>
            <input
              id="guardianName"
              name="guardianName"
              type="text"
              required
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              placeholder="Parent Name"
              className="w-full px-2 py-2 mt-2 mb-4 border-gray-900 bg-neutral-900 text-white focus:outline-none"
            />
            {guardianNameError && (
              <span className="text-red-500 text-xs block mb-4">
                {guardianNameError}
              </span>
            )}
            <label
              htmlFor="guardianPhone"
              className="uppercase text-xs mt-2 font-bold text-gray-300"
            >
              Guardian Phone
            </label>
            <input
              id="guardianPhone"
              name="guardianPhone"
              type="tel"
              required
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
              placeholder="555-555-5555"
              className="w-full px-2 py-2 mt-2 mb-4 border-gray-900 bg-neutral-900 text-white focus:outline-none"
            />
            {guardianPhoneError && (
              <span className="text-red-500 text-xs block mb-4">
                {guardianPhoneError}
              </span>
            )}
            <label
              htmlFor="guardianEmail"
              className="uppercase text-xs font-bold text-gray-300"
            >
              Guardian Email
            </label>
            <input
              id="guardianEmail"
              name="guardianEmail"
              type="email"
              required
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              placeholder="parent@email.com"
              className="w-full px-2 py-2 mt-2 mb-4 border-gray-900 bg-neutral-900 text-white focus:outline-none"
            />
            {guardianEmailError && (
              <span className="text-red-500 text-xs block mb-4">
                {guardianEmailError}
              </span>
            )}
            <div className="mb-4 mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={waiverLiability}
                  onChange={(e) => setWaiverLiability(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-200">
                  I agree to the{" "}
                  <b>
                    <Link
                      href="/waiver-code-of-conduct"
                      target="_blank"
                      style={{ textDecoration: "underline" }}
                    >
                      Liability Waiver and Code of Conduct
                    </Link>
                  </b>{" "}
                  (required)
                </span>
              </label>
              {waiverLiabilityError && (
                <span className="text-red-500 text-xs block mt-4">
                  {waiverLiabilityError}
                </span>
              )}
            </div>
            <div className="mt-12 pb-24">
              <button
                type="button"
                className="py-3 px-8 border-gray-400 bg-gray-100 text-black rounded-sm font-bold border-b-red-600 border-b-4 cursor-pointer hover:bg-gray-200"
                disabled={registrationLoading}
                onClick={() => {
                  if (validateAll()) setAccordionStep(2);
                }}
              >
                {registrationLoading ? "Submitting..." : "Continue to Payment"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Accordion Step 2: Payment */}
      <div
        className={`mt-0 pb-24 ${
          accordionStep === 2 ? "" : "opacity-60 pointer-events-none"
        }`}
      >
        <button
          type="button"
          className="w-full text-left py-4 px-6 bg-neutral-900 text-white focus:outline-none flex items-center justify-between"
          onClick={() => setAccordionStep(2)}
          aria-expanded={accordionStep === 2}
        >
          <span className="text-2xl dela font-bold">2. The Money</span>
          <span className="ml-2">{accordionStep === 2 ? "▼" : "▶"}</span>
        </button>
        {accordionStep === 2 && (
          <>
            {/* Invoice summary */}
            <div className="bg-neutral-800 text-white p-6 rounded mb-6">
              <div className="flex justify-between mb-2">
                <span>Players:</span>
                <span>{players.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Price per player:</span>
                <span>
                  $
                  {Number(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER) /
                    100}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 border-t border-neutral-700 pt-2">
                <span>Total:</span>
                <span>
                  $
                  {(
                    (players.length *
                      Number(
                        process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER
                      )) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            {/* Pay button */}
            <button
              type="button"
              className="py-3 px-8 border-gray-400 bg-red-600 text-white rounded-sm font-bold border-b-red-900 border-b-4 cursor-pointer hover:bg-red-700 w-full text-xl"
              style={{ opacity: registrationLoading || payLoading ? 0.5 : 1 }}
              disabled={registrationLoading || payLoading}
              onClick={async () => {
                try {
                  setPayLoading(true);
                  const amount =
                    players.length *
                    Number(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER);
                  // 1. Create registration in DB
                  const regRes = await fetch("/api/create-registration", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      players,
                      guardianEmail,
                    }),
                  });
                  const regData = await regRes.json();
                  if (!regRes.ok)
                    throw new Error(
                      regData.error || "Failed to create registration"
                    );
                  const registrationId = regData.registrationId;
                  // 2. Create Stripe Checkout Session with real registrationId
                  const res = await fetch("/api/create-checkout-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount,
                      registrationId,
                      players,
                      guardianEmail,
                      successUrl: `${window.location.origin}/registration-complete?session_id={CHECKOUT_SESSION_ID}`,
                      cancelUrl: `${window.location.origin}/register?canceled=1`,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok)
                    throw new Error(
                      data.error || "Failed to create checkout session"
                    );
                  const { getStripe } = await import("./stripeCheckout");
                  const stripe = await getStripe();
                  if (!stripe) throw new Error("Stripe.js failed to load");
                  await stripe.redirectToCheckout({ sessionId: data.id });
                } catch (err: any) {
                  alert(
                    err.message || "An error occurred while starting payment."
                  );
                } finally {
                  setPayLoading(false);
                  // Only clear persisted form data after payment attempt (success or cancel handled by redirect)
                  if (typeof window !== "undefined") {
                    localStorage.removeItem(FORM_STORAGE_KEY);
                  }
                }
              }}
            >
              {registrationLoading || payLoading
                ? "Processing..."
                : `Pay $${(
                    (players.length *
                      Number(
                        process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER
                      )) /
                    100
                  ).toFixed(2)}`}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default UnifiedRegistrationForm;
