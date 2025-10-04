import React from 'react'
import Navbar from './components/Navbar/Navbar'
import TopBanner from './components/TopBanner/TopBanner'
import './App.css'
import Home from './pages/Home'
import Course from './pages/Course'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <TopBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<Course />} />
      </Routes>
    </Router>
  )
}

export default App


