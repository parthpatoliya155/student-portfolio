/* 
  Education.jsx
  Education History Component
  Author: Parth Patoliya | Student Portfolio
  
  This component displays the academic qualifications of the student. 
  It formats the education detail (CHARUSAT University B.Tech IT) in a timeline card 
  with dates, scores, and key course listings.
*/

import React from 'react';

function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <h2 className="section-title">Education</h2>
        <p className="section-subtitle">My academic history and learning milestones</p>

        {/* Timeline Layout */}
        <div className="timeline">
          <div className="timeline-item">
            {/* Left timeline dot indicator */}
            <div className="timeline-dot" />

            {/* Main Education Card */}
            <div className="timeline-card">
              <span className="timeline-date">2024 - 2028 (Expected)</span>
              <h3>Bachelor of Technology</h3>
              <p className="timeline-college">Information Technology</p>
              <p style={{ color: 'var(--accent-color)', fontWeight: '600', marginBottom: '0.5rem' }}>
                CHARUSAT University (Charotar University of Science and Technology)
              </p>
              <div className="timeline-details">
                <p>
                  Focused on modern computing, software engineering, databases, and AI algorithms.
                </p>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.8rem', color: 'var(--text-secondary)' }}>
                  <li>Current Semester CPI: 9.2</li>
                  <li>Core coursework: Data Structures, Database Systems, Web Technologies, Analysis & Design of Algorithms.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
