import React from 'react';

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
        <li><a href="#home" className="hover:text-blue-500">Home</a></li>
        <li><a href="#courses" className="hover:text-blue-500">Courses</a></li>
        <li><a href="#events" className="hover:text-blue-500">Events</a></li>
        <li><a href="#aboutus" className="hover:text-blue-500">About Us</a></li>
        <li><a href="#contact" className="hover:text-blue-500">Contact</a></li>
        <li>
          <a href="#signup">
            <button className="px-4 py-2 rounded border border-black cursor-pointer transition duration-300">
              Sign Up
            </button>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
