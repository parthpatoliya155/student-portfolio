/* 
  Navbar.jsx
  Responsive Navigation Bar Component
  Author: Parth Patoliya | Student Portfolio
  
  Manages the navigation links for client-side routing.
  Uses NavLink from react-router-dom to highlight the active tab without page reloads.
  Also manages the mobile hamburger menu toggle state.
*/

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  // State to track if the mobile navigation menu is open
  const [isOpen, setIsOpen] = useState(false);

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when a navigation item is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

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
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
