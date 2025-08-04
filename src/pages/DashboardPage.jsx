import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import WorkoutListItem from '../components/WorkoutListItem';
import WorkoutCalendar from '../components/WorkoutCalendar';
import StatsWidget from '../components/StatsWidget'; // Import the new stats widget
import { parseLocalDate } from '../utils/date';
import { exerciseData } from '../data/exercises'; // Import exercise data for mapping
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Create a reverse map to easily find a muscle group from an exercise name
  const exerciseToMuscleMap = useMemo(() => {
    const map = {};
    for (const muscle in exerciseData) {
      exerciseData[muscle].forEach(exercise => {
        map[exercise] = muscle;
      });
    }
    return map;
  }, []);

  const stats = useMemo(() => {
    if (workouts.length === 0) return null;

    const muscleCounts = Object.keys(exerciseData).reduce((acc, muscle) => {
      acc[muscle] = 0;
      return acc;
    }, {});

    workouts.forEach(workout => {
      const musclesWorkedInSession = new Set();
      workout.exercises.forEach(exercise => {
        const muscle = exerciseToMuscleMap[exercise.exerciseName];
        if (muscle) {
          musclesWorkedInSession.add(muscle);
        }
      });
      musclesWorkedInSession.forEach(muscle => {
        muscleCounts[muscle]++;
      });
    });

    const sortedMuscles = Object.entries(muscleCounts).sort(([, a], [, b]) => b - a);

    return {
      totalWorkouts: workouts.length,
      muscleCounts: muscleCounts,
      mostWorked: sortedMuscles[0],
      leastWorked: sortedMuscles[sortedMuscles.length - 1],
    };
  }, [workouts, exerciseToMuscleMap]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // FIX: Use user.user.id to match the LoginResponseDto structure
        const response = await userService.getWorkouts(user.user.id);
        // Sort workouts by date in descending order (newest first)
        const sortedWorkouts = response.data.sort((a, b) => {
          const dateA = parseLocalDate(a.workoutDate);
          const dateB = parseLocalDate(b.workoutDate);
          return dateB - dateA;
        });
        setWorkouts(sortedWorkouts);
      } catch (err) {
        setError('Failed to fetch workouts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // FIX: Check for the nested user object and its id
    if (user && user.user && user.user.id) {
      fetchWorkouts();
    }
  }, [user]);

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        // FIX: Use user.user.id here as well
        await userService.deleteWorkout(user.user.id, workoutId);
        setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
      } catch (err) {
        setError('Failed to delete workout.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Loading workouts...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/create-workout" className="btn-primary">
          Create New Workout
        </Link>
      </div>
      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar-left">
          <StatsWidget stats={stats} />
        </aside>
        <div className="workout-list-container">
          {workouts.length > 0 ? (
            <div className="workout-list">
              {workouts.map((workout) => (
                <WorkoutListItem
                  key={workout.id}
                  workout={workout}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="no-workouts">
              <p>You haven't logged any workouts yet.</p>
              <p>
                <Link to="/create-workout">Get started now!</Link>
              </p>
            </div>
          )}
        </div>
        <aside className="dashboard-sidebar-right">
          <div className="calendar-widget">
            <h2 className="widget-title">Activity Calendar</h2>
            <WorkoutCalendar />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage; 