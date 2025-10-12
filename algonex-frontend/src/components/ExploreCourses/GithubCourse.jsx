import React, { useState } from 'react';

const GithubCourse = () => {
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

  // Git/GitHub-focused modules
  const modules = [
    {
      title: "MODULE 1 : Git Fundamentals",
      topics: [
        "Installing Git, first repo, SSH vs HTTPS auth",
        "Git config, user identity, global ignores",
        "Core objects: blob, tree, commit, refs",
        "Basic workflow: status, add, commit, log, diff, show",
        "Branching basics and HEAD, fast-forward merges"
      ]
    },
    {
      title: "MODULE 2 : Branching & History",
      topics: [
        "Branch strategies: feature, release, hotfix",
        "Merging vs rebasing, interactive rebase, fixup/squash",
        "Resolving conflicts, rerere, git mergetool",
        "Cherry-pick, revert, reset (soft/mixed/hard), reflog",
        "Stash workflows, worktrees, bisect for debugging"
      ]
    },
    {
      title: "MODULE 3 : GitHub Collaboration",
      topics: [
        "GitHub repos, forks, upstream remotes, PR workflows",
        "Branch protections, required reviews, CODEOWNERS",
        "Issues, labels, milestones, Projects, Discussions",
        "Templates: issue, PR; semantic commits and changelogs",
        "Releases, tags, GitHub Packages, versioning"
      ]
    },
    {
      title: "MODULE 4 : CI/CD with Actions",
      topics: [
        "Actions fundamentals: workflow, jobs, runners",
        "Triggers: push, PR, schedule; caching and artifacts",
        "Matrix builds, reusable workflows, environments",
        "Secrets, OIDC to cloud, approvals and deployments",
        "Testing pipelines for Node/.NET/Java, coverage gates"
      ]
    },
    {
      title: "MODULE 5 : Security & Compliance",
      topics: [
        "Branch protection rules, signed commits, GPG keys",
        "Dependabot alerts, version pinning, code scanning",
        "Secret scanning, push protection, security policy",
        "CODEOWNERS for compliance, audit logs, SSO/Teams",
        "SBOM basics, license checks, PR checklists"
      ]
    },
    {
      title: "MODULE 6 : Monorepos & Scaling",
      topics: [
        "Submodules vs Subtrees: trade-offs and workflows",
        "Monorepo tooling: Nx/Turborepo basics with Git",
        "Partial clones, sparse checkout, large repos tips",
        "Git LFS for binaries, artifact retention strategy",
        "Release orchestration, automated versioning"
      ]
    },
    {
      title: "MODULE 7 : Advanced Tips",
      topics: [
        "Aliases, delta/difftastic, pretty logs and graphs",
        "Hooks: pre-commit, commit-msg, pre-push with linting",
        "Rewriting history safely, filter-repo for cleanup",
        "Binary file strategies, patch series, format-patch",
        "Performance: packfiles, gc, maintenance tasks"
      ]
    },
    {
      title: "MODULE 8 : Projects & Deployment",
      topics: [
        "Designing a team workflow (GitFlow vs Trunk-Based)",
        "End-to-end PR lifecycle with checks and environments",
        "Automated changelog and release notes via Actions",
        "Deploying to Vercel/Netlify/Azure via OIDC",
        "Release hardening and rollback procedures"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I start this Git/GitHub course?",
      answer: "Begin by initializing a local repo, generating SSH keys, and pushing to a new GitHub repository using the setup guide in Module 1."
    },
    {
      question: "Will the course cover team workflows?",
      answer: "Yes, collaborative workflows include PR reviews, CODEOWNERS, branch protections, and CI status checks to enforce quality."
    },
    {
      question: "What are the completion checkpoints?",
      answer: "Complete all 8 modules, open and merge 3 PRs with reviews, configure a CI workflow, and ship one tagged release with automated notes."
    },
    {
      question: "Is Git required before GitHub?",
      answer: "Git fundamentals are taught first so that GitHub concepts like PRs, forks, and Actions build on solid version control foundations."
    }
  ];

  const interviewQuestions = [
    {
      title: "MODULE 1 : Git Concepts",
      description: "Explain branching vs tagging, fast-forward vs recursive merge, and how HEAD and refs work under the hood."
    },
    {
      title: "MODULE 2 : History & Safety",
      description: "When to use rebase vs merge, how to recover lost commits with reflog, and strategies for conflict resolution."
    },
    {
      title: "MODULE 3 : GitHub Workflow",
      description: "Describe a PR pipeline with required checks, CODEOWNERS, and semantic versioning for automated releases."
    },
    {
      title: "MODULE 4 : CI/CD & Security",
      description: "Outline a GitHub Actions pipeline with caching, matrix builds, environment protection, and secret management."
    },
    {
      title: "MODULE 5 : Scaling Repos",
      description: "Discuss monorepos, sparse checkout, partial clone, and using Git LFS for large assets."
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

      <div className="bg-[#CCF6FF] pt-28 pb-12">
        <div className="text-center pb-6 px-6">
          <h1 className="text-4xl font-bold text-black">Git & GitHub Mastery</h1>
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
                  A practical journey from Git fundamentals to advanced GitHub collaboration, CI/CD with Actions, security hardening, and automated releases for production teams.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-black">Course Objectives</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Master Git branching, rebasing, conflict resolution, and history rewriting safely.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Implement GitHub workflows with PR reviews, branch protections, and CODEOWNERS.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Build CI/CD pipelines using GitHub Actions with caching, matrices, and environment gates.
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    Secure repositories with secret scanning, Dependabot, signed commits, and policies.
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Capstone work includes creating a protected workflow, shipping a tagged release, and deploying via OIDC to cloud with automated release notes.
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
                    { title: "Git Internals & Branching" },
                    { title: "Merging, Rebasing, Recovery" },
                    { title: "GitHub PR Workflow" },
                    { title: "Actions CI/CD & Security" },
                    { title: "Scaling & Monorepos" }
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
              <p className="text-gray-600 text-sm">Coming soon! Stories from engineers who streamlined releases with GitHub.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GithubCourse;
