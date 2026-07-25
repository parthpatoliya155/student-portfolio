/*
  LoadingSpinner.jsx
  Premium Animated Loading Indicator Component
  Author: Parth Patoliya | Student Portfolio
*/

import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loader-container">
      <div className="loader-glass-card">
        {/* Animated Double-Gradient Spinner Ring */}
        <div className="spinner-ring">
          <div className="spinner-dot"></div>
        </div>
        
        {/* Animated Glow Backdrop */}
        <div className="loader-glow"></div>
        
        {/* Pulsing Status Text */}
        <h3 className="loader-text">Fetching Repositories</h3>
        <p className="loader-subtext">Connecting to GitHub API...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
