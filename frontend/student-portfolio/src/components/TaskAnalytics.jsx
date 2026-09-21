/*
  TaskAnalytics.jsx
  Supplementary Component: Lazy Loaded Heavy Analytical Dashboard
  Author: Parth Patoliya | Student Portfolio
  
  Visualizes task productivity metrics, priority breakdown, and completion velocity.
  Dynamically loaded only when requested to demonstrate component-level code splitting.
*/

import React from 'react';

function TaskAnalytics({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highCount = tasks.filter(t => t.priority === 'high').length;
  const medCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h3 className="analytics-title">📊 Task Productivity & Workload Analytics</h3>
          <p className="analytics-subtitle">Real-time breakdown of your task distribution and completion performance</p>
        </div>
        <span className="analytics-badge">⚡ Lazy-Loaded Chunk</span>
      </div>

      <div className="analytics-grid">
        {/* Metric 1: Completion Progress */}
        <div className="analytics-card">
          <div className="analytics-metric-title">Overall Completion</div>
          <div className="analytics-metric-value">{completionRate}%</div>
          <div className="analytics-progress-bar">
            <div 
              className="analytics-progress-fill" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="analytics-metric-footer">
            <span>{completed} Completed</span>
            <span>{pending} Pending</span>
          </div>
        </div>

        {/* Metric 2: Priority Distribution */}
        <div className="analytics-card">
          <div className="analytics-metric-title">Priority Breakdown</div>
          <div className="priority-bars">
            <div className="priority-bar-item">
              <span className="priority-label high">High</span>
              <div className="priority-bar-track">
                <div 
                  className="priority-bar-fill high-fill" 
                  style={{ width: total > 0 ? `${(highCount / total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="priority-count">{highCount}</span>
            </div>

            <div className="priority-bar-item">
              <span className="priority-label med">Medium</span>
              <div className="priority-bar-track">
                <div 
                  className="priority-bar-fill med-fill" 
                  style={{ width: total > 0 ? `${(medCount / total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="priority-count">{medCount}</span>
            </div>

            <div className="priority-bar-item">
              <span className="priority-label low">Low</span>
              <div className="priority-bar-track">
                <div 
                  className="priority-bar-fill low-fill" 
                  style={{ width: total > 0 ? `${(lowCount / total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="priority-count">{lowCount}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Load */}
        <div className="analytics-card">
          <div className="analytics-metric-title">Total Active Tasks</div>
          <div className="analytics-metric-value" style={{ color: 'var(--accent-blue)' }}>
            {total}
          </div>
          <div className="analytics-metric-hint">
            {total === 0 
              ? "No tasks recorded yet. Create one above!" 
              : completionRate === 100 
                ? "🎉 Incredible! All tasks are completed!" 
                : `${pending} pending items requiring action.`
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAnalytics;
