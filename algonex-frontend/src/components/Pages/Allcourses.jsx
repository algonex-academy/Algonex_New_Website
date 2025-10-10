import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [levelFilter, setLevelFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const scrollRef = useRef(null);

  const categories = [
    'All Courses', 'Trending', 'Frontend', 'Backend', 'Data Engineer', 'Java', 'Python', 
    'Excel', 'Gen AI', 'Data Science', 'Cyber Security', 'DevOps', 'Cloud',
    'Machine Learning', 'Power BI', 'Testing', 'Github'
  ];

  const careerAccelerators = [
    {
      title: 'JAVA FULLSTACK',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture3.png?updatedAt=1759557480087',
      tags: ['Spring Boot', 'Microservices'],
      moreCount: 15,
      level: 'All Levels',
      duration: '6 Months',
      aiTools: '10+ AI Tools',
      modules: '56',
      category: 'Backend',
      rating: '4.8',
      students: '18.5K'
    },
    {
      title: 'PYTHON FULLSTACK',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture4.png?updatedAt=1759557479904',
      tags: ['Django', 'Flask'],
      moreCount: 14,
      level: 'All Levels',
      duration: '6 Months',
      aiTools: '10+ AI Tools',
      modules: '56',
      category: 'Backend',
      rating: '4.7',
      students: '16.2K'
    },
    {
      title: 'DATA COURSES',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture5.png?updatedAt=1759557479964',
      tags: ['Data Visualization', 'AI ML'],
      moreCount: 12,
      level: 'All Levels',
      duration: '6 Months',
      aiTools: '10+ AI Tools',
      modules: '56',
      category: 'Data Science',
      rating: '4.9',
      students: '21.3K'
    },
    {
      title: 'MERN STACK',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture3.png?updatedAt=1759557480087',
      tags: ['MongoDB', 'Express', 'React'],
      moreCount: 18,
      level: 'Intermediate',
      duration: '7 Months',
      aiTools: '12+ AI Tools',
      modules: '64',
      category: 'Frontend',
      rating: '4.8',
      students: '19.8K'
    },
    {
      title: 'MEAN STACK',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture4.png?updatedAt=1759557479904',
      tags: ['MongoDB', 'Angular'],
      moreCount: 16,
      level: 'Intermediate',
      duration: '7 Months',
      aiTools: '12+ AI Tools',
      modules: '62',
      category: 'Frontend',
      rating: '4.7',
      students: '15.9K'
    },
    {
      title: 'DEVOPS ENGINEER',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture5.png?updatedAt=1759557479964',
      tags: ['Docker', 'Kubernetes', 'CI/CD'],
      moreCount: 20,
      level: 'Advanced',
      duration: '8 Months',
      aiTools: '15+ AI Tools',
      modules: '72',
      category: 'DevOps',
      rating: '4.9',
      students: '14.7K'
    },
    {
      title: 'CLOUD ARCHITECT',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture3.png?updatedAt=1759557480087',
      tags: ['AWS', 'Azure', 'GCP'],
      moreCount: 22,
      level: 'Advanced',
      duration: '9 Months',
      aiTools: '15+ AI Tools',
      modules: '78',
      category: 'Cloud',
      rating: '4.8',
      students: '17.5K'
    },
    {
      title: 'AI/ML ENGINEER',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture4.png?updatedAt=1759557479904',
      tags: ['TensorFlow', 'PyTorch'],
      moreCount: 25,
      level: 'Advanced',
      duration: '10 Months',
      aiTools: '20+ AI Tools',
      modules: '85',
      category: 'Machine Learning',
      rating: '4.9',
      students: '22.1K'
    },
    {
      title: 'CYBER SECURITY',
      image: 'https://ik.imagekit.io/ipo22webapp/Picture5.png?updatedAt=1759557479964',
      tags: ['Ethical Hacking', 'Penetration'],
      moreCount: 19,
      level: 'Intermediate',
      duration: '8 Months',
      aiTools: '12+ AI Tools',
      modules: '68',
      category: 'Cyber Security',
      rating: '4.7',
      students: '13.8K'
    }
  ];

  const courses = [
    {
      title: 'PYTHON',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Beginner',
      duration: '6 months',
      modules: '56',
      gradient: 'linear-gradient(to bottom, #FFE608, #585900)',
      category: 'Python',
      rating: '4.8',
      students: '25.4K'
    },
    {
      title: 'JAVA',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Intermediate',
      duration: '8 months',
      modules: '64',
      gradient: 'linear-gradient(to bottom, #FF6B35, #8B2500)',
      category: 'Java',
      rating: '4.7',
      students: '22.8K'
    },
    {
      title: 'REACT JS',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Intermediate',
      duration: '5 months',
      modules: '48',
      gradient: 'linear-gradient(to bottom, #61DAFB, #20232A)',
      category: 'Frontend',
      rating: '4.9',
      students: '31.2K'
    },
    {
      title: 'DATA SCIENCE',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '10 months',
      modules: '72',
      gradient: 'linear-gradient(to bottom, #4A90E2, #1A3A5C)',
      category: 'Data Science',
      rating: '4.8',
      students: '28.9K'
    },
    {
      title: 'MACHINE LEARNING',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '12 months',
      modules: '80',
      gradient: 'linear-gradient(to bottom, #9B59B6, #512E5F)',
      category: 'Machine Learning',
      rating: '4.9',
      students: '26.7K'
    },
    {
      title: 'NODE JS',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Intermediate',
      duration: '6 months',
      modules: '52',
      gradient: 'linear-gradient(to bottom, #68A063, #2D5016)',
      category: 'Backend',
      rating: '4.7',
      students: '24.3K'
    },
    {
      title: 'ANGULAR',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Intermediate',
      duration: '5 months',
      modules: '46',
      gradient: 'linear-gradient(to bottom, #DD0031, #5A0013)',
      category: 'Frontend',
      rating: '4.6',
      students: '19.5K'
    },
    {
      title: 'CYBER SECURITY',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '9 months',
      modules: '68',
      gradient: 'linear-gradient(to bottom, #E74C3C, #7B241C)',
      category: 'Cyber Security',
      rating: '4.8',
      students: '21.6K'
    },
    {
      title: 'Generative AI Mastery',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '8 months',
      modules: '75',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      rating: '4.9',
      students: '12.5K',
      category: 'Gen AI',
      trending: true
    },
    {
      title: 'Full Stack Web3 Development',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Intermediate',
      duration: '10 months',
      modules: '88',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      rating: '4.8',
      students: '10.2K',
      category: 'Frontend',
      trending: true
    },
    {
      title: 'Advanced Python for AI',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '9 months',
      modules: '82',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      rating: '4.9',
      students: '15.8K',
      category: 'Python',
      trending: true
    },
    {
      title: 'Cloud Native DevOps',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Expert',
      duration: '11 months',
      modules: '92',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      rating: '4.7',
      students: '8.9K',
      category: 'DevOps',
      trending: true
    },
    {
      title: 'Data Engineering Pro',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '10 months',
      modules: '86',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      rating: '4.8',
      students: '11.3K',
      category: 'Data Engineer',
      trending: true
    },
    {
      title: 'React Native Mobile Dev',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Intermediate',
      duration: '7 months',
      modules: '68',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      rating: '4.6',
      students: '9.7K',
      category: 'Frontend',
      trending: true
    },
    {
      title: 'Blockchain Development',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '9 months',
      modules: '78',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      rating: '4.8',
      students: '7.5K',
      category: 'Backend',
      trending: true
    },
    {
      title: 'Kubernetes Expert',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Expert',
      duration: '8 months',
      modules: '72',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      rating: '4.9',
      students: '6.8K',
      category: 'Cloud',
      trending: true
    },
    {
      title: 'Ethical Hacking Pro',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Advanced',
      duration: '10 months',
      modules: '84',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      rating: '4.7',
      students: '13.2K',
      category: 'Cyber Security',
      trending: true
    },
    {
      title: 'AWS Solutions Architect',
      image: 'https://ik.imagekit.io/ipo22webapp/96587e71447ca82f4b9dd7615eea1d6397c4d1c2.png?updatedAt=1759585799341',
      level: 'Expert',
      duration: '9 months',
      modules: '80',
      gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
      rating: '4.8',
      students: '14.6K',
      category: 'Cloud',
      trending: true
    }
  ];

  // Combined courses array
  const allCourses = [...courses];

  // Auto-scroll for trending section
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval;
    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1;
        }
      }, 30);
    };

    startScrolling();
    return () => clearInterval(scrollInterval);
  }, []);

  // Filter and sort function
  const getFilteredAndSortedCourses = () => {
    let filtered = [...allCourses];

    // Category filter
    if (selectedCategory !== 'All Courses') {
      if (selectedCategory === 'Trending') {
        filtered = filtered.filter(course => course.trending === true);
      } else {
        filtered = filtered.filter(course => 
          course.category === selectedCategory || 
          course.title.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
    }

    // Search filter - searches across title, category, tags, and level
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => {
        const titleMatch = course.title.toLowerCase().includes(query);
        const categoryMatch = course.category?.toLowerCase().includes(query);
        const levelMatch = course.level.toLowerCase().includes(query);
        const tagsMatch = course.tags?.some(tag => tag.toLowerCase().includes(query));
        
        return titleMatch || categoryMatch || levelMatch || tagsMatch;
      });
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course =>
        course.level.toLowerCase() === levelFilter.toLowerCase()
      );
    }

    // Duration filter
    if (durationFilter !== 'all') {
      filtered = filtered.filter(course => {
        const duration = parseInt(course.duration);
        if (durationFilter === 'short') return duration <= 5;
        if (durationFilter === 'medium') return duration > 5 && duration <= 8;
        if (durationFilter === 'long') return duration > 8;
        return true;
      });
    }

    // Sort
    if (sortBy === 'a-z') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'z-a') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'duration-asc') {
      filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    } else if (sortBy === 'duration-desc') {
      filtered.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => parseFloat(b.students) - parseFloat(a.students));
    }

    return filtered;
  };

  const filteredCourses = getFilteredAndSortedCourses();
  const trendingCourses = allCourses.filter(course => course.trending);
  const duplicatedTrending = [...trendingCourses, ...trendingCourses];

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('default');
    setLevelFilter('all');
    setDurationFilter('all');
    setSelectedCategory('All Courses');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#CCF6FF] via-[#E0F7FF] to-[#B3E5FF]">

      {/* Category Tabs */}
      <div className="container mx-auto px-4 mb-8 mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 border-2 rounded-full transition-all duration-300 font-semibold ${
                  selectedCategory === category
                    ? 'bg-[#00B4D8] text-white border-[#00B4D8] shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#00B4D8] hover:text-[#00B4D8]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            {selectedCategory === 'All Courses' ? 'All Courses' : `${selectedCategory} Courses`}
          </h2>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, index) => (
                <div
                  key={index}
                  className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div
                    className="h-full p-6 flex flex-col"
                    style={{ background: course.gradient }}
                  >
                    <div className="relative mb-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      {course.trending && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold uppercase shadow-lg">
                          Hot
                        </div>
                      )}
                      {course.rating && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                          <span className="text-yellow-500 text-sm"></span>
                          <span className="font-bold text-gray-800 text-sm">{course.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">{course.title}</h2>

                    {course.students && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-white/90 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                          </svg>
                          {course.students}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4 flex-grow">
                      <span className="px-3 py-1.5 text-white border-2 border-white/50 rounded-lg text-sm font-medium hover:bg-white/10 transition">
                        {course.level}
                      </span>
                      <span className="px-3 py-1.5 text-white border-2 border-white/50 rounded-lg text-sm font-medium hover:bg-white/10 transition">
                        {course.duration}
                      </span>
                      <span className="px-3 py-1.5 text-white border-2 border-white/50 rounded-lg text-sm font-medium hover:bg-white/10 transition">
                        {course.modules} Modules
                      </span>
                    </div>

                    <button className="w-full px-6 py-3 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition shadow-md hover:shadow-lg transform hover:scale-105">
                      Explore Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="mx-auto w-32 h-32 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-3xl font-bold text-gray-700 mb-3">No courses found</h3>
              <p className="text-gray-500 text-lg mb-6">Try adjusting your search or filters to find what you're looking for</p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-[#00B4D8] text-white font-semibold rounded-xl hover:bg-[#0096B8] transition shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Career Accelerators Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Ready to Reimagine Your Career?</h1>
          <p className="text-xl text-gray-600">Kickstart your career with confidence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {careerAccelerators.map((accelerator, index) => (
            <div
              key={index}
              className="relative h-[420px] bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              style={{ backgroundImage: `url("${accelerator.image}")` }}
            >
              <div className="absolute top-4 right-4 bg-[#66E5FF] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                NEW
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{accelerator.title}</h2>
                  <svg 
                    className="text-[#66E5FF] cursor-pointer hover:text-[#4dcff0] transition" 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M7 7h10v10M7 17L17 7" />
                  </svg>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-500 text-sm"> {accelerator.rating}</span>
                  <span className="text-gray-600 text-sm">• {accelerator.students} Students</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {accelerator.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-[#66E5FF] text-black text-sm font-medium rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 self-center font-semibold">+{accelerator.moreCount}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 px-3 py-1 bg-transparent border-2 border-[#66E5FF] text-black text-xs font-medium rounded-lg">
                    <img
                      src="https://ik.imagekit.io/ipo22webapp/dd633407c004d0747c47c11815a35f98692126fc.png?updatedAt=1759588354353"
                      alt="Level"
                      className="w-4 h-4"
                    />
                    {accelerator.level}
                  </span>

                  <span className="flex items-center gap-1 px-3 py-1 bg-transparent border-2 border-[#66E5FF] text-black text-xs font-medium rounded-lg">
                    <img
                      src="https://ik.imagekit.io/ipo22webapp/59690c968648007a2420eabecf38f3fed802c334.png?updatedAt=1759588564115"
                      alt="Duration"
                      className="w-4 h-4"
                    />
                    {accelerator.duration}
                  </span>

                  <span className="flex items-center gap-1 px-3 py-1 bg-transparent border-2 border-[#66E5FF] text-black text-xs font-medium rounded-lg">
                    <img
                      src="https://ik.imagekit.io/ipo22webapp/aa811ecebf620f0d8790c489d7fa4019bbe44911.png?updatedAt=1759588563739"
                      alt="AI Tools"
                      className="w-4 h-4"
                    />
                    {accelerator.aiTools}
                  </span>

                  <span className="flex items-center gap-1 px-3 py-1 bg-transparent border-2 border-[#66E5FF] text-black text-xs font-medium rounded-lg">
                    <img
                      src="https://ik.imagekit.io/ipo22webapp/b04dbda97308e590577f869e17e07cbee0ed620d.png?updatedAt=1759588563953"
                      alt="Modules"
                      className="w-4 h-4"
                    />
                    {accelerator.modules}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Courses Scroll Section */}
      <div className="w-full bg-gradient-to-r from-[#00B4D8] via-[#0096B8] to-[#00B4D8] py-16 my-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-white mb-3">Trending Courses</h2>
            <p className="text-xl text-white/90">Most popular courses chosen by professionals worldwide</p>
          </div>
          
          <div className="relative overflow-hidden py-6">
            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-hidden"
              style={{ scrollBehavior: 'smooth' }}
            >
              {duplicatedTrending.map((course, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-96 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 bg-white"
                >
                  <div
                    className="h-full p-6"
                    style={{ background: course.gradient }}
                  >
                    <div className="relative mb-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-56 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="font-bold text-gray-800">{course.rating}</span>
                      </div>
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg animate-pulse">
                        Trending
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">{course.title}</h2>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-white/90 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                        </svg>
                        {course.students} Students
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-2 border-white/30">
                        {course.level}
                      </span>
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-2 border-white/30">
                        {course.duration}
                      </span>
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-2 border-white/30">
                        {course.modules} Modules
                      </span>
                    </div>

                    <button className="w-full px-6 py-3 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                      Enroll Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CoursesPage;