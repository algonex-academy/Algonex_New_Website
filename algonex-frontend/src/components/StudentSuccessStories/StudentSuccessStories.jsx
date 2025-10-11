import React, { useRef, useEffect, useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import './StudentSuccessStories.scss';

const StudentSuccessStories = ({ testimonials }) => {
    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-scroll functionality with infinite loop
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || isPaused) return;

        const scrollInterval = setInterval(() => {
            const scrollWidth = scrollContainer.scrollWidth;
            const halfWidth = scrollWidth / 2;

            scrollContainer.scrollLeft += 1;

            // When we reach the halfway point (end of first set), seamlessly reset to start
            // We check if we've scrolled past the halfway point
            if (scrollContainer.scrollLeft >= halfWidth) {
                // Reset to the beginning without animation for seamless loop
                scrollContainer.scrollLeft = 0;
            }
        }, 30);

        return () => clearInterval(scrollInterval);
    }, [isPaused]);

    return (
        <div className="success-stories-section">
            <div className="section-header">
                <h2 className="section-title">Student Success Stories</h2>
                <p className="section-subtitle">
                    Hear from students who transformed their careers after completing our program
                </p>
            </div>
            <div className="carousel-container">
                <div 
                    className="testimonials-carousel"
                    ref={scrollContainerRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* First set of testimonials */}
                    {testimonials.map((testimonial, idx) => (
                        <div key={`first-${idx}`} className="testimonial-card">
                            <div className="testimonial-header">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className="testimonial-image"
                                />
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">{testimonial.name}</h4>
                                    <p className="testimonial-role">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={18} className="star-icon" />
                                ))}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-footer">
                                <CheckCircle className="check-icon" size={24} />
                            </div>
                        </div>
                    ))}
                    {/* Duplicate set for infinite loop effect */}
                    {testimonials.map((testimonial, idx) => (
                        <div key={`second-${idx}`} className="testimonial-card">
                            <div className="testimonial-header">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className="testimonial-image"
                                />
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">{testimonial.name}</h4>
                                    <p className="testimonial-role">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={18} className="star-icon" />
                                ))}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-footer">
                                <CheckCircle className="check-icon" size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentSuccessStories;

