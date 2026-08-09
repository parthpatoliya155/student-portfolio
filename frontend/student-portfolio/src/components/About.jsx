/* 
  About.jsx
  About Me Section Component
  Author: Parth Patoliya | Student Portfolio
  
  This component displays the personal background narrative. It organizes
  the information into a sleek 2-column format: personal statements and 
  aspirations on one side, and structured info cards (like Degree, University, 
  and Career Goal) on the other.
*/

import React from 'react';

function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">Get to know my interests, goals, and passions</p>

        <div className="about-grid">
          {/* Left Side: Personal Narrative & Philosophy */}
          <div className="about-text">
            <h3>My Passion & Vision</h3>
            <p>
              I am a passionate Information Technology student with a strong interest in 
              Web Development, Artificial Intelligence, Machine Learning, and Data Science.
            </p>
            <p>
              I enjoy solving complex programming problems, learning algorithms, and building 
              real-world projects using modern web technologies. I believe technology is a 
              powerful tool to make lives easier and build a better future.
            </p>
            <p>
              My long-term goal is to work as an AI Engineer, gain industry experience, 
              and later build my own technology startup.
            </p>
          </div>

          {/* Right Side: Quick Fact Grid Cards */}
          <div className="about-cards-grid">
            <div className="about-info-card">
              <h4>Current Field</h4>
              <p>Information Technology</p>
            </div>
            
            <div className="about-info-card">
              <h4>Affiliation</h4>
              <p>CHARUSAT University</p>
            </div>

            <div className="about-info-card">
              <h4>Key Focus</h4>
              <p>Web Dev & AI/ML</p>
            </div>

            <div className="about-info-card">
              <h4>Aspiration</h4>
              <p>AI Startup Founder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
