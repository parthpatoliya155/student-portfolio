/* 
  Projects.jsx
  Projects Portfolio Component
  Author: Parth Patoliya | Student Portfolio
  
  This component displays cards for the student's development projects:
  1. BookMyTurf using AI
  2. Smart Digital Voting System using Face Recognition and OTP
  
  Each project card uses clean hover transitions, dynamic technology tags,
  and simulated project links.
*/

import React from 'react';

function Projects() {
  // Static array of project information
  const projectList = [
    {
      title: "BookMyTurf using AI",
      description: "An intelligent sports ground reservation system. Incorporates machine learning to predict demand peaks, optimize turf scheduling, and suggest available slot categories based on player preferences.",
      tags: ["React", "Node.js", "Express.js", "MongoDB", "Python", "Machine Learning"],
      icon: "⚽"
    },
    {
      title: "Smart Digital Voting System",
      description: "A secure remote web voting portal. Uses real-time facial recognition via computer vision and secure OTP verification to authenticate citizens and prevent duplicate or proxy votes.",
      tags: ["React", "Python", "OpenCV", "Flask", "Tailwind CSS", "REST APIs"],
      icon: "🗳️"
    }
  ];

  return (
    <section className="section" id="projects">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Real-world projects I have built utilizing modern stacks</p>

        <div className="projects-grid">
          {projectList.map((project, index) => (
            <div key={index} className="project-card">
              {/* Graphic/Gradient header container with visual icon */}
              <div className="project-header">
                <span className="project-header-icon">{project.icon}</span>
              </div>

              {/* Project Card Text Content */}
              <div className="project-body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                {/* Dynamic tag badges list */}
                <div className="project-tags">
                  {project.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Simulated action links */}
                <div className="project-links">
                  <a href="#projects" className="project-link">
                    Code <span>↗</span>
                  </a>
                  <a href="#projects" className="project-link">
                    Live Demo <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
