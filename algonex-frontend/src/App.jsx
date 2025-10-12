import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Courses from './components/Pages/Courses';
import Allcourses from './components/Pages/Allcourses';
import Events from './components/Pages/Events';
import AboutUs from './components/Pages/AboutUs';
import Contact from './components/Pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signin from './components/Pages/Signin';
import FrontendCourse from './components/ExploreCourses/FrontendCourse';
import PythonCourse from './components/ExploreCourses/PythonCourse';
import BackendCourse from './components/ExploreCourses/BackendCourse';
import CloudCourse from './components/ExploreCourses/CloudCourse';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Top Banner */}
        <div className="bg-[#00D4FF] text-center py-5 font-semibold">
          Boost Your Professional Growth with Our Certified Training Courses - Flat 20% Off Course Fee
        </div>

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/events" element={<Events />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/allcourses" element={<Allcourses />} />
          <Route path="/explore-course/frontend" element={<FrontendCourse />} />
          <Route path="/explore-course/python" element={<PythonCourse />} />
          <Route path="/explore-course/backend" element={<BackendCourse />} />
          <Route path="/explore-course/cloud" element={<CloudCourse />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
