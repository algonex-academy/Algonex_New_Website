import React, { useState } from 'react';

const FrontendCourse = () => {
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
            {topics.map((topic, i) => (
              <li key={i} className="text-gray-700 text-sm flex items-start">
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

  // Frontend-focused modules
  const modules = [
    {
      title: "MODULE 1 : Web Foundations",
      topics: [
        "HTML5 semantics, forms, accessibility basics (ARIA, landmarks)",
        "CSS3 fundamentals, Flexbox, Grid, responsive design, TailwindCSS",
        "Modern JavaScript (ES6+): let/const, arrow functions, modules",
        "DOM APIs, events, fetch, async/await, error handling",
        "Tooling: npm, scripts, Prettier, ESLint, Browserslist"
      ]
    },
    {
      title: "MODULE 2 : Advanced CSS & UI",
      topics: [
        "Design systems, tokens, CSS architecture (BEM/ITCSS)",
        "Animations and transitions, transforms, keyframes",
        "Theming, dark mode, CSS variables, container queries",
        "Accessible UI patterns: modals, menus, focus management",
        "Component libraries: Tailwind UI, Radix, Headless UI"
      ]
    },
    {
      title: "MODULE 3 : React Essentials",
      topics: [
        "Functional components, hooks (useState, useEffect, useRef)",
        "Routing with React Router, nested routes, lazy loading",
        "State management: Context, Redux Toolkit, Zustand",
        "Forms with React Hook Form, Zod validation",
        "Data fetching: REST, caching with React Query"
      ]
    },
    {
      title: "MODULE 4 : Angular Essentials",
      topics: [
        "Components, templates, bindings, directives, pipes",
        "Routing, guards, resolvers, standalone components",
        "Services, HttpClient, interceptors, RxJS observables",
        "Forms: Template-driven vs Reactive forms, validation",
        "State management with NgRx signals/store"
      ]
    },
    {
      title: "MODULE 5 : Testing & Quality",
      topics: [
        "Unit testing with Jest/Vitest, mocking strategies",
        "React Testing Library and Angular Testing Utilities",
        "E2E testing with Playwright/Cypress",
        "TypeScript for safety, interfaces, generics, utility types",
        "CI basics: GitHub Actions, test coverage, lint-staged"
      ]
    },
    {
      title: "MODULE 6 : Performance & Accessibility",
      topics: [
        "Core Web Vitals, Lighthouse, bundle analysis",
        "Code splitting, lazy loading, image optimization",
        "Memoization: useMemo/useCallback, React performance",
        "Accessibility audits, keyboard nav, color contrast",
        "Internationalization and localization basics"
      ]
    },
    {
      title: "MODULE 7 : Architecture & APIs",
      topics: [
        "Project structure, feature-driven and monorepos",
        "API integration patterns, error and retry strategies",
        "Authentication: JWT, cookies, OAuth flows",
        "Real-time with WebSockets/SSE, optimistic updates",
        "Security basics: XSS, CSRF, CSP, dependency auditing"
      ]
    },
    {
      title: "MODULE 8 : Build & Deploy",
      topics: [
        "Vite, Webpack, and Nx fundamentals",
        "Env config, secrets management, feature flags",
        "Docker basics for frontend and preview environments",
        "Deploy to Netlify/Vercel/Azure Static Web Apps",
        "Monitoring: Sentry, LogRocket, and analytics hygiene"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I start the frontend course?",
      answer: "Access the dashboard, clone the starter repo, install dependencies, and begin with Module 1 which includes HTML/CSS and modern JavaScript primers."
    },
    {
      question: "Do projects use React or Angular?",
      answer: "Capstone projects include one React SPA and one Angular SPA, covering routing, forms, API integration, state management, testing, and deployment."
    },
    {
      question: "What are the completion checkpoints?",
      answer: "Finish all 8 modules, ship 2 capstones, reach 80%+ on the final assessment, and pass CI with unit and E2E test coverage thresholds."
    },
    {
      question: "Is TypeScript required?",
      answer: "TypeScript is integrated from Module 3 onward, with gradual migration patterns and strict mode for production builds."
    }
  ];

  const interviewQuestions = [
    {
      title: "MODULE 1 : HTML/CSS/JS",
      description: "Box model, stacking contexts, specificity, Flexbox vs Grid, event loop, async/await, and debouncing vs throttling."
    },
    {
      title: "MODULE 2 : React",
      description: "Reconciliation, keys, controlled vs uncontrolled components, Context vs Redux, and React Query caching strategies."
    },
    {
      title: "MODULE 3 : Angular",
      description: "Change detection, RxJS operators, interceptors, route guards, and reactive forms best practices."
    },
    {
      title: "MODULE 4 : Performance",
      description: "Core Web Vitals, code splitting, memoization, prefetching, and avoiding unnecessary re-renders."
    },
    {
      title: "MODULE 5 : Accessibility & Testing",
      description: "Semantic HTML, focus traps, ARIA roles, RTL queries, mocking HTTP, and E2E test flake mitigation."
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
                140<br/>downloadable resources
              </span>
            </div>
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                107<br/>coding exercises
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

      <div className="bg-[#CCF6FF] pt-28 pb-12">
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Frontend Development</h1>
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
                  This comprehensive frontend program covers modern HTML, CSS, and JavaScript with React and Angular tracks, emphasizing performance, accessibility, testing, and production-grade deployment.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build accessible, responsive UIs using semantic HTML, CSS Grid/Flexbox, and TailwindCSS.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Develop SPAs with React and Angular, including routing, forms, and state management.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Ensure quality with TypeScript, unit/E2E testing, and CI workflows.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Optimize performance and deliver production deployments with modern tooling.
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Learners ship two capstone apps—one in React and one in Angular—covering real-world APIs, auth, testing, and cloud deployment.
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
                  {[
                    { title: "HTML/CSS/JS" },
                    { title: "React" },
                    { title: "Angular" },
                    { title: "Performance" },
                    { title: "Accessibility & Testing" }
                  ].map((item, index) => (
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
              <p className="text-gray-600 text-sm">Coming soon! Real stories from frontend engineers and developers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontendCourse;
