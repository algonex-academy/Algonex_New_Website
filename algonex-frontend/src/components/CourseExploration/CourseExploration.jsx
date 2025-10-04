import React, { useState } from 'react';
import './CourseExploration.css';
import { useNavigate } from 'react-router-dom';
import Courses from '../Courses/Courses';
import { COURSES } from '../../constants/constant';
const CourseExploration = () => {
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const navigate = useNavigate();
  const categories = [
    'Trending', 'Front End', 'Back End', 'Data Engineer', 
    'Java', 'Python', 'Excel', 'Gen AI',
    'Data Courses', 'Cyber Security', 'DevOps', 'AWS', 
    'Machine Learning', 'Power BI', 'Testing', 'GitHub'
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
      <Courses courses={COURSES} />
    </div>
  );
};

export default CourseExploration;
