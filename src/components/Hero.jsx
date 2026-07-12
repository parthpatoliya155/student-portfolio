/* 
  Hero.jsx
  Hero Section Component
  Author: Parth Patoliya | Student Portfolio
  
  This component displays the prominent header introduction for Parth Patoliya.
  It takes name, title, and college from App.jsx via React props, keeping
  the component decoupled and reusable.
*/

import React from 'react';

// Functional component receiving name, title, and college as props
function Hero({ name, title, college }) {
  return (
    <section className="hero-section" id="hero">
      <div className="container hero-grid">
        {/* Left Column: text details and actions */}
        <div className="hero-content">
          <span className="hero-badge">Welcome to my Portfolio</span>
          
          <h1 className="hero-title">
            Hi, I am <br />
            <span>{name}</span>
          </h1>

          <h2 className="hero-subtitle">{title}</h2>
          
          <div className="hero-college">
            {/* College SVG Badge */}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
            <span>{college}</span>
          </div>

          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Contact Me
            </a>
          </div>
        </div>

        {/* Right Column: modern floating card graphic */}
        <div className="hero-visual">
          <div className="hero-circle" />
          <div className="hero-logo-card">
            {/* Visual Icon representing IT & Coding */}
            <div className="hero-icon">💻</div>
            <h3>Parth Patoliya</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              React.js & AI Specialist
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
