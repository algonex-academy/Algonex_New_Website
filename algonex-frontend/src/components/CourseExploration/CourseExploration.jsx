import React, { useState } from 'react';
import './CourseExploration.css';

const CourseExploration = () => {
  const [selectedCategory, setSelectedCategory] = useState('Trending');

  const categories = [
    'Trending', 'Front End', 'Back End', 'Data Engineer', 
    'Java', 'Python', 'Excel', 'Gen AI',
    'Data Courses', 'Cyber Security', 'DevOps', 'AWS', 
    'Machine Learning', 'Power BI', 'Testing', 'GitHub'
  ];

  const courses = [
    {
      id: 1,
      title: 'HTML',
      level: 'Beginner Level',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 2,
      title: 'HTML',
      level: 'Beginner Level',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 3,
      title: 'HTML',
      level: 'Beginner Level',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 4,
      title: 'PYTHON',
      level: 'Beginner',
      duration: '6 months',
      students: '56',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      isTrending: true
    },
    {
      id: 5,
      title: 'HTML',
      level: 'Beginner Level',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 6,
      title: 'HTML',
      level: 'Beginner Level',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 7,
      title: 'HTML',
      level: 'Beginner Level',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 8,
      title: 'HTML',
      level: 'Beginner Level',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ];

  return (
    <div className="course-exploration">
      <div className="section-header">
        <h2 className="section-title">EXPLORE ONLINE COURSES</h2>
      </div>
      
      <div className="category-tags">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card" style={{ background: course.gradient }}>
            {course.isTrending && (
              <div className="trending-badge">Trending</div>
            )}
            <div className="course-image">
              <img src={course.image} alt={course.title} />
            </div>
            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              {course.isTrending ? (
                <div className="course-tags">
                  <span className="tag">Beginner</span>
                  <span className="tag">{course.duration}</span>
                  <span className="tag">{course.students}</span>
                </div>
              ) : (
                <p className="course-level">{course.level}</p>
              )}
              <button className="explore-btn">Explore Course</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseExploration;
