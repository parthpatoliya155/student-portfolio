/* 
  Header.jsx
  Header & Branding Container Component
  Author: Parth Patoliya | Student Portfolio
  
  This component renders the sticky top bar. It displays the student's name
  as the brand logo (passed as a prop from App.jsx) and embeds the Navbar 
  component for site navigation.
*/

import React from 'react';
import Navbar from './Navbar';

// Functional component receiving 'name' as a prop from App.jsx
function Header({ name }) {
  return (
    <header className="header" id="header">
      <div className="container header-container">
        {/* Clickable Brand logo targeting the home/hero area */}
        <a href="#hero" className="logo">
          {name}
        </a>

        {/* Embedded Navbar component for section links */}
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
