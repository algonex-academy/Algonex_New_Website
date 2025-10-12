import React, { useState } from 'react';

const TestingCourse = () => {
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

  // Testing-focused modules
  const modules = [
    {
      title: "MODULE 1 : Testing Foundations",
      topics: [
        "SDLC vs STLC, test pyramid, shift-left testing",
        "Test levels: unit, integration, system, UAT",
        "Test types: functional, non-functional, regression, smoke",
        "Test artifacts: test plan, test cases, traceability matrix",
        "Defect lifecycle, severity vs priority, RCA basics"
      ]
    },
    {
      title: "MODULE 2 : Test Design Techniques",
      topics: [
        "Equivalence partitioning and boundary value analysis",
        "Decision tables and state transition testing",
        "Use case testing, exploratory testing, charters",
        "Risk-based testing, prioritization strategies",
        "Checklist-driven and heuristic testing"
      ]
    },
    {
      title: "MODULE 3 : Web UI Automation",
      topics: [
        "Selenium WebDriver fundamentals and locators",
        "Page Object Model and Page Factory patterns",
        "Waits, synchronization, flaky test mitigation",
        "Cypress basics: commands, assertions, fixtures",
        "Playwright: cross-browser, trace viewer, parallel runs"
      ]
    },
    {
      title: "MODULE 4 : API Testing & Contract",
      topics: [
        "REST fundamentals: verbs, status codes, idempotency",
        "Postman collections, environments, Newman CLI",
        "REST Assured with Java: specs, auth, serialization",
        "Contract testing with Pact and provider verification",
        "Mock servers, test data management strategies"
      ]
    },
    {
      title: "MODULE 5 : Unit Testing & TDD",
      topics: [
        "Testing strategies for pure functions and side effects",
        "Jest/Vitest for JS, JUnit 5 for Java basics",
        "Mocking, spies, stubs; test doubles best practices",
        "TDD workflow: red-green-refactor with examples",
        "Code coverage: lines, branches, mutation testing intro"
      ]
    },
    {
      title: "MODULE 6 : Performance & Reliability",
      topics: [
        "JMeter basics: thread groups, samplers, listeners",
        "Load, stress, soak, and spike testing scenarios",
        "k6 scripting with JS and CI integration",
        "Bottleneck analysis and scalability considerations",
        "SLOs, SLIs, SLAs and basic observability hooks"
      ]
    },
    {
      title: "MODULE 7 : CI/CD & Quality Gates",
      topics: [
        "Test execution in pipelines (GitHub Actions/Azure DevOps)",
        "Parallelization, retries, artifacts, and test reports",
        "Static analysis: ESLint/Checkstyle/SpotBugs",
        "Security scans and dependency auditing",
        "Quality gates with coverage and lint thresholds"
      ]
    },
    {
      title: "MODULE 8 : Best Practices & Frameworks",
      topics: [
        "Data-driven and keyword-driven frameworks",
        "Config, environment handling, secrets in tests",
        "Visual testing intro (Playwright/Selenium + tools)",
        "Accessibility checks and Lighthouse integration",
        "Test documentation and living specs with BDD (Cucumber)"
      ]
    }
  ];

  // FAQs tailored for Testing
  const faqs = [
    {
      question: "What are the prerequisites?",
      answer: "Basic programming knowledge is helpful; the course starts from testing fundamentals and ramps into automation with Selenium/Cypress and API testing."
    },
    {
      question: "Which tools are covered?",
      answer: "Selenium, Cypress, Playwright, Postman, REST Assured, JMeter, Jest/JUnit, and CI with GitHub Actions or Azure DevOps are included with practical labs."
    },
    {
      question: "What are the completion requirements?",
      answer: "Finish all 8 modules, automate a UI flow, create an API test suite, run a load test, and integrate tests into a CI pipeline with reports."
    },
    {
      question: "Do you include BDD?",
      answer: "Yes, BDD with Cucumber is introduced, including Gherkin scenarios, step definitions, and living documentation practices."
    }
  ];

  // Interview topics for Testing
  const interviewQuestions = [
    {
      title: "MODULE 1 : Test Strategies",
      description: "Test pyramid rationale, shift-left benefits, risk-based testing, and selecting the right test types."
    },
    {
      title: "MODULE 2 : Automation Design",
      description: "Locator strategies, POM, flaky tests handling, waits vs sleeps, and cross-browser considerations."
    },
    {
      title: "MODULE 3 : API & Contracts",
      description: "Idempotency, pagination, auth flows, contract testing with Pact, and consistent test data strategies."
    },
    {
      title: "MODULE 4 : Performance Testing",
      description: "Load models, bottleneck identification, interpreting reports, and integrating performance checks in CI."
    },
    {
      title: "MODULE 5 : CI & Quality",
      description: "Test parallelization, artifacts, coverage thresholds, linting, and security scans in pipelines."
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
                140<br/>downloadable resources
              </span>
            </div>

            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                107<br/>practice exercises
              </span>
            </div>

            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                67,164<br/>learners
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-[#CCF6FF] pt-28 pb-12">
        {/* Course Title */}
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Software Testing & Automation</h1>
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-black">Course Overview</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  A hands-on journey from testing fundamentals to automation for UI and APIs, performance checks, and CI integration, focusing on building stable, reliable test suites for production environments.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Design effective test cases using proven techniques and maintain clear test artifacts.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build resilient UI automation with Selenium/Cypress/Playwright and API suites with Postman/REST Assured.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Implement performance tests with JMeter or k6 and interpret key metrics.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Integrate tests into CI with reports, quality gates, and actionable feedback loops.
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Capstones include an automated UI regression pack, an API test suite with environments, and a pipeline executing tests with artifacts and coverage.
              </p>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Course Curriculum</h2>

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

              {/* Common Interview Questions */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-black">Common Interview Questions</h3>
                <div className="space-y-3">
                  {interviewQuestions.map((item, index) => (
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

          {/* Interview Questions Tab */}
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

          {/* Testimonial Tab */}
          {activeTab === 'testimonial' && (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-4 text-black">Student Testimonials</h2>
              <p className="text-gray-600 text-sm">Coming soon! Results from QA engineers and SDETs who automated end-to-end workflows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestingCourse;
