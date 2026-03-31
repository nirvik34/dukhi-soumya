import React, { useState, useEffect } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch User Profile
        const userRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userRes.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }

        const userData = await userRes.json();
        if (userData.status === 'success') setUser(userData.user);

        // Fetch Activities
        const actRes = await fetch(`${API_BASE}/activity/activities`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const actData = await actRes.json();
        if (actData && actData.activities) {
          const mapped = actData.activities.map((act, index) => ({
            ...act,
            icon: act.category === 'mood' ? 'mood' : 'extension',
            colorClass: index % 2 === 0 ? 'icon-secondary' : 'icon-tertiary'
          }));
          setActivities(mapped);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading your journey...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, <span className="highlight">{user?.name || 'Explorer'}!</span></h1>
        <p>You have {activities.length} new tasks today. Let's get started!</p>
      </header>
      
      <div className="dashboard-grid">
        {/* Progress Card */}
        <div className="dash-card xl-card">
          <h2>Your Weekly Progress</h2>
          <div className="stats-container">
             <div className="stat">
                <span className="stat-number primary">{user?.progress?.activities_completed || 0}</span>
                <span className="stat-label">Activities</span>
             </div>
             <div className="stat">
                <span className="stat-number secondary">{user?.progress?.focus_score || 0}%</span>
                <span className="stat-label">Focus Score</span>
             </div>
             <div className="stat">
                <span className="stat-number tertiary">{user?.progress?.rank || 'Lvl 1'}</span>
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
