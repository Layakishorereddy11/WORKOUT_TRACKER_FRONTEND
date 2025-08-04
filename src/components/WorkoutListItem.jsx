import React from 'react';
import { Link } from 'react-router-dom';
import { parseLocalDate } from '../utils/date'; // Import the new function
import '../styles/WorkoutListItem.css';

const WorkoutListItem = ({ workout, onDelete }) => {
  // FIX: Use the safe local date parser
  const workoutDate = parseLocalDate(workout.workoutDate).toLocaleDateString();

  return (
    <div className="workout-card">
      <div className="workout-card-header">
        <h2 className="workout-name">{workout.notes}</h2>
        <p className="workout-date">{workoutDate}</p>
      </div>
      <div className="workout-card-actions">
        <div className="actions-group">
          <Link to={`/workout/${workout.id}`} className="btn-secondary">
            View
          </Link>
          <Link to={`/edit-workout/${workout.id}`} className="btn-secondary">
            Edit
          </Link>
        </div>
        <button onClick={() => onDelete(workout.id)} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default WorkoutListItem; 