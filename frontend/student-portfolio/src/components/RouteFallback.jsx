/*
  RouteFallback.jsx
  Ultra-Modern Glassmorphic Skeleton & Suspense Fallback Component
  Author: Parth Patoliya | Student Portfolio
  
  Provides a polished shimmer skeleton + animated top progress bar
  to eliminate layout shifts (CLS: 0) and deliver an instantaneous app feel.
*/

import React from 'react';

function RouteFallback({ message = "Loading view...", type = "default" }) {
  return (
    <div className="route-fallback-wrapper" role="status" aria-live="polite">
      {/* 1. Top Gradient Loading Bar Indicator */}
      <div className="top-loading-bar-track">
        <div className="top-loading-bar-fill"></div>
      </div>

      <div className="container route-fallback-content">
        {/* 2. Floating Central Glass Indicator */}
        <div className="route-fallback-card">
          <div className="route-spinner">
            <div className="route-spinner-inner"></div>
          </div>
          <div className="route-fallback-glow"></div>
          <div className="route-fallback-meta">
            <h4 className="route-fallback-text">{message}</h4>
            <span className="route-fallback-badge">⚡ React.lazy() Chunk</span>
          </div>
        </div>

        {/* 3. Shimmer Skeleton Wireframe Preview */}
        <div className="skeleton-grid-preview">
          <div className="skeleton-hero-card">
            <div className="skeleton-line shimmer-line skeleton-title"></div>
            <div className="skeleton-line shimmer-line skeleton-subtitle"></div>
            <div className="skeleton-buttons-row">
              <div className="skeleton-btn shimmer-line"></div>
              <div className="skeleton-btn shimmer-line"></div>
            </div>
          </div>

          <div className="skeleton-cards-row">
            <div className="skeleton-card shimmer-line"></div>
            <div className="skeleton-card shimmer-line"></div>
            <div className="skeleton-card shimmer-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteFallback;
