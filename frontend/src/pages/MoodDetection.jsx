import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MoodDetection.css';

const ALL_GAMES = [
  {
    id: 'bubble-pop',
    title: 'Bubble Pop',
    description: 'Pop floating bubbles! Smaller = more points.',
    icon: 'bubble_chart',
    duration: '30s',
    difficulty: 'Easy',
    category: 'Energizing',
    path: '/games/bubble-pop'
  },
  {
    id: 'sound-match',
    title: 'Sound Match',
    description: 'Listen & repeat the rhythm pattern.',
    icon: 'music_note',
    duration: '5m',
    difficulty: 'Medium',
    category: 'Interactive',
    path: '/games/sound-match'
  },
  {
    id: 'color-sorting',
    title: 'Color Sorting',
    description: 'Sort colors into the right buckets.',
    icon: 'palette',
    duration: '3m',
    difficulty: 'Easy',
    category: 'Calming',
    path: '/games/color-sorting'
  },
  {
    id: 'feeling-journal',
    title: 'Feeling Journal',
    description: 'Check in with your emotions.',
    icon: 'auto_stories',
    duration: '5m',
    difficulty: 'Calm',
    category: 'Calming',
    path: '/games/feeling-journal'
  }
];

const MoodDetection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const filteredGames = useMemo(() => {
    if (selectedCategory === 'All') return ALL_GAMES;
    return ALL_GAMES.filter(game => game.category === selectedCategory);
  }, [selectedCategory]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectMood = async () => {
    if (!image) {
        alert("Please upload an image first!");
        return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/mood/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setResult(data.results);
      }
    } catch (error) {
      console.error("Error detecting mood:", error);
      setResult({
        primary_emotion: "Neutral",
        reasoning: "Analysis failed, but we're still here to help.",
        suggested_activity: "Take a sensory break.",
        confidences: { "Neutral": 100 }
      });
    }
    setLoading(false);
  };

  return (
    <div className="mood-page-container">
      <header className="mood-header">
        <h1>How are we <span className="italic-accent">feeling</span> today?</h1>
        <p>Upload a photo or use your camera, and NeuroLearn will help you understand your emotions and suggest the perfect activity.</p>
      </header>

      <div className="mood-grid">
        {/* Decorative Arrow */}
        <div className="mood-doodle-arrow">
          <svg viewBox="0 0 120 60" fill="none">
            <path d="M5 30C5 30 35 5 60 30C85 55 115 30 115 30" stroke="var(--color-primary)" strokeDasharray="8 8" strokeWidth="3" />
            <path d="M105 20L115 30L105 40" stroke="var(--color-primary)" strokeWidth="3" />
          </svg>
        </div>

        {/* Left: Upload Card */}
        <div className="mood-card upload-card shadow-soft">
          <div className="upload-dropzone">
            {preview ? (
              <div className="image-preview-wrapper">
                <img src={preview} alt="Preview" className="capture-preview" />
                <button className="btn-icon remove-img" onClick={() => {setPreview(null); setImage(null);}}>
                    <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ) : (
              <>
                <div className="icon-group">
                  <div className="icon-circle primary-circle">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                  <div className="icon-circle secondary-circle">
                    <span className="material-symbols-outlined">folder_open</span>
                  </div>
                </div>
                <h3>Capture or Upload</h3>
                <p>Click to take a selfie or browse files</p>
              </>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              id="mood-upload-input" 
              style={{display: 'none'}} 
            />
            
            <button className="btn-primary" onClick={() => !preview ? document.getElementById('mood-upload-input').click() : detectMood()} disabled={loading}>
              <span className="material-symbols-outlined">{loading ? "hourglass_top" : (preview ? "psychology" : "file_upload")}</span>
              {loading ? "Analyzing..." : (preview ? "Analyze Mood" : "Upload Image")}
            </button>
            <p className="privacy-note">Privacy Protected & AI-Powered</p>
          </div>
        </div>

        {/* Right: Result Card */}
        <div className="mood-card result-card shadow-soft">
          <div className="result-content">
            <div className="emotion-display">
              {result?.image_url ? (
                  <img src={result.image_url} alt="Analyzed" className="emotion-illustration rounded" />
              ) : (
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm8ZnjTse9HI_UfibDnWRPO3lwdMg96UDPLAahqGPPLRxa6_pUGUkqC6OMRABKmk_pr8I28UAjpbaUUi-XPBgyhvhNzMWnoMlZljwqUItJW2fhZd5K-H7av9pTleKVNgbMkvOZDdhkS7D1bqDqVOsm4cK9EvtxcJ_RvwoXXOJSYYxlzrxCm8_8X-ZozMEegBt0g8R99o9qHomxvG5AUsC9owk2lYruFYyazSMmehYicbIGiA-fybI-ADtsy_fL0Clrl1XJZQdbD80" alt="Feeling" className="emotion-illustration" />
              )}
              <h2>{result ? result.primary_emotion : "Detecting..."}</h2>
              <p className="mood-quote italic">{result?.reasoning ? `"${result.reasoning}"` : '"Waiting for your vibe check..."'}</p>
            </div>

            <div className="confidence-bars">
              {result && Object.entries(result.confidences).map(([emotion, value]) => (
                <div className="bar-group" key={emotion}>
                  <div className="bar-labels">
                    <span className="emotion-name">{emotion}</span>
                    <span className="confidence-value">{typeof value === 'number' ? (value * 100).toFixed(0) : value}%</span>
                  </div>
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ width: `${typeof value === 'number' ? value * 100 : value}%` }}></div>
                  </div>
                </div>
              ))}
              {!result && <div className="placeholder-bars"><div className="shimmer-bar"></div><div className="shimmer-bar"></div></div>}
            </div>

            <div className="mood-insights">
              <h4>
                <span className="material-symbols-outlined">lightbulb</span>
                NeuroInsight
              </h4>
              <p>{result?.suggested_activity || "Upload your photo to get a personalized sensory activity suggestion based on your current state."}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="suggested-activities-section">
        <div className="section-header">
          <div className="header-text">
            <span className="hand-subtitle">Personalized for You</span>
            <h2>Suggested Activities</h2>
          </div>
          
          <div className="category-filters">
            {['All', 'Calming', 'Energizing', 'Interactive'].map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="activities-grid">
          {filteredGames.map(game => (
            <div key={game.id} className="activity-card shadow-soft game-card">
              <div className="game-icon-wrapper">
                <span className="material-symbols-outlined">{game.icon}</span>
              </div>
              <div className="activity-content">
                <div className="activity-badge-row">
                  <span className="badge">{game.category}</span>
                  <span className="time">{game.duration} • {game.difficulty}</span>
                </div>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <button className="play-now-btn" onClick={() => navigate(game.path)}>
                  Play Now <span className="material-symbols-outlined">play_circle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ActivityCard = ({ title, category, img }) => (
  <div className="activity-card shadow-soft">
    <div className="activity-img-wrapper">
      <img src={img} alt={title} />
    </div>
    <div className="activity-badge-row">
      <span className="badge">{category}</span>
      <span className="time">15 mins</span>
    </div>
    <h3>{title}</h3>
    <p>Engaging learning module designed for your current mood.</p>
  </div>
);

export default MoodDetection;
