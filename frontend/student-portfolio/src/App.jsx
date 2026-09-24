/* 
  App.jsx
  Main Application Component
  Author: Parth Patoliya | Student Portfolio
  
  This component acts as the main hub of the application. It holds the core portfolio 
  data object and manages the page layout by rendering each section component.
  It passes appropriate data down to Header, Hero, and Skills components via React props.
*/

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteFallback from './components/RouteFallback';
import './App.css';

import Home from './pages/Home';

// Route-based Code Splitting: Dynamically import auxiliary page components on-demand
const Projects = lazy(() => import('./pages/Projects'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Auth = lazy(() => import('./pages/Auth'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));


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
        2. Main Application Content Area: Handled by React Router for SPAs with Suspense Code Splitting.
      */}
      <main className="main-content">
        <Suspense fallback={<RouteFallback message="Loading page view..." />}>
          <Routes>
            {/* Home Route: Aggregates Hero, About, Skills, and Education sections */}
            <Route path="/" element={<Home portfolioData={portfolioData} />} />
            
            {/* Projects Route: GitHub API integrations and showcases */}
            <Route path="/projects" element={<Projects />} />
            
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
            
            {/* Contact Route: Controlled input form with real-time feedback and tooltip toggles */}
            <Route path="/contact" element={<Contact />} />
            
            {/* 404 Route: Fallback handler for any undefined navigation route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* 
        3. Footer Component: Hosts social media buttons and copyright.
      */}
      <Footer name={portfolioData.name} />
    </div>
  );
}

export default App;
