/* 
  App.jsx
  Main Application Component
  Author: Parth Patoliya | Student Portfolio
  
  This component acts as the main hub of the application. It holds the core portfolio 
  data object and manages the page layout by rendering each section component.
  It passes appropriate data down to Header, Hero, and Skills components via React props.
*/

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Auth from './pages/Auth';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import './App.css';


function App() {
  // Main portfolio data object containing student information
  const portfolioData = {
    name: "Parth Patoliya",
    title: "B.Tech Information Technology Student",
    college: "CHARUSAT",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Vite",
      "Bootstrap",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Git",
      "GitHub",
      "Python",
      "C++",
      "Java",
      "SQL",
      "MySQL",
      "Oracle Database",
      "Linux",
      "Ubuntu",
      "VS Code",
      "Data Structures",
      "Machine Learning Basics",
      "REST APIs"
    ]
  };

  // State to manage the website theme (dark by default)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Auth state management
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Validate session on mount
  useEffect(() => {
    if (token) {
      import('./services/api').then(({ getMe }) => {
        getMe()
          .then(data => {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          })
          .catch(() => {
            handleLogout();
          });
      });
    }
  }, [token]);

  // Listen for session expiry custom events
  useEffect(() => {
    const handleAuthExpired = () => {
      handleLogout();
    };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  // Toggles the theme between dark and light
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Sync theme changes with the root document class and local storage
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* 
        1. Header & Navigation: Receives the student's name, current theme, toggle handler, and auth info.
      */}
      <Header 
        name={portfolioData.name} 
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
      />

      {/* 
        2. Main Application Content Area: Handled by React Router for SPAs.
      */}
      <main className="main-content">
         <Routes>
          {/* Home Route: Aggregates Hero, About, Skills, and Education sections */}
          <Route path="/" element={<Home portfolioData={portfolioData} />} />
          
          {/* Tasks Route: Renders the central full-stack tasks manager dashboard (Protected) */}
          <Route 
            path="/tasks" 
            element={token ? <Tasks /> : <Navigate to="/login" replace />} 
          />
          
          {/* Auth Route: Login / Register tabs */}
          <Route 
            path="/login" 
            element={!token ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/tasks" replace />} 
          />
          
          {/* Redirect /projects to /tasks for seamless migration */}
          <Route path="/projects" element={<Navigate to="/tasks" replace />} />
          
          {/* Contact Route: Controlled input form with real-time feedback and tooltip toggles */}
          <Route path="/contact" element={<Contact />} />
          
          {/* 404 Route: Fallback handler for any undefined navigation route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 
        3. Footer Component: Hosts social media buttons and copyright.
      */}
      <Footer name={portfolioData.name} />
    </div>
  );
}

export default App;
