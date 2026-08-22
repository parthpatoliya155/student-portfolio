/*
  Auth.jsx
  Premium Authentication Page (Login / Register Tabs)
  Author: Parth Patoliya | Student Portfolio
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import Toast from '../components/Toast';

function Auth({ onLoginSuccess }) {
  const navigate = useNavigate();

  // 1. Active Tab State ('login' | 'register')
  const [activeTab, setActiveTab] = useState('login');

  // 2. Form Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 3. UI Status States
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFieldErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  // 4. Form Submit Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    // Client-side quick checks
    if (!email.trim() || !password) {
      setFieldErrors({
        email: !email.trim() ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined
      });
      setLoading(false);
      return;
    }

    if (activeTab === 'register' && password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'login') {
        // --- LOGIN FLOW ---
        const response = await loginUser(email, password);
        showToast("Login successful! Redirecting...", "success");
        
        // Pass token and user details to parent App state
        setTimeout(() => {
          onLoginSuccess(response.token, response.user);
          navigate('/tasks');
        }, 1000);
      } else {
        // --- REGISTRATION FLOW ---
        const response = await registerUser(email, password);
        showToast("Registration successful! Please log in.", "success");
        
        // Switch to Login Tab automatically and pre-fill details
        setTimeout(() => {
          setActiveTab('login');
          setPassword('');
          setConfirmPassword('');
          setFieldErrors({});
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      // Capture detailed validation errors from backend validation pipeline
      if (err.details) {
        setFieldErrors(err.details);
        showToast(err.message || "Validation failed.", "error");
      } else {
        showToast(err.message || "An authentication error occurred.", "error");
      }
    }
  };

  return (
    <section className="section auth-section" style={{ paddingTop: '10rem', minHeight: '90vh' }}>
      <div className="container auth-flex-container">
        
        {/* Floating Notification Toast */}
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />

        {/* Outer Authentication Card */}
        <div className="auth-glass-card">
          
          {/* Tab Selection Headers */}
          <div className="auth-tab-headers">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
              disabled={loading}
            >
              🔒 Login
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabChange('register')}
              disabled={loading}
            >
              ⚡ Register
            </button>
          </div>

          <div className="auth-card-body">
            <h3 className="auth-title">
              {activeTab === 'login' ? 'Welcome Back' : 'Join Us Today'}
            </h3>
            <p className="auth-subtitle">
              {activeTab === 'login' 
                ? 'Enter credentials to access your user-scoped tasks' 
                : 'Create an account to start managing persistent tasks'}
            </p>

            <form onSubmit={handleAuthSubmit} className="auth-form-fields">
              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  type="email"
                  id="auth-email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={fieldErrors.email ? 'input-error' : ''}
                  required
                />
                {fieldErrors.email && (
                  <span className="field-error-text">❌ {fieldErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="auth-password">Password</label>
                <input
                  type="password"
                  id="auth-password"
                  placeholder="Enter password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={fieldErrors.password ? 'input-error' : ''}
                  required
                />
                {fieldErrors.password && (
                  <span className="field-error-text">❌ {fieldErrors.password}</span>
                )}
              </div>

              {activeTab === 'register' && (
                <div className="form-group">
                  <label htmlFor="auth-confirm-password">Confirm Password</label>
                  <input
                    type="password"
                    id="auth-confirm-password"
                    placeholder="Verify password matches"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={fieldErrors.confirmPassword ? 'input-error' : ''}
                    required
                  />
                  {fieldErrors.confirmPassword && (
                    <span className="field-error-text">❌ {fieldErrors.confirmPassword}</span>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-loading-spinner">
                    ⏳ Processing...
                  </span>
                ) : (
                  activeTab === 'login' ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Auth;
