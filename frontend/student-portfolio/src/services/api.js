/*
  api.js
  Centralized API Client with JWT Authorization & Middleware Pipeline
  Author: Parth Patoliya | Student Portfolio
*/

const BASE_URL = 'http://localhost:5000';

/**
 * Dynamically constructs headers including the JWT token from localStorage.
 */
const getHeaders = (hasBody = true) => {
  const headers = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Handle fetch response helper to throw proper HTTP error messages and catch 401 token expiry.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    // Intercept 401 Unauthorized responses to clear token and redirect
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-expired'));
      errorMessage = "Session expired or invalid credentials. Please log in again.";
    }

    try {
      const errorData = await response.json();
      if (errorData) {
        if (errorData.details) {
          // If detailed field validations exist, pass them inside the error message
          return Promise.reject({
            message: errorData.error || "Validation failed",
            details: errorData.details
          });
        }
        errorMessage = errorData.error || errorData.message || errorMessage;
      }
    } catch (e) {
      // JSON parsing failed, fallback to default error message
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/* ==========================================================================
   AUTHENTICATION ENDPOINTS
   ========================================================================== */

/**
 * POST /auth/register - Register a new user
 */
export const registerUser = (email, password) => {
  return fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(handleResponse);
};

/**
 * POST /auth/login - Authenticate user and receive JWT
 */
export const loginUser = (email, password) => {
  return fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(handleResponse);
};

/**
 * GET /auth/me - Retrieve details of currently logged-in user
 */
export const getMe = () => {
  return fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getHeaders(false)
  }).then(handleResponse);
};

/* ==========================================================================
   PROTECTED TASK CRUD ENDPOINTS (Authorized with Bearer JWT)
   ========================================================================== */

/**
 * GET all tasks from /tasks (scopes to logged-in user)
 */
export const getTasks = () => {
  return fetch(`${BASE_URL}/tasks`, {
    method: 'GET',
    headers: getHeaders(false)
  }).then(handleResponse);
};

/**
 * GET a single task by ID from /tasks/:id
 */
export const getTaskById = (id) => {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'GET',
    headers: getHeaders(false)
  }).then(handleResponse);
};

/**
 * POST /tasks - Create a new task scoped to the user
 */
export const createTask = (taskData) => {
  return fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(taskData)
  }).then(handleResponse);
};

/**
 * PUT /tasks/:id - Update an existing task
 */
export const updateTask = (id, taskData) => {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(taskData)
  }).then(handleResponse);
};

/**
 * DELETE /tasks/:id - Delete a task by ID
 */
export const deleteTask = (id) => {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(false)
  }).then(handleResponse);
};
