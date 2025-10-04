import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection/HeroSection';
import CourseExploration from '../components/CourseExploration/CourseExploration';
import CareerProspects from '../components/CareerProspects/CareerProspects';
import StudentTestimonials from '../components/StudentTestimonials/StudentTestimonials';
import FAQ from '../components/FAQ/FAQ';
import WhyAlgonex from '../components/WhyAlgonex/WhyAlgonex';
import LearnFromExperts from '../components/LearnFromExperts/LearnFromExperts';
import { ALGONEX_FAQS } from '../constants/constant';
const Home = () => {
    return (
        <div>
            <HeroSection />
            <CourseExploration />
            <CareerProspects />
            <StudentTestimonials />
            <FAQ faqs={ALGONEX_FAQS} />
            <WhyAlgonex />
            <LearnFromExperts />
        </div>
    );
};

export default Home;