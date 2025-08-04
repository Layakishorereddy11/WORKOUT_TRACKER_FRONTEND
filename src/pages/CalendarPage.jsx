import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import '../styles/CalendarPage.css';

const CalendarPage = () => {
  const [workoutDates, setWorkoutDates] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkoutDates = async () => {
      try {
        const response = await userService.getWorkouts(user.user.id);
        const dates = new Set(response.data.map(workout => new Date(workout.workoutDate).toDateString()));
        setWorkoutDates(dates);
      } catch (error) {
        console.error("Failed to fetch workout dates:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.user && user.user.id) {
      fetchWorkoutDates();
    }
  }, [user]);

  const tileContent = ({ date, view }) => {
    // Add a glowing dot to days with workouts
    if (view === 'month' && workoutDates.has(date.toDateString())) {
      return <div className="workout-dot"></div>;
    }
    return null;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Your Workout Calendar</h1>
        <p>A visual log of your dedication and progress.</p>
      </div>
      <div className="calendar-wrapper">
        {loading ? (
          <p className="loading-text">Loading workout data...</p>
        ) : (
          <Calendar
            tileContent={tileContent}
            showNeighboringMonth={false}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage; 