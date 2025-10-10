import React from 'react';
import { FaWhatsapp, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-2xl font-bold mb-4 text-[#66E5FF]">Algonex Academy</h4>
              <p className="text-gray-400 mb-4">
                Empowering careers through innovative education and community events
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-[#66E5FF]">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">Contact</a></li>
                <div className='flex justify-center gap-5'>
                  <li>
                  <a
                    href="https://wa.me/919000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 hover:text-[#25D366] transition-colors"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/algonex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 hover:text-[#0A66C2] transition-colors"
                  >
                    <FaLinkedin size={20} />
                  </a>
                </li>
                </div>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-[#66E5FF]">Event Types</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">Workshops</a></li>
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">Bootcamps</a></li>
                <li><a href="#" className="hover:text-[#66E5FF] transition-colors">Career Fairs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-[#66E5FF]">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Bangalore, Karnataka</li>
                <li>events@algonexacademy.com</li>
                <li>+91 1800-123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2025 Algonex Academy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
