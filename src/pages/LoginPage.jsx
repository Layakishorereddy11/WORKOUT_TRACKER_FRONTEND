import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await userService.login(username, password);
      // Assuming the backend response is { user: {...}, token: '...' }
      // Or if the token is inside the user object, that's fine too.
      // The important part is that response.data is stored.
      auth.login(response.data);
      navigate('/');
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        'Login failed. Please check your credentials.';
      setMessage(resMessage);
      console.error('Login error:', resMessage);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {message && <p className="message error-message">{message}</p>}
        <Link to="/account-recovery" className="forgot-link">Forgot password or username?</Link>
      </form>
    </div>
  );
};

export default LoginPage; 