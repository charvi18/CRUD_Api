/**
 * api.js
 * Shared API client for Student Management System.
 * Handles all backend API communication.
 */

const API_BASE = 'http://localhost:5000/api/v1';

// ─────────────────────────────────────────────────────────────
// CORE FETCH WRAPPER
// ─────────────────────────────────────────────────────────────

async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  const json = await response.json();

  // Handle API errors
  if (!response.ok) {
    const error = new Error(json.message || 'Request failed');

    error.statusCode = response.status;
    error.errors = json.errors || [];

    throw error;
  }

  return json;
}

// ─────────────────────────────────────────────────────────────
// STUDENT API METHODS
// ─────────────────────────────────────────────────────────────

const StudentsAPI = {

  /**
   * GET ALL STUDENTS
   * Supports pagination + search + filtering
   */
  getAll(params = {}) {

    const queryString = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== '' && value != null,
        ),
      ),
    ).toString();

    return apiRequest(
      `/students${queryString ? `?${queryString}` : ''}`,
    );
  },

  /**
   * GET SINGLE STUDENT
   */
  getById(id) {
    return apiRequest(`/students/${id}`);
  },

  /**
   * CREATE STUDENT
   */
  create(data) {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * UPDATE STUDENT
   */
  update(id, data) {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE STUDENT
   */
  delete(id) {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// ─────────────────────────────────────────────────────────────
// TOAST HELPER
// ─────────────────────────────────────────────────────────────

function showToast(
  id,
  message,
  type = 'success',
  duration = 4000,
) {

  const element = document.getElementById(id);

  if (!element) return;

  element.textContent = message;
  element.className = `toast ${type}`;

  if (duration > 0) {

    clearTimeout(element._timer);

    element._timer = setTimeout(() => {
      element.className = 'toast hidden';
    }, duration);
  }
}

// ─────────────────────────────────────────────────────────────
// BUTTON LOADING HELPER
// ─────────────────────────────────────────────────────────────

function setButtonLoading(buttonId, loading) {

  const button = document.getElementById(buttonId);

  if (!button) return;

  button.disabled = loading;

  const label = button.querySelector('.btn-label');
  const spinner = button.querySelector('.btn-spinner');

  if (label) {
    label.style.opacity = loading ? '0' : '1';
  }

  if (spinner) {
    spinner.classList.toggle('hidden', !loading);
  }
}