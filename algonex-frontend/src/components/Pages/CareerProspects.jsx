import React from "react";

const CareerProspects = () => {
  const stats = [
    { value: "6 LPA", label: "Top Average Placement Package" },
    { value: "500+", label: "Trained Alumni Countless Success Stories" },
    { value: "50+", label: "Hiring Partners including MNC’s" },
    { value: "25+", label: "Hackathons Building Problem-Solvers" },
  ];

  return (
    <section className="bg-[#e6f8fc] py-12 px-4 text-center w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Stellar Career Prospects
        </h2>
        <p className="text-gray-600 text-sm tracking-wider mb-8">
          LAUNCH YOUR CAREER WITH PROVEN SUCCESS
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-sky-600 text-white px-4 py-8 rounded-lg shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg mr-[45px] 
              ${stat.value === "500+" ? "ml-[20px] mr-[20px] w-[85%]" : "w-[60%]"}
              ${stat.value === "25+" ? "ml-[20px]" : ""}
              mx-auto`}
          >
            <h3 className="text-4xl font-bold mb-2 -mt-7">{stat.value}</h3>
            <p className="text-sm leading-5 -mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CareerProspects;
