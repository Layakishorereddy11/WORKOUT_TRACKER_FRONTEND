import api from './api';

// --- Auth ---
const register = (username, email, password) => {
  return api.post('/users/register', {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return api.post('/users/login', {
    username,
    password,
  });
};

// --- Workouts ---
const getWorkouts = (userId) => {
  return api.get(`/users/${userId}/workouts`);
};

const createWorkout = (userId, workoutData) => {
  return api.post(`/users/${userId}/workouts`, workoutData);
};

const getWorkoutById = (userId, workoutId) => {
  return api.get(`/users/${userId}/workouts/${workoutId}`);
};

const updateWorkout = (userId, workoutId, workoutData) => {
  return api.put(`/users/${userId}/workouts/${workoutId}`, workoutData);
};

const deleteWorkout = (userId, workoutId) => {
  return api.delete(`/users/${userId}/workouts/${workoutId}`);
};

// --- Templates ---
const getTemplates = (userId) => {
  return api.get(`/users/${userId}/templates`);
};

const createTemplate = (userId, templateData) => {
  return api.post(`/users/${userId}/templates`, templateData);
};

const deleteTemplate = (userId, templateId) => {
  return api.delete(`/users/${userId}/templates/${templateId}`);
};


const userService = {
  register,
  login,
  getWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getTemplates,
  createTemplate,
  deleteTemplate,
};

export default userService; 