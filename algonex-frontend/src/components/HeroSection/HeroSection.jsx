import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Become Top 1% in the<br />
            <span className="highlight">Al-First World</span>
          </h1>
          <p className="hero-description">
            Whether it is Product, Growth, Design, Business, Tech or Data, 
            GrowthSchool is the place to learn from top experts in the field 
            to become the Top 1%
          </p>
          <div className="social-proof">
            <div className="social-avatars">
              <div className="avatar avatar-1"></div>
              <div className="avatar avatar-2"></div>
              <div className="avatar avatar-3"></div>
              <div className="avatar avatar-4"></div>
            </div>
            <span className="social-text">adafghhdhdfb</span>
          </div>
          <div className="hero-buttons">
            <button className="btn btn-outline">Learn more</button>
            <button className="btn btn-primary">Explore more</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-bg-pattern"></div>
        </div>
      </div>
      <div className="carousel-indicators">
        <div className="indicator active"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
        <div className="indicator"></div>
      </div>
    </div>
  );
};

export default HeroSection;
