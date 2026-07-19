/* 
  App.jsx
  Main Application Component
  Author: Parth Patoliya | Student Portfolio
  
  This component acts as the main hub of the application. It holds the core portfolio 
  data object and manages the page layout by rendering each section component.
  It passes appropriate data down to Header, Hero, and Skills components via React props.
*/

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
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

  // State to manage the website theme (dark by default)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Toggles the theme between dark and light
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Sync theme changes with the root document class and local storage
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* 
        1. Header & Navigation: Receives the student's name, current theme, and toggle handler.
      */}
      <Header 
        name={portfolioData.name} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 
        2. Main Application Content Area: Handled by React Router for SPAs.
      */}
      <main className="main-content">
        <Routes>
          {/* Home Route: Aggregates Hero, About, Skills, and Education sections */}
          <Route path="/" element={<Home portfolioData={portfolioData} />} />
          
          {/* Projects Route: Renders the dedicated projects gallery section */}
          <Route path="/projects" element={<Projects />} />
          
          {/* Contact Route: Controlled input form with real-time feedback and tooltip toggles */}
          <Route path="/contact" element={<Contact />} />
          
          {/* 404 Route: Fallback handler for any undefined navigation route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 
        3. Footer Component: Hosts social media buttons and copyright.
      */}
      <Footer name={portfolioData.name} />
    </div>
  );
}

export default App;
