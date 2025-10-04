import React from 'react';
import { useParams } from 'react-router-dom';
import { COURSES } from '../constants/constant';
import Courses from '../components/Courses/Courses';
import CourseBanner from '../components/CourseBanner/CourseBanner';
import ExploreModules from "../components/Modules/ExploreModules";
import Module from "../components/Modules/Module";
import FAQ from "../components/FAQ/FAQ";
const Course = () => {
    const { id } = useParams();
    const course = COURSES.find((course) => course.id === parseInt(id));
    return (
        <div className="course-page">
            <CourseBanner course={course} />
            <ExploreModules course={course} />
            <div className="modules-list">
                {course.modules.map((module) => (
                    <Module key={module.id} module={module} />
                ))}
            </div>
            <FAQ faqs={course.faq} />
            <div className="trending-courses">
                <div className="section-header">
                    <h2 className="section-title">Trending Courses</h2>
                </div>
                <Courses courses={COURSES.filter((course) => course.isTrending)} />
            </div>
        </div>
    );
};

export default Course;