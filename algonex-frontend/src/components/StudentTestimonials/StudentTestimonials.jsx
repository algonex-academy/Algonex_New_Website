import React from 'react';
import './StudentTestimonials.css';

const StudentTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'ati Geethika',
      role: 'Final-year B.Tech Student',
      program: 'Artificial Intelligence & Data Science',
      text: '...attended the DevRel ft, Bangalore! opportunity to connect lations professionals, nd fellow enthusiasts at sightful community en part of red the evolving role of oper experience is rowth, and the power...',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'M Praveen kumar',
      role: 'Sri Venkateswara, Final-year B.Tech',
      program: 'Artificial Intelligence & Data Science',
      text: 'Grateful to have attended DevRel Meetup #8 at Microsoft, Bengaluru! It was an incredible gathering of developers, tech enthusiasts, and community leaders. The sessions were insightful, covering real-world developer experiences and tools. Loved the energy. innovation, and openness of the DevRel community. Engaging conversations and networking made it even more memorable.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Bhavitha Ch',
      role: 'N.B.K.R. Final-year B.Tech Student',
      program: 'Artificial Intelligence & Data Science',
      text: 'Attending the DevRel Meetup in Bengaluru was an incredibly enriching experience that left me both inspired and grateful. Being surrounded by passionate developer advocates, community builders, and tech enthusiasts reminded me just how powerful collaboration and knowledge-sharing can be. From insightful conversations to actionable takeaways.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Shaik Moneesha',
      role: 'Sri Venkateswara, Final-year B.Tech',
      program: 'Computer Science Student',
      text: 'I had the opportunity to attend a online workshop organized by Alognex focused on Resume creation, website development and etc. The session enhanced my understanding of industry practices, tools, and real-world use cases, while also allowing me to collaborate with professionals and peers in a dynamic learning environment Thanks to Algonex IT Solutions......',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Renuka Duvvuru',
      role: 'N.B.K.R. Final-year B.Tech Student',
      program: 'Artificial Intelligence & Data Science',
      text: 'Exciting Milestone Achieved! I am thrilled to share that I have successfully completed my Python Industrial Internship at Algonex IT Solutions in Bengaluru, from June 14, 2025, to August 14, 2025. Throughout this enriching journey, I had the opportunity to work on real-time projects as a Python Developer and gained hands-on experience with the following tools and technologies........',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'Jayanthi Santenna',
      role: 'Sri Venkateswara, Final-year B.Tech',
      program: 'Artificial Intelligence & Data Science',
      text: 'I\'m happy to share that I\'m starting a new position as Intern at Algonex IT Solutions! I\'m a passionate AI & ML undergraduate with a deep interest in research-driven innovation, especially in healthcare and intelligent systems. My goal is to apply machine learning and data-driven methods to solve real-world problems that impact lives........',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 7,
      name: 'ati Geethika',
      role: 'Final-year B.Tech Student',
      program: 'Artificial Intelligence & Data Science',
      text: '...attended the DevRel ft, Bangalore! opportunity to connect lations professionals, nd fellow enthusiasts at sightful community en part of red the evolving role of oper experience is rowth, and the power...',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 8,
      name: 'M Praveen kumar',
      role: 'Sri Venkateswara, Final-year B.Tech',
      program: 'Artificial Intelligence & Data Science',
      text: 'Grateful to have attended DevRel Meetup #8 at Microsoft, Bengaluru! It was an incredible gathering of developers, tech enthusiasts, and community leaders. The sessions were insightful, covering real-world developer experiences and tools. Loved the energy. innovation, and openness of the DevRel community. Engaging conversations and networking made it even more memorable.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 9,
      name: 'Bhavitha Ch',
      role: 'N.B.K.R. Final-year B.Tech Student',
      program: 'Artificial Intelligence & Data Science',
      text: 'Attending the DevRel Meetup in Bengaluru was an incredibly enriching experience that left me both inspired and grateful. Being surrounded by passionate developer advocates, community builders, and tech enthusiasts reminded me just how powerful collaboration and knowledge-sharing can be. From insightful conversations to actionable takeaways.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 10,
      name: 'Shaik Moneesha',
      role: 'Sri Venkateswara, Final-year B.Tech',
      program: 'Computer Science Student',
      text: 'I had the opportunity to attend a online workshop organized by Alognex focused on Resume creation, website development and etc. The session enhanced my understanding of industry practices, tools, and real-world use cases, while also allowing me to collaborate with professionals and peers in a dynamic learning environment Thanks to Algonex IT Solutions......',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 11,
      name: 'Renuka Duvvuru',
      role: 'N.B.K.R. Final-year B.Tech Student',
      program: 'Artificial Intelligence & Data Science',
      text: 'Exciting Milestone Achieved! I am thrilled to share that I have successfully completed my Python Industrial Internship at Algonex IT Solutions in Bengaluru, from June 14, 2025, to August 14, 2025. Throughout this enriching journey, I had the opportunity to work on real-time projects as a Python Developer and gained hands-on experience with the following tools and technologies........',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: 12,
      name: 'Jayanthi Santenna',
      role: 'Sri Venkateswara, Final-year B.Tech',
      program: 'Artificial Intelligence & Data Science',
      text: 'I\'m happy to share that I\'m starting a new position as Intern at Algonex IT Solutions! I\'m a passionate AI & ML undergraduate with a deep interest in research-driven innovation, especially in healthcare and intelligent systems. My goal is to apply machine learning and data-driven methods to solve real-world problems that impact lives........',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face'
    }
  ];

  return (
    <div className="student-testimonials">
      <div className="section-header">
        <h2 className="section-title">What Our Students Say</h2>
        <p className="section-description">
          ffgaglgkgsjgimvrgoaenbobekbmekbmefkme klmdfkmbfkmbfkmbppfmbmbpkemfbpmfbdfmbf bdlfbmfklmdlkmfbklfdmfkbmkfmbkfkdkk
        </p>
      </div>
      
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="linkedin-icon">
              <span>in</span>
            </div>
            <div className="testimonial-content">
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="student-info">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="student-avatar"
                />
                <div className="student-details">
                  <h4 className="student-name">{testimonial.name}</h4>
                  <p className="student-role">{testimonial.role}</p>
                  <p className="student-program">{testimonial.program}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTestimonials;
