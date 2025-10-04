import React from 'react';
import './courseBanner.scss';

const CourseBanner = ({ course }) => {
  return (
    <div className="course-banner">
        <img className="course-banner-image" src={course.banner} alt={course.name} />
        <div className="course-banner-overlay">
            <p className="course-banner-text">{course.banner_text}</p>
            <button className="course-banner-button">Explore Course</button>
            <div className="course-banner-details">
                <div className="course-banner-details-box">
                    <h4>Course Duration</h4>
                    <p>{course.duration}</p>
                </div>
                <div className="course-banner-details-box">
                    <h4>Course level</h4>
                    <p>{course.recommended.level}</p>
                    <p>{course.recommended.prior_knowledge}</p>
                </div>
                <div className="course-banner-details-box">
                    <h4>Course rating</h4>
                    <p>{course.rating}</p>
                    <p>{course.reviews}</p>
                </div>
                <div className="course-banner-details-box">
                    <h4>Course students</h4>
                    <p>{course.students}</p>
                </div>
                <div className="course-banner-details-box">
                    <h4>Course modules</h4>
                    <p>{course.modules.length}</p>
                </div>
            </div>
        </div>
    </div>
    );
};
export default CourseBanner;