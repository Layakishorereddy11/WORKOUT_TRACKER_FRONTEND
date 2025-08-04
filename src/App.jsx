import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/App.css';

const HomePage = () => (
  <main className="main-content">
    <h1>Workout Tracker</h1>
    <p>Welcome to your personal workout tracker!</p>
  </main>
);

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
