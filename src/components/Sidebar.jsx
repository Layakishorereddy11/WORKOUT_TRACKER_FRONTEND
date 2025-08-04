import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="sidebar-header">
        <Link to="/" className="header-link">
          <h2>Home</h2>
        </Link>
      </div>
      <ul className="sidebar-menu">
        {auth.user ? (
          <li>
            <button onClick={handleLogout} className="sidebar-button">Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className="sidebar-button">Login</Link>
            </li>
            <li>
              <Link to="/register" className="sidebar-button">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar; 