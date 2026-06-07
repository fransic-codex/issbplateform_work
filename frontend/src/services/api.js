import axios from 'axios';

// In production (Railway), VITE_API_URL must be set during build.
// Fallback: use current origin + /api (works if behind a reverse proxy)
// Dev fallback: localhost:5000
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In production, try same-origin /api (useful if proxied)
  if (import.meta.env.PROD) {
    return window.location.origin + '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Test APIs
export const testAPI = {
  getTests: () => api.get('/tests'),
  getTest: (id) => api.get(`/tests/${id}`),
  getTestWithQuestions: (id) => api.get(`/tests/${id}/questions`),
  createTest: (data) => api.post('/tests', data),
  updateTest: (id, data) => api.put(`/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/tests/${id}`),
};

// Question APIs
export const questionAPI = {
  getQuestionsByTest: (testId) => api.get(`/questions/test/${testId}`),
  createQuestion: (data) => api.post('/questions', data),
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
  bulkCreateQuestions: (data) => api.post('/questions/bulk', data),
};

// Result APIs
export const resultAPI = {
  submitResult: (data) => api.post('/results', data),
  getResults: () => api.get('/results'),
  getResult: (id) => api.get(`/results/${id}`),
  getResultsByTest: (testId) => api.get(`/results/test/${testId}`),
  deleteResult: (id) => api.delete(`/results/${id}`),
};

export default api;
