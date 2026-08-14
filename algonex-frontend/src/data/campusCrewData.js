export const ecosystemNodes = [
  { id: 'center', label: 'ALGONEX\nCAMPUS CREW', type: 'core', desc: 'Central Innovation Hub' },
  { id: 'students', label: 'STUDENTS', type: 'pillar', desc: 'Active Builders & Leaders' },
  { id: 'colleges', label: 'COLLEGES', type: 'pillar', desc: 'Campus Ecosystem Partners' },
  { id: 'industry', label: 'INDUSTRY', type: 'pillar', desc: 'Tech Companies & Mentors' },
  { id: 'ai', label: 'AI & TECH', type: 'tech', desc: 'Agentic Workflows & Modern Tools' },
  { id: 'projects', label: 'PROJECTS', type: 'tech', desc: 'Real-World Software Building' },
  { id: 'mentors', label: 'MENTORS', type: 'expert', desc: 'Senior Industry Architects' },
  { id: 'hackathons', label: 'HACKATHONS', type: 'event', desc: 'Idea to Deployed Demo' },
  { id: 'internships', label: 'OPPORTUNITIES', type: 'career', desc: 'Internship & Career Pathways' }
];

export const ecosystemConnections = [
  { from: 'colleges', to: 'center' },
  { from: 'students', to: 'center' },
  { from: 'center', to: 'industry' },
  { from: 'industry', to: 'mentors' },
  { from: 'mentors', to: 'ai' },
  { from: 'ai', to: 'projects' },
  { from: 'projects', to: 'hackathons' },
  { from: 'hackathons', to: 'internships' },
  { from: 'internships', to: 'students' },
  { from: 'colleges', to: 'students' }
];

export const partnerEcosystem = [
  { name: 'Paytm', logo: 'https://img.icons8.com/color/96/paytm-logo.png', relationshipType: 'Speaker Affiliation', verified: true },
  { name: 'Microsoft', logo: 'https://img.icons8.com/color/96/microsoft.png', relationshipType: 'Speaker Affiliation', verified: true },
  { name: 'AWS', logo: 'https://img.icons8.com/color/96/amazon-web-services.png', relationshipType: 'Community Partner', verified: true },
  { name: 'IBM', logo: 'https://img.icons8.com/color/96/ibm.png', relationshipType: 'Speaker Affiliation', verified: true },
  { name: 'OutSystems', logo: 'https://img.icons8.com/color/96/code.png', relationshipType: 'Technology Partner', verified: true },
  { name: 'Google', logo: 'https://img.icons8.com/color/96/google-logo.png', relationshipType: 'Speaker Affiliation', verified: true },
  { name: 'Nokia', logo: 'https://img.icons8.com/color/96/domain.png', relationshipType: 'Mentor Affiliation', verified: true }
];

export const classroomVsIndustry = {
  classroom: [
    { title: 'Theory & Concepts', detail: 'Focuses primarily on theoretical foundations and standard textbook problems.' },
    { title: 'Standard Assignments', detail: 'Single-developer exercises with predetermined outcomes and static code.' },
    { title: 'Academic Exams', detail: 'Memorization and written evaluation without production stress.' },
    { title: 'Fixed Curriculum', detail: 'Updates every few years, often lagging behind live industry stack evolution.' },
    { title: 'Grades & Marks', detail: 'Evaluates test score compliance rather than software engineering execution.' }
  ],
  industry: [
    { title: 'Real Requirements', detail: 'Solves ambiguous business problems with evolving user constraints.' },
    { title: 'Product Architecture', detail: 'Scalable system design, API design, modularity, and error resiliency.' },
    { title: 'Modern Tech & AI', detail: 'Full-stack development, AI agents, cloud APIs, and automated tools.' },
    { title: 'Git & Collaboration', detail: 'PR workflows, code reviews, trunk development, and CI/CD testing.' },
    { title: 'Production Deployment', detail: 'Moving code beyond localhost into live environments with monitoring.' }
  ]
};

export const fivePillars = [
  { title: 'LEARN', desc: 'Learn directly from senior industry professionals who build production systems daily.', icon: 'BookOpen' },
  { title: 'BUILD', desc: 'Move past static tutorials and construct practical software solutions that work.', icon: 'Code' },
  { title: 'INNOVATE', desc: 'Experiment with Generative AI, agentic workflows, and emerging tech stacks.', icon: 'Cpu' },
  { title: 'CONNECT', desc: 'Build long-term peer networks and professional relationships across top engineering campuses.', icon: 'Users' },
  { title: 'LEAD', desc: 'Become campus ambassadors and core cohort members who lead innovation on their campus.', icon: 'Zap' }
];

