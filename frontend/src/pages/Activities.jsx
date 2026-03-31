import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Activities.css';

const Activities = () => {
  const navigate = useNavigate();

  const categories = [
    { title: "Sensory", count: 12, icon: "sensors", color: "var(--color-secondary-container)" },
    { title: "Cognitive", count: 8, icon: "psychology", color: "var(--color-primary-container)" },
    { title: "Language", count: 15, icon: "translate", color: "var(--color-tertiary-container)" },
    { title: "Motor Skills", count: 10, icon: "directions_run", color: "var(--color-surface-container-high)" },
  ];

  const games = [
    { title: "Bubble Pop", time: "30s", level: "Easy", icon: "bubble_chart", route: "/games/bubble-pop", desc: "Pop floating bubbles! Smaller = more points.", color: "#e3f2fd" },
    { title: "Sound Match", time: "5m", level: "Medium", icon: "music_note", route: "/games/sound-match", desc: "Listen & repeat the rhythm pattern.", color: "#f3e5f5" },
    { title: "Color Sorting", time: "3m", level: "Easy", icon: "palette", route: "/games/color-sorting", desc: "Sort colors into the right buckets.", color: "#e8f5e9" },
    { title: "Feeling Journal", time: "5m", level: "Calm", icon: "auto_stories", route: "/games/feeling-journal", desc: "Check in with your emotions.", color: "#fff8e1" },
  ];

  return (
    <div className="activities-page">
      <header className="activities-header">
        <h1>Activity <span className="italic-accent">Library</span></h1>
        <p>Explore a world of sensory-friendly learning designed for neurodiverse minds.</p>
      </header>

      <div className="category-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="category-card" style={{ backgroundColor: cat.color }}>
            <span className="material-symbols-outlined cat-icon">{cat.icon}</span>
            <h3>{cat.title}</h3>
            <p>{cat.count} Activities</p>
          </div>
        ))}
      </div>

      {/* Playable Games Section */}
      <section className="featured-section">
        <div className="section-title-row">
          <h2><span className="material-symbols-outlined section-icon">stadia_controller</span> Play Now</h2>
          <div className="filter-pills">
             <span className="pill active">All</span>
             <span className="pill">Calming</span>
             <span className="pill">Energizing</span>
             <span className="pill">Interactive</span>
          </div>
        </div>

        <div className="games-grid">
          {games.map((game, idx) => (
            <div key={idx} className="game-card shadow-soft" style={{ backgroundColor: game.color }}
                 onClick={() => navigate(game.route)}>
              <span className="material-symbols-outlined game-icon">{game.icon}</span>
              <div className="game-info">
                <h3>{game.title}</h3>
                <p className="game-desc">{game.desc}</p>
                <div className="game-meta">
                  <span className="meta-pill">{game.time}</span>
                  <span className="meta-pill">{game.level}</span>
                </div>
              </div>
              <span className="material-symbols-outlined game-arrow">play_circle</span>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-title-row">
          <h2>More Activities</h2>
        </div>
        <div className="activities-grid">
          <ActivityItem title="Sand Drawing" time="15m" level="Medium" img="https://images.unsplash.com/photo-1506190500382-d27870075d6b?auto=format&fit=crop&q=80&w=400" />
          <ActivityItem title="Pattern Master" time="10m" level="Medium" img="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400" />
          <ActivityItem title="Story Weaver" time="20m" level="Hard" img="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400" />
        </div>
      </section>
    </div>
  );
};

const ActivityItem = ({ title, time, level, img }) => (
  <div className="activity-item-card shadow-soft">
    <div className="item-img"><img src={img} alt={title} /></div>
    <div className="item-details">
      <div className="meta-row">
        <span>{time}</span>
        <span className="dot"></span>
        <span>{level}</span>
      </div>
      <h3>{title}</h3>
      <button className="play-btn"><span className="material-symbols-outlined">play_arrow</span> Start</button>
    </div>
  </div>
);

export default Activities;
