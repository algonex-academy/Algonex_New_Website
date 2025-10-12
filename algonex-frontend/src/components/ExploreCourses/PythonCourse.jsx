import React, { useState } from 'react';

const PythonCourse = () => {
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

  // Module data
  const modules = [
    {
      title: "MODULE 1 : Python Basics",
      topics: [
        "Introduction to Python programming",
        "Variables, data types, and operators",
        "Control structures (if/else, loops)",
        "Functions and scope",
        "Error handling and debugging"
      ]
    },
    {
      title: "MODULE 2 : Data Structures",
      topics: [
        "Lists, tuples, and dictionaries",
        "Sets and their operations",
        "String manipulation techniques",
        "File handling and I/O operations",
        "Working with JSON data"
      ]
    },
    {
      title: "MODULE 3 : Libraries & Applications",
      topics: [
        "NumPy for numerical computing",
        "Pandas for data analysis",
        "Matplotlib for data visualization",
        "Web scraping with BeautifulSoup",
        "API integration and requests"
      ]
    },
    {
      title: "MODULE 4 : Projects & Deployment",
      topics: [
        "Building real-world projects",
        "Version control with Git",
        "Testing and code quality",
        "Deployment strategies",
        "Best practices and optimization"
      ]
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How do I get started with the online classes?",
      answer: "You can start immediately after enrollment. Access your course dashboard, download materials, and begin with Module 1. Our support team is available 24/7 to help you get started."
    },
    {
      question: "Where should I search for new code references?",
      answer: "We provide a comprehensive resource library with code examples, documentation links, and recommended external resources. You'll also have access to our private GitHub repository with all course code."
    },
    {
      question: "What are the main checkpoint requirements for finishing?",
      answer: "To complete the course, you need to: complete all 4 modules, submit 3 hands-on projects, pass the final assessment with 80% score, and participate in the capstone project presentation."
    },
    {
      question: "What programming languages will we learn from?",
      answer: "This course focuses primarily on Python, but you'll also learn complementary technologies including HTML/CSS for web development, SQL for databases, and basic JavaScript for full-stack understanding."
    }
  ];

  // Interview Questions data
  const interviewQuestions = [
    {
      title: "MODULE 1 : Python Basics",
      description: "Covers fundamental concepts including variables, data types, control structures, and basic programming principles."
    },
    {
      title: "MODULE 2 : Data Structures", 
      description: "Deep dive into Python's built-in data structures and their practical applications."
    },
    {
      title: "MODULE 3 : OOP in Python",
      description: "Object-oriented programming concepts, classes, inheritance, and design patterns."
    },
    {
      title: "MODULE 4 : File Handling & Exceptions",
      description: "Working with files, exception handling, and error management techniques."
    },
    {
      title: "MODULE 5 : Database Applications",
      description: "Connecting Python with databases, SQL integration, and data persistence."
    }
  ];

  return (
    <div className="flex-1 relative">
      {/* Hero Section with Gray Background */}
      <div 
        className="bg-gray-300 min-h-[60vh]"
        style={{
          // Add background image here later like:
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
                107<br/>coding exercises
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
          <h1 className="text-4xl font-bold text-black">Python Programming</h1>
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
                  Python is a versatile, beginner-friendly, and powerful programming language used in web 
                  development, data science, automation, AI/ML, and more. This course provides students 
                  with a strong foundation in Python programming, hands-on projects, and industry-
                  relevant applications to make them job-ready.
                </p>
              </div>

              {/* Course Objectives */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build strong fundamentals in Python programming.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Learn to write efficient, clean, and reusable code.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Work with data handling, file operations, and error management.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Gain exposure to web, automation, and data science applications.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Prepare for interviews and real-world project scenarios.
                  </li>
                </ul>
              </div>

              {/* Highlight Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Boost your Python expertise with Python Online Training. Our Python Online Training offers 
                a complete curriculum and practical applications.
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
              <p className="text-gray-600 text-sm">Coming soon! We'll feature amazing testimonials from our Python course graduates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PythonCourse;
