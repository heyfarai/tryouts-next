import React from "react";
import Image from "next/image";

const SectionFAQ: React.FC = () => {
  return (
    <div
      id="FAQ"
      className="sectionFAQ flex flex-col items-center  lg:pt-32 pt-32"
    >
      <div className="sectionContent w-full lg:w-[68%] lg:ml-24 max-w-[640px] px-6 pb-48">
        <h1
          style={{ color: "var(--precision-red)" }}
          className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl mb-0"
        >
          FAQs.
        </h1>
        <h1 className="alexandria font-extrabold text-4xl lg:text-6xl md:text-5xl mt-0 mb-0">
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
                <li>Assessment of athletic abilities and basketball skills</li>
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
              Financial assistance is available on a case by case basis. Contact
              us at{" "}
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
  );
};

export default SectionFAQ;
