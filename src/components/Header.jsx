/* 
  Header.jsx
  Header & Branding Container Component
  Author: Parth Patoliya | Student Portfolio
  
  This component renders the sticky top bar. It displays the student's name
  as the brand logo (passed as a prop from App.jsx) and embeds the Navbar 
  component for site navigation.
*/

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

// Functional component receiving 'name', 'theme', and 'toggleTheme' as props
function Header({ name, theme, toggleTheme }) {
  return (
    <header className="header" id="header">
      <div className="container header-container">
        {/* Clickable Brand logo targeting the home route */}
        <Link to="/" className="logo">
          {name}
        </Link>

        {/* Header Actions containing Navbar and Theme Toggle */}
        <div className="header-actions">
          <Navbar />
          
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
