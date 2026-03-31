import React, { useState } from 'react';
import './MoodDetection.css';

const MoodDetection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectMood = async () => {
    setLoading(true);
    // Mocking the detection process
    try {
      const response = await fetch('http://localhost:5000/api/mood/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: "mock-base64-data" })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setResult(data.results);
      }
    } catch (error) {
      console.error("Error detecting mood:", error);
      // Fallback fallback
      setResult({
        primary_emotion: "Happy",
        confidences: { "Happy": 92, "Neutral": 7, "Sad": 1 }
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
            <button className="btn-primary" onClick={detectMood} disabled={loading}>
              <span className="material-symbols-outlined">search</span>
              {loading ? "Detecting..." : "Detect Mood"}
            </button>
            <p className="privacy-note">Privacy Protected & Secure</p>
          </div>
        </div>

        {/* Right: Result Card */}
        <div className="mood-card result-card shadow-soft">
          <div className="result-content">
            <div className="emotion-display">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm8ZnjTse9HI_UfibDnWRPO3lwdMg96UDPLAahqGPPLRxa6_pUGUkqC6OMRABKmk_pr8I28UAjpbaUUi-XPBgyhvhNzMWnoMlZljwqUItJW2fhZd5K-H7av9pTleKVNgbMkvOZDdhkS7D1bqDqVOsm4cK9EvtxcJ_RvwoXXOJSYYxlzrxCm8_8X-ZozMEegBt0g8R99o9qHomxvG5AUsC9owk2lYruFYyazSMmehYicbIGiA-fybI-ADtsy_fL0Clrl1XJZQdbD80" alt="Feeling" className="emotion-illustration" />
              <h2>{result ? result.primary_emotion : "Detecting..."}</h2>
              <p className="mood-quote italic">"You're feeling great today!"</p>
            </div>

            <div className="confidence-bars">
              {result && Object.entries(result.confidences).map(([emotion, value]) => (
                <div className="bar-group" key={emotion}>
                  <div className="bar-labels">
                    <span className="emotion-name">{emotion}</span>
                    <span className="confidence-value">{value}%</span>
                  </div>
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ width: `${value}%`, opacity: value < 20 ? 0.3 : 1 }}></div>
                  </div>
                </div>
              ))}
              {!result && <p>Waiting for analysis...</p>}
            </div>

            <div className="mood-insights">
              <h4>
                <span className="material-symbols-outlined">lightbulb</span>
                Mood Insights
              </h4>
              <p>Your facial markers suggest high engagement and positive valence. This is a perfect time for creative tasks or social learning.</p>
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
          <button className="view-all-btn">
            View All Activities <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="activities-grid">
           <ActivityCard title="Color Matching" category="Cognitive" img="https://lh3.googleusercontent.com/aida-public/AB6AXuBe15522zdTh70SGebfxuh6DtXJ0UzftHzbXwnBhpYCp8A1HnJWJ8rbK7aUuCShUTVs1Ks8rHjepA3goqYUrGTEOsGfIk9zgID1akWzmxphMSABPIDvlYm7S3zEiuQNx8kYvufBEMe6RCPqfiVlKFhm0D0zqnIjdhM5Bkg3KWBK3skSMrVTWm2OaS21AbDhnCzGpuFuivcK1IbMTkDsLFFC6lo_Lwx22TfXEbiieDHWuAuxEvZLlwXgsU-xxOUNaY_5Lb0RwqvSamg" />
           <ActivityCard title="Music & Rhythm" category="Sensory" img="https://lh3.googleusercontent.com/aida-public/AB6AXuBuz8XeDGvHY84wEGttGPzWmB3WZNOc3HSAzKXDawNNzLJ7AfRj9igKU6k3W4SA5fG0TZM_wOsCRNW9oX1SiCJJUw5HmpzdunwuSEeovQNIpErM3jVf_oMKHFiCKIpQt-w0gZ-TpEBzupHCUVrM5CTVvkjVVvpqxgY4nPfTXgLPwl-g5ny2NQ0N3W3vCPllNS0OYO_ffXo-usFUZdLod9_7aooABRM0RqCjm0KOmM2UxdZsxmgF_v1MHxZgZ1eJNkJbyj71n4Z4zFw" />
           <ActivityCard title="Story Time" category="Language" img="https://lh3.googleusercontent.com/aida-public/AB6AXuAnUp6HkGpOBkqgmoUaFHZowmMQsmY5ejz3pMdRwnjoeFOAd8Twp-ysS1oeAcWbzMFhhi4BZwljNNKRkfT2KzfSVE4Nz8oBwgnjWffrsQb6YFcdU8ENhrxBOD_EvdqYxs1BGzfrvqzJjmAkmz-CJty9oxG6Z_LFweaWHTC3EZEaPStNzjKeoUFsiAyQvhbCMdFMRszL1LFsHpXksHGGjZpf6IJpuJrO1ofzr4TfBE0QaeAYOmaC8mmiHHjTRDoJV-ZdVKuFuTOFpFg" />
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
