import React, { useEffect, useState } from 'react';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const [gameScores, setGameScores] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem('username') || "Parent";

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const DUMMY_SCORES = [
    { game: 'Bubble Pop', score: 850, timestamp: new Date(Date.now() - 86400000).toISOString() },
    { game: 'Color Sorting', score: 920, timestamp: new Date(Date.now() - 172800000).toISOString() },
    { game: 'Sound Match', score: 780, timestamp: new Date(Date.now() - 259200000).toISOString() }
  ];

  const DUMMY_MOODS = [
    { primary_emotion: 'Happy', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { primary_emotion: 'Calm', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { primary_emotion: 'Happy', timestamp: new Date(Date.now() - 259200000).toISOString() },
    { primary_emotion: 'Neutral', timestamp: new Date(Date.now() - 345600000).toISOString() },
    { primary_emotion: 'Happy', timestamp: new Date(Date.now() - 432000000).toISOString() }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      try {
        // Fetch game scores
        const scoresRes = await fetch(`${API_BASE}/game/scores?username=${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const scoresData = await scoresRes.json();
        if (scoresData.scores && scoresData.scores.length > 0) {
          setGameScores(scoresData.scores);
        } else {
          setGameScores(DUMMY_SCORES);
        }

        // Fetch mood history
        const moodRes = await fetch(`${API_BASE}/mood/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const moodData = await moodRes.json();
        if (moodData.history && moodData.history.length > 0) {
          setMoodHistory(moodData.history);
        } else {
          setMoodHistory(DUMMY_MOODS);
        }

      } catch (err) {
        console.error("Error fetching parent dashboard:", err);
        setGameScores(DUMMY_SCORES);
        setMoodHistory(DUMMY_MOODS);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // 🔹 Activities count
  const activitiesDone = gameScores.length;

  // 🔹 Mood calculation
  const moodCounts = {};
  moodHistory.forEach(m => {
    const mood = m.primary_emotion || m.emotion || "Neutral";
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  const dominantMood =
    Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0] || "Neutral";

  // 🔹 Fake focus score (based on activity count)
  const focusScore = activitiesDone > 0 ? (Math.min(activitiesDone * 10, 100) / 10).toFixed(1) : "0";

  const kpis = [
    { title: "Average Mood", value: dominantMood, change: "Based on recent logs", icon: "mood", color: "#BAE6FD" },
    { title: "Activities Done", value: activitiesDone, change: "This week", icon: "task_alt", color: "#E0E7FF" },
    { title: "Focus Score", value: focusScore, change: "Derived from activity", icon: "psychology", color: "#F0F9FF" },
    { title: "Mood Entries", value: moodHistory.length, change: "Tracked emotions", icon: "chat_bubble", color: "#DDD6FE" },
  ];

  // 🔹 Last 7 mood values for chart
  const last7 = moodHistory.slice(-7);
  const moodValues = last7.map((_, i) => 50 + i * 5); // simple visual variation

  if (loading) {
    return <div className="parent-page-container">Loading dashboard...</div>;
  }

  return (
    <div className="parent-page-container">
      
      {/* Header */}
      <header className="parent-header">
        <div className="header-top">
          <h1>Welcome back, <span className="italic-accent">{username}</span></h1>
          <div className="date-picker-placeholder">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Last 7 Days</span>
          </div>
        </div>
        <p className="subtitle">Here’s how your child is progressing this week.</p>
      </header>

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <div className="kpi-card shadow-sm" key={index} style={{ borderLeft: `4px solid ${kpi.color}` }}>
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <span className="material-symbols-outlined kpi-icon">{kpi.icon}</span>
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{kpi.value}</span>
              <p className="kpi-change">{kpi.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-card shadow-soft">
        <h2>Weekly Mood Trend</h2>
        <div className="bar-container">
          {moodValues.map((val, i) => (
            <div key={i} className="bar" style={{ height: `${val}%` }}></div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="alerts-card shadow-sm">
        <h2>Mood Alerts</h2>

        {dominantMood === "Sad" || dominantMood === "Angry" ? (
          <div className="alert-item warning">
            <p>Child showing signs of stress. Consider calming activities.</p>
          </div>
        ) : (
          <div className="alert-item">
            <p>No concerning mood patterns detected 👍</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="rec-card primary shadow-sm">
        <h4>Recommendation</h4>
        <p>
          Encourage more {dominantMood === "Happy" ? "interactive" : "calming"} activities
          based on recent mood trends.
        </p>
      </div>

    </div>
  );
};

export default ParentDashboard;