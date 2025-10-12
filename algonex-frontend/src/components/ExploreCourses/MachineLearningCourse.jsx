import React, { useState } from 'react';

const MachineLearningCourse = () => {
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
      <path d="M12 12.75c1.63 0 3.07.39 4.24.9c1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73c1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm2.78 1.58c-.85-.37-1.79-.58-2.78-.58c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57c0-.81-.48-1.53-1.22-1.85zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zM4 8c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm16 0c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3z" />
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

  // Module data (Machine Learning)
  const modules = [
    {
      title: "MODULE 1 : ML Foundations",
      topics: [
        "End-to-end ML workflow and problem framing",
        "Data cleaning, encoding, scaling, and splits",
        "Feature engineering and selection",
        "Evaluation: CV, metrics for regression/classification",
        "Bias–variance tradeoff and regularization"
      ]
    },
    {
      title: "MODULE 2 : Supervised Learning",
      topics: [
        "Linear/logistic regression with L1/L2/ElasticNet",
        "Trees, random forests, gradient boosting (XGBoost/LightGBM)",
        "SVMs, k-NN, Naive Bayes: pros/cons and tuning",
        "Hyperparameter search: grid/random/Bayesian",
        "Imbalanced learning: resampling, thresholds, costs"
      ]
    },
    {
      title: "MODULE 3 : Unsupervised & Time Series",
      topics: [
        "Clustering: k-means, hierarchical, DBSCAN; model selection",
        "Dimensionality reduction: PCA, t-SNE/UMAP",
        "Anomaly detection techniques and evaluation",
        "Embeddings and representation learning basics",
        "Time series: stationarity, ARIMA, feature windows"
      ]
    },
    {
      title: "MODULE 4 : MLOps & Deployment",
      topics: [
        "Experiment tracking and model versioning (MLflow/W&B)",
        "Packaging and serving models with APIs and containers",
        "Monitoring performance, drift, and alerting",
        "Retraining pipelines and CI/CD for ML",
        "Responsible AI: fairness, explainability, privacy"
      ]
    }
  ];

  // FAQ data (Machine Learning)
  const faqs = [
    {
      question: "How do I get started with the online classes?",
      answer:
        "Access the dashboard after enrollment. Start with Module 1 and set up the Python environment using the starter guide and example notebooks."
    },
    {
      question: "Where should I search for new code references?",
      answer:
        "The course provides notebooks, experiment runs, and links to official docs. A private repository includes E2E examples and datasets."
    },
    {
      question: "What are the main checkpoint requirements for finishing?",
      answer:
        "Complete all 4 modules, submit 3 projects (supervised model, unsupervised analysis, deployment with monitoring), and pass the final assessment."
    },
    {
      question: "What programming tools will we learn?",
      answer:
        "Python with NumPy, pandas, scikit-learn, MLflow/W&B for tracking, and optional Flask/FastAPI plus Docker for serving."
    }
  ];

  // Interview Questions data (Machine Learning)
  const interviewQuestions = [
    {
      title: "Bias–variance tradeoff",
      description:
        "Explain underfitting vs overfitting, how regularization and cross-validation help, and how to diagnose with learning curves."
    },
    {
      title: "Choosing evaluation metrics",
      description:
        "Select metrics by task: RMSE/MAE for regression; precision/recall, F1, ROC-AUC, PR-AUC for classification, especially with imbalance."
    },
    {
      title: "Feature engineering pitfalls",
      description:
        "Discuss leakage prevention, scaling/encoding choices, interaction terms, and domain-informed features."
    },
    {
      title: "Hyperparameter tuning",
      description:
        "Compare grid, random, and Bayesian search; nested CV and early stopping; reproducibility and avoiding data leakage."
    },
    {
      title: "MLOps monitoring and drift",
      description:
        "Outline tracking/versioning, serving patterns, detecting data/model drift, and triggers for retraining."
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
                107<br/>ML exercises
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
          <h1 className="text-4xl font-bold text-black">Machine Learning</h1>
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
                  Master the ML lifecycle from data prep and feature engineering to modeling, evaluation, and deployment. Build supervised and unsupervised models, tune them rigorously, and ship production-ready systems with MLOps.
                </p>
              </div>

              {/* Course Objectives */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Apply robust preprocessing, feature engineering, and model selection techniques.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Evaluate with appropriate metrics and cross-validation; handle class imbalance effectively.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Tune models using systematic search strategies with reproducible experiments.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Deploy models with APIs and containers; track, monitor, and retrain in production.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Incorporate responsible AI considerations: fairness, explainability, and privacy.
                  </li>
                </ul>
              </div>

              {/* Highlight Text */}
              <p className="text-sm text-gray-700 leading-relaxed">
                Become job-ready by delivering real ML projects with rigorous evaluation and production MLOps practices.
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
              <p className="text-gray-600 text-sm">Coming soon! We'll feature amazing testimonials from our Machine Learning course graduates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineLearningCourse;
