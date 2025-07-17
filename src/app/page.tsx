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
        <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 lg:pt-52 pt-36 pb-32 mb-12">
          <div className="mb-40">
            <h1
              style={{ color: "var(--precision-red)" }}
              className="dela font-extrabold text-4xl lg:text-5xl md:text-4xl mb-0"
            >
              Precision Heat.
            </h1>
            <h1 className="dela font-extrabold text-4xl lg:text-5xl md:text-4xl mt-0 mb-12 leading-[3.2rem]">
              U14 Boys Basketball.
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
          </div>
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
        <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 ">
          <div className="formLede">
            <h1
              style={{ color: "var(--precision-red)" }}
              className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mb-1"
            >
              Tryouts.
            </h1>
            <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-1">
              Take the shot.
            </h1>
            <h1 className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-12">
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
                BGC Taggart Parkes (
                <a
                  href="https://maps.app.goo.gl/fcace5GkineLFBK69"
                  className="text-[var(--precision-red)]"
                >
                  map
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
                BGC Taggart Parkes (
                <a
                  href="https://maps.app.goo.gl/fcace5GkineLFBK69"
                  className="text-[var(--precision-red)]"
                >
                  map <i className="fa-solid fa-location-dot"></i>
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
        id="coaching"
        className="sectionCoaching bg-size-[50%_50%] md:bg-cover bg-position-[-34rem_-2rem] md:bg-position-[center_0]  flex flex-col items-center  lg:pt-32 pt-32"
      >
        <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 pb-48 pt-60 md:pt-0 bg-auto ">
          <h1 className="dela font-extrabold text-4xl lg:text-5xl md:text-5xl mb-0 text-shadow-stone-400 md:text-black">
            Our coaches.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-5xl md:text-5xl mt-0 mb-0">
            Coach Nicholas.
          </h1>
          <h1 className="dela font-extrabold text-4xl lg:text-5xl md:text-5xl mt-0 mb-0">
            Coach Ron.
          </h1>
          <div className="coachContent mt-16">
            <p className="text-lg mb-8 ">
              Two military vets. Decades of experience. One mission: develop
              disciplined, confident players who love the game.
            </p>
            <p className="text-lg mb-8 ">
              Coach Nicholas and Coach Ron bring a combined 50+ years of
              high-level basketball experience, on the court, on the bench, and
              in uniform. Both competed at national and international levels as
              members of Canadian military teams, earning a reputation for
              toughness, precision, and performance under pressure.
            </p>
            <p className="text-lg mb-8 ">
              Now, they channel that experience into developing young athletes
              who play smart, stay composed, and thrive in high-stakes moments.
              Their coaching goes beyond W&apos;s. <br />
              It&apos;s about mindset, accountability, and real growth. <br />
              Meet the coaches behind the culture.
            </p>
            <p className="text-lg mb-8 ">
              Head Coach: Nicholas Thomas (
              <a
                className="text-[var(--precision-red)]"
                href="/bios/bio-coach-nicholas-thomas.pdf"
              >
                Download full profile
              </a>
              )
              {/* <br />
              Assistant Coach: Ron&apos; */}
            </p>

            <p className="text-lg mb-8 ">
              W&apos;s still matter. Here&apos;s a summary of their recents
              successes:
            </p>
            <ul>
              <li>🏆 2024 Ontario Cup U17 & U15 Champions</li>
              <li>🏆 2025 Ontario Cup U15 Champions</li>
              <li>
                🏆 3× 1st Place Winners – Mike Suys Memorial Tournament
                (U15/U17)
              </li>
              <li>
                🏆 Podium finishes in over 10 elite-level tournaments
                (2021–2025)
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        id="FAQ"
        className="sectionFAQ flex flex-col items-center  lg:pt-32 pt-32"
      >
        <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 pb-48">
          <h1
            style={{ color: "var(--precision-red)" }}
            className="dela font-extrabold text-4xl lg:text-6xl md:text-5xl mb-0"
          >
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
                <strong>Coaching Staff</strong> Tryouts will be conducted by
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