export const studentBenefits = [
  { title: 'Industry Exposure', desc: 'Meet architects, senior engineering managers, and tech leaders in interactive sessions.', badge: 'Networking' },
  { title: 'Practical Projects', desc: 'Build real-world applications with modern tech stacks, moving from idea to implementation.', badge: 'Hands-on' },
  { title: 'AI & Agentic Experience', desc: 'Explore AI tools, prompt engineering, agentic development, and workflow automation.', badge: 'Emerging Tech' },
  { title: 'Hackathons & Challenges', desc: 'Solve real industry challenges under realistic time and technical constraints.', badge: 'Competition' },
  { title: 'Professional Mentorship', desc: 'Receive direct guidance from tech leaders who understand production engineering.', badge: 'Guidance' },
  { title: 'GitHub & Live Portfolio', desc: 'Build verifiable evidence of your work with active repositories and hosted projects.', badge: 'Proof of Work' },
  { title: 'Cloud & Deployment', desc: 'Understand how software moves beyond local host environment into cloud deployment.', badge: 'DevOps' },
  { title: 'Career & Profile Building', desc: 'Get practical resume feedback, LinkedIn positioning, and tech interview preparation.', badge: 'Readiness' },
  { title: 'Cross-College Access', desc: 'Participate in eligible Campus Crew activities across participating campuses nationwide.', badge: 'Ecosystem' },
  { title: 'Certification & Recognition', desc: 'Receive formal Algonex Campus Crew program certifications tied to active participation.', badge: 'Credentials' }
];

export const studentJourneyTimeline = [
  { step: '01', title: 'DISCOVER', desc: 'Explore Algonex Campus Crew on your campus or via digital community.' },
  { step: '02', title: 'JOIN', desc: 'Apply for your college’s 50-member core Campus Crew cohort or community stream.' },
  { step: '03', title: 'LEARN', desc: 'Attend Industry Immersion Days and expert-led technology deep-dives.' },
  { step: '04', title: 'BUILD', desc: 'Collaborate with peers to develop real-world software applications.' },
  { step: '05', title: 'DEPLOY', desc: 'Package and push live code to production cloud environments.' },
  { step: '06', title: 'DEMO & HACK', desc: 'Present software builds during hackathons and demo days for industry review.' },
  { step: '07', title: 'CAREER PATHWAYS', desc: 'Build a verifiable GitHub portfolio and unlock industry connection opportunities.' }
];

export const immersionDaySchedule = [
  { phase: 'Phase 01', title: 'Welcome & Industry Reality Check', topic: 'The real gap between college coding and production engineering.' },
  { phase: 'Phase 02', title: 'Keynote & Tech Deep-Dive', topic: 'Modern software architecture, AI agent workflows, and cloud paradigms.' },
  { phase: 'Phase 03', title: 'Requirement Analysis & Solution Design', topic: 'Breaking down ambiguous problems into clean system specs.' },
  { phase: 'Phase 04', title: 'Hands-on Build Session', topic: 'Pair programming, API development, and AI-enabled prototyping.' },
  { phase: 'Phase 05', title: 'Testing, GitHub & Cloud Deployment', topic: 'Version control, automated testing, and live hosting setup.' },
  { phase: 'Phase 06', title: 'Live Demo & Industry Expert Review', topic: 'Presenting working builds and receiving constructive engineering feedback.' }
];

export const engineeringPipeline = [
  { step: '1. REAL PROBLEM', desc: 'Industry use case analysis' },
  { step: '2. REQUIREMENTS', desc: 'User stories & API spec' },
  { step: '3. ARCHITECTURE', desc: 'System & DB design' },
  { step: '4. DEVELOPMENT', desc: 'Full-stack build' },
  { step: '5. AI / AUTOMATION', desc: 'Agent integration' },
  { step: '6. TESTING & GIT', desc: 'Code review & CI' },
  { step: '7. DEPLOYMENT', desc: 'Cloud infrastructure' },
  { step: '8. LIVE DEMO', desc: 'Industry critique' }
];

export const techTracks = [
  { name: 'AI & Agentic Engineering', items: ['Generative AI', 'LLM APIs', 'AI Agents', 'Workflow Automation', 'RAG Systems'] },
  { name: 'Full Stack Engineering', items: ['React / Next.js', 'REST & GraphQL', 'Node / Python / Django', 'SQL & NoSQL', 'System Design'] },
  { name: 'Cloud & Infrastructure', items: ['Cloud Fundamentals', 'Containerization', 'Serverless', 'CI/CD Pipelines', 'Observability'] },
  { name: 'Engineering Workflows', items: ['Git & GitHub', 'Unit & Integration Testing', 'Agile Sprints', 'Code Review Practices'] },
  { name: 'Product & Architecture', items: ['Requirement Analysis', 'UX & Architecture', 'API First Design', 'Security Fundamentals'] },
  { name: 'Career & Positioning', items: ['Technical Resumes', 'GitHub Portfolio', 'LinkedIn Branding', 'Mock Tech Interviews'] }
];

