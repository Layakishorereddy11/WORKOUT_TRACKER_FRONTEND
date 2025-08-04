import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { exerciseData } from '../data/exercises.js';
import TemplateModal from '../components/TemplateModal'; // Import the new modal
import '../styles/WorkoutFormPage.css';

const WorkoutFormPage = () => {
  // FIX: Rename from workoutName to workoutNotes to match WorkoutDto
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [addedExercises, setAddedExercises] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success messages
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  
  const [currentMuscle, setCurrentMuscle] = useState('');
  // FIX: Rename fields to match ExerciseDto
  const [currentExercise, setCurrentExercise] = useState({
    exerciseName: '',
    sets: '',
    reps: '',
    weightKg: '',
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await userService.getTemplates(user.user.id);
        setTemplates(response.data);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };
    if (user && user.user && user.user.id) {
      fetchTemplates();
    }
  }, [user]);

  const handleTemplateSelect = (template) => {
    if (!template) return;

    const hasUnsavedChanges = workoutNotes.trim() !== '' || addedExercises.length > 0;

    const loadTemplate = () => {
      setWorkoutNotes(template.name);
      setAddedExercises(template.exercises.map(({ id, ...rest }) => rest));
      setIsModalOpen(false);
    };

    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes that will be overwritten. Are you sure you want to load this template?')) {
        loadTemplate();
      }
      // If user clicks cancel, do nothing.
    } else {
      // No unsaved changes, load directly.
      loadTemplate();
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!workoutNotes || addedExercises.length === 0) {
      setError('A template must have a name and at least one exercise.');
      return;
    }
    setError('');
    setSuccessMessage('');

    const templateData = {
      name: workoutNotes,
      exercises: addedExercises,
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
    // FIX: Check for exerciseName
    if (!currentExercise.exerciseName || !currentExercise.sets || !currentExercise.reps) {
      setError('Please fill out the exercise name, sets, and reps.');
      return;
    }
    setError('');
    setAddedExercises([...addedExercises, currentExercise]);
    setCurrentMuscle('');
    // FIX: Reset state with correct field names
    setCurrentExercise({ exerciseName: '', sets: '', reps: '', weightKg: '' });
  };

  const handleRemoveExercise = (index) => {
    setAddedExercises(addedExercises.filter((_, i) => i !== index));
  };

  const handleSaveWorkout = async () => {
    // FIX: Check for workoutNotes
    if (!workoutNotes || addedExercises.length === 0) {
      setError('Please provide a workout name and add at least one exercise.');
      return;
    }
    setError('');
    // FIX: Construct the payload to exactly match WorkoutDto and ExerciseDto
    const workoutData = {
      notes: workoutNotes,
      workoutDate: workoutDate,
      exercises: addedExercises,
    };

    try {
      // FIX: Use user.user.id
      await userService.createWorkout(user.user.id, workoutData);
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError('Failed to save workout. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
      {isModalOpen && (
        <TemplateModal
          templates={templates}
          onSelect={handleTemplateSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h1 className="form-title">Create Your Workout</h1>
            {templates.length > 0 && (
              <button onClick={() => setIsModalOpen(true)} className="btn-load-template">
                Load from Template
              </button>
            )}
          </div>
          
          {/* Workout Details */}
          <div className="form-group-inline">
            <div className="form-group">
              {/* FIX: Label and state updated to "Workout Notes" */}
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
                  // FIX: Use currentExercise.exerciseName
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
                {/* FIX: State and field names updated to weightKg */}
                <input type="number" placeholder="60" value={currentExercise.weightKg} onChange={(e) => setCurrentExercise({ ...currentExercise, weightKg: e.target.value })} />
              </div>
            </div>
            <button onClick={handleAddExercise} className="btn-add-exercise">Add Exercise</button>
          </div>

          {addedExercises.length > 0 && (
            <div className="current-workout-list">
              <h2>Your Current Workout</h2>
              {addedExercises.map((ex, index) => (
                <div key={index} className="added-exercise-card">
                  <div>
                    {/* FIX: Display exerciseName */}
                    <p className="exercise-name">{ex.exerciseName}</p>
                    {/* FIX: Display weightKg */}
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
                onClick={handleSaveWorkout}
                className="btn-save-workout"
                disabled={!workoutNotes || addedExercises.length === 0}
              >
                Save Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkoutFormPage; 