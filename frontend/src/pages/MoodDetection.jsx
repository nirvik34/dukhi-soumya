import React, { useState, useRef, useCallback } from 'react';
import './MoodDetection.css';

const MOOD_QUOTES = {
  Happy: "You're radiating positivity today! 🌟",
  Sad: "It's okay to feel down. Let's find something uplifting.",
  Angry: "Take a deep breath. Let's channel that energy.",
  Surprised: "Something caught your attention! Stay curious.",
  Neutral: "Calm and collected — a perfect state for learning.",
  Fear: "You're safe here. Let's try something calming.",
  Disgust: "Let's shift focus to something you enjoy.",
};

const MoodDetection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

  // Open the camera
  const openCamera = useCallback(async () => {
    setError(null);
    setCapturedImage(null);
    setResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      streamRef.current = stream;
      setCameraOpen(true);

      // Wait for DOM update, then attach stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please allow camera permissions.");
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }, []);

  // Capture photo from video
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  // Send captured image to backend for analysis
  const analyzeMood = useCallback(async () => {
    if (!capturedImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/mood/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult(data.results);
      } else {
        setError(data.message || "Analysis failed. Please try again.");
      }
    } catch (err) {
      console.error("Error detecting mood:", err);
      setError("Could not connect to the server. Please check if the backend is running.");
    }

    setLoading(false);
  }, [capturedImage, API_BASE]);

  // Retake: reset everything and open camera again
  const retake = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    openCamera();
  }, [openCamera]);

  // Get the quote based on detected emotion
  const getQuote = () => {
    if (!result) return "";
    return MOOD_QUOTES[result.primary_emotion] || "Every feeling is valid. Keep going!";
  };

  // Get sorted confidences (highest first)
  const getSortedConfidences = () => {
    if (!result || !result.confidences) return [];
    return Object.entries(result.confidences).sort((a, b) => b[1] - a[1]);
  };

  return (
    <div className="mood-page-container">
      <header className="mood-header">
        <h1>How are we <span className="italic-accent">feeling</span> today?</h1>
        <p>Use your camera so NeuroLearn can help you understand your emotions and suggest the perfect activity.</p>
      </header>

      <div className="mood-grid">
        {/* Decorative Arrow */}
        <div className="mood-doodle-arrow">
          <svg viewBox="0 0 120 60" fill="none">
            <path d="M5 30C5 30 35 5 60 30C85 55 115 30 115 30" stroke="var(--color-primary)" strokeDasharray="8 8" strokeWidth="3" />
            <path d="M105 20L115 30L105 40" stroke="var(--color-primary)" strokeWidth="3" />
          </svg>
        </div>

        {/* Left: Camera / Capture Card */}
        <div className="mood-card upload-card shadow-soft">
          <div className="upload-dropzone">
            {/* State: No camera, no image */}
            {!cameraOpen && !capturedImage && (
              <>
                <div className="icon-group">
                  <div className="icon-circle primary-circle">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                </div>
                <h3>Detect Your Mood</h3>
                <p>Click below to open your camera and take a selfie</p>
                <button className="btn-primary" onClick={openCamera}>
                  <span className="material-symbols-outlined">videocam</span>
                  Open Camera
                </button>
                <p className="privacy-note">
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.25rem' }}>lock</span>
                  Privacy Protected & Secure
                </p>
              </>
            )}

            {/* State: Camera is live */}
            {cameraOpen && (
              <div className="camera-container">
                <video ref={videoRef} className="camera-feed" autoPlay playsInline muted />
                <div className="camera-controls">
                  <button className="btn-capture" onClick={capturePhoto}>
                    <span className="material-symbols-outlined">photo_camera</span>
                    Capture
                  </button>
                  <button className="btn-cancel" onClick={stopCamera}>
                    <span className="material-symbols-outlined">close</span>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* State: Photo captured, ready to analyze */}
            {capturedImage && !cameraOpen && (
              <div className="captured-container">
                <img src={capturedImage} alt="Captured" className="captured-preview" />
                <div className="camera-controls">
                  <button className="btn-primary" onClick={analyzeMood} disabled={loading}>
                    <span className="material-symbols-outlined">search</span>
                    {loading ? "Analyzing..." : "Detect Mood"}
                  </button>
                  <button className="btn-cancel" onClick={retake} disabled={loading}>
                    <span className="material-symbols-outlined">refresh</span>
                    Retake
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="error-message">
                <span className="material-symbols-outlined">warning</span>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Right: Result Card */}
        <div className="mood-card result-card shadow-soft">
          <div className="result-content">
            <div className="emotion-display">
              {result ? (
                <>
                  <div className="emotion-icon-large">
                    <span className="material-symbols-outlined">{getEmotionIcon(result.primary_emotion)}</span>
                  </div>
                  <h2>{result.primary_emotion}</h2>
                  <p className="mood-quote italic">"{getQuote()}"</p>
                </>
              ) : (
                <>
                  <div className="emotion-icon-large waiting">
                    <span className="material-symbols-outlined">face</span>
                  </div>
                  <h2>Waiting...</h2>
                  <p className="mood-quote italic">"Take a photo to detect your mood"</p>
                </>
              )}
            </div>

            <div className="confidence-bars">
              {result ? (
                getSortedConfidences().map(([emotion, value]) => (
                  <div className="bar-group" key={emotion}>
                    <div className="bar-labels">
                      <span className="emotion-name">{emotion}</span>
                      <span className="confidence-value">{value}%</span>
                    </div>
                    <div className="bar-wrapper">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${value}%`,
                          opacity: value < 5 ? 0.25 : value < 20 ? 0.5 : 1,
                          backgroundColor: emotion === result.primary_emotion ? 'var(--color-primary)' : 'var(--color-secondary)',
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="waiting-bars">
                  {['Happy', 'Sad', 'Neutral', 'Angry', 'Surprised'].map(e => (
                    <div className="bar-group" key={e}>
                      <div className="bar-labels">
                        <span className="emotion-name">{e}</span>
                        <span className="confidence-value">—</span>
                      </div>
                      <div className="bar-wrapper">
                        <div className="bar-fill bar-placeholder" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {result && (
              <div className="mood-insights">
                <h4>
                  <span className="material-symbols-outlined">lightbulb</span>
                  Mood Insights
                </h4>
                <p>{getInsight(result.primary_emotion)}</p>
              </div>
            )}
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

// Helper: get Material Symbol icon for each emotion
function getEmotionIcon(emotion) {
  const icons = {
    Happy: 'sentiment_very_satisfied',
    Sad: 'sentiment_dissatisfied',
    Angry: 'mood_bad',
    Surprised: 'sentiment_excited',
    Neutral: 'sentiment_neutral',
    Fear: 'sentiment_worried',
    Disgust: 'sick',
  };
  return icons[emotion] || 'face';
}

// Helper: get insight text for each emotion
function getInsight(emotion) {
  const insights = {
    Happy: "Your facial markers suggest high engagement and positive valence. This is a perfect time for creative tasks or social learning.",
    Sad: "Your expression shows lower energy. Calming sensory activities or gentle creative tasks might help lift your mood.",
    Angry: "High arousal detected. Physical activities or rhythm-based games can help channel this energy positively.",
    Surprised: "Your expression shows heightened attention. This is a great time for exploration and discovery-based learning.",
    Neutral: "A balanced emotional state — ideal for focused cognitive tasks, reading, or structured learning activities.",
    Fear: "Signs of anxiety detected. Try deep breathing exercises or calming sensory activities to feel more grounded.",
    Disgust: "Your expression suggests discomfort. Let's switch to something enjoyable — music or creative play might help.",
  };
  return insights[emotion] || "Every feeling is valid. Let's find the right activity for you.";
}

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
