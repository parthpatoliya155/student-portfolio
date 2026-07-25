/* 
  Projects.jsx
  Projects Portfolio Component
  Author: Parth Patoliya | Student Portfolio
  
  This component fetches and displays the student's GitHub repositories dynamically
  utilizing the GitHub REST API, while showcasing loading/error states and a search filter.
*/

import React, { useState, useEffect } from 'react';
import RepoCard from './RepoCard';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// Configurable GitHub Username - Change this to fetch projects from another user
const GITHUB_USERNAME = 'parthpatoliya155';

function Projects() {
  // 1. Core States for Asynchronous API Fetching
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. State for Local Search Filtering
  const [searchTerm, setSearchTerm] = useState('');

  // Static array of featured projects (from Practical 2) to preserve existing functionality
  const featuredProjects = [
    {
      title: "BookMyTurf using AI",
      description: "An intelligent sports ground reservation system. Incorporates machine learning to predict demand peaks, optimize turf scheduling, and suggest available slot categories based on player preferences.",
      tags: ["React", "Node.js", "Express.js", "MongoDB", "Python", "Machine Learning"],
      icon: "⚽"
    },
    {
      title: "Smart Digital Voting System",
      description: "A secure remote web voting portal. Uses real-time facial recognition via computer vision and secure OTP verification to authenticate citizens and prevent duplicate or proxy votes.",
      tags: ["React", "Python", "OpenCV", "Flask", "Tailwind CSS", "REST APIs"],
      icon: "🗳️"
    }
  ];

  // 3. Fetch function to request repos from GitHub REST API
  const fetchRepositories = () => {
    setLoading(true);
    setError(null);
    
    // Fetch repos sorted by updated date (limiting to 100 repositories)
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter out forks if preferred, or display all. We will show all user repos.
          setRepos(data);
        } else {
          throw new Error("Unexpected response structure from the GitHub API.");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load repositories. Please check your connection.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 4. Trigger fetch once on mount
  useEffect(() => {
    fetchRepositories();
  }, []);

  // 5. Filter repositories in real-time based on search input
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="section" id="projects" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="section-title">Projects Showcase</h2>
        <p className="section-subtitle">A collection of featured projects and live GitHub repositories</p>

        {/* ================= FEATURED PROJECTS SECTION ================= */}
        <div className="featured-section" style={{ marginBottom: '5rem' }}>
          <h3 className="sub-section-title">★ Featured Works</h3>
          <div className="projects-grid">
            {featuredProjects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <span className="project-header-icon">{project.icon}</span>
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-tags">
                    {project.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a href="#projects" className="project-link">
                      Code <span>↗</span>
                    </a>
                    <a href="#projects" className="project-link">
                      Live Demo <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= GITHUB LIVE INTEGRATION SECTION ================= */}
        <div className="github-section">
          <div className="github-section-header">
            <h3 className="sub-section-title">⚡ Live GitHub Repositories</h3>
            
            {/* Search Input Bar (only shown if not in error state and finished loading) */}
            {!loading && !error && (
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search live repos by name..."
              />
            )}
          </div>

          {/* Conditional Rendering based on API Request States */}
          {loading && (
            <LoadingSpinner />
          )}

          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={fetchRepositories} 
            />
          )}

          {!loading && !error && (
            <>
              {filteredRepos.length > 0 ? (
                <div className="repos-grid">
                  {filteredRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              ) : (
                <div className="no-results-card">
                  <span className="no-results-icon">🔍</span>
                  <h4>No Matching Repositories</h4>
                  <p>We couldn't find any repositories matching "{searchTerm}". Try another search term!</p>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setSearchTerm('')}
                    style={{ marginTop: '1rem' }}
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Projects;
