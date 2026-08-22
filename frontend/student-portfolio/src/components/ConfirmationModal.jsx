/*
  ConfirmationModal.jsx
  Premium Glassmorphic Action Confirmation Modal Dialog
  Author: Parth Patoliya | Student Portfolio
*/

import React, { useEffect } from 'react';

function ConfirmationModal({ 
  isOpen, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  onConfirm, 
  onCancel, 
  confirmText = "Delete", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div 
        className={`modal-card ${type}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-icon">
          {type === 'danger' ? '⚠️' : 'ℹ️'}
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary modal-btn-cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'} modal-btn-confirm`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
