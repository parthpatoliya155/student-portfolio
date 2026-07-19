/*
  Contact.jsx
  Contact Page Component
  Author: Parth Patoliya | Student Portfolio
  
  Provides an interactive contact page with controlled inputs,
  real-time state reflections, live character counters, 
  and UI toggle options using the useState hook.
*/

import React, { useState } from 'react';

function Contact() {
  // Controlled inputs state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // UI visibility state variable
  const [showHelp, setShowHelp] = useState(false);
  
  // Form submission feedback state variable
  const [submitted, setSubmitted] = useState(false);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section className="section contact-section" id="contact" style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '8rem' }}>
      <div className="container">
        
        {/* Help Tooltip Trigger and Box */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <button 
              type="button" 
              className="btn btn-secondary help-toggle-btn"
              onClick={() => setShowHelp(!showHelp)}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              {showHelp ? '✕ Hide Page Help' : '💡 Show Page Help'}
            </button>
            
            {showHelp && (
              <div className="help-tooltip-box">
                <h4>💡 Practical 2 Form Guide</h4>
                <p>This form uses React's <code>useState</code> hook to bind inputs in real-time:</p>
                <ul>
                  <li><strong>Controlled Inputs:</strong> The inputs' values are tied directly to state.</li>
                  <li><strong>Real-time Preview:</strong> You can see a live render of your message below the input field.</li>
                  <li><strong>Character Count:</strong> A live counter shows characters used out of a limit.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="contact-container">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
            Have a project in mind or want to collaborate? Send me a message!
          </p>

          {submitted ? (
            /* Success Feedback Card */
            <div className="success-card">
              <h3 className="success-title">✓ Message Sent Successfully!</h3>
              <p className="success-message">
                Thank you, <strong>{name}</strong>! Your message has been received. I'll get back to you at <strong>{email}</strong> as soon as possible.
              </p>
              
              <div className="message-summary-box">
                <h4>Submitted Message Details:</h4>
                <p>"{message}"</p>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleReset}
                style={{ marginTop: '1.5rem', padding: '0.6rem 2rem' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="contact-form">
              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input 
                  type="text" 
                  id="contact-name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name" 
                  required 
                />
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input 
                  type="email" 
                  id="contact-email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  required 
                />
              </div>

              {/* Message Input */}
              <div className="form-group">
                <label htmlFor="contact-message">Your Message</label>
                <textarea 
                  id="contact-message" 
                  rows="5" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 500))} // Limit to 500 chars
                  placeholder="Hi Parth, let's discuss..." 
                  required
                />
                
                {/* Character Counter */}
                <div className="char-counter-container">
                  <span className={`char-counter ${message.length >= 450 ? 'limit-warning' : ''}`}>
                    {message.length} / 500 characters
                  </span>
                </div>
              </div>

              {/* Live Input Preview */}
              {message && (
                <div className="live-preview-box">
                  <h4>✍️ Live Message Preview:</h4>
                  <p>{message}</p>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
