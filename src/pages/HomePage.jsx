import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/HomePage.css'

const HomePage = () => (
  <div className="homepage-container">
    <header className="hero-section">
      <h1>Workout Tracker</h1>
      <p>Your companion for logging, tracking, and analyzing your workouts.</p>
      <div className="hero-buttons">
        <Link to="/login" className="btn-primary">Login</Link>
        <Link to="/register" className="btn-secondary">Register</Link>
      </div>
    </header>

    <section className="features-section">
      <h2>Key Features</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Track Workouts</h3>
          <p>Log exercises with sets, reps, and weights for every session.</p>
        </div>
        <div className="feature-card">
          <h3>Workout Templates</h3>
          <p>Save and reuse your favorite routines in one click.</p>
        </div>
        <div className="feature-card">
          <h3>Activity Calendar</h3>
          <p>Visualize your consistency at a glance.</p>
        </div>
        <div className="feature-card">
          <h3>Training Stats</h3>
          <p>Get insights on muscle focus, totals, and personal bests.</p>
        </div>
      </div>
    </section>

    <footer className="homepage-footer">
      <p>Crafted with ❤️ by Laya Kishore Reddy</p>
    </footer>
  </div>
)

export default HomePage 