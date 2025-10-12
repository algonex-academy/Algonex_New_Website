import React, { useState } from 'react';

const ExcelCourse = () => {
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

  const modules = [
    {
      title: "MODULE 1 : Excel Fundamentals",
      topics: [
        "Excel interface, ribbons, quick access toolbar, and workbooks",
        "Data entry best practices, number formats, custom formats",
        "Relative vs absolute references, named ranges",
        "Sorting, filtering, custom sort, remove duplicates",
        "Data validation, drop-down lists, and conditional formatting basics"
      ]
    },
    {
      title: "MODULE 2 : Core Functions & Formulas",
      topics: [
        "Text functions: LEFT, RIGHT, MID, TRIM, LEN, TEXTSPLIT, TEXTJOIN",
        "Date/Time: TODAY, NOW, EOMONTH, DATEDIF, WORKDAY, NETWORKDAYS",
        "Math/Stats: SUMIFS, AVERAGEIFS, COUNTIFS, SUBTOTAL, AGGREGATE",
        "Lookup/X functions: VLOOKUP, INDEX+MATCH, XLOOKUP, XMATCH",
        "Dynamic arrays: FILTER, SORT, UNIQUE, SEQUENCE, TAKE/DROP"
      ]
    },
    {
      title: "MODULE 3 : Data Cleaning & Analysis",
      topics: [
        "Power Query: importing, shaping, merging, appending",
        "Table design, structured references, and slicers",
        "What-If Analysis: Goal Seek, Scenario Manager, Data Tables",
        "PivotTables: grouping, calculated fields, field settings",
        "PivotCharts and advanced conditional formatting rules"
      ]
    },
    {
      title: "MODULE 4 : Dashboards & Visualization",
      topics: [
        "Chart selection: column, line, combo, waterfall, sparklines",
        "KPI cards, gauges, and trend indicators with formulas",
        "Interactive dashboards with slicers and timelines",
        "Design systems: color, typography, and layout grids",
        "Publishing, protecting, and performance optimization"
      ]
    },
    {
      title: "MODULE 5 : Automation with VBA",
      topics: [
        "VBA editor, modules, procedures, and macro recorder",
        "Variables, loops, conditions, and error handling",
        "Working with ranges, sheets, and events",
        "UserForms, controls, and basic applications",
        "Best practices, security, and deployment"
      ]
    },
    {
      title: "MODULE 6 : Excel for Finance & Ops",
      topics: [
        "Financial models: NPV, IRR, PMT, amortization schedules",
        "Forecasting: moving averages, growth rates, trendlines",
        "Budgeting templates and variance analysis",
        "Inventory and sales dashboards for operations",
        "Power Pivot with DAX fundamentals (SUMX, CALCULATE)"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do the online Excel classes start?",
      answer: "Access begins immediately after enrollment with a guided orientation file, starter datasets, and a practice workbook to begin with Module 1 fundamentals."
    },
    {
      question: "Where can new Excel templates and examples be found?",
      answer: "The course library includes ready-to-use templates, function cheat sheets, and a private repo containing dashboard samples and VBA snippets."
    },
    {
      question: "What are the completion requirements?",
      answer: "Complete all 6 modules, build 2 dashboards, finish 1 Power Query case study, pass a final quiz with 80%+, and submit a capstone Excel model."
    },
    {
      question: "Which versions of Excel are supported?",
      answer: "The course supports Microsoft 365 and Excel 2019+ with guidance for Excel 2016, highlighting differences for Dynamic Array and XLOOKUP features."
    }
  ];

  const interviewQuestions = [
    {
      title: "MODULE 1 : Excel Basics",
      description: "Covers cell referencing, formatting, tables, and data validation essentials used in analytics workflows."
    },
    {
      title: "MODULE 2 : Formulas & Lookups",
      description: "Focuses on SUMIFS vs COUNTIFS, INDEX+MATCH vs XLOOKUP, and handling errors with IFERROR."
    },
    {
      title: "MODULE 3 : Pivot & Power Query",
      description: "Explores PivotTables, Power Query transformations, merging datasets, and refresh automation."
    },
    {
      title: "MODULE 4 : Dashboards",
      description: "Discusses KPI design, chart selection, interactivity with slicers, and layout best practices."
    },
    {
      title: "MODULE 5 : VBA & Automation",
      description: "Introduces macros, loops, events, and building simple tools to automate repetitive tasks."
    }
  ];

  return (
    <div className="flex-1 relative">
      <div className="bg-gray-300 min-h-[60vh]" />
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
                120<br/>downloadable resources
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                95<br/>practice exercises
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                80,000+<br/>learners
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#CCF6FF] pt-28 pb-12">
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Microsoft Excel Mastery</h1>
        </div>

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

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 mx-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-black">Course Overview</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Excel is the industry standard for analysis, reporting, dashboards, and automation across finance, operations, marketing, and data roles, and this course builds practical skills from fundamentals to advanced analytics with hands-on projects and templates.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Master core functions, dynamic arrays, and modern lookups for reliable models.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Clean, transform, and combine data using Tables, PivotTables, and Power Query.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build interactive dashboards with slicers, timelines, and effective visual design.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Automate repetitive tasks using VBA macros and robust best practices.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Apply Excel in finance and operations with templates for real business scenarios.
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Gain job-ready Excel skills through a structured curriculum, practice datasets, and capstone projects designed for analysts, developers, and business professionals.
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
              <p className="text-gray-600 text-sm">Coming soon! Real outcomes from Excel practitioners and analysts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelCourse;
