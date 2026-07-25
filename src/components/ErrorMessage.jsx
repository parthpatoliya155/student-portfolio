/*
  ErrorMessage.jsx
  Premium Error Display & Retry Component
  Author: Parth Patoliya | Student Portfolio
*/

import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-glass-card">
        {/* Large Warning SVG Icon */}
        <div className="error-icon-wrapper">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="error-svg-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        {/* Error Info */}
        <h3 className="error-title">Oops! API Request Failed</h3>
        <p className="error-message">{message || 'An unexpected error occurred while loading projects.'}</p>
        
        {/* Retry Trigger Button */}
        {onRetry && (
          <button 
            type="button" 
            className="btn btn-primary error-retry-btn" 
            onClick={onRetry}
          >
            <span className="retry-icon">🔄</span> Retry Connection
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
