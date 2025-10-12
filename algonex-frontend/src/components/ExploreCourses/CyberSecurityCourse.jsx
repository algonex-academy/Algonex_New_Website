import React, { useState } from 'react';

const CyberSecurityCourse = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // People Group Icon Component
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

  // Module data (Cybersecurity)
  const modules = [
    {
      title: "MODULE 1 : Introduction to Cybersecurity",
      topics: [
        "What is Cybersecurity and the CIA triad",
        "Threat taxonomy: malware, phishing, social engineering, DoS/DDoS",
        "Security controls: preventive, detective, corrective",
        "Risk, vulnerability, and exposure basics",
        "Security baselines and system hardening overview"
      ]
    },
    {
      title: "MODULE 2 : Network Security",
      topics: [
        "Network models, protocols, and common ports",
        "Firewalls, IDS/IPS, and zero trust fundamentals",
        "VPNs, secure tunneling, and segmentation",
        "DDoS concepts and mitigation approaches",
        "Secure configurations and patching in networks"
      ]
    },
    {
      title: "MODULE 3 : Cryptography and Data Protection",
      topics: [
        "Symmetric vs asymmetric encryption, key exchange",
        "Hashing, integrity, and message authentication",
        "TLS/HTTPS basics and PKI concepts",
        "Data-at-rest vs data-in-transit protection",
        "Privacy concepts and regulatory awareness"
      ]
    },
    {
      title: "MODULE 4 : Threat Detection & Incident Response",
      topics: [
        "Threat intelligence basics and detection engineering",
        "NIST incident response lifecycle",
        "SIEM triage, alert handling, and use cases",
        "Digital forensics fundamentals and evidence handling",
        "Playbooks and SOC workflows"
      ]
    }
  ];

  // FAQ data (Cybersecurity)
  const faqs = [
    {
      question: "What is cybersecurity and why is it important?",
      answer:
        "Cybersecurity protects systems, networks, and data from threats like malware, phishing, breaches, and service disruption to preserve confidentiality, integrity, and availability."
    },
    {
      question: "What are the types of cyber threats?",
      answer:
        "Common threats include malware (viruses, worms, ransomware), phishing/social engineering, man-in-the-middle, and DoS/DDoS; each targets different technical or human weaknesses."
    },
    {
      question: "How can cybersecurity threats be prevented?",
      answer:
        "Use strong unique passwords with a manager, enable multi-factor authentication, keep software updated, limit admin rights, and avoid suspicious links and attachments."
    },
    {
      question: "What skills are needed for a cybersecurity career?",
      answer:
        "Key skills include networking and OS fundamentals, cryptography basics, SIEM and logging, incident response, vulnerability assessment, and hands-on exposure to firewalls, IDS/IPS, and packet analysis."
    }
  ];

  // Interview Questions data
  const interviewQuestions = [
    {
      title: "What is a firewall and how does it work?",
      description:
        "A firewall enforces traffic policies between trust zones, filtering packets based on rules and state to block unauthorized access while allowing legitimate communication."
    },
    {
      title: "Explain symmetric vs asymmetric encryption.",
      description:
        "Symmetric encryption uses a single shared key and is efficient for bulk data, while asymmetric encryption uses a public/private key pair for encryption, signing, and simplified key exchange."
    },
    {
      title: "What is a Man-in-the-Middle (MITM) attack?",
      description:
        "MITM is the interception and potential alteration of communications between parties, commonly exploiting insecure channels or weak certificate validation."
    },
    {
      title: "What are common types of malware?",
      description:
        "Malware categories include viruses, worms, Trojans, ransomware, spyware, and adware; they differ in propagation, payload, persistence, and objectives."
    }
  ];

  return (
    <div className="flex-1 relative">
      {/* Hero Section with Gray Background */}
      <div
        className="bg-gray-300 min-h-[60vh]"
        style={{
          // backgroundImage: 'url("/cyber-hero.jpg")',
          // backgroundSize: 'cover',
          // backgroundPosition: 'center'
        }}
      >
        {/* Empty hero section - cards will be positioned absolutely */}
      </div>

      {/* Statistics Cards - Positioned between sections */}
      <div className="absolute top-[50vh] left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="absolute top-[30%] left-0 w-full h-1"></div>

          <div className="flex justify-center gap-0 px-4 relative z-10">
            {/* Experts Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                Cybersecurity<br/>experts
              </span>
            </div>

            {/* Labs Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                Hands-on<br/>labs & SIEM
              </span>
            </div>

            {/* Tools Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg border-r border-gray-200">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                Firewalls,<br/>IDS/IPS, PKI
              </span>
            </div>

            {/* Roles Card */}
            <div className="bg-white px-6 py-6 text-center w-[200px] flex flex-col items-center shadow-lg">
              <PeopleGroupIcon className="w-12 h-12 text-black mb-3" />
              <span className="text-xs text-gray-600 font-medium leading-tight">
                SOC-ready<br/>foundations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="bg-[#CCF6FF] pt-28 pb-12">
        {/* Course Title */}
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Cybersecurity</h1>
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 mx-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Course Overview */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-black">Course Overview</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Build practical foundations to defend systems and data, covering threats, controls,
                  cryptography, network security, and incident response through labs and guided exercises
                  aligned with the NIST lifecycle for handling real-world security events.
                </p>
              </div>

              {/* Course Objectives */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Understand core security principles, common threats, and risk fundamentals used across defensive programs.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Secure networks/endpoints with firewalls, IDS/IPS, access control, patching, and baseline hardening.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Apply cryptography for confidentiality, integrity, and authentication using symmetric/asymmetric schemes and hashing.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Monitor and respond using SIEM-driven detection and NIST-aligned incident response practices.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Practice ethical hacking basics for defense readiness with mitigation planning.
                  </li>
                </ul>
              </div>

              {/* Highlight Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Become job-ready for entry security roles with a curriculum that blends fundamentals, tools, and hands-on incident workflows.
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
              <p className="text-gray-600 text-sm">Coming soon! Testimonials from cybersecurity course graduates will be featured here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberSecurityCourse;
