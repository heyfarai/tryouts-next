"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import TryoutRegistrationList from "./components/TryoutRegistrationList";
import UnifiedRegistrationForm from "./components/UnifiedRegistrationForm";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`/api/account-data?clerkUserId=${user.id}&role=GUARDIAN`)
        .then(async (res) => {
          if (!res.ok)
            throw new Error(
              (await res.json()).error || "Failed to load registrations"
            );
          return res.json();
        })
        .then((data) => setRegistrations(data.registrations || []));
      // .finally(() => setRegistrationsLoading(false));
    }
  }, [isLoaded, user]);

  // Unified registration form state
  const [registrationComplete, setRegistrationComplete] = useState(false);

  return (
    <div>
      <div className="sectionHero flex flex-col items-center  sm:min-h-[calc(100vh)]">
        <div className="sectionContent w-full lg:w-[68%] lg:ml-48 max-w-[640px] px-6 lg:pt-52 pt-36 pb-32 mb-12">
          <h1
            style={{ fontWeight: "600" }}
            className="dela font-weight-[600] font-extrabold text-4xl lg:text-6xl md:text-5xl text-red-600 mb-0"
          >
            Precision.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
            Purpose.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">
            Progress.
          </h1>
          <p className="text-xl mb-8">
            An Ottawa-based U14 AAA+ (Major Bantam) basketball team. <br /> We
            coach and train competitive basketball players to elite levels of
            individual and team skills.
          </p>
          <p className="text-lg mb-20 mt-0">
            <a
              href="#tryouts"
              className="py-3 px-8 border-gray-400 bg-gray-100 text-black rounded-sm font-bold border-b-red-600 border-b-4 cursor-pointer hover:bg-gray-400 transition"
            >
              Register for Tryouts
            </a>
          </p>
          <h3 className="font-bold text-2xl mt-4 mb-2">
            Leagues, tournaments, and travel
          </h3>
          <p className="text-lg mb-12">
            Games and leagues are TBC. <br /> We expect to travel to highly
            competitive tournaments across Ontario and Quebec.
          </p>
          <h3 className="font-bold text-2xl mt-4 mb-2">What we believe</h3>
          <p className="text-lg mb-12">
            Hard work. No cap. No yap. <br />
            Respect. For ourselves. For those around us. <br />
            Boosting self-esteem and confidence.
          </p>
          <h3 className="font-bold text-2xl mt-4 mb-2">
            We practice 3 times a week.
          </h3>
          <p className="text-lg mb-4">
            1 weeknight, then Saturday and Sunday. (2 hours each)
            <br />
            Gamedays and Leagues are TBC.
          </p>

          <h3 className="font-bold text-sm uppercase mt-0 mb-2">
            Practice Locations
          </h3>
          <ul className="mb-12">
            <li>BGC Taggart Parkes: 1770 Heatherington Rd.</li>
            <li>BGC Tomlinson: 1463 Prince of Wales Dr.</li>
          </ul>
        </div>
      </div>
      <div
        id="tryouts"
        className="sectionForm flex flex-col items-center lg:pt-32 pt-32 pb-32"
      >
        <div className="sectionContent w-full lg:w-[68%] lg:ml-48 max-w-[640px] px-6 ">
          <div className="formLede">
            <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl text-red-600 mb-0">
              Tryouts.
            </h1>
            <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
              Shoot your shot.
            </h1>
            <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">
              With Precision.
            </h1>
            <ul className="mb-12 text-lg">
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
              For competitive players born in 2012 or later.
            </p>
            <p className="text-lg mb-8">
              Tryouts will be conducted by 4-6 Precision Heat coaches, alongside
              current competitive basketball professionals.
            </p>
            <p className="text-lg mb-8">
              We want to see you at your best. Show up with your athleticism,
              court IQ, competitive drive, and coachable mindset.
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
                    }}
                  />
                )}
                {/* Unified single-step registration form */}
                {(!user ||
                  showForm ||
                  (user && registrations.length === 0)) && (
                  <div>
                    {registrationComplete ? (
                      <div className="p-8 text-center">
                        <h2 className="dela text-2xl font-bold mb-4 text-green-400">
                          Registration Complete!
                        </h2>
                        <p className="mb-4">
                          Thank you for registering. Check your email for
                          confirmation and next steps.
                        </p>
                        <button
                          className="py-2 px-6 border border-gray-300 rounded hover:bg-gray-200 transition"
                          onClick={() => setRegistrationComplete(false)}
                        >
                          Register another player
                        </button>
                      </div>
                    ) : (
                      <UnifiedRegistrationForm />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div
        id="FAQ"
        className="sectionFAQ flex flex-col items-center  lg:pt-32 pt-32"
      >
        <div className="sectionContent w-full lg:w-[68%] lg:ml-48 max-w-[640px] px-6 pb-48">
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl text-red-600 mb-0">
            FAQs.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
            Answers.
          </h1>
          <div className="faqContent mt-16">
            <div className="faqItem mb-12">
              <h2 className="text-xl font-bold mb-4">
                What is the Tryout and Evaluation Process?
              </h2>
              <p className="text-lg mb-4">
                <strong>Coaching Staff</strong> Tryouts will be conducted by 4-6
                Precision Heat coaches, alongside current competitive basketball
                professionals.
              </p>
              <div className="text-lg mb-4">
                <strong>Evaluation Criteria</strong>
                <ul className="list-disc ml-4">
                  <li>Standardized tryout forms</li>
                  <li>
                    Assessment of athletic abilities and basketball skills
                  </li>
                  <li>Scrimmages to evaluate game-like decision-making</li>
                  <li>
                    Evaluation of coachability athletic abilities and basketball
                    skills
                  </li>
                </ul>
              </div>
            </div>
            <div className="faqItem">
              <h2 className="text-xl font-bold mb-4">
                Is Financial Assistance Available?
              </h2>
              <p className="text-lg mb-4">
                Financial assistance is available on a case by case basis.
                Contact us at{" "}
                <a
                  href="mailto:gm@precisionheat.team"
                  className=" text-[var(--precision-red)] hover:underline hover:text-gray-400 transition"
                >
                  gm@precisionheat.team
                </a>{" "}
                to inquire about financial assistance options.
              </p>
            </div>
            <div className="faqItem">
              <h2 className="text-xl font-bold mb-4">More questions?</h2>
              <p className="text-lg mb-4">
                Reach out to{" "}
                <a
                  href="mailto:gm@precisionheat.team"
                  className="text-[var(--precision-red)] hover:underline hover:text-gray-400 transition"
                >
                  gm@precisionheat.team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
