import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GamePage.css';
import './FeelingJournal.css';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#FFD93D' },
  { emoji: '😌', label: 'Calm', color: '#96CEB4' },
  { emoji: '😢', label: 'Sad', color: '#74B9FF' },
  { emoji: '😠', label: 'Angry', color: '#FF6B6B' },
  { emoji: '😰', label: 'Anxious', color: '#DDA0DD' },
  { emoji: '🤔', label: 'Confused', color: '#FFEAA7' },
  { emoji: '😴', label: 'Tired', color: '#BDC3C7' },
  { emoji: '🤩', label: 'Excited', color: '#FF8E53' },
];

const PROMPTS = [
  "What made you feel this way?",
  "What's one thing that went well today?",
  "Who made you smile today?",
  "What sound do you hear right now?",
  "What are you looking forward to?",
  "Describe your favorite place in 3 words.",
  "What color matches your mood today?",
  "Name one thing you're grateful for.",
];

function FeelingJournal() {
  const [step, setStep] = useState(1); // 1: mood, 2: intensity, 3: prompt, 4: done
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState([]);
  const [currentPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const selectMood = (mood) => {
    setSelectedMood(mood);
    setStep(2);
  };

  const submitEntry = () => {
    const entry = {
      mood: selectedMood,
      intensity,
      text: journalText,
      prompt: currentPrompt,
      timestamp: new Date().toISOString(),
    };

    setEntries(prev => [entry, ...prev]);

    // Save to backend
    fetch(`${API_BASE}/game/save-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game: 'feeling_journal',
        score: intensity * 10, // Use intensity as a "score" for tracking
        username: localStorage.getItem('username') || 'anonymous',
        details: {
          mood: selectedMood.label,
          moodEmoji: selectedMood.emoji,
          intensity,
          text: journalText,
          prompt: currentPrompt,
        }
      })
    }).catch(console.error);

    setStep(4);
  };

  const reset = () => {
    setSelectedMood(null);
    setIntensity(3);
    setJournalText('');
    setStep(1);
  };

  return (
    <div className="game-page journal-page">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/activities')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1>📓 Feeling Journal</h1>
        <p>Check in with your emotions. It's ok to feel anything!</p>
      </div>

      {/* Step indicator */}
      <div className="step-indicators">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`}>
            {step > s ? '✓' : s}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Mood */}
      {step === 1 && (
        <div className="journal-step">
          <h2>How are you feeling right now?</h2>
          <div className="mood-grid">
            {MOODS.map(mood => (
              <button
                key={mood.label}
                className="mood-btn"
                style={{ '--mood-color': mood.color }}
                onClick={() => selectMood(mood)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Intensity */}
      {step === 2 && selectedMood && (
        <div className="journal-step">
          <div className="selected-mood-display" style={{ backgroundColor: selectedMood.color + '33' }}>
            <span className="big-emoji">{selectedMood.emoji}</span>
            <h3>Feeling {selectedMood.label}</h3>
          </div>
          <h2>How much?</h2>
          <div className="intensity-slider">
            <span className="intensity-label-sm">A little</span>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
              className="slider"
            />
            <span className="intensity-label-sm">A lot!</span>
          </div>
          <div className="intensity-visual">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`intensity-dot ${i <= intensity ? 'filled' : ''}`}
                    style={{ backgroundColor: i <= intensity ? selectedMood.color : 'transparent' }}>
                {selectedMood.emoji}
              </span>
            ))}
          </div>
          <button className="start-btn" onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {/* Step 3: Writing Prompt */}
      {step === 3 && (
        <div className="journal-step">
          <div className="prompt-card">
            <span className="material-symbols-outlined prompt-icon">edit_note</span>
            <h2>{currentPrompt}</h2>
          </div>
          <textarea
            className="journal-textarea"
            placeholder="Write your thoughts here... (optional)"
            value={journalText}
            onChange={e => setJournalText(e.target.value)}
            rows={5}
          />
          <div className="char-count">{journalText.length} characters</div>
          <button className="start-btn" onClick={submitEntry}>
            Save Entry ✨
          </button>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div className="game-end-screen">
          <div className="end-card journal-done-card">
            <span className="end-emoji">🌟</span>
            <h2>Great job checking in!</h2>
            <p className="affirmation">
              It's wonderful that you took a moment to notice how you feel. 
              Your emotions are valid and important.
            </p>
            <div className="entry-summary" style={{ backgroundColor: selectedMood?.color + '22' }}>
              <span className="summary-emoji">{selectedMood?.emoji}</span>
              <div>
                <strong>{selectedMood?.label}</strong> — Intensity {intensity}/5
                {journalText && <p className="summary-text">"{journalText}"</p>}
              </div>
            </div>
            <p className="score-saved">✅ Entry saved to your journal!</p>
            <div className="end-actions">
              <button className="start-btn" onClick={reset}>New Entry</button>
              <button className="secondary-btn" onClick={() => navigate('/activities')}>Back to Activities</button>
            </div>
          </div>
        </div>
      )}

      {/* Past entries */}
      {entries.length > 0 && step !== 4 && (
        <div className="past-entries">
          <h3>Today's Entries</h3>
          <div className="entries-list">
            {entries.map((entry, idx) => (
              <div key={idx} className="entry-chip" style={{ backgroundColor: entry.mood.color + '33' }}>
                <span>{entry.mood.emoji}</span>
                <span>{entry.mood.label}</span>
                <span className="entry-time">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeelingJournal;
