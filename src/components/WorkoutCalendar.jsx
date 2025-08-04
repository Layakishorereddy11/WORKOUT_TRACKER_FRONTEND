import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { parseLocalDate } from '../utils/date'; // Import the new function
import '../styles/WorkoutCalendar.css'; // New dedicated stylesheet

const WorkoutCalendar = () => {
  const [workoutDates, setWorkoutDates] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkoutDates = async () => {
      try {
        const response = await userService.getWorkouts(user.user.id);
        // FIX: Use the safe local date parser before getting the date string
        const dates = new Set(response.data.map(workout => parseLocalDate(workout.workoutDate).toDateString()));
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

  const tileClassName = ({ date, view }) => {
    // If it's a month view and the date is in our set of workout dates,
    // apply the 'workout-day' class to the tile.
    if (view === 'month' && workoutDates.has(date.toDateString())) {
      return 'workout-day';
    }
    return null;
  };

  if (loading) {
    return <div className="calendar-loading">Loading Calendar...</div>;
  }

  return (
    <Calendar
      tileClassName={tileClassName}
      showNeighboringMonth={false}
    />
  );
};

export default WorkoutCalendar; 