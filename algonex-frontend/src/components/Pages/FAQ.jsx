import React from "react";

const FAQ = () => {
  const faqs = [
    "How do I know which career path is right for me?",
    "Where should I search for jobs and internships?",
    "What are the most common interview questions for freshers?",
    "How do I prepare for technical interviews?",
    "Which programming languages should I learn first?",
  ];

  return (
    <div className="bg-[#e6f7fb] py-10 px-5 text-center font-sans w-full">
      <h2 className="text-2xl font-bold mb-8 text-black">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-5 items-center">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="w-4/5 max-w-2xl bg-white px-5 py-4 border border-[#00cfff] rounded-xl text-base text-black cursor-pointer transition-all duration-300 text-center"
          >
            {faq}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
