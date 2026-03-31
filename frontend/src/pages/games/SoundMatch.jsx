import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GamePage.css';
import './SoundMatch.css';

const SOUNDS = [
  { id: 'clap', emoji: '👏', freq: 300, label: 'Clap' },
  { id: 'drum', emoji: '🥁', freq: 150, label: 'Drum' },
  { id: 'bell', emoji: '🔔', freq: 600, label: 'Bell' },
  { id: 'snap', emoji: '🫰', freq: 450, label: 'Snap' },
];

function playTone(freq, duration = 200) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch(e) { /* Audio not supported */ }
}

function SoundMatch() {
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | showing | input | correct | wrong | finished
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [activeSound, setActiveSound] = useState(null);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const generatePattern = useCallback((lvl) => {
    const length = 2 + lvl;
    const newPattern = [];
    for (let i = 0; i < length; i++) {
      newPattern.push(SOUNDS[Math.floor(Math.random() * SOUNDS.length)].id);
    }
    return newPattern;
  }, []);

  const showPattern = useCallback(async (pat) => {
    setPhase('showing');
    for (let i = 0; i < pat.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      const sound = SOUNDS.find(s => s.id === pat[i]);
      setActiveSound(pat[i]);
      playTone(sound.freq, 300);
      await new Promise(r => setTimeout(r, 400));
      setActiveSound(null);
    }
    await new Promise(r => setTimeout(r, 300));
    setPhase('input');
  }, []);

  const startRound = useCallback(() => {
    const pat = generatePattern(level);
    setPattern(pat);
    setUserPattern([]);
    setHighlightIdx(-1);
    showPattern(pat);
  }, [level, generatePattern, showPattern]);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setPhase('idle');
    setTimeout(() => {
      const pat = generatePattern(1);
      setPattern(pat);
      setUserPattern([]);
      showPattern(pat);
    }, 500);
  };

  const handleSoundClick = (soundId) => {
    if (phase !== 'input') return;

    const sound = SOUNDS.find(s => s.id === soundId);
    playTone(sound.freq, 200);
    setActiveSound(soundId);
    setTimeout(() => setActiveSound(null), 200);

    const newUserPattern = [...userPattern, soundId];
    setUserPattern(newUserPattern);
    setHighlightIdx(newUserPattern.length - 1);

    // Check if wrong
    if (soundId !== pattern[newUserPattern.length - 1]) {
      setPhase('wrong');
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setPhase('finished');
        // Save score
        fetch(`${API_BASE}/game/save-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game: 'sound_match',
            score,
            username: localStorage.getItem('username') || 'anonymous',
            details: { levelsCompleted: level - 1 }
          })
        }).catch(console.error);
      } else {
        setTimeout(() => startRound(), 1500);
      }
      return;
    }

    // Check if pattern complete
    if (newUserPattern.length === pattern.length) {
      const points = level * 25;
      setScore(prev => prev + points);
      setPhase('correct');
      setTimeout(() => {
        setLevel(prev => prev + 1);
        const nextPat = generatePattern(level + 1);
        setPattern(nextPat);
        setUserPattern([]);
        setHighlightIdx(-1);
        showPattern(nextPat);
      }, 1200);
    }
  };

  return (
    <div className="game-page sound-match-page">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/activities')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>🎵 Sound Match</h1>
        <p>Listen to the pattern, then repeat it! Patterns get longer each level.</p>
      </div>

      {phase === 'idle' && (
        <div className="game-start-screen">
          <div className="start-card">
            <span className="start-emoji">🎵</span>
            <h2>Sound Match</h2>
            <p>Listen carefully and repeat the rhythm pattern.</p>
            <ul className="rules-list">
              <li>🔊 Watch & listen to the pattern</li>
              <li>🎯 Tap sounds in the same order</li>
              <li>❤️ You have 3 lives</li>
              <li>📈 Patterns grow each level</li>
            </ul>
            <button className="start-btn" onClick={startGame}>Start Game</button>
          </div>
        </div>
      )}

      {(phase !== 'idle' && phase !== 'finished') && (
        <>
          <div className="game-hud">
            <div className="hud-item score-hud">
              <span className="material-symbols-outlined">star</span>
              <span>{score}</span>
            </div>
            <div className="hud-item level-hud">
              Level {level}
            </div>
            <div className="hud-item lives-hud">
              {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
            </div>
          </div>

          <div className="sound-status">
            {phase === 'showing' && <p className="status-text listening">🔊 Listen carefully...</p>}
            {phase === 'input' && <p className="status-text your-turn">🎯 Your turn! ({userPattern.length}/{pattern.length})</p>}
            {phase === 'correct' && <p className="status-text correct">✅ Perfect! +{level * 25} pts</p>}
            {phase === 'wrong' && <p className="status-text wrong">❌ Wrong! {lives > 0 ? 'Try again...' : ''}</p>}
          </div>

          <div className="sound-grid">
            {SOUNDS.map(sound => (
              <button
                key={sound.id}
                className={`sound-btn ${activeSound === sound.id ? 'active' : ''}`}
                onClick={() => handleSoundClick(sound.id)}
                disabled={phase !== 'input'}
              >
                <span className="sound-emoji">{sound.emoji}</span>
                <span className="sound-label">{sound.label}</span>
              </button>
            ))}
          </div>

          {/* Pattern dots */}
          <div className="pattern-dots">
            {pattern.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx < userPattern.length ? (userPattern[idx] === pattern[idx] ? 'correct' : 'wrong') : ''} ${idx === highlightIdx ? 'current' : ''}`}
              />
            ))}
          </div>
        </>
      )}

      {phase === 'finished' && (
        <div className="game-end-screen">
          <div className="end-card">
            <span className="end-emoji">🎶</span>
            <h2>Game Over!</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="stat-value">{score}</span>
                <span className="stat-label">Points</span>
              </div>
              <div className="final-stat">
                <span className="stat-value">Lvl {level - 1}</span>
                <span className="stat-label">Reached</span>
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

export default SoundMatch;
