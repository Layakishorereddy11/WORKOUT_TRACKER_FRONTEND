import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutFormPage from './pages/WorkoutFormPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage'; // Add this import
import EditWorkoutPage from './pages/EditWorkoutPage'; // Add this import
import AccountRecoveryPage from './pages/AccountRecoveryPage'; // Import new page
// No longer need to import CalendarPage
import './styles/App.css';

const HomePage = () => (
  <main className="main-content">
    <h1>Workout Tracker</h1>
    <p>Welcome! Please log in or register to continue.</p>
  </main>
);

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Sidebar />
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account-recovery" element={<AccountRecoveryPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="create-workout" element={<WorkoutFormPage />} />
            {/* Add the new route for viewing a workout */}
            <Route path="workout/:workoutId" element={<WorkoutDetailPage />} />
            {/* Add the new route for editing a workout */}
            <Route path="edit-workout/:workoutId" element={<EditWorkoutPage />} />
            {/* The /calendar route is now removed */}
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
