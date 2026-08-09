/*
  Home.jsx
  Home Page Component
  Author: Parth Patoliya | Student Portfolio
  
  Renders the main profile overview, including the Hero banner,
  About narrative, Skills grid, and Education timeline.
*/

import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Education from '../components/Education';

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
