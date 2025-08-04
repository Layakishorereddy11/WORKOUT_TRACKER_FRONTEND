import React from 'react';
import '../styles/StatsWidget.css';

const StatsWidget = ({ stats }) => {
  if (!stats) {
    return (
      <div className="stats-widget-container">
        <h2 className="widget-title">Your Stats</h2>
        <p className="no-stats-text">Log a workout to see your stats!</p>
      </div>
    );
  }

  return (
    <div className="stats-widget-container">
      <h2 className="widget-title">Your Stats</h2>
      <div className="stat-card total-workouts-card">
        <span className="stat-value">{stats.totalWorkouts}</span>
        <span className="stat-label">Total Workouts</span>
      </div>
      
      <div className="stat-card focus-card">
        <div>
          <span className="stat-label">Most Worked</span>
          <span className="stat-value small">{stats.mostWorked[0]}</span>
        </div>
        <div>
          <span className="stat-label">Least Worked</span>
          <span className="stat-value small">{stats.leastWorked[0]}</span>
        </div>
      </div>

      <div className="muscle-breakdown">
        <h3 className="breakdown-title">Muscle Breakdown</h3>
        <ul>
          {Object.entries(stats.muscleCounts).map(([muscle, count]) => (
            <li key={muscle}>
              <span>{muscle}</span>
              <span className="count-badge">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatsWidget; 