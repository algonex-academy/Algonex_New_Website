import React, { useState } from 'react';

const JavaCourse = () => {
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

  // Java-focused modules
  const modules = [
    {
      title: "MODULE 1 : Java Fundamentals",
      topics: [
        "JDK, JRE, JVM architecture and runtime",
        "Syntax, data types, operators, control flow",
        "Methods, overloading, pass-by-value semantics",
        "Arrays, Strings, StringBuilder, immutability",
        "Packages, access modifiers, coding conventions"
      ]
    },
    {
      title: "MODULE 2 : OOP & Core APIs",
      topics: [
        "Classes/objects, encapsulation, inheritance, polymorphism",
        "Abstract classes, interfaces, default/static methods",
        "Enums, records (modern Java), nested classes",
        "java.lang, java.util essentials, wrapper types",
        "Object contracts: equals, hashCode, toString"
      ]
    },
    {
      title: "MODULE 3 : Exceptions & Collections",
      topics: [
        "Checked vs unchecked, try-with-resources, custom exceptions",
        "Collections Framework: List, Set, Map, Queue",
        "Iterators, Comparable vs Comparator",
        "Generics, wildcards, PECS principle",
        "Best practices for defensive copying and null-safety"
      ]
    },
    {
      title: "MODULE 4 : Concurrency & I/O",
      topics: [
        "Threads, synchronization, locks, volatile, atomics",
        "Executors, futures, CompletableFuture",
        "Parallel streams and pitfalls",
        "I/O and NIO.2: files, paths, channels",
        "Serialization basics and alternatives"
      ]
    },
    {
      title: "MODULE 5 : Functional & Streams",
      topics: [
        "Lambdas, method references, functional interfaces",
        "Stream API: map/filter/reduce, collectors",
        "Optional usage patterns and anti-patterns",
        "Date/Time API (java.time) and formatting",
        "Performance considerations with streams"
      ]
    },
    {
      title: "MODULE 6 : Data & Persistence",
      topics: [
        "JDBC: drivers, connections, PreparedStatement, transactions",
        "Connection pooling and resource management",
        "JPA/Hibernate essentials: entities, relationships, queries",
        "Validation with Bean Validation (Jakarta Validation)",
        "Flyway/Liquibase for schema migrations"
      ]
    },
    {
      title: "MODULE 7 : Web & Spring Boot",
      topics: [
        "Servlets/JSP overview and legacy context",
        "Spring Core: beans, DI, configuration",
        "Spring Boot REST: controllers, DTOs, exception handling",
        "Spring Data JPA, pagination, specification pattern",
        "Security basics with Spring Security and JWT"
      ]
    },
    {
      title: "MODULE 8 : Build, Test, Deploy",
      topics: [
        "Maven/Gradle builds, multi-module setup",
        "JUnit 5, Mockito, Testcontainers for integration tests",
        "Quality: SpotBugs, Checkstyle, PMD, Jacoco coverage",
        "Dockerizing Java apps, JVM tuning basics",
        "Deploy to Azure/AWS, CI with GitHub Actions"
      ]
    }
  ];

  // FAQs for Java
  const faqs = [
    {
      question: "What are the prerequisites for this Java course?",
      answer: "No prior Java experience is required; basic programming knowledge helps, and the course starts from fundamentals before advancing to frameworks and full-stack development."
    },
    {
      question: "Which tools and IDEs are used?",
      answer: "The course uses Java 17+, Maven or Gradle, and IDEs like IntelliJ IDEA and Eclipse, with guidance for Visual Studio Code and common debugging workflows."
    },
    {
      question: "What projects are included?",
      answer: "Projects include a console app, JDBC CRUD, a Spring Boot REST API with JWT auth, and a full-stack app integrating a modern frontend with a relational database."
    },
    {
      question: "Does it help with certifications?",
      answer: "Topics align with Oracle Java certifications by covering core language features, OOP, collections, exceptions, and modern APIs frequently tested."
    }
  ];

  // Interview topics for Java
  const interviewQuestions = [
    {
      title: "MODULE 1 : Core Java & OOP",
      description: "Covers object model, access control, immutability, equals/hashCode, and API design trade-offs."
    },
    {
      title: "MODULE 2 : Collections & Generics",
      description: "Focus on choosing proper data structures, comparator strategies, generics variance, and common pitfalls."
    },
    {
      title: "MODULE 3 : Concurrency",
      description: "Threads vs executors, synchronization tools, deadlocks, liveness, and CompletableFuture patterns."
    },
    {
      title: "MODULE 4 : Persistence & REST",
      description: "Transaction management, JPA mapping patterns, N+1 issues, pagination, REST design and error handling."
    },
    {
      title: "MODULE 5 : Testing & Deployment",
      description: "Unit and integration testing with JUnit/Testcontainers, CI pipelines, and containerized deployment basics."
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
                180<br/>downloadable resources
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                125<br/>coding exercises
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                89,247<br/>learners
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#CCF6FF] pt-28 pb-12">
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Java Full Stack Programming</h1>
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
                  A complete pathway from Core Java to Spring Boot and persistence, culminating in deployable full-stack applications with production-ready practices.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Master OOP, collections, exceptions, and modern Java APIs used in enterprise apps.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build reliable data layers with JDBC and JPA/Hibernate and manage transactions safely.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Develop REST services with Spring Boot, validation, security, and pagination patterns.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Test, containerize, and ship Java services to cloud with CI pipelines and quality gates.
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Capstone deliverables include a Spring Boot API with JWT, integration tests, database migrations, and a deployed full-stack app.
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
              <p className="text-gray-600 text-sm">Coming soon! Real outcomes from Java developers and full-stack engineers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JavaCourse;
