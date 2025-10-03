import React from 'react';
import './Navbar.css';

const Navbar = () => {
    const navbarOptions = [
        { id: 1, name: 'Home', link: '#home' },
        { id: 2, name: 'Courses', link: '#courses' },
        { id: 3, name: 'Events', link: '#events' },
        { id: 4, name: 'About us', link: '#about' },
        { id: 5, name: 'Contact', link: '#contact' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <div className="logo">
                        <span className="logo-a">A</span>
                    </div>
                </div>
                <div className="navbar-menu">
                    {navbarOptions.map((option) => (
                        <a key={option.id} href={option.link} className="navbar-link">
                            {option.name}
                        </a>
                    ))}
                </div>
                <div className="navbar-actions">
                    <button className="signup-btn">Sign up</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;