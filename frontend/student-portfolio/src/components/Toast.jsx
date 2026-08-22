/*
  Toast.jsx
  Premium Sliding Toast/Notification Alert Component
  Author: Parth Patoliya | Student Portfolio
*/

import React, { useEffect } from 'react';

function Toast({ 
  message, 
  type = 'success', // 'success' | 'error' | 'info'
  onClose, 
  duration = 4000 
}) {
  // Set automatic close timer on mount or message update
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-notification-wrapper ${type}`}>
      <div className="toast-glow"></div>
      <div className="toast-container">
        <span className="toast-type-icon">
          {type === 'success' && '🟢'}
          {type === 'error' && '🔴'}
          {type === 'info' && '🔵'}
        </span>
        <div className="toast-message-body">
          <h4 className="toast-title">
            {type === 'success' ? 'Success' : type === 'error' ? 'Error occurred' : 'Notice'}
          </h4>
          <p className="toast-text">{message}</p>
        </div>
        <button 
          type="button" 
          className="toast-close-btn" 
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default Toast;
