import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { parseLocalDate } from '../utils/date'; // Import the new function
import '../styles/WorkoutDetailPage.css';

const WorkoutDetailPage = () => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { workoutId } = useParams();
  const { user } = useAuth();

  const handleSaveAsTemplate = async () => {
    if (!workout || !workout.notes) {
      alert("Cannot save a template from a workout without a name.");
      return;
    }

    const templateName = workout.notes;
    const templateData = {
      name: templateName,
      // Remove exercise IDs to create a fresh template
      exercises: workout.exercises.map(({ id, ...rest }) => rest),
    };

    try {
      await userService.createTemplate(user.user.id, templateData);
      alert(`Template "${templateName}" saved successfully!`);
    } catch (err) {
      console.error("Failed to save template", err);
      alert("Error: Could not save template. A template with this name might already exist.");
    }
  };

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await userService.getWorkoutById(user.user.id, workoutId);
        setWorkout(response.data);
      } catch (err) {
        setError('Failed to fetch workout details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.user && user.user.id) {
      fetchWorkout();
    }
  }, [user, workoutId]);

  if (loading) {
    return <div className="loading-container">Loading Workout...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!workout) {
    return <div className="error-container">Workout not found.</div>;
  }

  // FIX: Use the safe local date parser
  const workoutDate = parseLocalDate(workout.workoutDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-card-actions">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          <button onClick={handleSaveAsTemplate} className="btn-secondary">Save as Template</button>
        </div>
        <div className="detail-header">
          <h1>{workout.notes}</h1>
          <p>{workoutDate}</p>
        </div>
        <div className="exercises-list">
          <h2>Exercises Performed</h2>
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <span className="exercise-name">{exercise.exerciseName}</span>
              <span className="exercise-stats">
                {exercise.sets} sets × {exercise.reps} reps
                {exercise.weightKg && ` @ ${exercise.weightKg} kg`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage; 