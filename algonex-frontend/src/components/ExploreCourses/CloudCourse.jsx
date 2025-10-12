import React, { useState } from 'react';

const CloudCourse = () => {
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

  // Module data (Cloud)
  const modules = [
    {
      title: "MODULE 1 : Cloud Foundations",
      topics: [
        "Cloud models: public, private, hybrid; IaaS, PaaS, SaaS",
        "Global infrastructure: regions, AZs, edge, networking basics",
        "Identity and access management fundamentals (IAM)",
        "Compute, storage, and databases overview (AWS/Azure/GCP)",
        "Shared responsibility model and cloud pricing basics"
      ]
    },
    {
      title: "MODULE 2 : Core Services & Networking",
      topics: [
        "Compute services: VMs, autoscaling, images, spot/preemptible",
        "Storage: object (S3/Blob/GCS), block (EBS/Disk), file (EFS/FSx)",
        "Databases: managed SQL (RDS/Azure SQL/Cloud SQL), NoSQL (DynamoDB/Cosmos/Firestore)",
        "Virtual networks, subnets, routing, security groups/NSGs, load balancers",
        "Hybrid connectivity: VPN, Direct Connect/ExpressRoute/Interconnect"
      ]
    },
    {
      title: "MODULE 3 : Containers, Serverless & IaC",
      topics: [
        "Containers and orchestration: Docker, EKS/AKS/GKE fundamentals",
        "Serverless compute: Lambda/Azure Functions/Cloud Functions",
        "Event-driven patterns and managed messaging (SQS/SNS, Service Bus, Pub/Sub)",
        "Infrastructure as Code: CloudFormation, Terraform, ARM/Bicep",
        "CI/CD pipelines and artifact registries"
      ]
    },
    {
      title: "MODULE 4 : Reliability, Cost & Security",
      topics: [
        "Well-Architected pillars: reliability, performance, cost, security, operations, sustainability",
        "Monitoring and observability: CloudWatch/Azure Monitor/Cloud Monitoring",
        "Backup, DR, multi-AZ and multi-region strategies",
        "Cost optimization: right-sizing, autoscaling, savings plans/committed use",
        "Cloud security basics: KMS/Key Vault/KMS, encryption at rest/in transit"
      ]
    }
  ];

  // FAQ data (Cloud)
  const faqs = [
    {
      question: "How do I get started with the online classes?",
      answer:
        "Access is immediate after enrollment. Begin with Cloud Foundations, set up a free-tier account on a provider, and follow the environment setup guide and labs."
    },
    {
      question: "Where should I search for new cloud references?",
      answer:
        "Each module links to AWS, Azure, and GCP docs and provides sample templates for CloudFormation and Terraform, plus CLI scripts for common workflows."
    },
    {
      question: "What are the main checkpoint requirements for finishing?",
      answer:
        "Complete all 4 modules, deploy two workloads (containerized app and serverless function), pass the final assessment, and publish an IaC-based deployment with monitoring."
    },
    {
      question: "Which platforms will we learn from?",
      answer:
        "Concepts are provider-agnostic with hands-on examples on AWS, Azure, and GCP, covering IAM, networking, storage, databases, containers, and serverless."
    }
  ];

  // Interview Questions data (Cloud)
  const interviewQuestions = [
    {
      title: "IaaS vs PaaS vs SaaS",
      description:
        "Explain control boundaries, common use cases, and migration considerations when selecting service models across providers."
    },
    {
      title: "Well-Architected pillars",
      description:
        "Summarize the six pillars and provide examples of decisions that impact reliability, security, performance, cost, operations, and sustainability."
    },
    {
      title: "Kubernetes vs Serverless",
      description:
        "Compare operational overhead, cost profiles, and scaling behavior for container orchestration versus event-driven serverless functions."
    },
    {
      title: "Designing multi-region DR",
      description:
        "Outline RPO/RTO targets, active-passive vs active-active patterns, data replication, health checks, and failover automation."
    },
    {
      title: "Cloud networking essentials",
      description:
        "Describe VPC/VNet layout, subnetting, routing, security groups/NSGs, and load balancing strategies for internet-facing and internal services."
    }
  ];

  return (
    <div className="flex-1 relative">
      {/* Hero Section with Gray Background */}
      <div 
        className="bg-gray-300 min-h-[60vh]"
        style={{
          // Add background image here later like:
          // backgroundImage: 'url(\"your-background-image.jpg\")',
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
                107<br/>cloud labs
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
          <h1 className="text-4xl font-bold text-black">Cloud Computing</h1>
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
                  Learn cloud architecture and operations across AWS, Azure, and GCP: compute, storage, databases,
                  networking, security, and cost optimization. Build hands-on skills with containers, serverless,
                  and Infrastructure as Code, applying Well-Architected principles for resilient, scalable systems.
                </p>
              </div>

              {/* Course Objectives */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Understand IaaS, PaaS, SaaS and global cloud infrastructure across providers.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Configure secure networks, storage, and managed databases with IAM best practices.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Deploy apps using containers and serverless with event-driven integrations and IaC.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Apply Well-Architected pillars for reliability, performance, security, cost, operations, and sustainability.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Implement monitoring, backups, and DR with multi-AZ and multi-region strategies.
                  </li>
                </ul>
              </div>

              {/* Highlight Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Become job-ready for cloud and DevOps roles by deploying real workloads with Terraform/CloudFormation and managed services.
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
              <p className="text-gray-600 text-sm">Coming soon! We'll feature amazing testimonials from our Cloud course graduates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudCourse;
