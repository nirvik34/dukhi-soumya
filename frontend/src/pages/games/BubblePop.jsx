import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GamePage.css';
import './BubblePop.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
const GAME_DURATION = 30;

function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState('idle'); // idle | playing | finished
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [poppedEffects, setPoppedEffects] = useState([]);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const spawnBubble = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const size = 40 + Math.random() * 50;
    const bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (rect.width - size),
      y: rect.height,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 1 + Math.random() * 2,
      wobble: Math.random() * 3,
    };
    setBubbles(prev => [...prev, bubble]);
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Spawn bubbles
  useEffect(() => {
    if (gameState !== 'playing') return;
    spawnRef.current = setInterval(spawnBubble, 600);
    return () => clearInterval(spawnRef.current);
  }, [gameState, spawnBubble]);

  // Animate bubbles floating up
  useEffect(() => {
    if (gameState !== 'playing') return;
    const animFrame = setInterval(() => {
      setBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y - b.speed, x: b.x + Math.sin(b.y / 30) * b.wobble }))
          .filter(b => b.y + b.size > 0)
      );
    }, 30);
    return () => clearInterval(animFrame);
  }, [gameState]);

  // Save score to MongoDB when game finishes
  useEffect(() => {
    if (gameState !== 'finished') return;
    fetch(`${API_BASE}/game/save-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game: 'bubble_pop',
        score,
        username: localStorage.getItem('username') || 'anonymous',
        duration: GAME_DURATION,
        details: { bestCombo }
      })
    }).catch(err => console.error('Failed to save score:', err));
  }, [gameState]);

  const popBubble = (e, bubble) => {
    e.stopPropagation();
    const points = Math.round(10 + (1 / bubble.size) * 500);
    const comboMultiplier = 1 + combo * 0.1;
    const totalPoints = Math.round(points * comboMultiplier);
    
    setScore(prev => prev + totalPoints);
    setCombo(prev => {
      const newCombo = prev + 1;
      if (newCombo > bestCombo) setBestCombo(newCombo);
      return newCombo;
    });
    
    setPoppedEffects(prev => [...prev, {
      id: bubble.id,
      x: bubble.x + bubble.size / 2,
      y: bubble.y + bubble.size / 2,
      points: totalPoints,
      color: bubble.color
    }]);
    
    setTimeout(() => {
      setPoppedEffects(prev => prev.filter(p => p.id !== bubble.id));
    }, 600);
    
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
  };

  // Reset combo on miss
  const handleMiss = () => {
    if (gameState === 'playing') setCombo(0);
  };

  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setBestCombo(0);
    setGameState('playing');
  };

  return (
    <div className="game-page bubble-pop-page">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/activities')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>🫧 Bubble Pop</h1>
        <p>Pop the bubbles to earn points! Smaller bubbles = more points. Build combos!</p>
      </div>

      {gameState === 'idle' && (
        <div className="game-start-screen">
          <div className="start-card">
            <span className="start-emoji">🫧</span>
            <h2>Ready to Pop?</h2>
            <p>Pop as many bubbles as you can in {GAME_DURATION} seconds!</p>
            <ul className="rules-list">
              <li>🎯 Smaller bubbles = more points</li>
              <li>🔥 Chain pops for combo multipliers</li>
              <li>❌ Missing resets your combo</li>
            </ul>
            <button className="start-btn" onClick={startGame}>Start Game</button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="game-hud">
            <div className="hud-item score-hud">
              <span className="material-symbols-outlined">star</span>
              <span>{score}</span>
            </div>
            <div className="hud-item timer-hud" data-low={timeLeft <= 5}>
              <span className="material-symbols-outlined">timer</span>
              <span>{timeLeft}s</span>
            </div>
            {combo > 1 && (
              <div className="hud-item combo-hud">
                <span>🔥 x{combo}</span>
              </div>
            )}
          </div>
          <div className="bubble-arena" ref={containerRef} onClick={handleMiss}>
            {bubbles.map(bubble => (
              <div
                key={bubble.id}
                className="bubble"
                style={{
                  left: bubble.x,
                  bottom: containerRef.current ? containerRef.current.getBoundingClientRect().height - bubble.y - bubble.size : 0,
                  width: bubble.size,
                  height: bubble.size,
                  backgroundColor: bubble.color,
                }}
                onClick={(e) => popBubble(e, bubble)}
              >
                <div className="bubble-shine" />
              </div>
            ))}
            {poppedEffects.map(effect => (
              <div
                key={effect.id}
                className="pop-effect"
                style={{ left: effect.x, bottom: containerRef.current ? containerRef.current.getBoundingClientRect().height - effect.y : 0, color: effect.color }}
              >
                +{effect.points}
              </div>
            ))}
          </div>
        </>
      )}

      {gameState === 'finished' && (
        <div className="game-end-screen">
          <div className="end-card">
            <span className="end-emoji">🎉</span>
            <h2>Time's Up!</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="stat-value">{score}</span>
                <span className="stat-label">Points</span>
              </div>
              <div className="final-stat">
                <span className="stat-value">{bestCombo}x</span>
                <span className="stat-label">Best Combo</span>
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

export default BubblePop;
