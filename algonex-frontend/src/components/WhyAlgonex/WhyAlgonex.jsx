import React from 'react';
import './WhyAlgonex.css';

const WhyAlgonex = () => {
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
      overlay: 'Solving Problems Matter',
      alt: 'Team collaboration'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      alt: 'Professional mentor'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=200&fit=crop',
      overlay: 'Real Industry Real Connections',
      alt: 'Microsoft Innovation Hub'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop',
      alt: 'Conference attendees'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop',
      overlay: 'Smarter with GEN AI',
      alt: 'AI presentation'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop',
      alt: 'Team thumbs up'
    }
  ];

  return (
    <div className="why-algonex">
      <div className="section-header">
        <h2 className="section-title">Why Algonex</h2>
      </div>
      
      <div className="images-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.src} alt={image.alt} className="grid-image" />
            {image.overlay && (
              <div className="image-overlay">
                <h3 className="overlay-text">{image.overlay}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyAlgonex;
