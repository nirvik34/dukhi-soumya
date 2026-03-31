import React, { useState } from 'react';
import './Communication.css';

const Communication = () => {
  const [text, setText] = useState("");

  const speak = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // Friendly tone
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech!");
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      speak(text);
      setText("");
    }
  };

  const cards = [
    { id: 1, title: "I'm Happy", icon: "sunny", category: "primary", message: "I am feeling happy today!" },
    { id: 2, title: "I'm Hungry", icon: "restaurant", category: "secondary", message: "I am hungry, can I have something to eat?" },
    { id: 3, title: "I'm Thirsty", icon: "local_drink", category: "tertiary", message: "I am thirsty, can I have some water?" },
    { id: 4, title: "I'm Sad", icon: "rainy", category: "error", message: "I am feeling a little bit sad." },
    { id: 5, title: "Let's Play", icon: "sports_soccer", category: "secondary", message: "I want to play a game!" },
    { id: 6, title: "Need Help", icon: "contact_support", category: "urgent", message: "I need help with something, please." },
  ];

  return (
    <div className="comm-page-container">
      <header className="comm-header">
        <div className="header-decoration">
          <span className="material-symbols-outlined text-8xl opacity-20">auto_awesome</span>
        </div>
        <h1>What's on your <span className="italic-accent">mind?</span></h1>
        <div className="header-tip">
          <p className="handwritten">Tap a card to speak!</p>
          <span className="material-symbols-outlined bounce">arrow_downward</span>
        </div>
      </header>

      <div className="comm-grid">
        {cards.map(card => (
          <button 
            key={card.id} 
            className={`comm-card ${card.category}`}
            onClick={() => speak(card.message)}
          >
            <div className="card-bg-circle"></div>
            <span className="material-symbols-outlined card-icon">
              {card.icon}
            </span>
            <h3>{card.title}</h3>
            <div className="tap-to-speak">
              <span className="material-symbols-outlined">volume_up</span>
              TAP TO SAY
            </div>
          </button>
        ))}
      </div>

      <div className="type-suggestion">
        <p className="handwritten">You can also type exactly what you want to say in the bar below!</p>
        <div className="doodle-arrow">
           <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M10 10C15 25 35 30 50 50M50 50L40 45M50 50L45 35" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
           </svg>
        </div>
      </div>

      <footer className="comm-footer">
        <div className="footer-input-wrapper">
          <div className="input-container">
            <input 
              type="text" 
              placeholder="Type a message to speak..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <span className="material-symbols-outlined input-icon">keyboard</span>
          </div>
          <button className="btn-send" onClick={handleSend}>
            <span>Send</span>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </footer>

      {/* Decorative scatter elements */}
      <div className="scatter-element top-left">
        <span className="material-symbols-outlined">spa</span>
      </div>
      <div className="scatter-element bottom-right">
        <span className="material-symbols-outlined">extension</span>
      </div>
    </div>
  );
};

export default Communication;
