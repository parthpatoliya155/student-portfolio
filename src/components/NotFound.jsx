/*
  NotFound.jsx
  Custom 404 Error Component
  Author: Parth Patoliya | Student Portfolio
  
  Renders when a user tries to access a route that does not exist.
  Includes a navigation option to return to the home route.
*/

import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="section notfound-section" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '8rem' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="notfound-card">
          <div className="notfound-icon">🌌</div>
          <h1 className="notfound-code">404</h1>
          <h2 className="notfound-title">Lost in Space</h2>
          <p className="notfound-message">
            The page you are looking for has drifted into deep space or never existed. Let's get you back to safety.
          </p>
          <Link to="/" className="btn btn-primary notfound-btn">
            Return to Home Base
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
