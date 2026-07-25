/*
  RepoCard.jsx
  Premium Glassmorphic Repository Showcase Card
  Author: Parth Patoliya | Student Portfolio
*/

import React from 'react';

// Maps common programming languages to specific brand colors for badges
const getLanguageColor = (language) => {
  const colors = {
    javascript: '#f1e05a',
    typescript: '#3178c6',
    python: '#3572a5',
    java: '#b07219',
    cpp: '#f34b7d',
    'c++': '#f34b7d',
    c: '#555555',
    html: '#e34c26',
    css: '#563d7c',
    go: '#00add8',
    ruby: '#701516',
    php: '#4f5d95',
    swift: '#f05138',
    rust: '#dea584',
    shell: '#89e051'
  };
  
  if (!language) return '#94a3b8';
  return colors[language.toLowerCase()] || '#06B6D4'; // default to accent cyan
};

function RepoCard({ repo }) {
  const {
    name,
    html_url,
    description,
    stargazers_count,
    language,
    updated_at
  } = repo;

  // Format date to a clean, readable form (e.g., "Jul 25, 2026")
  const formattedDate = new Date(updated_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="repo-card">
      {/* Top section: Repository SVG Icon and Stars Badge */}
      <div className="repo-card-header">
        <div className="repo-icon-container">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="repo-svg"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10" />
          </svg>
        </div>
        
        {/* Stars badge */}
        <div className="repo-stars-badge" title={`${stargazers_count} stars`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="star-svg"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span>{stargazers_count}</span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="repo-card-body">
        <h3 className="repo-name" title={name}>{name}</h3>
        <p className="repo-description">
          {description || "No description provided for this GitHub repository."}
        </p>
      </div>

      {/* Footer info: Tech stack, date, and link button */}
      <div className="repo-card-footer">
        <div className="repo-meta-left">
          {/* Language badge */}
          {language && (
            <span className="repo-lang-badge">
              <span 
                className="repo-lang-color" 
                style={{ backgroundColor: getLanguageColor(language) }}
              />
              {language}
            </span>
          )}
          
          {/* Updated date indicator */}
          <span className="repo-date" title={`Last updated: ${new Date(updated_at).toLocaleString()}`}>
            Updated {formattedDate}
          </span>
        </div>

        {/* View on GitHub Action Button */}
        <a 
          href={html_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-secondary repo-github-link"
        >
          GitHub <span className="arrow">↗</span>
        </a>
      </div>
    </div>
  );
}

export default RepoCard;