export const industryExperts = [
  {
    name: 'Venkata Chaitanya',
    role: 'Founder & Managing Director',
    organization: 'Algonex IT Solutions',
    expertise: 'Enterprise Architecture, AI Ecosystems, Full Stack Systems',
    verified: true,
    tag: 'Leadership'
  },
  {
    name: 'Industry Architect Network',
    role: 'Principal Architects & Tech Leads',
    organization: 'Top Tech Ecosystem Partners',
    expertise: 'Cloud Native, GenAI, Microservices, DevOps',
    verified: true,
    tag: 'Mentorship Pool'
  },
  {
    name: 'Product & Engineering Leaders',
    role: 'Senior Engineering Managers',
    organization: 'Global Tech & Startup Ecosystems',
    expertise: 'Product Thinking, Scalable Infra, System Reliability',
    verified: true,
    tag: 'Guest Speakers'
  }
];

export const collegeBenefits = [
  { title: 'Structured Industry Connect', desc: 'Regular, structured engagement with seasoned tech professionals on campus.' },
  { title: 'Enhanced Placement Readiness', desc: 'Equips students with practical project experience and GitHub proof of work.' },
  { title: 'AI & Emerging Tech Adoption', desc: 'Exposes student body and faculty to cutting-edge AI and engineering tools.' },
  { title: 'Active Innovation Culture', desc: 'Fosters continuous hacker spirit through hackathons, projects, and demo days.' },
  { title: 'Faculty Development Programs', desc: 'Optional modules designed to update faculty on modern industry tools and workflows.' },
  { title: 'Innovation Cell Acceleration', desc: 'Acts as an execution engine for college EDC / IIC / Skill cells.' }
];

export const leadershipRoles = [
  {
    title: 'CAMPUS AMBASSADOR',
    subtitle: 'The Student Lead',
    desc: 'Serves as the primary bridge between Algonex, college leadership, and the student body.',
    responsibilities: [
      'Coordinate campus activations and Immersion Days',
      'Lead communications with college authorities and faculty',
      'Represent campus in cross-college leadership forums',
      'Drive student onboarding for the 50-member core cohort'
    ]
  },
  {
    title: 'CORE MEMBER COHORT',
    subtitle: 'Selected 50 Members',
    desc: 'A focused cohort of up to 50 active student builders selected per campus.',
    responsibilities: [
      'Receive priority access to hackathons and mentorship',
      'Work on collaborative industry-oriented projects',
      'Assist in peer-to-peer coding and project circles',
      'Participate in industrial visits subject to eligibility'
    ]
  },
  {
    title: 'COMMUNITY MEMBER',
    subtitle: 'Wider College Body',
    desc: 'Open access for all students to open keynotes, general workshops, and community events.',
    responsibilities: [
      'Attend public keynotes and broad awareness sessions',
      'Access open open-source learning repositories',
      'Participate in campus-wide hackathon qualifiers'
    ]
  }
];

export const verifiedFaqs = [
  {
    q: 'What is Algonex Campus Crew?',
    a: 'Algonex Campus Crew is an on-campus student innovation community launched by Algonex IT Solutions. It creates continuous, recurring collaboration between colleges, engineering students, and industry professionals.'
  },
  {
    q: 'Who can join Algonex Campus Crew?',
    a: 'Students from participating colleges enrolled in Computer Science, IT, AI, Data Science, Electrical, and allied engineering or MCA programs can apply.'
  },
  {
    q: 'Why is there a core cohort of 50 members per college?',
    a: 'Selecting up to 50 core members ensures intensive mentorship, quality project reviews, and direct student leadership development. However, open events and keynotes remain accessible to the broader college community.'
  },
  {
    q: 'Does Algonex Campus Crew guarantee jobs or internships?',
    a: 'No. Algonex Campus Crew focuses strictly on skill development, practical project building, mentorship, and career readiness. We do not guarantee jobs or placements, but we build the verifiable evidence (GitHub, deployed apps) that improves student career outcomes.'
  },
  {
    q: 'How frequently are major events conducted on campus?',
    a: 'The typical operating model includes approximately one major on-campus Industry Immersion event every two months, complemented by ongoing community building and project sprints. Final calendars are customized with each college.'
  },
  {
    q: 'How can a college partner with Algonex IT Solutions?',
    a: 'College officials can click "Partner With Algonex" on this page and submit the enquiry form. Our team will schedule an institutional discussion to establish a structured program or MoU.'
  },
  {
    q: 'Are certificates provided for participation?',
    a: 'Yes. Official program and event certificates are issued by Algonex IT Solutions subject to verified attendance and project submission criteria.'
  }
];
