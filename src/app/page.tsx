"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CoachingSection from "./components/CoachingSection";
import TryoutRegistrationList from "./components/TryoutRegistrationList";
import UnifiedRegistrationForm from "./components/UnifiedRegistrationForm";
import SectionSponsors from "./components/SectionSponsors";
import SectionFAQ from "./components/SectionFAQ";

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
        <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 lg:pt-52 pt-36 pb-32 mb-12">
          <div className="mb-40">
            <h1
              style={{ color: "var(--precision-red)" }}
              className="alexandria font-extrabold text-4xl lg:text-5xl md:text-4xl mb-0"
            >
              Precision Heat.
            </h1>
            <h1 className="alexandria font-extrabold text-4xl lg:text-5xl md:text-4xl mt-0 mb-12 md:leading-[3.2rem]">
              U14 Boys Basketball.
            </h1>
            <p className="text-xl mb-8 font-semibold">
              An Ottawa-based U14 AAA+ (Major Bantam) basketball team. <br />{" "}
              For the 2025-26 season we are playing in the highly competitive
              Ascent League of the{" "}
              <a
                className="text-[var(--precision-red)] hover:underline transition"
                href="https://natcaphoops.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                National Capital Hoops Circuit
              </a>
              . <br />
            </p>
            <p className="mb-8">
              Join us and play for a team that coaches and trains competitive
              basketball players to elite levels of individual and team skills.
            </p>
            <p className="text-lg mb-20 mt-0">
              <a
                href="#tryouts"
                className="py-3 px-8 border-gray-400 bg-gray-100 text-black rounded-sm font-bold border-b-red-600 border-b-4 cursor-pointer hover:bg-gray-400 transition"
              >
                Register for Tryouts
              </a>
            </p>
          </div>
          <h3 className="font-bold text-2xl mt-4 mb-2">
            League: National Capital Hoops Circuit
          </h3>
          <p className="text-lg mb-12">
            <span className="font-bold">Games:</span> All 2025-26 league games
            are in Ottawa. <br />
            <span className="font-bold">Tournaments:</span> We&apos;ll travel to
            select competitive tournaments across Ontario and Quebec. We plan to
            minimize travel in our first season.
          </p>
          <h3 className="font-bold text-2xl mt-4 mb-4">
            Practice: 3 times a week.
          </h3>
          <h3 className="font-bold text-sm uppercase mt-6 mb-2">
            Practice Days
          </h3>
          <p className="text-lg mb-4">
            Wednesday, then Saturday and Sunday. (2 hours each)
          </p>
          <h3 className="font-bold text-sm uppercase mt-6 mb-2">
            Professional Development
          </h3>
          <p className="text-lg mb-4">
            More than playing with the team, we have a consultant professional
            development coach to improve <i>YOUR</i> individual game.
          </p>

          <h3 className="font-bold text-sm uppercase mt-6 mb-2">
            Practice Locations
          </h3>
          <ul className="mb-12">
            <li>
              <span className="font-bold">
                Sir Wilfrid Laurier High School:
              </span>{" "}
              1515 Tenth Line Rd, Orléans
            </li>
            <li>
              <span className="font-bold">BGC Taggart Parkes:</span> 1770
              Heatherington Rd.
            </li>
            <li>
              <span className="font-bold">BGC Tomlinson:</span> 1463 Prince of
              Wales Dr.
            </li>
          </ul>
          <h3 className="font-bold text-2xl mt-4 mb-2">What we believe</h3>
          <p className="text-lg mb-12">
            Hard work. No cap. No yap. <br />
            Respect. For ourselves. For those around us. <br />
            Boosting self-esteem and confidence.
          </p>
        </div>
      </div>
      <div
        id="tryouts"
        className="sectionForm flex flex-col items-center lg:pt-32 pt-32 pb-32"
      >
        <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 ">
          <div className="formLede">
            <h1
              style={{ color: "var(--precision-red)" }}
              className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl mb-0"
            >
              Tryouts.
            </h1>
            <h1 className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
              Take the shot.
            </h1>
            <h1 className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">
              With Precision.
            </h1>
            <p className="text-lg mb-4">
              For competitive players born in 2012 or later. $30 per player.
            </p>
            <div className="flex lg:flex-row flex-col mb-2 text-lg gap-x-16">
              <div className="mb-6">
                <span className="font-bold uppercase mt-0 mb-2">
                  Tryouts Day 1
                </span>
                <br />
                (All welcome) <br />
                Sunday, 24 August <br />
                3:00pm - 5:00pm <br />
                BGC Tomlinson (
                <a
                  href="https://maps.app.goo.gl/4YFkKQamYPUCXG4m7"
                  className="text-[var(--precision-red)]"
                >
                  1463 Prince of Wales Dr.
                </a>
                )
              </div>
              <div className="mb-6">
                <span className="font-bold uppercase mt-0 mb-2">
                  Tryouts Day 2
                </span>
                <br />
                (Invitation only) <br />
                Thursday, 28 August <br />
                5:30pm - 7:30pm <br />
                BGC Tomlinson (
                <a
                  href="https://maps.app.goo.gl/4YFkKQamYPUCXG4m7"
                  className="text-[var(--precision-red)]"
                >
                  1463 Prince of Wales Dr.
                  <i className="fa-solid fa-location-dot"></i>
                </a>
                )
              </div>
            </div>
            <p className="text-lg mb-8 hidden ">
              Bring your athleticism, court IQ, competitive drive, and coachable
              mindset.
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
                        <h2 className="alexandria text-2xl font-bold mb-4 text-green-400">
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
      <CoachingSection />
      <SectionFAQ />
      <SectionSponsors />
    </div>
  );
}
