import React from 'react';
import './LearnFromExperts.css';

const LearnFromExperts = () => {
  const steps = [
    {
      id: 1,
      number: '01',
      title: 'FOUNDATION FIRST',
      description: 'Master core concepts with clarity and build confidence in fundamentals',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      borderColor: '#ff9a9e'
    },
    {
      id: 2,
      number: '02',
      title: 'SKILL UP',
      description: 'Learn by doing through guided exercises and industry technologies',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      borderColor: '#a8edea'
    },
    {
      id: 3,
      number: '03',
      title: 'BUILD TO SOLVE',
      description: 'Solve real-world challenges and create portfolio-ready work',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      borderColor: '#d299c2'
    },
    {
      id: 4,
      number: '04',
      title: 'GROW WITH EXPERTS',
      description: 'Mentorship & Masterclasses, Learn from industry leaders, Get personalized feedback',
      gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      borderColor: '#89f7fe'
    }
  ];

  return (
    <div className="learn-from-experts">
      <div className="section-header">
        <h2 className="section-title">Learn From Experts</h2>
        <p className="section-subtitle">YOUR JOURNEY TOWARDS YOUR DREAM COMPANY</p>
      </div>
      
      <div className="timeline-container">
        <div className="timeline-line"></div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.id} className={`step-card step-${index + 1}`}>
              <div className="step-number">{step.number}</div>
              <div 
                className="step-content"
                style={{ 
                  background: step.gradient,
                  borderColor: step.borderColor
                }}
              >
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnFromExperts;
