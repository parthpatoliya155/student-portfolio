/* 
  Skills.jsx
  Skills Inventory Component
  Author: Parth Patoliya | Student Portfolio
  
  This component takes an array of skills as a prop from App.jsx and maps over 
  it to dynamically generate the skill badge elements. This adheres to React 
  best practices regarding list rendering (utilizing unique keys) and component 
  reusability.
*/

import React from 'react';

// Functional component receiving 'skills' array as a prop
function Skills({ skills }) {
  return (
    <section className="section" id="skills">
      <div className="container">
        <h2 className="section-title">My Skills</h2>
        <p className="section-subtitle">A collection of tools, languages, and concepts I work with</p>

        {/* Flex layout container holding all dynamic skill cards */}
        <div className="skills-container">
          {skills.map((skill, index) => (
            // Always provide a unique 'key' prop when rendering items dynamically with map()
            <div key={index} className="skill-tag">
              <span className="skill-icon">⚡</span>
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
