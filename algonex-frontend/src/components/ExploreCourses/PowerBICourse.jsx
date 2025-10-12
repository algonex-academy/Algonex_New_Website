import React, { useState } from 'react';

const PowerBICourse = () => {
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

  // Power BI–focused modules
  const modules = [
    {
      title: "MODULE 1 : Power BI Fundamentals",
      topics: [
        "Power BI Desktop vs Service vs Mobile",
        "Connecting to files, databases, and web APIs",
        "Import vs DirectQuery vs Live Connection",
        "Basic transformations and data types",
        "Report canvas, visuals, and interactions"
      ]
    },
    {
      title: "MODULE 2 : Power Query (ETL)",
      topics: [
        "M language basics and applied steps",
        "Cleaning data: split, merge, pivot/unpivot",
        "Combining queries: merge vs append",
        "Parameterization and query functions",
        "Incremental refresh overview"
      ]
    },
    {
      title: "MODULE 3 : Data Modeling",
      topics: [
        "Star schema design and dimension/fact tables",
        "Relationships, cardinality, filter directions",
        "Calculated columns vs measures",
        "Role-playing dimensions and inactive relationships",
        "Model performance and size optimization"
      ]
    },
    {
      title: "MODULE 4 : DAX Essentials",
      topics: [
        "Row vs filter context, context transition",
        "CALCULATE, FILTER, ALL, ALLEXCEPT",
        "Time intelligence: DATEADD, TOTALYTD, SAMEPERIODLASTYEAR",
        "Iterators: SUMX, AVERAGEX, RANKX",
        "Common patterns: dynamic titles, KPI flags, TOPN"
      ]
    },
    {
      title: "MODULE 5 : Visualization & UX",
      topics: [
        "Choosing the right chart and custom visuals",
        "Bookmarks, buttons, drillthrough, and tooltips",
        "Field parameters for dynamic measures/dimensions",
        "Theming, layout grids, and accessibility",
        "Report navigation and storytelling"
      ]
    },
    {
      title: "MODULE 6 : Performance & Governance",
      topics: [
        "Performance Analyzer and DAX Studio basics",
        "Composite models and aggregations",
        "Security: Row-Level Security and object-level security",
        "Sensitivity labels and dataset endorsements",
        "Deployment pipelines and workspace roles"
      ]
    },
    {
      title: "MODULE 7 : Power BI Service",
      topics: [
        "Publishing reports and managing datasets",
        "Gateways for on-premises data sources",
        "Scheduled refresh and dataflows",
        "Apps, sharing, and permissions",
        "Usage metrics and audit logs"
      ]
    },
    {
      title: "MODULE 8 : Advanced & Integration",
      topics: [
        "Paginated reports basics",
        "Python/R visuals and scripts",
        "Real-time dashboards with push datasets and streaming",
        "Power Automate and Teams integration",
        "Embedding Power BI in web apps"
      ]
    }
  ];

  // FAQs tailored for Power BI
  const faqs = [
    {
      question: "What are the prerequisites?",
      answer: "Basic Excel or SQL knowledge helps, but the course starts from fundamentals and gradually introduces modeling, DAX, and service workflows."
    },
    {
      question: "Will this cover data modeling best practices?",
      answer: "Yes, the course emphasizes star schema design, relationship management, and performance optimization with proven patterns."
    },
    {
      question: "Do projects include real datasets?",
      answer: "Yes, capstones use realistic sales, finance, and operations datasets with requirements to build models, measures, and interactive dashboards."
    },
    {
      question: "Is Power BI Service included?",
      answer: "Publishing, refresh, RLS, deployment pipelines, and app distribution in the Service are covered with step-by-step guidance."
    }
  ];

  // Interview topics for Power BI
  const interviewQuestions = [
    {
      title: "MODULE 1 : Modeling & Schema",
      description: "Star vs snowflake, relationships, inactive joins, and filter propagation strategies."
    },
    {
      title: "MODULE 2 : DAX & Context",
      description: "Context transition, CALCULATE, ALL variants, iterators, and time intelligence trade-offs."
    },
    {
      title: "MODULE 3 : Power Query",
      description: "M transformations, query folding, parameters, and incremental refresh considerations."
    },
    {
      title: "MODULE 4 : Performance & RLS",
      description: "Aggregation tables, composite models, Performance Analyzer, and secure RLS design."
    },
    {
      title: "MODULE 5 : Service & Deployment",
      description: "Gateways, dataflows, refresh strategies, workspace roles, and deployment pipelines."
    }
  ];

  return (
    <div className="flex-1 relative">
      {/* Hero Section */}
      <div className="bg-gray-300 min-h-[60vh]" />

      {/* Stats Cards */}
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
                130<br/>downloadable resources
              </span>
            </div>

            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                90<br/>practice exercises
              </span>
            </div>

            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                72,500+<br/>learners
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Section */}
      <div className="bg-[#CCF6FF] pt-28 pb-12">
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Power BI Mastery</h1>
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
                <h2 className="text-xl font-semibold mb-3 text-black">Course Overview</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  A practical path from data import and transformation to robust data models, DAX measures, and interactive dashboards, ending with governed deployment in the Power BI Service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Clean and combine data using Power Query and proven ETL patterns for reliable refreshes.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Design star schemas, manage relationships, and write efficient DAX for KPIs and time intelligence.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build accessible, performant reports with drillthrough, bookmarks, and dynamic visuals.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Publish, secure, and automate deployments with RLS, dataflows, and deployment pipelines.
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Capstones include a sales analytics dashboard, finance time-intelligence model, and a governed release through the Power BI Service.
              </p>
            </div>
          )}

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
              <p className="text-gray-600 text-sm">Coming soon! Success stories from Power BI analysts and developers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PowerBICourse;
