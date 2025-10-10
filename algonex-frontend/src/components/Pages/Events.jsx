import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight, Search, Filter } from 'lucide-react';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingEvents = [
    {
      id: 1,
      title: 'AI & Machine Learning Workshop',
      date: 'Nov 15, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Microsoft Office, Bellandur',
      type: 'Workshop',
      mode: 'Offline',
      participants: 50,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
      description: 'Deep dive into AI agents and practical machine learning implementations',
      status: 'Upcoming',
      spots: 15
    },
    {
      id: 2,
      title: 'Cloud Computing Bootcamp',
      date: 'Nov 22, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'AWS Office, KR Puram',
      type: 'Bootcamp',
      mode: 'Offline',
      participants: 40,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
      description: 'Hands-on AWS cloud architecture and deployment strategies',
      status: 'Upcoming',
      spots: 20
    },
    {
      id: 3,
      title: 'Full Stack Development Webinar',
      date: 'Nov 28, 2025',
      time: '7:00 PM - 9:00 PM',
      location: 'Online',
      type: 'Webinar',
      mode: 'Online',
      participants: 200,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop',
      description: 'Modern web development practices and industry trends',
      status: 'Upcoming',
      spots: 50
    },
    {
      id: 4,
      title: 'DevOps & Agile Masterclass',
      date: 'Dec 5, 2025',
      time: '10:00 AM - 3:00 PM',
      location: 'ThoughtWorks, Whitefield',
      type: 'Masterclass',
      mode: 'Offline',
      participants: 35,
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop',
      description: 'CI/CD pipelines, containerization, and modern DevOps practices',
      status: 'Upcoming',
      spots: 10
    }
  ];

  const pastEvents = [
    {
      id: 5,
      title: 'AI Agents Workshop',
      date: 'Sep 20, 2024',
      location: 'Microsoft Office, Bellandur',
      type: 'Workshop',
      mode: 'Offline',
      participants: 60,
      image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&auto=format&fit=crop',
      description: 'Explored autonomous AI agents and their real-world applications',
      highlights: ['45+ attendees', 'Hands-on labs', 'Industry expert speakers']
    },
    {
      id: 6,
      title: 'Travel Tech Innovation Summit',
      date: 'Aug 15, 2024',
      location: 'Amadeus Office, Bangalore',
      type: 'Summit',
      mode: 'Offline',
      participants: 80,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop',
      description: 'Technology innovations in travel and hospitality industry',
      highlights: ['80+ professionals', 'Panel discussions', 'Networking sessions']
    },
    {
      id: 7,
      title: 'AWS Cloud Certification Drive',
      date: 'Jul 28, 2024',
      location: 'AWS Office, KR Puram',
      type: 'Certification',
      mode: 'Offline',
      participants: 55,
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop',
      description: 'Intensive AWS certification preparation workshop',
      highlights: ['55 participants', 'Mock exams', '90% pass rate']
    },
    {
      id: 8,
      title: 'Agile Transformation Workshop',
      date: 'Jun 10, 2024',
      location: 'ThoughtWorks, Whitefield',
      type: 'Workshop',
      mode: 'Offline',
      participants: 45,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
      description: 'Agile methodologies and continuous delivery practices',
      highlights: ['Real case studies', 'Interactive sessions', 'Certification']
    },
    {
      id: 9,
      title: 'Data Science Hackathon',
      date: 'May 25, 2024',
      location: 'Algonex Academy, Bangalore',
      type: 'Hackathon',
      mode: 'Offline',
      participants: 70,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
      description: '24-hour data science problem-solving competition',
      highlights: ['15 teams', 'Industry mentors', 'Prize pool ₹50K']
    },
    {
      id: 10,
      title: 'Tech Career Fair 2024',
      date: 'Apr 18, 2024',
      location: 'Online',
      type: 'Career Fair',
      mode: 'Online',
      participants: 150,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
      description: 'Connect with top companies for placement opportunities',
      highlights: ['30+ companies', '150+ candidates', '40 job offers']
    }
  ];

  const eventTypes = ['all', 'Workshop', 'Webinar', 'Bootcamp', 'Masterclass', 'Summit', 'Hackathon', 'Career Fair'];

  const filteredUpcoming = upcomingEvents.filter(event => 
    (activeFilter === 'all' || event.type === activeFilter) &&
    (searchQuery === '' || event.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPast = pastEvents.filter(event => 
    (activeFilter === 'all' || event.type === activeFilter) &&
    (searchQuery === '' || event.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CCF6FF] via-[#E0F7FF] to-[#B3E5FF]">
      {/* Hero Banner */}
      <div className="relative w-full h-[500px] md:h-[612px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] opacity-95"></div>
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop" 
          alt="Events Banner"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center drop-shadow-2xl">
            Events & Workshops
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl leading-relaxed">
            Join our community events, workshops, and networking sessions to accelerate your career growth
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
              <button className="bg-white text-[#00B4D8] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105">
                Register Now
              </button>
            </a>

            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#00B4D8] transition-all shadow-2xl">
              View Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-2xl text-center hover:shadow-3xl transition-all transform hover:scale-105">
            <div className="text-4xl font-bold text-[#00B4D8] mb-2">50+</div>
            <div className="text-gray-600 font-semibold">Events Hosted</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-2xl text-center hover:shadow-3xl transition-all transform hover:scale-105">
            <div className="text-4xl font-bold text-[#00B4D8] mb-2">3000+</div>
            <div className="text-gray-600 font-semibold">Participants</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-2xl text-center hover:shadow-3xl transition-all transform hover:scale-105">
            <div className="text-4xl font-bold text-[#00B4D8] mb-2">25+</div>
            <div className="text-gray-600 font-semibold">Partner Venues</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-2xl text-center hover:shadow-3xl transition-all transform hover:scale-105">
            <div className="text-4xl font-bold text-[#00B4D8] mb-2">4.8/5</div>
            <div className="text-gray-600 font-semibold">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeFilter === type
                      ? 'bg-[#00B4D8] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Upcoming Events</h2>
          <p className="text-gray-600 text-lg">Register now to secure your spot</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredUpcoming.map(event => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02] border-2 border-[#66E5FF]">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#00B4D8] text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                  {event.type}
                </div>
                <div className="absolute top-4 left-4 bg-white text-[#00B4D8] px-4 py-2 rounded-xl font-bold shadow-lg">
                  {event.mode}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="text-[#00B4D8]" size={20} />
                    <span className="font-semibold">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="text-[#00B4D8]" size={20} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="text-[#00B4D8]" size={20} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="text-[#00B4D8]" size={20} />
                    <span>{event.spots} spots remaining</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                  Register Now <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Events */}
      <div className="bg-white/60 backdrop-blur-sm py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Past Events</h2>
            <p className="text-gray-600 text-lg">Explore our successful event history</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredPast.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-[#66E5FF]">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {event.type}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="text-[#00B4D8]" size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="text-[#00B4D8]" size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="bg-[#E6FAFF] p-4 rounded-xl border-2 border-[#66E5FF]">
                    <div className="font-semibold text-[#00B4D8] mb-2 text-sm">Highlights:</div>
                    <div className="space-y-1">
                      {event.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-[#00B4D8] font-bold">•</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Partners */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Event Partners</h2>
          <p className="text-gray-600 text-lg">Collaborating with industry leaders</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {['Microsoft', 'AWS', 'ThoughtWorks', 'Amadeus', 'Google Cloud'].map((partner, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center border-2 border-[#66E5FF]">
              <div className="text-2xl font-bold text-[#00B4D8]">{partner}</div>
            </div>
          ))}
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Never Miss an Event!</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Subscribe to our newsletter to get updates on upcoming workshops, webinars, and networking events
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-xl text-gray-800 font-semibold w-full md:w-96 focus:outline-none focus:ring-4 focus:ring-white"
            />
            <button className="bg-white text-[#00B4D8] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;