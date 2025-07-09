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
      <div className="sectionHero flex flex-col justify-start lg:pl-64">
        <div className="content max-w-3xl mx-7 pt-36">
          <h1 className="dela font-weight-[600] font-extrabold text-4xl lg:text-6xl md:text-5xl text-red-600 mb-0">
            Precision.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
            Purpose.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">
            Progress.
          </h1>
          <p className="text-xl mb-8">
            A U14 AAA+ (Major Bantam) competitive boys basketball team. <br />
            Built for serious players. Elite coaching, no politics, and real
            development.
          </p>
          <h3 className="font-extrabold text-xl mt-4 mb-2">
            3 Practices a week
          </h3>
          <p className="text-xl mb-8">
            Expect to practice 3 times a week. <br />1 weeknight, Saturday, and
            Sunday. (2 hours each)
            <br />
            Gamedays and Leagues are TBC.
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
          <p className="text-lg mb-0 mt-8">
            <a
              href="#tryouts"
              className="py-3 px-8 border-gray-400 bg-gray-100 text-black rounded-sm font-bold border-b-red-600 border-b-4 cursor-pointer hover:bg-gray-200"
            >
              Register for Tryouts
            </a>
          </p>
        </div>
      </div>
      <div
        id="tryouts"
        className="sectionForm flex flex-col lg:pl-64 pt-48 px-7 bg-opacity-50"
      >
        <div className="content max-w-3xl bg-bl  ">
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
                          className="py-2 px-6 border border-gray-300 rounded"
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
    </div>
  );
}
