/*
  api.js
  Centralized API Client for Task Manager Backend Integration
  Author: Parth Patoliya | Student Portfolio
*/

const BASE_URL = 'http://localhost:5000';

/**
 * Handle fetch response helper to throw proper HTTP error messages.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // JSON parsing failed, fallback to status code string
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * GET all tasks from /tasks
 */
export const getTasks = () => {
  return fetch(`${BASE_URL}/tasks`).then(handleResponse);
};

/**
 * GET a single task by ID from /tasks/:id
 */
export const getTaskById = (id) => {
  return fetch(`${BASE_URL}/tasks/${id}`).then(handleResponse);
};

/**
 * POST /tasks - Create a new task
 */
export const createTask = (taskData) => {
  return fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData)
  }).then(handleResponse);
};

/**
 * PUT /tasks/:id - Update an existing task
 */
export const updateTask = (id, taskData) => {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData)
  }).then(handleResponse);
};

/**
 * DELETE /tasks/:id - Delete a task by ID
 */
export const deleteTask = (id) => {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  }).then((res) => {
    // Delete endpoint in taskController returns a message and the task object
    return handleResponse(res);
  });
};
