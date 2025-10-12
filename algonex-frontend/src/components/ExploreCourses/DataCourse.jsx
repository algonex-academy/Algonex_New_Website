import React, { useState } from 'react';

const DataCourses = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // People Group Icon Component (same for all cards)
  const PeopleGroupIcon = ({ className = "w-12 h-12" }) => (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12 12.75c1.63 0 3.07.39 4.24.9c1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73c1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm2.78 1.58c-.85-.37-1.79-.58-2.78-.58c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57c0-.81-.48-1.53-1.22-1.85zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zM4 8c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm16 0c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3z"/>
    </svg>
  );

  // Module Accordion Component
  const ModuleAccordion = ({ title, topics, index, isExpanded, onToggle }) => (
    <div className="border border-gray-200 rounded-md mb-3">
      <button
        className="w-full bg-blue-50 px-4 py-3 text-left flex justify-between items-center hover:bg-blue-100 transition-colors"
        onClick={() => onToggle(index)}
      >
        <h4 className="text-sm font-medium text-black">{title}</h4>
        <span className="text-gray-500 text-lg">
          {isExpanded ? '−' : '+'}
        </span>
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

  // FAQ Accordion Component
  const FAQAccordion = ({ question, answer, index, isExpanded, onToggle }) => (
    <div className="border border-gray-200 rounded-md mb-3">
      <button
        className="w-full bg-blue-50 px-4 py-3 text-left flex justify-between items-center hover:bg-blue-100 transition-colors"
        onClick={() => onToggle(index)}
      >
        <p className="text-sm text-gray-700">{question}</p>
        <span className="text-gray-500 text-lg">
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 bg-white">
          <p className="text-gray-700 text-sm mt-3 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );

  // Module data (Data-focused)
  const modules = [
    {
      title: "MODULE 1 : Data Foundations",
      topics: [
        "Data lifecycle, roles (Analyst, Engineer, Scientist), and tooling overview",
        "Data types, schemas, and file formats (CSV, JSON, Parquet)",
        "Exploratory analysis with Python and SQL fundamentals",
        "Descriptive statistics and data quality checks",
        "Versioning datasets and notebooks; reproducibility"
      ]
    },
    {
      title: "MODULE 2 : Data Wrangling & SQL",
      topics: [
        "Cleaning, transforming, and joining datasets",
        "Window functions, CTEs, and subqueries in SQL",
        "Performance basics: indexing, query plans, partitioning",
        "Feature extraction and encoding for analytics/ML",
        "Working with APIs and semi-structured data"
      ]
    },
    {
      title: "MODULE 3 : Analytics, BI & Visualization",
      topics: [
        "Analytical modeling: aggregations, cohort, funnel, A/B basics",
        "Dashboards and storytelling principles",
        "KPIs, experimentation metrics, and anomalies",
        "Power BI/Tableau/Metabase overview and best practices",
        "Data governance and documentation for BI"
      ]
    },
    {
      title: "MODULE 4 : Data Engineering & Platforms",
      topics: [
        "ETL/ELT pipelines with orchestration (Airflow, Prefect)",
        "Data warehousing and lakehouse concepts",
        "Batch vs streaming (Kafka, Spark Structured Streaming)",
        "Cloud platforms: BigQuery/Redshift/Snowflake overview",
        "Testing, CI/CD for data, and observability of pipelines"
      ]
    }
  ];

  // FAQ data (Data-focused)
  const faqs = [
    {
      question: "How do I get started with the online classes?",
      answer:
        "Access the dashboard after enrollment, set up Python/SQL environment using the starter guide, and begin with Module 1 for data foundations."
    },
    {
      question: "Where should I search for new code references?",
      answer:
        "Each module includes notebooks, SQL snippets, and links to docs for libraries and databases; a private repo hosts all example code and datasets."
    },
    {
      question: "What are the main checkpoint requirements for finishing?",
      answer:
        "Finish 4 modules, complete 3 projects (SQL analytics, ETL pipeline, BI dashboard), and pass a final assessment with practical tasks."
    },
    {
      question: "Which tools and languages are covered?",
      answer:
        "Focus on Python and SQL with exposure to Airflow/Prefect, Spark fundamentals, and BI tools; cloud examples use BigQuery/Redshift/Snowflake."
    }
  ];

  // Interview Questions data (Data-focused)
  const interviewQuestions = [
    {
      title: "SQL joins and window functions",
      description: "Explain inner/outer joins and use cases for window functions like ROW_NUMBER, RANK, and moving averages."
    },
    {
      title: "ETL vs ELT and orchestration",
      description: "Differentiate ETL and ELT; describe how Airflow/Prefect manage dependencies, retries, and scheduling."
    },
    {
      title: "Data modeling for analytics",
      description: "Discuss star vs snowflake schemas, slowly changing dimensions, and partitioning/clustering strategies."
    },
    {
      title: "Batch vs streaming systems",
      description: "Compare batch processing to streaming; outline typical architectures using Kafka and Spark Structured Streaming."
    },
    {
      title: "Data quality and observability",
      description: "Describe validation checks, anomaly detection, data contracts, and monitoring SLAs for pipelines."
    }
  ];

  return (
    <div className="flex-1 relative">
      {/* Hero Section with Gray Background */}
      <div 
        className="bg-gray-300 min-h-[60vh]"
        style={{
          // backgroundImage: 'url("your-background-image.jpg")',
          // backgroundSize: 'cover',
          // backgroundPosition: 'center'
        }}
      >
        {/* Empty hero section - cards will be positioned absolutely */}
      </div>

      {/* Statistics Cards - Positioned between sections with blue accent line */}
      <div className="absolute top-[50vh] left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="absolute top-[30%] left-0 w-full h-1"></div>
          
          <div className="flex justify-center gap-0 px-4 relative z-10">
            {/* Certificate Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                Certificate<br/>of completion
              </span>
            </div>

            {/* Downloadable Resources Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                140<br/>downloadable resources
              </span>
            </div>

            {/* Coding Exercises Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                107<br/>data exercises
              </span>
            </div>

            {/* Learners Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                67,164<br/>learners
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section - with extra top padding to accommodate floating cards */}
      <div className="bg-[#CCF6FF] pt-28 pb-12">
        {/* Course Title */}
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Data Courses</h1>
        </div>

        {/* Tab Navigation */}
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

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 mx-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Course Overview */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-black">Course Overview</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Build end-to-end data skills across analysis, engineering, and visualization. Learn SQL and Python for
                  exploration, model data for BI and ML, orchestrate reliable pipelines, and deliver dashboards and data
                  products aligned to business outcomes.
                </p>
              </div>

              {/* Course Objectives */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Analyze, transform, and model datasets using SQL and Python with best practices.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Design analytics-ready schemas and optimize queries for scale and cost.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Orchestrate ETL/ELT pipelines with testing, CI/CD, and observability.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build dashboards and communicate insights with clear metrics and stories.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Apply batch and streaming architectures to real business problems.
                  </li>
                </ul>
              </div>

              {/* Highlight Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Become job-ready for data roles by delivering real datasets, pipelines, and dashboards from brief to production.
              </p>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Course Curriculum</h2>
              
              {/* Module Cards with Accordion */}
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

              {/* Common Interview Questions Section */}
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

              {/* Frequently Asked Questions Section */}
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
              <p className="text-gray-600 text-sm">Coming soon! We'll feature amazing testimonials from our Data course graduates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCourses;
