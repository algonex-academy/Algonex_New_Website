import React from 'react';
import './Navbar.css';
import navbarOptions from './navbarOptions';
const Navbar = () => {
    return (
        <div className="home-navbar">
            {navbarOptions.map((option) => (
                <div key={option.id} className="home-navbar-option">
                    <a href={option.link}>{option.name}</a>
                </div>
            ))}
        </div>
    );
};
export default Navbar;