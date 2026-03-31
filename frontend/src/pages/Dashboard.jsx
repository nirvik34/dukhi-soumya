import React, { useState, useEffect } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [activities, setActivities] = useState([
    // Fallback static data in case backend isn't up
    { id: 101, title: 'Pattern Matching', category: 'logic', description: "Tell us how you're feeling to get customized activity picks.", icon: 'extension', colorClass: 'icon-secondary' },
    { id: 102, title: 'Feeling Journal', category: 'emotional', description: "Track your stars, levels, and upcoming activities all in one place.", icon: 'mood', colorClass: 'icon-tertiary' }
  ]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${API_BASE}/activity/activities`)
      .then(res => res.json())
      .then(data => {
        if (data && data.activities) {
          // Map backend data to frontend model
          const mapped = data.activities.map((act, index) => ({
            ...act,
            icon: act.category === 'mood' ? 'mood' : 'extension',
            colorClass: index % 2 === 0 ? 'icon-secondary' : 'icon-tertiary'
          }));
          setActivities(mapped);
        }
      })
      .catch(err => console.error("Could not load backend activities, using fallbacks:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, <span className="highlight">Explorer!</span></h1>
        <p>You have 3 new tasks today. Let's get started!</p>
      </header>
      
      <div className="dashboard-grid">
        {/* Progress Card */}
        <div className="dash-card xl-card">
          <h2>Your Weekly Progress</h2>
          <div className="stats-container">
             <div className="stat">
                <span className="stat-number primary">12</span>
                <span className="stat-label">Activities</span>
             </div>
             <div className="stat">
                <span className="stat-number secondary">90%</span>
                <span className="stat-label">Focus Score</span>
             </div>
             <div className="stat">
                <span className="stat-number tertiary">Lvl 5</span>
                <span className="stat-label">Rank</span>
             </div>
          </div>
        </div>

        {/* Current Mood */}
        <div className="dash-card">
           <div className="mood-header">
              <h2>Current Mood</h2>
              <button className="btn-edit">Edit <span className="material-symbols-outlined">edit</span></button>
           </div>
           <div className="mood-display bg-primary-container">
              <span className="mood-emoji">😊</span>
              <p className="mood-text">Happy and Ready!</p>
           </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="dash-card dashed-zone">
           <h2>Up Next (from API)</h2>
           <ul className="task-list">
              {activities.map(activity => (
                <li key={activity.id}>
                   <span className={`material-symbols-outlined ${activity.colorClass}`}>{activity.icon}</span>
                   <div className="task-info">
                      <strong>{activity.title}</strong>
                      <p>{activity.description || '10 mins'} • {activity.category}</p>
                   </div>
                   <button className="btn-icon"><span className="material-symbols-outlined">play_arrow</span></button>
                </li>
              ))}
           </ul>
        </div>
      </div>
    </div>
  );
}
