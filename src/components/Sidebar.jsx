import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-left">
        <NavLink to="/" className="header-link">
          <img src="/logo.png" alt="Workout Tracker Logo" className="logo-image" />
          <h2>Workout Tracker</h2>
        </NavLink>
      </div>
      <ul className="sidebar-menu">
        {auth.user ? (
          <li>
            <button onClick={handleLogout} className="sidebar-button">Logout</button>
          </li>
        ) : (
          <>
            <li>
              <NavLink to="/login" className="sidebar-button">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register" className="sidebar-button">Register</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar; 