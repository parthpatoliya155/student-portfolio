/*
  Home.jsx
  Home Page Component
  Author: Parth Patoliya | Student Portfolio
  
  Renders the main profile overview, including the Hero banner,
  About narrative, Skills grid, and Education timeline.
*/

import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Education from './Education';

function Home({ portfolioData }) {
  return (
    <>
      {/* Hero Section */}
      <Hero 
        name={portfolioData.name} 
        title={portfolioData.title} 
        college={portfolioData.college} 
      />

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills skills={portfolioData.skills} />

      {/* Education Section */}
      <Education />
    </>
  );
}

export default Home;
