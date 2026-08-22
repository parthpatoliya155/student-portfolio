/*
  Tasks.jsx
  Full-Stack Task Management Dashboard
  Author: Parth Patoliya | Student Portfolio

  This component manages the state for tasks fetched from the Express+MongoDB backend.
  It handles optimistic UI updates, filters, search, and loading/error states.
*/

import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationModal from '../components/ConfirmationModal';
import Toast from '../components/Toast';

function Tasks() {
  // 1. Core States for Backend Operations
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Form Input States (Combined for Create & Edit)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingTask, setEditingTask] = useState(null);

  // 3. Search and Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'

  // 4. Modal and Toast Alert States
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error' | 'info'

  // Trigger floating toast notifications
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Fetch initial tasks from backend
  const fetchTasksList = () => {
    setLoading(true);
    setError(null);
    getTasks()
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort by creation date (newest first)
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setTasks(sorted);
        } else {
          throw new Error("Invalid format received from server.");
        }
      })
      .catch((err) => {
        setError(err.message || "Could not retrieve tasks from database.");
        showToast(err.message || "Failed to load tasks.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasksList();
  }, []);

  // 5. Create / Edit Task Submission Handler
  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Task title is required", "error");
      return;
    }

    if (editingTask) {
      // --- UPDATE TASK FLOW ---
      const taskId = editingTask._id;
      const previousTasks = [...tasks];
      
      const updatedFields = {
        title: title.trim(),
        description: description.trim(),
        priority: priority
      };

      // Optimistic state update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updatedFields } : t));
      showToast("Saving changes...", "info");

      // Reset form states
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setPriority('medium');

      updateTask(taskId, updatedFields)
        .then((savedTask) => {
          setTasks(prev => prev.map(t => t._id === taskId ? savedTask : t));
          showToast("Task updated successfully!", "success");
        })
        .catch((err) => {
          // Revert optimistic changes on failure
          setTasks(previousTasks);
          showToast(`Update failed: ${err.message}`, "error");
        });

    } else {
      // --- CREATE TASK FLOW (Optimistic UI Update) ---
      const tempId = `opt-${Date.now()}`;
      const optimisticTask = {
        _id: tempId,
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
      };

      const previousTasks = [...tasks];

      // Reset form fields
      setTitle('');
      setDescription('');
      setPriority('medium');

      // Optimistically insert at the top of the list
      setTasks(prev => [optimisticTask, ...prev]);
      showToast("Creating task...", "info");

      createTask({
        title: optimisticTask.title,
        description: optimisticTask.description,
        priority: optimisticTask.priority
      })
        .then((savedTask) => {
          // Replace optimistic placeholder with real document from MongoDB
          setTasks(prev => prev.map(t => t._id === tempId ? savedTask : t));
          showToast("Task created successfully!", "success");
        })
        .catch((err) => {
          // Revert optimistic insert
          setTasks(previousTasks);
          showToast(`Creation failed: ${err.message}`, "error");
        });
    }
  };

  // 6. Toggle Task Status (Completed / Active)
  const handleToggleComplete = (task) => {
    const taskId = task._id;
    const newCompletedState = !task.completed;
    const previousTasks = [...tasks];

    // Optimistic status update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: newCompletedState } : t));

    updateTask(taskId, { completed: newCompletedState })
      .then((savedTask) => {
        setTasks(prev => prev.map(t => t._id === taskId ? savedTask : t));
        showToast(
          `Task marked as ${newCompletedState ? 'completed' : 'active'}!`, 
          newCompletedState ? 'success' : 'info'
        );
      })
      .catch((err) => {
        // Revert status
        setTasks(previousTasks);
        showToast(`Failed to update status: ${err.message}`, "error");
      });
  };

  // 7. Delete Task Initiation & Confirmation Modal
  const initiateDeleteTask = (task) => {
    setTaskToDelete(task);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const taskId = taskToDelete._id;
    const previousTasks = [...tasks];

    // Close Confirmation Modal
    setModalOpen(false);
    setTaskToDelete(null);

    // Optimistic delete
    setTasks(prev => prev.filter(t => t._id !== taskId));
    showToast("Deleting task...", "info");

    deleteTask(taskId)
      .then(() => {
        showToast("Task deleted successfully!", "success");
      })
      .catch((err) => {
        // Revert delete operation
        setTasks(previousTasks);
        showToast(`Deletion failed: ${err.message}`, "error");
      });
  };

  // Populate form for editing
  const initiateEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    // Scroll smoothly to form container
    document.getElementById('task-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  // 8. Filters and Search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'active' && !task.completed);

    const matchesPriority = 
      priorityFilter === 'all' || 
      task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <section className="section" id="tasks" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="section-title">Task Management Suite</h2>
        <p className="section-subtitle">Full Stack Node + MongoDB Live State Synchronization</p>

        {/* Floating Notification Toast */}
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />

        {/* Dangerous Action Confirmation Dialog */}
        <ConfirmationModal
          isOpen={modalOpen}
          title="Delete Task Permanently"
          message={`Are you sure you want to delete task "${taskToDelete?.title}"? This action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setModalOpen(false);
            setTaskToDelete(null);
          }}
        />

        {/* Global Error Handler at mount */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={fetchTasksList} 
          />
        )}

        {!error && (
          <div className="tasks-dashboard-layout" id="task-form-section">
            
            {/* ================= LEFT PANEL: CREATE/EDIT GLASS FORM ================= */}
            <div className="tasks-form-panel">
              <div className="tasks-glass-card form-sticky">
                <h3 className="form-panel-title">
                  {editingTask ? '📝 Edit Task' : '⚡ Create New Task'}
                </h3>
                <p className="form-panel-subtitle">
                  {editingTask ? 'Update task details below' : 'Add task to persist to MongoDB'}
                </p>

                <form onSubmit={handleSubmitTask} className="tasks-interactive-form">
                  <div className="form-group">
                    <label htmlFor="task-title">Title *</label>
                    <input
                      type="text"
                      id="task-title"
                      placeholder="What needs to be done?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="task-desc">Description</label>
                    <textarea
                      id="task-desc"
                      placeholder="Add task notes/details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="task-priority">Priority Level</label>
                    <select
                      id="task-priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    {editingTask && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-cancel-edit"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btn-primary btn-submit-task">
                      {editingTask ? 'Save Changes' : 'Add Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* ================= RIGHT PANEL: TASK FILTER & LIST ================= */}
            <div className="tasks-list-panel">
              
              {/* Toolbar: Search and Filter Controls */}
              <div className="tasks-toolbar">
                <div className="toolbar-search-wrapper">
                  <SearchBar 
                    value={searchTerm} 
                    onChange={setSearchTerm} 
                    placeholder="Search tasks by text..."
                  />
                </div>
                
                <div className="toolbar-filters">
                  <div className="filter-group">
                    <span className="filter-label">Status:</span>
                    <div className="filter-buttons">
                      {['all', 'active', 'completed'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group">
                    <span className="filter-label">Priority:</span>
                    <div className="filter-buttons">
                      {['all', 'high', 'medium', 'low'].map((prio) => (
                        <button
                          key={prio}
                          type="button"
                          className={`filter-btn ${priorityFilter === prio ? 'active' : ''}`}
                          onClick={() => setPriorityFilter(prio)}
                        >
                          {prio === 'all' ? 'All' : prio === 'high' ? '🔴 High' : prio === 'medium' ? '🟡 Med' : '🟢 Low'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Cards Grid */}
              {loading && tasks.length === 0 ? (
                <LoadingSpinner />
              ) : (
                <div className="tasks-grid-list">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => {
                      const isOptimistic = typeof task._id === 'string' && task._id.startsWith('opt-');
                      return (
                        <div 
                          key={task._id} 
                          className={`task-glass-card task-item-card ${task.completed ? 'completed' : ''} ${isOptimistic ? 'optimistic-saving' : ''}`}
                        >
                          <div className="task-card-header">
                            {/* Checkbox to Toggle Status */}
                            <label className="task-checkbox-container" title="Toggle task status">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleComplete(task)}
                                disabled={isOptimistic}
                              />
                              <span className="checkmark"></span>
                            </label>
                            
                            {/* Priority Badge */}
                            <span className={`task-badge priority-${task.priority}`}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>

                          <div className="task-card-body">
                            <h4 className="task-card-title">{task.title}</h4>
                            {task.description && (
                              <p className="task-card-desc">{task.description}</p>
                            )}
                            <div className="task-card-meta">
                              <span className="task-date">
                                📅 {new Date(task.createdAt).toLocaleDateString(undefined, { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {isOptimistic && (
                                <span className="saving-indicator">Saving to DB...</span>
                              )}
                            </div>
                          </div>

                          <div className="task-card-actions">
                            <button
                              type="button"
                              className="task-action-btn edit-btn"
                              onClick={() => initiateEditTask(task)}
                              title="Edit task details"
                              disabled={isOptimistic}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="task-action-btn delete-btn"
                              onClick={() => initiateDeleteTask(task)}
                              title="Delete task"
                              disabled={isOptimistic}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-tasks-card">
                      <span className="no-tasks-icon">📋</span>
                      <h4>No Tasks Found</h4>
                      <p>
                        {tasks.length === 0 
                          ? "Database is empty. Get started by creating a new task!" 
                          : "No tasks match your search filters."}
                      </p>
                      {tasks.length > 0 && (
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-clear-filters"
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setPriorityFilter('all');
                          }}
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}

export default Tasks;
