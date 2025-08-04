import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { exerciseData } from '../data/exercises.js';
import '../styles/WorkoutFormPage.css'; // Reusing the same styles

const EditWorkoutPage = () => {
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [addedExercises, setAddedExercises] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success messages
  const [loading, setLoading] = useState(true);
  
  const [currentMuscle, setCurrentMuscle] = useState('');
  const [currentExercise, setCurrentExercise] = useState({
    exerciseName: '',
    sets: '',
    reps: '',
    weightKg: '',
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { workoutId } = useParams();

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await userService.getWorkoutById(user.user.id, workoutId);
        const data = response.data;
        setWorkoutNotes(data.notes);
        setWorkoutDate(new Date(data.workoutDate).toISOString().split('T')[0]);
        setAddedExercises(data.exercises || []);
      } catch (err) {
        setError('Failed to load workout data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.user && user.user.id) {
      fetchWorkoutData();
    }
  }, [user, workoutId]);

  const handleSaveAsTemplate = async () => {
    if (!workoutNotes || addedExercises.length === 0) {
      setError('A template must have a name and at least one exercise.');
      return;
    }
    setError('');
    setSuccessMessage('');

    const templateData = {
      name: workoutNotes,
      // Strip exercise IDs when creating a template from an existing workout
      exercises: addedExercises.map(({ id, ...rest }) => rest),
    };

    try {
      await userService.createTemplate(user.user.id, templateData);
      setSuccessMessage(`Template "${workoutNotes}" saved!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save template. A template with this name might already exist.');
      console.error(err);
    }
  };

  const handleAddExercise = () => {
    if (!currentExercise.exerciseName || !currentExercise.sets || !currentExercise.reps) {
      setError('Please fill out the exercise name, sets, and reps.');
      return;
    }
    setError('');
    setAddedExercises([...addedExercises, currentExercise]);
    setCurrentMuscle('');
    setCurrentExercise({ exerciseName: '', sets: '', reps: '', weightKg: '' });
  };

  const handleRemoveExercise = (index) => {
    setAddedExercises(addedExercises.filter((_, i) => i !== index));
  };

  const handleUpdateWorkout = async () => {
    if (!workoutNotes || addedExercises.length === 0) {
      setError('A workout must have a name and at least one exercise.');
      return;
    }
    setError('');
    const workoutData = {
      id: workoutId,
      userId: user.user.id,
      notes: workoutNotes,
      workoutDate: workoutDate,
      exercises: addedExercises,
    };

    try {
      await userService.updateWorkout(user.user.id, workoutId, workoutData);
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError('Failed to update workout. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading workout for editing...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Edit Your Workout</h1>
        
        {/* Workout Details */}
        <div className="form-group-inline">
          <div className="form-group">
            <label>Workout Name/Notes</label>
            <input
              type="text"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="e.g., Morning Chest & Triceps"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
            />
          </div>
        </div>

        {/* Add Exercise Section */}
        <div className="add-exercise-section">
          <h2>Add an Exercise</h2>
          <div className="form-group-inline">
            <div className="form-group">
              <label>Muscle Group</label>
              <select value={currentMuscle} onChange={(e) => setCurrentMuscle(e.target.value)}>
                <option value="">Select Muscle</option>
                {Object.keys(exerciseData).map((muscle) => (
                  <option key={muscle} value={muscle}>{muscle}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Exercise</label>
              <select 
                value={currentExercise.exerciseName}
                onChange={(e) => setCurrentExercise({ ...currentExercise, exerciseName: e.target.value })}
                disabled={!currentMuscle}
              >
                <option value="">Select Exercise</option>
                {currentMuscle && exerciseData[currentMuscle].map((ex) => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label>Sets</label>
              <input type="number" placeholder="3" value={currentExercise.sets} onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Reps</label>
              <input type="number" placeholder="10" value={currentExercise.reps} onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" placeholder="60" value={currentExercise.weightKg} onChange={(e) => setCurrentExercise({ ...currentExercise, weightKg: e.target.value })} />
            </div>
          </div>
          <button onClick={handleAddExercise} className="btn-add-exercise">Add Exercise</button>
        </div>

        {/* Current Workout List */}
        {addedExercises.length > 0 && (
          <div className="current-workout-list">
            <h2>Your Current Workout</h2>
            {addedExercises.map((ex, index) => (
              <div key={index} className="added-exercise-card">
                <div>
                  <p className="exercise-name">{ex.exerciseName}</p>
                  <p className="exercise-details">{ex.sets} sets of {ex.reps} reps {ex.weightKg && `at ${ex.weightKg} kg`}</p>
                </div>
                <button onClick={() => handleRemoveExercise(index)} className="btn-remove">×</button>
              </div>
            ))}
          </div>
        )}

        {/* Save & Error */}
        <div className="form-footer">
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="form-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSaveAsTemplate}
              disabled={!workoutNotes || addedExercises.length === 0}
            >
              Save as Template
            </button>
            <button
              onClick={handleUpdateWorkout}
              className="btn-save-workout"
              disabled={!workoutNotes || addedExercises.length === 0}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWorkoutPage; 