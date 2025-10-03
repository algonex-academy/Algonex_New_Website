import React from 'react';
import './CareerProspects.css';

const CareerProspects = () => {
  const stats = [
    {
      id: 1,
      number: '6LPA',
      title: 'Top Average',
      subtitle: 'Placement Package'
    },
    {
      id: 2,
      number: '500+',
      title: 'Trained Alumni',
      subtitle: 'Countless Success Stories'
    },
    {
      id: 3,
      number: '50+',
      title: 'Hiring Partners',
      subtitle: 'including MNC\'s'
    },
    {
      id: 4,
      number: '25+',
      title: 'Hackathons Building',
      subtitle: 'Problem-Solvers'
    }
  ];

  return (
    <div className="career-prospects">
      <div className="section-header">
        <h2 className="section-title">Stellar Career Prospects</h2>
        <p className="section-subtitle">Launch Your Career with Proven Success</p>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-subtitle">{stat.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerProspects;
