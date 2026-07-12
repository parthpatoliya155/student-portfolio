/* 
  App.jsx
  Main Application Component
  Author: Parth Patoliya | Student Portfolio
  
  This component acts as the main hub of the application. It holds the core portfolio 
  data object and manages the page layout by rendering each section component.
  It passes appropriate data down to Header, Hero, and Skills components via React props.
*/

import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Main portfolio data object containing student information
  const portfolioData = {
    name: "Parth Patoliya",
    title: "B.Tech Information Technology Student",
    college: "CHARUSAT",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Vite",
      "Bootstrap",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Git",
      "GitHub",
      "Python",
      "C++",
      "Java",
      "SQL",
      "MySQL",
      "Oracle Database",
      "Linux",
      "Ubuntu",
      "VS Code",
      "Data Structures",
      "Machine Learning Basics",
      "REST APIs"
    ]
  };

  return (
    <div className="app-container">
      {/* 
        1. Header Component: Receives the student's name as a prop to render the logo/brand.
      */}
      <Header name={portfolioData.name} />

      {/* 
        2. Hero Section: Receives the student's name, professional title, and college as props.
      */}
      <Hero 
        name={portfolioData.name} 
        title={portfolioData.title} 
        college={portfolioData.college} 
      />

      {/* 
        3. About Section: Displays biographical details and future engineering goals.
      */}
      <About />

      {/* 
        4. Skills Section: Receives the dynamic skills array as a prop.
      */}
      <Skills skills={portfolioData.skills} />

      {/* 
        5. Education Section: Lists academic details at CHARUSAT University.
      */}
      <Education />

      {/* 
        6. Projects Section: Portrays the core academic coding projects.
      */}
      <Projects />

      {/* 
        7. Footer Component: Hosts the Contact Form, social media buttons, and copyright.
      */}
      <Footer name={portfolioData.name} />
    </div>
  );
}

export default App;
