import React from 'react';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const kpis = [
    { title: "Average Mood", value: "Stable", change: "↑ 12% improvement", icon: "mood", color: "#BAE6FD" },
    { title: "Activities Done", value: "24", change: "Goal: 30/week", icon: "task_alt", color: "#E0E7FF" },
    { title: "Focus Score", value: "8.4", change: "Consistent peak", icon: "psychology", color: "#F0F9FF" },
    { title: "Social Interacts", value: "12", change: "New phrases used", icon: "chat_bubble", color: "#DDD6FE" },
  ];

  const alerts = [
    { id: 1, type: "warning", time: "2h ago", title: "Recent Alert", message: "Unusual frustration during Logic Puzzles.", status: "Active" },
    { id: 2, type: "history", time: "Yesterday", title: "Resolved", message: "Sleep disruption reported via Mood Tracker.", status: "Resolved" },
  ];

  return (
    <div className="parent-page-container">
      <header className="parent-header">
        <div className="header-top">
          <h1>Welcome back, <span className="italic-accent">Sarah</span></h1>
          <div className="date-picker-placeholder">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Last 7 Days</span>
          </div>
        </div>
        <p className="subtitle">Here's how Leo is progressing this week.</p>
      </header>

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

      <div className="dashboard-main-grid">
        <div className="chart-section lg:col-span-2">
          <div className="chart-card shadow-soft">
            <div className="chart-header">
              <h2>Weekly Mood Trend</h2>
              <span className="handwritten">Visualizing calmness</span>
            </div>
            <div className="chart-visual">
               {/* Simulated bar chart */}
               <div className="bar-container">
                  <div className="bar" style={{ height: '75%' }}></div>
                  <div className="bar" style={{ height: '50%' }}></div>
                  <div className="bar" style={{ height: '85%' }}></div>
                  <div className="bar" style={{ height: '65%' }}></div>
                  <div className="bar" style={{ height: '75%' }}></div>
                  <div className="bar" style={{ height: '80%' }}></div>
                  <div className="bar" style={{ height: '100%' }}></div>
               </div>
               <div className="chart-footer">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>
          </div>

          <div className="secondary-stats-row">
            <div className="focus-areas-card shadow-sm">
              <h3>Focus Areas</h3>
              <div className="area-item">
                <div className="item-txt"><span>Language</span><span>85%</span></div>
                <div className="progress-bg"><div className="progress-fill primary" style={{ width: '85%' }}></div></div>
              </div>
              <div className="area-item">
                <div className="item-txt"><span>Motor Skills</span><span>62%</span></div>
                <div className="progress-bg"><div className="progress-fill secondary" style={{ width: '62%' }}></div></div>
              </div>
              <div className="area-item">
                <div className="item-txt"><span>Logic</span><span>94%</span></div>
                <div className="progress-bg"><div className="progress-fill tertiary" style={{ width: '94%' }}></div></div>
              </div>
            </div>

            <div className="milestone-card shadow-sm">
              <span className="material-symbols-outlined milestone-icon">stars</span>
              <p className="milestone-title">Weekly Milestone</p>
              <p className="milestone-desc">Leo mastered the "Complex Shapes" module 2 days earlier than projected!</p>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <section className="alerts-card shadow-sm">
             <div className="section-title">
                <span className="material-symbols-outlined text-error">warning</span>
                <h2>Mood Alerts</h2>
             </div>
             <div className="alerts-list">
                {alerts.map(alert => (
                  <div className={`alert-item ${alert.type}`} key={alert.id}>
                    <span className="material-symbols-outlined icon-small">
                      {alert.type === 'warning' ? 'event_busy' : 'history'}
                    </span>
                    <div className="alert-content">
                       <span className="alert-meta">{alert.title} • {alert.time}</span>
                       <p className="alert-msg">{alert.message}</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="recommendations-section">
             <div className="section-title">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <h2>Caregiver Recommendations</h2>
             </div>
             <div className="rec-card primary shadow-sm">
                <h4>Evening Wind-down Tip</h4>
                <p>Try introducing the "Deep Sea Breath" activity 15 minutes earlier today to combat recorded afternoon fatigue.</p>
                <span className="material-symbols-outlined arrow">chevron_right</span>
             </div>
             <div className="rec-card tertiary shadow-sm">
                <h4>Activity Adjustment</h4>
                <p>Leo is excelling at visual tasks. Introduce more 'matching' games to build on this confidence boost.</p>
                <span className="material-symbols-outlined arrow">chevron_right</span>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
