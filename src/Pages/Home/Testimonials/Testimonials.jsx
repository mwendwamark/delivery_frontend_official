import React, { useState, useEffect } from "react";
import "./Testimonials.css";
import { GiGlassCelebration } from "react-icons/gi";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaStar } from "react-icons/fa";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Mark Ramirez",
      position: "Owner of Luna Inc",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "Their team took our wellness brand and elevated it to new heights with their thoughtful designs and strategic branding. They've helped us create a cohesive and compelling brand identity. What sets Kelola apart is their passion for storytelling through design.",
      rating: 5,
      company: "Luna Inc"
    },
    {
      id: 2,
      name: "Joe Ghazi",
      position: "CEO Glow Co.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "In the fast-paced world of tech, it's crucial to have a creative partner who can keep up with our innovative ideas. Kelola not only kept up but exceeded our expectations. They transformed our marketing campaigns with their fresh perspective and bold designs.",
      rating: 5,
      company: "Glow Co.",
      featured: true
    },
    {
      id: 3,
      name: "Thomas Gala",
      position: "Director of Malisimo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      quote: "As a fellow creative professional, I have high standards when it comes to design. Kelola not only met but exceeded those standards. Their approach to our website redesign was nothing short of brilliant also optimized it for a seamless user experience.",
      rating: 5,
      company: "Malisimo"
    }
  ];

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === currentTestimonial) return;
    setIsAnimating(true);
    setCurrentTestimonial(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="home-testimonials section">
      <div className="testimonials-background">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>

      <div className="home-testimonial_contents container">
        <div className="home-testimonial_title">
          <span className="subtitle-center">
            <GiGlassCelebration className="subtitle-icon" />
            TESTIMONIALS
          </span>
          <h2 className="text-thick">
            What Our Client Say About 
            <span className="brand-highlight">
               Liquor ChapChap.
              <div className="circle-animation">
                <svg className="circle-svg" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="2"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                    className="circle-path"
                  />
                </svg>
              </div>
            </span>
          </h2>
        </div>

        <div className="testimonials-container">
          {/* Navigation Arrows */}
          <button 
            className="nav-arrow nav-arrow-left"
            onClick={prevTestimonial}
            disabled={isAnimating}
          >
            <FaChevronLeft />
          </button>

          <button 
            className="nav-arrow nav-arrow-right"
            onClick={nextTestimonial}
            disabled={isAnimating}
          >
            <FaChevronRight />
          </button>

          {/* Testimonials Grid */}
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => {
              let positionClass = '';
              if (index === currentTestimonial) positionClass = 'center';
              else if (index === (currentTestimonial - 1 + testimonials.length) % testimonials.length) positionClass = 'left';
              else if (index === (currentTestimonial + 1) % testimonials.length) positionClass = 'right';
              else positionClass = 'hidden';

              return (
                <div
                  key={testimonial.id}
                  className={`testimonial-card ${positionClass} ${isAnimating ? 'animating' : ''}`}
                  onClick={() => goToTestimonial(index)}
                >
                  <div className="testimonial-content">
                    <div className="quote-icon">
                      <FaQuoteLeft />
                    </div>
                    
                    <div className="testimonial-text">
                      <p>"{testimonial.quote}"</p>
                    </div>

                    <div className="rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="star" />
                      ))}
                    </div>

                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <img src={testimonial.avatar} alt={testimonial.name} />
                        <div className="avatar-ring"></div>
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">{testimonial.name}</h4>
                        <p className="author-position">{testimonial.position}</p>
                        <span className="company-name">{testimonial.company}</span>
                      </div>
                    </div>
                  </div>

                  {testimonial.featured && (
                    <div className="featured-badge">
                      <span>Featured</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => goToTestimonial(index)}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${((currentTestimonial + 1) / testimonials.length) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="testimonial-stats">
          <div className="stat-item">
            <div className="stat-number">150+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;