import React from "react";

const CoachingSection = () => (
  <div
    id="coaching"
    className="sectionCoaching bg-size-[auto_40%] md:bg-size-[auto_60%] lg:bg-cover bg-position-[70%_0] md:bg-position-[20%_0]  flex flex-col items-center  lg:pt-32 pt-32"
  >
    <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 pb-48 pt-48 md:pt-16 bg-auto ">
      <h1 className="hidden alexandria font-extrabold text-4xl lg:text-5xl md:text-5xl mb-0 text-shadow-stone-400 md:text-[var(--precision-red)]">
        Our coach.
      </h1>
      <h1 className="alexandria font-extrabold text-4xl lg:text-5xl md:text-5xl mt-0 mb-12">
        Coach Nicholas.
      </h1>
      <p className="text-lg mb-8 w-[60%]">
        We don&apos;t do parent coaches. We have a military vet with decades of
        experience. One mission: develop disciplined, confident players who love
        the game.
      </p>
      <p className="text-lg mb-8 ">
        Coach Nicholas brings decades of high-level basketball experience, on
        the court, on the bench, and in uniform. He competed at national and
        international levels as a member of Canadian military teams, earning a
        reputation for toughness, precision, and performance under pressure.
      </p>
      <p className="text-lg mb-8 ">
        Now, he channels that experience into developing young athletes who play
        smart, stay composed, and thrive in high-stakes moments. His coaching
        goes beyond W&apos;s. <br />
        It&apos;s about self-respect, mindset, accountability, and real growth.{" "}
        <br />
        Meet the coach behind the culture.
      </p>
      <p className="text-lg mb-8 ">
        Head Coach: Nicholas Thomas (
        <a
          className="text-[var(--precision-red)]"
          href="/bios/bio-coach-nicholas-thomas.pdf"
        >
          Download full PDF bio
        </a>
        )
      </p>
      <p className="text-lg mb-8 ">
        W&apos;s still matter. Here&apos;s just a few of his recent successes:
      </p>
      <ul>
        <li>🏆 2024 Ontario Cup U17 Champions</li>
        <li>🏆 2025 Ontario Cup U15 Champions</li>
        <li>🏆 2× 1st Place – Mike Suys Memorial Tournament (U15/U17)</li>
        <li>🏆 10+ Podium finishes in AAA-level tournaments (2021–2025)</li>
      </ul>
    </div>
  </div>
);

export default CoachingSection;
