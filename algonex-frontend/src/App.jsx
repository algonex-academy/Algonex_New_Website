import React from 'react'
import Navbar from './components/Navbar/Navbar'
import TopBanner from './components/TopBanner/TopBanner'
import HeroSection from './components/HeroSection/HeroSection'
import CourseExploration from './components/CourseExploration/CourseExploration'
import CareerProspects from './components/CareerProspects/CareerProspects'
import StudentTestimonials from './components/StudentTestimonials/StudentTestimonials'
import FAQ from './components/FAQ/FAQ'
import WhyAlgonex from './components/WhyAlgonex/WhyAlgonex'
import LearnFromExperts from './components/LearnFromExperts/LearnFromExperts'
import './App.css'

function App() {
  return (
    <div className="app">
      <TopBanner />
      <Navbar />
      <HeroSection />
      <CourseExploration />
      <CareerProspects />
      <StudentTestimonials />
      <FAQ />
      <WhyAlgonex />
      <LearnFromExperts />
    </div>
  )
}

export default App
