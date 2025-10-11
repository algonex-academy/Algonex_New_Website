import React from 'react';
import { useParams } from 'react-router-dom';
import { STACKS } from '../constants/constant';
import Courses from '../components/Courses/Courses';
import CourseBanner from '../components/CourseBanner/CourseBanner';
import ExploreModules from "../components/Modules/ExploreModules";
import Module from "../components/Modules/Module";
import FAQ from "../components/FAQ/FAQ";
import Skills from "../components/Skills/Skills";
import StudentSuccessStories from "../components/StudentSuccessStories/StudentSuccessStories";
import './Course.scss';

const StackPage = () => {
    const { id } = useParams();
    const course = STACKS.find((course) => course.id === parseInt(id));
    
    return (
        <div className="course-page">
            <CourseBanner course={course} />
            
            <div className="course-page-content">
                <ExploreModules course={course} />
                <Skills course={course} />
                <div className="modules-section">
                    <div className="section-header">
                        <h2 className="section-title">Course Modules</h2>
                        <p className="section-subtitle">Comprehensive curriculum designed for your success</p>
                    </div>
                    <div className="modules-list">
                        {course.modules.map((module) => (
                            <Module key={module.id} module={module} />
                        ))}
                    </div>
                </div>
                <div className="trending-courses-section">
                    <div className="section-header">
                        <h2 className="section-title">Trending Courses</h2>
                        <p className="section-subtitle">Explore other popular courses</p>
                    </div>
                    <Courses courses={STACKS.filter((course) => course.isTrending)} />
                </div>
                <StudentSuccessStories testimonials={course.testimonials} />
                <FAQ faqs={course.faq} />
            </div>
        </div>
    );
};

export default StackPage;