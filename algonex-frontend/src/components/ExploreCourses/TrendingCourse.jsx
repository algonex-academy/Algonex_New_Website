import React, { useState } from 'react';

const TrendingCourse = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const PeopleGroupIcon = ({ className = "w-12 h-12" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12.75c1.63 0 3.07.39 4.24.9c1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73c1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm2.78 1.58c-.85-.37-1.79-.58-2.78-.58c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57c0-.81-.48-1.53-1.22-1.85zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zM4 8c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm16 0c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3z"/>
    </svg>
  );

  const ModuleAccordion = ({ title, topics, index, isExpanded, onToggle }) => (
    <div className="border border-gray-200 rounded-md mb-3">
      <button
        className="w-full bg-blue-50 px-4 py-3 text-left flex justify-between items-center hover:bg-blue-100 transition-colors"
        onClick={() => onToggle(index)}
      >
        <h4 className="text-sm font-medium text-black">{title}</h4>
        <span className="text-gray-500 text-lg">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 bg-white">
          <ul className="space-y-2 mt-3">
            {topics.map((topic, topicIndex) => (
              <li key={topicIndex} className="text-gray-700 text-sm flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const FAQAccordion = ({ question, answer, index, isExpanded, onToggle }) => (
    <div className="border border-gray-200 rounded-md mb-3">
      <button
        className="w-full bg-blue-50 px-4 py-3 text-left flex justify-between items-center hover:bg-blue-100 transition-colors"
        onClick={() => onToggle(index)}
      >
        <p className="text-sm text-gray-700">{question}</p>
        <span className="text-gray-500 text-lg">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 bg-white">
          <p className="text-gray-700 text-sm mt-3 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );

  // Trending tracks combined in one curriculum
  const modules = [
    {
      title: "TRACK 1 : AI/ML Foundations",
      topics: [
        "Python for ML, NumPy, pandas, scikit-learn essentials",
        "Supervised vs unsupervised learning, model selection",
        "Experiment tracking and evaluation metrics",
        "Intro to deep learning with PyTorch/TensorFlow",
        "Model deployment basics and monitoring"
      ]
    },
    {
      title: "TRACK 2 : GenAI & LLMs",
      topics: [
        "Tokenization, embeddings, vector stores",
        "Prompt engineering and retrieval-augmented generation (RAG)",
        "Fine-tuning vs adapters (LoRA/QLoRA) trade-offs",
        "Serving LLMs with APIs, latency and cost controls",
        "Safety, evals, and observability for GenAI apps"
      ]
    },
    {
      title: "TRACK 3 : Cloud & DevOps",
      topics: [
        "Docker, container images, and registries",
        "CI/CD with GitHub Actions/Azure DevOps",
        "IaC overview: Terraform basics and modules",
        "Cloud primitives on AWS/Azure (compute, network, storage)",
        "Security, secrets, and policy-as-code basics"
      ]
    },
    {
      title: "TRACK 4 : Full‑Stack Web (React/Next.js)",
      topics: [
        "React fundamentals, routing, data fetching, forms",
        "Next.js SSR/SSG, app router, caching strategies",
        "State management: Context, RTK/Query, SWR",
        "Authentication, role-based access, and guards",
        "Performance and accessibility best practices"
      ]
    },
    {
      title: "TRACK 5 : Data Engineering",
      topics: [
        "Batch vs streaming pipelines and use-cases",
        "ETL/ELT with Spark or dbt fundamentals",
        "Data modeling: star schema and lakehouse patterns",
        "Orchestration with Airflow, scheduling and retries",
        "Quality checks, lineage, and cost governance"
      ]
    },
    {
      title: "TRACK 6 : Cybersecurity & AppSec",
      topics: [
        "Threat modeling, OWASP Top 10, secure SDLC",
        "Secrets management, SAST/DAST, dependency audits",
        "AuthN/Z patterns (OAuth2/OIDC), session security",
        "CSP, CSRF, XSS/XSRF mitigations, headers",
        "Incident response playbooks and logging hygiene"
      ]
    }
  ];

  // FAQs tailored for a multi-track “Trending” program
  const faqs = [
    {
      question: "How should tracks be selected?",
      answer: "Choose one primary track aligned to current goals and optionally add a secondary track for breadth; example: Full‑Stack as primary and GenAI as secondary."
    },
    {
      question: "Are there capstone projects?",
      answer: "Each track includes a capstone, such as an LLM RAG app, a Next.js full‑stack app, a Spark/dbt pipeline, or a hardened CI/CD release with policies."
    },
    {
      question: "What are the completion requirements?",
      answer: "Finish at least two tracks, deliver corresponding capstones, pass assessments at 80%+, and present a combined portfolio."
    },
    {
      question: "Do you cover deployment?",
      answer: "Yes, deployments are included per track—web apps on Vercel/Azure, services via containers and CI, and data jobs with schedulers and cloud storage."
    }
  ];

  // Interview topics spanning multiple trending areas
  const interviewQuestions = [
    {
      title: "TRACK : AI/ML & GenAI",
      description: "Bias/variance, model evals, vector search, RAG pipelines, prompt patterns, and safe deployment considerations."
    },
    {
      title: "TRACK : Full‑Stack & APIs",
      description: "HTTP fundamentals, REST design, auth flows, caching, SSR vs CSR, and debugging production issues."
    },
    {
      title: "TRACK : DevOps & Cloud",
      description: "CI pipelines, artifacts, rollbacks, IaC patterns, secrets management, and cost/perf trade-offs."
    },
    {
      title: "TRACK : Data Engineering",
      description: "Partitioning, joins, data quality, lineage, orchestration, and incremental processing strategies."
    },
    {
      title: "TRACK : Security & Compliance",
      description: "OWASP risks, least privilege, policy enforcement, audits, and incident response readiness."
    }
  ];

  return (
    <div className="flex-1 relative">
      {/* Hero Section */}
      <div className="bg-gray-300 min-h-[60vh]" />

      {/* Statistics Cards */}
      <div className="absolute top-[50vh] left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="absolute top-[30%] left-0 w-full h-1"></div>
          <div className="flex justify-center gap-0 px-4 relative z-10">
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                Certificate<br/>of completion
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                160<br/>downloadable resources
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                120<br/>practice exercises
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                95,000+<br/>learners
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-[#CCF6FF] pt-28 pb-12">
        {/* Title */}
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Trending Tech Programs</h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'questions', label: "Interview Question's" },
            { id: 'testimonial', label: 'Testimonial' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`text-sm font-medium pb-2 ${
                activeTab === tab.id
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 mx-6">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-black">Program Overview</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  A curated multi‑track program spanning AI/ML, GenAI, Cloud/DevOps, Full‑Stack Web, Data Engineering, and Cybersecurity, designed to build job‑ready projects and portfolios.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Program Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Gain depth in one primary track while developing cross‑disciplinary fluency for real‑world systems.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build production‑minded skills in deployment, security, testing, and performance across tracks.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Deliver capstone projects that demonstrate practical impact, measurable KPIs, and maintainability.
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Each track culminates in a capstone aligned to industry portfolios, with guidance on resumes, interviews, and architecture reviews.
              </p>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Curriculum Tracks</h2>

              <div className="space-y-3">
                {modules.map((module, index) => (
                  <ModuleAccordion
                    key={index}
                    title={module.title}
                    topics={module.topics}
                    index={index}
                    isExpanded={expandedModule === index}
                    onToggle={(idx) => setExpandedModule(expandedModule === idx ? null : idx)}
                  />
                ))}
              </div>

              {/* Interview sections */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-black">Common Interview Areas</h3>
                <div className="space-y-3">
                  {[
                    { title: "AI/ML & GenAI" },
                    { title: "Full‑Stack & APIs" },
                    { title: "DevOps & Cloud" },
                    { title: "Data Engineering" },
                    { title: "Security & Compliance" }
                  ].map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-md">
                      <div className="bg-blue-50 px-4 py-3">
                        <h4 className="text-sm font-medium text-black">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-black">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <FAQAccordion
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      index={index}
                      isExpanded={expandedFaq === index}
                      onToggle={(idx) => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Interview Questions</h2>
              <div className="space-y-4">
                {interviewQuestions.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-black mb-2">{item.title}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonial' && (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-4 text-black">Student Testimonials</h2>
              <p className="text-gray-600 text-sm">Coming soon! Outcomes from engineers switching to high‑impact, in‑demand roles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingCourse;
