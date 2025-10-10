import React, { useState } from "react";
import { Clock, Users, Award, BookOpen, Code, CheckCircle, Star, TrendingUp, Zap, Target, ChevronDown, Globe, Rocket, ArrowRight, Briefcase, GraduationCap } from 'lucide-react';

export default function MERNCourseLanding() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const weeks = [
    {
      number: 1,
      title: "Week 1-2: JavaScript Fundamentals & Node.js",
      description: "Master JavaScript ES6+ features and Node.js fundamentals including async programming, event loop, and file system operations."
    },
    {
      number: 2,
      title: "Week 3: MongoDB Basics",
      description: "Deep dive into NoSQL databases with MongoDB, covering CRUD operations, aggregation pipelines, and Mongoose ODM."
    },
    {
      number: 3,
      title: "Week 4: Express.js Basics",
      description: "Build robust REST APIs with Express.js, implementing middleware, authentication, and error handling patterns."
    },
    {
      number: 4,
      title: "Week 5-6: React Basics",
      description: "Create dynamic UIs with React, mastering components, hooks, state management, and modern React patterns."
    },
    {
      number: 5,
      title: "Week 7-8: Full Stack Integration",
      description: "Connect React with Node.js backend, implement JWT authentication, and build complete CRUD applications."
    },
    {
      number: 6,
      title: "Week 9: Advanced Concepts & Deployment",
      description: "Learn advanced patterns, real-time features with Socket.io, testing, and deploy full-stack apps to production."
    }
  ];

  const modules = [
    {
      title: "JavaScript & Node.js Fundamentals",
      description: "Build a solid foundation in modern JavaScript and server-side development with Node.js, covering ES6+ features and asynchronous programming.",
      topics: [
        "ES6+ Features & Arrow Functions",
        "Promises & Async/Await",
        "Node.js Core Modules",
        "NPM & Package Management",
        "File System Operations",
        "Event-Driven Architecture",
        "Streams & Buffers",
        "Error Handling Patterns",
        "Environment Variables"
      ]
    },
    {
      title: "MongoDB & Database Design",
      description: "Master NoSQL database concepts with MongoDB, learn schema design, indexing strategies, and data modeling for scalable applications.",
      topics: [
        "NoSQL vs SQL Databases",
        "MongoDB Atlas Setup",
        "CRUD Operations Mastery",
        "Mongoose ODM Integration",
        "Schema Design Patterns",
        "Indexing & Performance",
        "Aggregation Framework",
        "Data Validation",
        "Database Security"
      ]
    },
    {
      title: "Express.js & REST API Development",
      description: "Build production-ready REST APIs with Express.js, implementing authentication, authorization, and industry-standard best practices.",
      topics: [
        "RESTful API Design",
        "Routing & Middleware",
        "JWT Authentication",
        "Request Validation",
        "Error Handling",
        "Security Best Practices",
        "Rate Limiting",
        "API Documentation",
        "Testing with Jest"
      ]
    },
    {
      title: "React & Modern Frontend",
      description: "Create stunning user interfaces with React, mastering hooks, context API, and state management for complex applications.",
      topics: [
        "Components & Props",
        "Hooks (useState, useEffect)",
        "Context API & State",
        "React Router",
        "Form Handling",
        "API Integration",
        "Custom Hooks",
        "Performance Optimization",
        "Testing Components"
      ]
    },
    {
      title: "Full Stack Integration & Deployment",
      description: "Bring it all together by building complete MERN applications and deploying them to production with CI/CD pipelines.",
      topics: [
        "Frontend-Backend Connection",
        "Authentication Flow",
        "File Upload & Storage",
        "Real-time with Socket.io",
        "Payment Integration",
        "Docker Containerization",
        "AWS/Heroku Deployment",
        "CI/CD with GitHub Actions",
        "Monitoring & Logging"
      ]
    }
  ];

  const faqs = [
    {
      question: "What are the prerequisites for this course?",
      answer: "Basic understanding of HTML and CSS is recommended. No prior programming experience is required as we start from fundamentals."
    },
    {
      question: "How long does it take to complete the course?",
      answer: "The course is designed for 9 weeks with 10-15 hours per week commitment. You can also learn at your own pace with lifetime access."
    },
    {
      question: "Will I get a certificate after completion?",
      answer: "Yes! You'll receive an industry-recognized certificate upon completing all modules and the final project."
    },
    {
      question: "Do I need to know React before starting?",
      answer: "No, we cover React from basics to advanced. The curriculum is structured to take you from beginner to job-ready developer."
    },
    {
      question: "What kind of support is available?",
      answer: "You get 24/7 community support, weekly live doubt sessions, 1-on-1 mentorship, and lifetime access to course materials."
    }
  ];

  const skillLanguages = [
    { 
      name: "JavaScript", 
      color: "from-yellow-500 to-yellow-600",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
    },
    { 
      name: "Node.js", 
      color: "from-green-600 to-green-700",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
    },
    { 
      name: "MongoDB", 
      color: "from-green-700 to-green-800",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
    },
    { 
      name: "Express.js", 
      color: "from-gray-700 to-gray-800",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
    },
    { 
      name: "React", 
      color: "from-blue-500 to-blue-600",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    },
    { 
      name: "REST API", 
      color: "from-purple-600 to-purple-700",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fastapi.svg"
    },
    { 
      name: "JWT Auth", 
      color: "from-red-600 to-red-700",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg"
    },
    { 
      name: "Git & GitHub", 
      color: "from-orange-600 to-orange-700",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
    }
  ];

  const learningOutcomes = [
    {
      number: "01",
      title: "Build Full-Stack Applications",
      description: "Create production-ready web applications from scratch using the complete MERN stack with industry best practices",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      number: "02",
      title: "Master Modern JavaScript",
      description: "Gain expertise in ES6+ features, async programming, and modern JavaScript patterns used by top tech companies",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      number: "03",
      title: "Deploy to Production",
      description: "Learn to deploy, scale, and maintain full-stack applications on cloud platforms with CI/CD pipelines",
      gradient: "from-orange-600 to-red-600"
    }
  ];

  const testimonials = [
    {
      name: "Arjun Mehta",
      role: "Full Stack Developer at Amazon",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
      rating: 5,
      text: "This course transformed my career. The hands-on projects and mentorship helped me land a job at Amazon within 3 months of completion."
    },
    {
      name: "Priya Sharma",
      role: "Software Engineer at Microsoft",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
      rating: 5,
      text: "Best investment I made in my career. The curriculum is up-to-date with industry standards and the instructors are incredibly supportive."
    },
    {
      name: "Rohan Desai",
      role: "Lead Developer at Startup",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop",
      rating: 5,
      text: "From zero coding experience to building my own startup's tech stack. This course gave me the confidence and skills to execute my vision."
    }
  ];

  const trendingCourses = [
    { title: "Python Full Stack", students: "2,500+", rating: "4.8" },
    { title: "DevOps Mastery", students: "1,800+", rating: "4.9" },
    { title: "React Native", students: "3,200+", rating: "4.7" },
    { title: "Cloud Computing", students: "2,100+", rating: "4.8" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white font-semibold text-sm">Limited Time Offer: Enroll Now & Get 20% Off + Free Internship Opportunity</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <span className="px-5 py-2 bg-green-600 text-white rounded-full font-semibold text-sm flex items-center gap-2">
              <Award size={16} /> Industry Certified
            </span>
            <span className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm flex items-center gap-2">
              <Users size={16} /> 5,000+ Students Enrolled
            </span>
            <span className="px-5 py-2 bg-purple-600 text-white rounded-full font-semibold text-sm flex items-center gap-2">
              <Briefcase size={16} /> Job Assistance Program
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Master the MERN Stack Development
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform from beginner to full-stack developer in 9 weeks. Build real-world projects, gain industry experience, and launch your tech career with our comprehensive training program.
              </p>
              <div className="flex gap-4 flex-wrap">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                  Enroll Now <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all">
                  Download Curriculum
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-white mb-2">9 Weeks</div>
                  <div className="text-gray-300 font-medium text-sm">Course Duration</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-white mb-2">100%</div>
                  <div className="text-gray-300 font-medium text-sm">Placement Support</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-white mb-2">15+</div>
                  <div className="text-gray-300 font-medium text-sm">Live Projects</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-4xl font-bold text-white mb-2">4.9</div>
                  <div className="text-gray-300 font-medium text-sm">Course Rating</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
              <div className="p-8 text-center hover:bg-white/5 transition-all">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Code className="text-white" size={28} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Live Coding Sessions</h3>
                <p className="text-gray-300 text-sm">Interactive sessions with industry experts</p>
              </div>
              <div className="p-8 text-center hover:bg-white/5 transition-all">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="text-white" size={28} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Real-World Projects</h3>
                <p className="text-gray-300 text-sm">Build portfolio-worthy applications</p>
              </div>
              <div className="p-8 text-center hover:bg-white/5 transition-all">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Expert Mentorship</h3>
                <p className="text-gray-300 text-sm">Personal guidance from developers</p>
              </div>
              <div className="p-8 text-center hover:bg-white/5 transition-all">
                <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <GraduationCap className="text-white" size={28} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Industry Certificate</h3>
                <p className="text-gray-300 text-sm">Recognized professional credentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Will Learn</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Master the complete MERN stack and become a job-ready full-stack developer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {learningOutcomes.map((item, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-90`}></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="relative p-8 h-80 flex flex-col justify-between">
                  <div className="text-white/20 text-8xl font-bold">{item.number}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/90 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skill Languages */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technologies You Will Master</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skillLanguages.map((skill, idx) => (
                <div key={idx} className="group">
                  <div className="bg-white p-8 rounded-xl shadow-md border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all h-32 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                    <img 
                      src={skill.logo} 
                      alt={skill.name}
                      className="w-12 h-12 object-contain mb-3 relative z-10"
                    />
                    <span className="text-gray-800 font-semibold text-sm relative z-10">{skill.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info Boxes */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-3">Job Placement Assistance</h3>
              <p className="text-lg leading-relaxed opacity-95">Get comprehensive placement support including resume building, interview preparation, and direct company referrals to kickstart your career.</p>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-3">Internship Program</h3>
              <p className="leading-relaxed opacity-95">3-month paid internship opportunity included with the course</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Journey Banner */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Your 9-Week Learning Journey</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">From fundamentals to deployment, follow a structured curriculum designed by industry experts</p>
            
            <div className="grid md:grid-cols-3 gap-8 text-white">
              {weeks.slice(0, 3).map((week, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                  <div className="text-blue-400 font-bold text-3xl mb-3">Week {week.number}</div>
                  <h4 className="font-semibold text-lg mb-2">{week.title.split(':')[1]}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{week.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive modules covering everything from basics to advanced concepts</p>
          </div>

          <div className="space-y-8">
            {modules.map((module, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 text-9xl font-bold opacity-10">{idx + 1}</div>
                    <div className="relative z-10">
                      <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                        Module {idx + 1}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{module.title}</h3>
                      <p className="text-white/90 leading-relaxed">{module.description}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 p-10 bg-white">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <BookOpen className="text-blue-600" size={24} />
                      Topics Covered
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {module.topics.map((topic, topicIdx) => (
                        <div key={topicIdx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {String(topicIdx + 1).padStart(2, '0')}
                          </div>
                          <span className="text-gray-700 font-medium text-sm leading-relaxed">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Related Courses</h2>
              <p className="text-gray-600 text-lg">Explore other professional training programs</p>
            </div>
            <TrendingUp className="text-blue-600" size={40} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {trendingCourses.map((course, idx) => (
              <div key={idx} className="group">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-64 mb-4 overflow-hidden relative shadow-lg hover:shadow-xl transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-purple-600/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold transform scale-0 group-hover:scale-100 transition-transform">
                      View Course
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white font-semibold text-xl mb-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-white text-sm">
                      <span className="flex items-center gap-1">
                        <Users size={16} /> {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" /> {course.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hear from students who transformed their careers after completing our program</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600 font-semibold">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions about the course</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-all shadow-sm">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="text-gray-900 font-semibold text-lg pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`text-blue-600 flex-shrink-0 transition-transform ${openFAQ === idx ? 'rotate-180' : ''}`} 
                    size={24} 
                  />
                </button>
                {openFAQ === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/95 mb-10 leading-relaxed">
            Join 5,000+ students who have transformed their careers with our MERN stack program
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:bg-gray-50 transition-all shadow-2xl flex items-center gap-3">
              Enroll Now - 20% Off <ArrowRight size={24} />
            </button>
            <button className="px-12 py-5 border-2 border-white text-white rounded-xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all">
              Book Free Demo
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 text-white text-sm flex-wrap">
            <span className="flex items-center gap-2">
              <CheckCircle size={20} /> Money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={20} /> Lifetime access
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={20} /> Job placement support
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-2xl font-bold mb-4 text-blue-400">
                Algonex Academy
              </h4>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering the next generation of developers with industry-leading education and professional training programs.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Globe size={20} />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Users size={20} />
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-blue-400 text-lg">Popular Courses</h5>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">MERN Stack Development</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Python Full Stack</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">DevOps Engineering</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cloud Computing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-blue-400 text-lg">Company</h5>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-blue-400 text-lg">Contact</h5>
              <ul className="space-y-3 text-gray-400">
                <li>Bangalore, Karnataka</li>
                <li>contact@algonexacademy.com</li>
                <li>+91 1800-123-4567</li>
                <li className="pt-4">
                  <span className="text-blue-400 font-semibold">Mon - Sat:</span> 9 AM - 8 PM
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
            <p>© 2025 Algonex Academy. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}