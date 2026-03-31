import axios from 'axios';

/**
 * Axios instance pre-configured with the Spring Boot backend base URL.
 * All API calls should use this instance for consistent configuration.
 */
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// Employee API calls
// ==========================================

export const getAllEmployees = () => API.get('/employees');
export const getEmployeeById = (id) => API.get(`/employees/${id}`);
export const createEmployee = (data) => API.post('/employees', data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

// ==========================================
// Task API calls
// ==========================================

export const getAllTasks = () => API.get('/tasks');
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const getTasksByEmployee = (employeeId) => API.get(`/tasks/employee/${employeeId}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ==========================================
// Performance Review API calls
// ==========================================

export const getAllReviews = () => API.get('/reviews');
export const getReviewById = (id) => API.get(`/reviews/${id}`);
export const getReviewsByEmployee = (employeeId) => API.get(`/reviews/employee/${employeeId}`);
export const createReview = (data) => API.post('/reviews', data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// ==========================================
// Dashboard API calls
// ==========================================

export const getDashboardStats = () => API.get('/dashboard/stats');

// ==========================================
// AI Analytics API calls
// ==========================================

export const checkAiHealth = () => API.get('/ai/health');
export const predictPerformance = (employee) => API.post(`/ai/performance/${employee}`);
export const predictTaskCompletion = (taskId) => API.post(`/ai/task-prediction/${taskId}`);
export const getEmployeeClusters = () => API.get('/ai/employee-clusters');
export const recommendEmployee = (taskId) => API.post(`/ai/recommend-employee/${taskId}`);
export const getPerformanceScores = () => API.get('/ai/performance-scores');

export default API;
