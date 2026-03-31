import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GamePage.css';
import './ColorSorting.css';

const COLOR_GROUPS = [
  { name: 'Warm', colors: ['#FF6B6B', '#FF8E53', '#FFB347', '#FF4757'], bucket: '🔴' },
  { name: 'Cool', colors: ['#45B7D1', '#4ECDC4', '#6C5CE7', '#74B9FF'], bucket: '🔵' },
  { name: 'Nature', colors: ['#2ECC71', '#96CEB4', '#A8E6CF', '#00B894'], bucket: '🟢' },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ColorSorting() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sorted, setSorted] = useState({ Warm: [], Cool: [], Nature: [] });
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | playing | finished
  const [feedback, setFeedback] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const generateItems = useCallback(() => {
    const allItems = [];
    COLOR_GROUPS.forEach(group => {
      group.colors.forEach(color => {
        allItems.push({
          id: `${group.name}-${color}-${Math.random()}`,
          color,
          group: group.name,
        });
      });
    });
    return shuffleArray(allItems);
  }, []);

  const startGame = () => {
    setItems(generateItems());
    setSorted({ Warm: [], Cool: [], Nature: [] });
    setScore(0);
    setMoves(0);
    setTimeElapsed(0);
    setSelectedItem(null);
    setFeedback(null);
    setPhase('playing');
  };

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Check win
  useEffect(() => {
    if (phase !== 'playing') return;
    if (items.length === 0) {
      setPhase('finished');
      const bonus = Math.max(0, 500 - timeElapsed * 3);
      setScore(prev => prev + bonus);
      
      fetch(`${API_BASE}/game/save-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: 'color_sorting',
          score: score + bonus,
          username: localStorage.getItem('username') || 'anonymous',
          details: { moves, timeElapsed }
        })
      }).catch(console.error);
    }
  }, [items, phase]);

  const selectItem = (item) => {
    if (phase !== 'playing') return;
    setSelectedItem(item);
  };

  const dropIntoBucket = (bucketName) => {
    if (!selectedItem || phase !== 'playing') return;
    setMoves(m => m + 1);

    if (selectedItem.group === bucketName) {
      // Correct!
      const points = 50;
      setScore(prev => prev + points);
      setSorted(prev => ({
        ...prev,
        [bucketName]: [...prev[bucketName], selectedItem]
      }));
      setItems(prev => prev.filter(i => i.id !== selectedItem.id));
      setFeedback({ type: 'correct', text: `+${points} pts!` });
    } else {
      // Wrong
      setScore(prev => Math.max(0, prev - 10));
      setFeedback({ type: 'wrong', text: `That's ${selectedItem.group}, not ${bucketName}!` });
    }
    setSelectedItem(null);
    setTimeout(() => setFeedback(null), 1200);
  };

  return (
    <div className="game-page color-sorting-page">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/activities')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>🎨 Color Sorting</h1>
        <p>Sort the color tiles into the correct buckets! Warm, Cool, or Nature.</p>
      </div>

      {phase === 'idle' && (
        <div className="game-start-screen">
          <div className="start-card">
            <span className="start-emoji">🎨</span>
            <h2>Color Sorting</h2>
            <p>Tap a color tile, then tap the matching bucket to sort it!</p>
            <ul className="rules-list">
              <li>🔴 <strong>Warm:</strong> Reds, Oranges, Yellows</li>
              <li>🔵 <strong>Cool:</strong> Blues, Purples</li>
              <li>🟢 <strong>Nature:</strong> Greens</li>
              <li>⚡ Faster = bonus points!</li>
            </ul>
            <button className="start-btn" onClick={startGame}>Start Game</button>
          </div>
        </div>
      )}

      {(phase === 'playing') && (
        <>
          <div className="game-hud">
            <div className="hud-item score-hud">
              <span className="material-symbols-outlined">star</span>
              <span>{score}</span>
            </div>
            <div className="hud-item timer-hud">
              <span className="material-symbols-outlined">timer</span>
              <span>{timeElapsed}s</span>
            </div>
            <div className="hud-item moves-hud">
              {items.length} left
            </div>
          </div>

          {feedback && (
            <div className={`sort-feedback ${feedback.type}`}>
              {feedback.text}
            </div>
          )}

          {/* Color tiles */}
          <div className="color-tiles">
            {items.map(item => (
              <div
                key={item.id}
                className={`color-tile ${selectedItem?.id === item.id ? 'selected' : ''}`}
                style={{ backgroundColor: item.color }}
                onClick={() => selectItem(item)}
              />
            ))}
          </div>

          {/* Buckets */}
          <div className="bucket-row">
            {COLOR_GROUPS.map(group => (
              <div
                key={group.name}
                className={`sort-bucket ${selectedItem ? 'droppable' : ''}`}
                onClick={() => dropIntoBucket(group.name)}
              >
                <span className="bucket-emoji">{group.bucket}</span>
                <span className="bucket-name">{group.name}</span>
                <div className="bucket-count">{sorted[group.name].length}</div>
                <div className="bucket-preview">
                  {sorted[group.name].slice(-4).map((item, i) => (
                    <div key={i} className="mini-tile" style={{ backgroundColor: item.color }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {phase === 'finished' && (
        <div className="game-end-screen">
          <div className="end-card">
            <span className="end-emoji">🎨</span>
            <h2>All Sorted!</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="stat-value">{score}</span>
                <span className="stat-label">Points</span>
              </div>
              <div className="final-stat">
                <span className="stat-value">{moves}</span>
                <span className="stat-label">Moves</span>
              </div>
              <div className="final-stat">
                <span className="stat-value">{timeElapsed}s</span>
                <span className="stat-label">Time</span>
              </div>
            </div>
            <p className="score-saved">✅ Score saved to your profile!</p>
            <div className="end-actions">
              <button className="start-btn" onClick={startGame}>Play Again</button>
              <button className="secondary-btn" onClick={() => navigate('/activities')}>Back to Activities</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorSorting;
