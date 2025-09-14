const API_BASE = 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const authAPI = {
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (username, email, password, role) => 
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    }),
};

export const tasksAPI = {
  getAll: () => apiRequest('/tasks'),
  create: (taskData) => 
    apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),
  update: (id, taskData) => 
    apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),
  delete: (id) => 
    apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

export const logsAPI = {
  getAll: () => apiRequest('/tasks/logs/all'),
};