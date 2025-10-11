import React, { useState } from 'react';
import './FAQ.scss';

const FAQ = ({faqs}) => {
  const [openIndex, setOpenIndex] = useState(null);

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
          <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
            <div className="faq-question-container">
              <span className="faq-question">{faq.question}</span>
              <button 
                className="faq-icon"
                onClick={() => toggleFAQ(index)}
                aria-label={openIndex === index ? 'Close answer' : 'Open answer'}
              >
                {openIndex === index ? '−' : '+'}
              </button>
            </div>
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
