import React from "react";
import Image from "next/image";

const SectionSponsors: React.FC = () => {
  return (
    <div
      id="sponsors"
      className="sectionSponsors flex flex-col items-center  lg:pt-6 pt-6"
    >
      <p className="text-center mb-12">
        We&apos;re grateful to our sponsors. <br /> They support us. Please
        visit and support them.
      </p>
      <div className="flex flex-wrap justify-center gap-y-6 mb-12">
        <a
          href="https://dki.ca/"
          className="hover:opacity-80 transition"
        >
          <Image
            src="/sponsors/sponsor-DKI.png"
            alt="DKI Sponsor"
            width={120}
            height={39}
          />
        </a>
      </div>
    </div>
  );
};

export default SectionSponsors;
