import React from 'react';
import { useNavigate } from 'react-router-dom';
import './courses.scss';

const Courses = ({ courses }) => {
    const navigate = useNavigate();
    return (
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
                    <button onClick={() => navigate(`/course/${course.id}`)} className="explore-btn">Explore Course</button>
                </div>
                </div>
            ))}
        </div>
    );
};
export default Courses;