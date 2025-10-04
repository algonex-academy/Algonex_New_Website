import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="container mx-auto flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="https://ik.imagekit.io/ipo22webapp/Picture1.png?updatedAt=1759509431158"
          alt="EduTech Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-6 text-gray-700 font-medium">
        <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
        <li><Link to="/courses" className="hover:text-blue-500">Courses</Link></li>
        <li><Link to="/events" className="hover:text-blue-500">Events</Link></li>
        <li><Link to="/aboutus" className="hover:text-blue-500">About Us</Link></li>
        <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
        <li>
          <Link to="/signup">
            <button className="px-4 py-2 rounded border border-black cursor-pointer transition duration-300 hover:bg-blue-500 hover:text-white">
              Sign Up
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
