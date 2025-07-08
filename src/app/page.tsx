"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
import TryoutRegistrationList from "./components/TryoutRegistrationList";
import StripePaymentForm from "./components/StripePaymentForm";
import ConfirmationStep from "./components/ConfirmationStep";
import PlayerForm, { Player, PlayerErrors } from "./components/PlayerForm";
import GuardianForm from "./components/GuardianForm";
import { validatePlayerInfo } from "./components/validation";
import { DEFAULT_PLAYER } from "./components/constants";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationsError, setRegistrationsError] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      setRegistrationsLoading(true);
      fetch(`/api/account-data?clerkUserId=${user.id}&role=GUARDIAN`)
        .then(async (res) => {
          if (!res.ok)
            throw new Error(
              (await res.json()).error || "Failed to load registrations"
            );
          return res.json();
        })
        .then((data) => setRegistrations(data.registrations || []))
        .catch((err) => setRegistrationsError(err.message || "Unknown error"))
        .finally(() => setRegistrationsLoading(false));
    }
  }, [isLoaded, user]);

  // Step state: 0 = player, 1 = guardian, 2 = waivers, 3 = payment, 4 = account, 5 = confirmation
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Set step and update URL (no query param sync in app router, so just use state)
  const goToStep = (newStep: number) => setStep(newStep);

  // Players: support multiple players
  const [players, setPlayers] = useState<Player[]>([DEFAULT_PLAYER]);
  const [playerErrors, setPlayerErrors] = useState<PlayerErrors[]>([
    { firstName: "", lastName: "", birthdate: "", gender: "" },
  ]);

  // Guardian fields
  const [guardianName, setGuardianName] = useState("Parent McGuardian");
  const [guardianPhone, setGuardianPhone] = useState("+15555555555");
  const [guardianEmail, setGuardianEmail] = useState("farai@icloud.com");

  // Guardian errors
  const [guardianNameError, setGuardianNameError] = useState("");
  const [guardianPhoneError, setGuardianPhoneError] = useState("");
  const [guardianEmailError, setGuardianEmailError] = useState("");

  // Payment status for Stripe payment
  const [paymentStatus, setPaymentStatus] = useState<"incomplete" | "complete">(
    "incomplete"
  );
  // Registration ID for payment linkage
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  // Waiver fields
  const [waiverLiability, setWaiverLiability] = useState(true);
  const [waiverPhoto, setWaiverPhoto] = useState(true);
  // Waiver errors
  const [waiverLiabilityError, setWaiverLiabilityError] = useState("");
  const [waiverPhotoError, setWaiverPhotoError] = useState("");

  // Player validation using utility
  const onPlayerFormNext = () => {
    const errors = validatePlayerInfo(players);
    setPlayerErrors(errors);
    const valid = errors.every(
      (e) => !e.firstName && !e.lastName && !e.birthdate && !e.gender
    );
    if (valid) {
      goToStep(1);
    }
  };

  // Combined guardian + waiver validation
  const validateGuardianAndWaivers = () => {
    let valid = true;
    setGuardianNameError("");
    setGuardianPhoneError("");
    setGuardianEmailError("");
    setWaiverLiabilityError("");
    setWaiverPhotoError("");

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

  return (
    <div>
      <div className="sectionHero flex flex-col justify-center lg:pl-64">
        <div className="content max-w-3xl mx-7">
          <h1 className="dela font-extrabold text-6xl text-red-600 mb-0">
            Precision.
          </h1>
          <h1 className="dela font-extrabold text-6xl mt-0 mb-0">Purpose.</h1>
          <h1 className="dela font-extrabold text-6xl mt-0 mb-12">Progress.</h1>
          <p className="text-xl mb-8">
            A U14 AAA+ (Major Bantam) competitive boys basketball team. <br />
            Built for serious players. <br />
            Elite coaching, no politics, and real development.
          </p>
          <h3 className="font-extrabold text-xl mt-4 mb-2">
            3 Practices a week
          </h3>
          <p className="text-xl mb-8">
            Expect to practice 3 times a week. <br />1 weeknight, Saturday, and
            Sunday. (2 hours each)
            <br />
            Gamedays are TBC.
          </p>

          <h3 className="font-extrabold text-xl mt-4 mb-2">
            Practice Locations
          </h3>
          <ul>
            <li>Boys and Girls Club (BGC) Taggart: 1770 Heatherington Rd</li>
            <li>
              Boys and Girls Club (BGC) Tomlinson: 1463 Prince of Wales Dr
            </li>
          </ul>
        </div>
      </div>
      <div className="sectionForm flex flex-col lg:pl-64 pt-48 ">
        <div className="content max-w-3xl mx-7">
          <div className="formLede">
            <h1 className="dela font-extrabold text-6xl text-red-600 mb-0">
              Tryouts.
            </h1>
            <h1 className="dela font-extrabold text-6xl mt-0 mb-0">
              Shoot your shot.
            </h1>
            <h1 className="dela font-extrabold text-6xl mt-0 mb-12">
              With Precision.
            </h1>
            <ul className="mb-8 text-lg">
              <li>
                Tryouts Day 1 (All welcome): Sunday, 24 August, 3:00pm-5:00pm at
                BGC Taggart Parkes.
              </li>
              <li>
                Tryouts Day 2 (Invitation only): Thursday, 28 August,
                5:30pm-7:30pm at BGC Taggart Parkes.
              </li>
              <li className="mt-4">Fees $30 per player.</li>
            </ul>
            <p className="text-lg mb-0">
              Who's eligible? Competitive players born in 2012{" "}
              <i>(or later if you play up)</i>.
            </p>
            <p className="text-lg mb-8">
              Tryouts will be conducted by 4-6 Precision Heat coaches, alongside
              current competitive basketball professionals.
            </p>
            <p className="text-lg mb-8">
              We&apos;re not trying to catch you slipping. We want to see you at
              your best. So come and show us your athleticism, court IQ,
              competitive drive, and coachable mindset.
            </p>
          </div>
          <div className="formContent">
            {/* Only render form and registration list after auth state is loaded */}
            {isLoaded && (
              <>
                {/* Show registration list for authed users */}
                {user && registrations.length > 0 && (
                  <TryoutRegistrationList
                    registrations={registrations}
                    onRegisterAnother={() => {
                      setShowForm(true);
                      setStep(0);
                      setPlayers([
                        {
                          firstName: "",
                          lastName: "",
                          birthdate: "",
                          gender: "",
                        },
                      ]);
                      setGuardianName("");
                      setGuardianPhone("");
                      setGuardianEmail("");
                      setWaiverLiability(true);
                      setWaiverPhoto(true);
                      setRegistrationId(null);
                      setPaymentStatus("incomplete");
                      setRegistrationError("");
                    }}
                  />
                )}
                {/* Registration steps would be rendered here based on step */}
                {(!user ||
                  showForm ||
                  (user && registrations.length === 0)) && (
                  <div>
                    {/* Step 0: Player Info */}
                    {step === 0 && (
                      <PlayerForm
                        players={players}
                        errors={playerErrors}
                        onChange={setPlayers}
                        onErrors={setPlayerErrors}
                        onNext={onPlayerFormNext}
                        loading={registrationLoading}
                      />
                    )}
                    {/* Step 1: Guardian & Waivers */}
                    {step === 1 && (
                      <GuardianForm
                        name={guardianName}
                        phone={guardianPhone}
                        email={guardianEmail}
                        nameError={guardianNameError}
                        phoneError={guardianPhoneError}
                        emailError={guardianEmailError}
                        waiverLiability={waiverLiability}
                        waiverPhoto={waiverPhoto}
                        waiverLiabilityError={waiverLiabilityError}
                        waiverPhotoError={waiverPhotoError}
                        onNameChange={setGuardianName}
                        onPhoneChange={setGuardianPhone}
                        onEmailChange={setGuardianEmail}
                        onWaiverLiabilityChange={setWaiverLiability}
                        onWaiverPhotoChange={setWaiverPhoto}
                        onNext={() => {
                          if (validateGuardianAndWaivers()) goToStep(2);
                        }}
                        loading={registrationLoading}
                      />
                    )}
                    {/* Step 2: Payment (Stripe) */}
                    {step === 2 && (
                      <>
                        <h3>The Money</h3>
                        <Elements stripe={stripePromise}>
                          <StripePaymentForm
                            amount={4000 * players.length}
                            registrationId={registrationId!}
                            onSuccess={() => {
                              setPaymentStatus("complete");
                              goToStep(3);
                            }}
                          />
                        </Elements>
                      </>
                    )}
                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                      <ConfirmationStep
                        guardianEmail={guardianEmail}
                        guardianPhone={guardianPhone}
                        players={players}
                        paymentStatus={paymentStatus}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
