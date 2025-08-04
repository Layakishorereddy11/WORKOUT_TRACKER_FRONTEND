import api from './api';

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

const userService = {
  register,
  login,
};

export default userService; 