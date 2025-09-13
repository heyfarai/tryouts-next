import React from "react";
import Image from "next/image";

const sponsors = [
  {
    href: "https://dki.ca/",
    imgSrc: "/sponsors/sponsor-DKI.png",
    alt: "Disaster Kleenup International - a large disaster restoration contracting organization in North America.",
    width: 128,
    height: 52,
  },
  {
    href: "https://jessicathomas.ca/",
    imgSrc: "/sponsors/sponsor-JessicaThomas.png",
    alt: "Jessica Thomas - Fine Art Photography Ottawa. Book a portrait session.",
    width: 154,
    height: 52,
  },
  {
    href: "https://www.chezziespatties.ca/",
    imgSrc: "/sponsors/sponsor-Chezzies.png",
    alt: "Chezzies Patties, Toronto - Savor the vegan delight. Order today.",
    width: 50,
    height: 52,
  },
  {
    href: "https://verdunwindows.com",
    imgSrc: "/sponsors/sponsor-Verdun.png",
    alt: "Verdun Windows -  Windows and Doors Made in Canada.",
    width: 65,
    height: 65,
  },
];

const SectionSponsors: React.FC = () => {
  return (
    <div
      id="sponsors"
      className="sectionSponsors flex flex-col items-center lg:pt-6 pt-6"
    >
      <p className="text-center mb-12">
        Our sponsors support us.
        <br /> Please support them.
      </p>
      <div className="flex flex-wrap justify-center gap-y-6 items-center mb-12">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.href}
            href={sponsor.href}
            title={sponsor.alt}
            className="hover:opacity-80 transition mx-4 cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={sponsor.imgSrc}
              alt={sponsor.alt}
              width={sponsor.width}
              height={sponsor.height}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SectionSponsors;
