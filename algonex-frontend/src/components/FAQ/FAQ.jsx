import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I know which career path is right for me?',
      answer: 'Our career assessment tools and expert guidance help you identify your strengths, interests, and market opportunities to choose the right path.'
    },
    {
      id: 2,
      question: 'Where should I search for jobs and internships?',
      answer: 'We provide access to our exclusive job portal, partner company listings, and direct connections with hiring managers from top companies.'
    },
    {
      id: 3,
      question: 'What are the most common interview questions for freshers?',
      answer: 'We cover technical questions, behavioral questions, and industry-specific scenarios with detailed preparation materials and mock interviews.'
    },
    {
      id: 4,
      question: 'How do I prepare for technical interviews?',
      answer: 'Our structured curriculum includes coding challenges, system design concepts, and hands-on projects that mirror real interview scenarios.'
    },
    {
      id: 5,
      question: 'Which programming languages should I learn first?',
      answer: 'Based on current market demand, we recommend starting with Python or JavaScript, followed by specialized languages based on your career goals.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <div className="section-header">
        <h2 className="section-title">Frequently Asked Questions</h2>
      </div>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="faq-item">
            <button 
              className={`faq-question ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className="faq-icon">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
