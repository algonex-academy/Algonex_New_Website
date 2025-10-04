import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
          {/* Future routes can be added here */}
          {/* <Route path="/courses" element={<Courses />} /> */}
          {/* <Route path="/events" element={<Events />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
