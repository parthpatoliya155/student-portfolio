/* 
  Navbar.jsx
  Responsive Navigation Bar Component
  Author: Parth Patoliya | Student Portfolio
  
  This component manages the navigation links and active menu highlighting.
  It uses standard React state to control the mobile hamburger menu toggle.
  Additionally, it implements a scroll listener (Intersection Observer)
  to dynamically update which link is highlighted based on the section in view.
*/

import React, { useState, useEffect } from 'react';

function Navbar() {
  // State to track if the mobile navigation menu is open
  const [isOpen, setIsOpen] = useState(false);
  // State to track the currently active section id in view
  const [activeSection, setActiveSection] = useState('hero');

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when a navigation item is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Set up an Intersection Observer to monitor active page sections
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'education', 'projects', 'contact'];
    
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-50% 0px -50% 0px', // triggers when section is in the middle of screen
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup observer on unmount
    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <nav className="nav-container">
      {/* Mobile Hamburger/Close Menu Trigger Button */}
      <button 
        className="menu-toggle" 
        onClick={toggleMenu} 
        aria-label="Toggle navigation menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* List of Navigation Links */}
      <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <li>
          <a 
            href="#hero" 
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Home
          </a>
        </li>
        <li>
          <a 
            href="#about" 
            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            About
          </a>
        </li>
        <li>
          <a 
            href="#skills" 
            className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Skills
          </a>
        </li>
        <li>
          <a 
            href="#education" 
            className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Education
          </a>
        </li>
        <li>
          <a 
            href="#projects" 
            className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Projects
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
