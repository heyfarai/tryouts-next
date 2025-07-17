import React, { useState, useRef, useEffect } from "react";
import { getPaymentAmount } from "../lib/paymentAmount";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validatePlayerInfo } from "./validation";
import { useCreateRegistration } from "./useCreateRegistration";

import { Player, PlayerErrors } from "./PlayerForm";
import { DEFAULT_PLAYER } from "./constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isDevOrPreviewEnv } from "../lib/envUtils";

interface UnifiedRegistrationFormProps {
  registrationLoading?: boolean;
}

const UnifiedRegistrationForm: React.FC<UnifiedRegistrationFormProps> = ({
  registrationLoading,
}) => {
  // Local loading state for Pay button
  const [payLoading, setPayLoading] = useState(false);

  // Persisted registration form state keys
  const FORM_STORAGE_KEY = "registrationFormData";

  // Hydrate all form fields from localStorage using useState initializers
  const saved =
    typeof window !== "undefined"
      ? localStorage.getItem(FORM_STORAGE_KEY)
      : null;
  type RegistrationFormData = {
    players: Player[];
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    waiverLiability: boolean;
    waiverPhoto: boolean;
    accordionStep: number;
  };
  let parsed: Partial<RegistrationFormData> = {};
  try {
    parsed = saved ? JSON.parse(saved) : {};
  } catch {}

  const [players, setPlayers] = useState<Player[]>(
    parsed.players ||
      (isDevOrPreviewEnv()
        ? [DEFAULT_PLAYER]
        : [{ firstName: "", lastName: "", birthdate: "", gender: "other" }])
  );
  const [playerErrors, setPlayerErrors] = useState<PlayerErrors[]>([
    { firstName: "", lastName: "", birthdate: "", gender: "other" },
  ]);
  const [guardianName, setGuardianName] = useState<string>(
    parsed.guardianName || (isDevOrPreviewEnv() ? "Mumzo" : "")
  );
  const [guardianPhone, setGuardianPhone] = useState<string>(
    parsed.guardianPhone || (isDevOrPreviewEnv() ? "800 000 0000" : "")
  );
  const [guardianEmail, setGuardianEmail] = useState<string>(
    parsed.guardianEmail || (isDevOrPreviewEnv() ? "farai@icloud.com" : "")
  );
  const [waiverLiability, setWaiverLiability] = useState<boolean>(
    typeof parsed.waiverLiability === "boolean" ? parsed.waiverLiability : true
  );
  const [waiverPhoto, setWaiverPhoto] = useState<boolean>(
    typeof parsed.waiverPhoto === "boolean" ? parsed.waiverPhoto : true
  );
  const [accordionStep, setAccordionStep] = useState<number>(
    typeof parsed.accordionStep === "number" ? parsed.accordionStep : 1
  );
  const [hydrated, setHydrated] = useState<boolean>(false);
  // General error state for validation
  const [showGeneralError, setShowGeneralError] = useState(false);

  // Registration API state
  const { createRegistration, registrationId: regIdFromHook } = useCreateRegistration();
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  useEffect(() => {
    if (regIdFromHook && !registrationId) setRegistrationId(regIdFromHook);
  }, [regIdFromHook, registrationId]);

  useEffect(() => {
    setHydrated(true);

    // Autofill polling: for first 3 seconds after mount, poll key fields for changes
    let active = true;
    let pollCount = 0;
    const maxPolls = 10; // poll for ~3 seconds (10 x 300ms)
    const pollInterval = 300;
    const poll = () => {
      if (!active || pollCount > maxPolls) return;
      pollCount++;
      // Guardian Email
      const emailInput = document.getElementById(
        "guardianEmail"
      ) as HTMLInputElement | null;
      if (emailInput && emailInput.value !== guardianEmail) {
        setGuardianEmail(emailInput.value);
      }
      // Guardian Phone
      const phoneInput = document.getElementById(
        "guardianPhone"
      ) as HTMLInputElement | null;
      if (phoneInput && phoneInput.value !== guardianPhone) {
        setGuardianPhone(phoneInput.value);
      }
      // Guardian Name
      const nameInput = document.getElementById(
        "guardianName"
      ) as HTMLInputElement | null;
      if (nameInput && nameInput.value !== guardianName) {
        setGuardianName(nameInput.value);
      }
      // Player fields
      let playersChanged = false;
      const updatedPlayers = players.map((player, idx) => {
        let changed = false;
        const firstNameInput = document.getElementById(
          `player-firstName-${idx}`
        ) as HTMLInputElement | null;
        const lastNameInput = document.getElementById(
          `player-lastName-${idx}`
        ) as HTMLInputElement | null;
        const birthdateInput = document.getElementById(
          `player-birthdate-${idx}`
        ) as HTMLInputElement | null;
        const updated = { ...player };
        if (firstNameInput && firstNameInput.value !== player.firstName) {
          updated.firstName = firstNameInput.value;
          changed = true;
        }
        if (lastNameInput && lastNameInput.value !== player.lastName) {
          updated.lastName = lastNameInput.value;
          changed = true;
        }
        if (birthdateInput && birthdateInput.value !== player.birthdate) {
          updated.birthdate = birthdateInput.value;
          changed = true;
        }
        if (changed) playersChanged = true;
        return updated;
      });
      if (playersChanged) setPlayers(updatedPlayers);
      setTimeout(poll, pollInterval);
    };
    setTimeout(poll, pollInterval);
    return () => {
      active = false;
    };
  }, [guardianEmail, guardianPhone, guardianName, players]);

  // Ensure at least one blank player on mount (only if no data was restored)
  useEffect(() => {
    if (players.length === 0 && hydrated) {
      setPlayers([
        { firstName: "", lastName: "", birthdate: "", gender: "other" },
      ]);
      setPlayerErrors([
        { firstName: "", lastName: "", birthdate: "", gender: "other" },
      ]);
    }
  }, [players.length, hydrated]);

  // Hide general error when user edits any field
  useEffect(() => {
    if (showGeneralError) setShowGeneralError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    players,
    guardianName,
    guardianPhone,
    guardianEmail,
    waiverLiability,
    waiverPhoto,
  ]);

  // Guardian errors
  const [guardianNameError, setGuardianNameError] = useState("");
  const [guardianPhoneError, setGuardianPhoneError] = useState("");
  const [guardianEmailError, setGuardianEmailError] = useState("");

  // Waivers
  const [waiverLiabilityError, setWaiverLiabilityError] = useState("");

  // Save form data to localStorage whenever relevant state changes
  useEffect(() => {
    if (typeof window !== "undefined" && hydrated) {
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
  }, [
    players,
    guardianName,
    guardianPhone,
    guardianEmail,
    waiverLiability,
    waiverPhoto,
    accordionStep,
    hydrated,
  ]);

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
    if (!waiverLiability) {
      setWaiverLiabilityError("You must agree to the liability waiver.");
      valid = false;
    }
    if (!waiverPhoto) {
      valid = false;
    }
    return valid;
  };

  const handleAddPlayer = () => {
    setPlayers([
      ...players,
      { firstName: "", lastName: "", birthdate: "", gender: "other" },
    ]);
    setPlayerErrors([
      ...playerErrors,
      { firstName: "", lastName: "", birthdate: "", gender: "other" },
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
        className={`bg-neutral-800 rounded-tr-lg rounded-tl-lg ${
          accordionStep === 1 ? "" : "opacity-60"
        }`}
      >
        <div className="stepHeader w-full flex items-center justify-between py-6 px-6  text-white rounded-tr-sm rounded-tl-sm ">
          <button
            type="button"
            className="w-full text-left  border-none text-white focus:outline-none flex items-center justify-between "
            onClick={() => setAccordionStep(1)}
            aria-expanded={accordionStep === 1}
          >
            <span className="text-xl font-bold">1. The Player & Guardian</span>
            <span className="ml-2 hidden">
              {accordionStep === 1 ? "▼" : "▶"}
            </span>
          </button>
          {accordionStep !== 1 && (
            <button
              type="button"
              className="ml-4 underline text-sm bg-transparent border-none cursor-pointer"
              onClick={() => {
                setAccordionStep(1);
                if (formRef.current) {
                  formRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }}
              tabIndex={0}
            >
              Edit
            </button>
          )}
        </div>
        {accordionStep === 1 && (
          <div className="stepWrapper pb-12 px-6 rounded-tl-sm rounded-tr-sm">
            {players.map((player, idx) => (
              <div
                key={idx}
                className="mb-8 pt-4"
              >
                <div className="flex gap-3 flex-col md:flex-row">
                  <div className="flex-1">
                    <label
                      className="uppercase text-xs font-bold text-gray-300"
                      htmlFor={`firstName-${idx}`}
                    >
                      Player First Name
                    </label>
                    <input
                      id={`player-firstName-${idx}`}
                      type="text"
                      autoComplete="given-name"
                      value={player.firstName}
                      onChange={(e) =>
                        handleInputChange(idx, "firstName", e.target.value)
                      }
                      required
                      className="w-full px-2 py-2 mt-2 border-gray-900 text-white focus:outline-none"
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
                      Player Last Name
                    </label>
                    <input
                      id={`player-lastName-${idx}`}
                      type="text"
                      autoComplete="family-name"
                      value={player.lastName}
                      onChange={(e) =>
                        handleInputChange(idx, "lastName", e.target.value)
                      }
                      required
                      className="w-full px-2 py-2 mt-2 border-gray-900    text-white focus:outline-none"
                    />
                    {playerErrors[idx]?.lastName && (
                      <span className="text-red-500 text-xs block mt-1">
                        {playerErrors[idx].lastName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 flex-col md:flex-row mt-6">
                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor={`birthdate-${idx}`}
                      className="uppercase text-xs font-bold text-gray-300"
                    >
                      Player Birthdate
                    </label>

                    <DatePicker
                      id={`birthdate-${idx}`}
                      selected={
                        player.birthdate ? new Date(player.birthdate) : null
                      }
                      onChange={(date: Date | null) =>
                        handleInputChange(
                          idx,
                          "birthdate",
                          date ? date.toISOString().slice(0, 10) : ""
                        )
                      }
                      dateFormat="yyyy-MM-dd"
                      maxDate={new Date("2012-12-31")}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Select birthdate"
                      className="w-1/2 px-2 py-2 mt-2 border-gray-900 text-white focus:outline-none bg-neutral-800 focus:bg-neutral-900"
                      required
                    />

                    {playerErrors[idx]?.birthdate && (
                      <span className="text-red-500 text-xs block mt-1">
                        {playerErrors[idx].birthdate}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 hidden">
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
                      className="w-full px-2 py-2 mt-2 border-gray-900  text-white focus:outline-none"
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
                      className="hover:underline mt-2 text-sm font-semibold cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
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
                      className="text-neutral-400 hover:text-neutral-200 hover:underline mt-2 text-sm font-semibold cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
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
            <div className="mb-8 pt-8">
              <h2 className=" text-xl font-bold mb-4 pt-6 hidden">
                The Guardian
              </h2>
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
                className="w-full px-2 py-2 mt-2 mb-4 border-gray-900  text-white focus:outline-none"
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
                className="w-full px-2 py-2 mt-2 mb-4 border-gray-900  text-white focus:outline-none"
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
                className="w-full px-2 py-2 mt-2 mb-4 border-gray-900  text-white focus:outline-none"
              />
              {guardianEmailError && (
                <span className="text-red-500 text-xs block mb-4">
                  {guardianEmailError}
                </span>
              )}
            </div>
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
                <span className="text-[var(--precision-red)] text-xs block mt-4">
                  {waiverLiabilityError}
                </span>
              )}
            </div>
            {/* General error message for validation errors */}
            {showGeneralError && (
              <div
                className="bg-red-100 text-red-700 px-4 py-3 mt-12 rounded mb-4"
                role="alert"
              >
                <span className="block">
                  Check for missing or invalid fields highlighted in red.
                </span>
              </div>
            )}
            <div className="mt-12 pb-6">
              <button
                type="button"
                className="py-3 px-8 border-gray-400 bg-gray-100 text-black rounded-sm font-bold border-b-[var(--precision-red)] border-b-4 cursor-pointer hover:bg-gray-400 transition"
                disabled={registrationLoading}
                onClick={async () => {
                  const valid = validateAll();
                  if (valid) {
                    setShowGeneralError(false);
                    // Save cart/registration on step 1 submit
                    if (!registrationId) {
                      const regId = await createRegistration({
                        players,
                        guardianEmail,
                      });
                      if (regId) {
                        setRegistrationId(regId);
                      }
                    }
                    setAccordionStep(2);
                  } else {
                    setShowGeneralError(true);
                  }
                }}
              >
                {registrationLoading ? "Submitting..." : "Continue to Payment"}
              </button>
            </div>
          </div>
        )}
        {accordionStep === 2 && (
          <>
            {/* Step 1 Summary */}
            <div className="bg-neutral-800 text-white px-6 pt-0 pb-6 rounded mb-0">
              <div className="mb-4">
                <div className="font-semibold mb-1">Registering:</div>
                <p className="ml-0 flex">
                  {players.map((player, idx) => (
                    <span
                      key={idx}
                      className="mb-1 list-none ml-0 pl-0"
                    >
                      {player.firstName} {player.lastName} — {player.birthdate}{" "}
                    </span>
                  ))}
                </p>
              </div>
              <div className="mb-1">
                <span className="font-semibold">Guardian:</span>{" "}
                {guardianName || (
                  <span className="italic text-gray-400">(none)</span>
                )}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Guardian Phone:</span>{" "}
                {guardianPhone || (
                  <span className="italic text-gray-400">(none)</span>
                )}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Guardian Email:</span>{" "}
                {guardianEmail || (
                  <span className="italic text-gray-400">(none)</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Accordion Step 2: Payment */}
      <div
        className={`mt-0 pb-0 mb-12 bg-neutral-800 rounded-lg border-t-2 border-black ${
          accordionStep === 2 ? "" : "opacity-60 pointer-events-none"
        }`}
      >
        <button
          type="button"
          className="w-full text-left py-6 px-6 text-white focus:outline-none flex items-center justify-between"
          onClick={() => setAccordionStep(2)}
          aria-expanded={accordionStep === 2}
        >
          <span className="text-xl font-bold">2. The Money</span>
          <span className="ml-2 hidden">{accordionStep === 2 ? "▼" : "▶"}</span>
        </button>
        {accordionStep === 2 && (
          <>
            {/* Invoice summary */}
            <div className="bg-neutral-800 text-white p-6 rounded mb-6">
              <div className="flex justify-between mb-2">
                <span>Players to register</span>
                <span>{players.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Price per player</span>
                <span>${Number(getPaymentAmount()) / 100}</span>
              </div>
              <div className="flex justify-between font-bold mt-4 border-t border-neutral-700 pt-4">
                <span>Total to pay</span>
                <span>
                  $
                  {(
                    (players.length * Number(getPaymentAmount())) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            {/* Pay button */}
            <div className="px-6 pb-12">
              <button
                type="button"
                className="py-3 px-8 bg-white text-black rounded-sm font-bold border-b-[var(--precision-red)] border-b-4 cursor-pointer hover:text-white text-xl hover:bg-gray-400 transition"
                style={{ opacity: registrationLoading || payLoading ? 0.5 : 1 }}
                disabled={registrationLoading || payLoading}
                onClick={async () => {
                  try {
                    // Remove confirmationEmailSent flag when starting a new registration
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("confirmationEmailSent");
                    }
                    setPayLoading(true);
                    const amount = players.length * Number(getPaymentAmount());
                    // Use existing registrationId from step 1
                    if (!registrationId) {
                      alert("Registration not found. Please complete step 1 first.");
                      setPayLoading(false);
                      return;
                    }
                    // Create Stripe Checkout Session with existing registrationId
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
                    // (Do not clear registrationFormData here; it will be cleared in the confirmation step after email is sent)
                  }
                }}
              >
                {registrationLoading || payLoading
                  ? "Processing..."
                  : `Pay $${(
                      (players.length * getPaymentAmount()) /
                      100
                    ).toFixed(2)}`}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default UnifiedRegistrationForm;
