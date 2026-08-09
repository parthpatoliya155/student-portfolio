/*
  SearchBar.jsx
  Real-time Search Filter Component
  Author: Parth Patoliya | Student Portfolio
*/

import React from 'react';

function SearchBar({ value, onChange, placeholder = "Search repositories..." }) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        {/* Search SVG Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="search-icon"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        
        {/* Search input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search repositories by name"
        />
        
        {/* Clear Button (renders when there's text) */}
        {value && (
          <button 
            type="button" 
            className="search-clear-btn" 
            onClick={() => onChange('')}
            aria-label="Clear search query"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
