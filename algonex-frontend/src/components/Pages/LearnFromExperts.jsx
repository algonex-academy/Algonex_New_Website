import React from "react";

const steps = [
  {
    number: "01",
    title: "FOUNDATION FIRST",
    text: "Master core concepts with clarity and build confidence in fundamentals",
  },
  {
    number: "02",
    title: "SKILL UP",
    text: "Learn by doing through guided exercises and industry technologies",
  },
  {
    number: "03",
    title: "BUILD TO SOLVE",
    text: "Solve real-world challenges and create portfolio-ready work",
  },
  {
    number: "04",
    title: "GROW WITH EXPERTS",
    text: "Mentorship & Masterclasses, Learn from industry leaders, Get personalized feedback",
  },
  {
    number: "05",
    title: "BEYOND CLASS ROOMS",
    text: "Community & Support Forums, peer reviews, and career guidance. Lifetime access to updates",
  },
];

const LearnFromExperts = () => {
  return (
    <section className="bg-[#e6f8fc] py-12 px-5 font-sans w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-[#222]">Learn From Experts</h2>
        <p className="text-gray-600 text-sm mt-2 tracking-wider">
          YOUR JOURNEY TOWARDS YOUR DREAM COMPANY
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto py-5">
        {/* Vertical Line */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-190 bg-[#2bb7de]"></div>

        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex w-full items-start my-12"
          >
            {/* Timeline Item */}
            <div
              className={`w-[45%] ${
                index % 2 === 0
                  ? "mr-auto text-right pr-8"
                  : "ml-auto text-left pl-8"
              }`}
            >
              <div className="bg-white border-2 border-[#5fc0db] rounded-lg p-5 shadow-md inline-block">
                <h3 className="italic font-bold text-[26px] leading-[44px] bg-gradient-to-r from-[#00B7DC] via-[#FF2A7D] to-[#FFB000] bg-clip-text text-transparent">
                  {step.title}
                </h3>
                <p className="text-sm text-[#444] leading-relaxed mt-2">
                  {step.text}
                </p>
              </div>
            </div>

            {/* Circle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 bg-[#5fc0db] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm z-10">
              {step.number}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearnFromExperts;
