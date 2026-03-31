# NeuroLearn - Educational Platform for Neurodiverse Learning

NeuroLearn is a sensory-friendly, "Soft Maximalist" educational platform designed to empower neurodiverse learners through interactive activities, emotional recognition, and advanced communication tools.

## 🌟 Key Features

- **Emotional Recognition:** Uses computer vision to help students identify and track their moods, suggesting activities that match their current emotional state.
- **Communication Board (AAC):** A digital "Speak" board with high-contrast, friendly cards and text-to-speech capabilities for non-verbal learners.
- **Personalized Activities:** A library of sensory, cognitive, and language-based learning modules.
- **Parent/Caregiver Panel:** Detailed analytics, mood trends, and AI-driven recommendations for caregivers to track and support progress.
- **Premium Design:** Pure Vanilla CSS "Soft Maximalism" aesthetic with organic shapes, harmonious palettes, and a "No-Line" rule for reduced sensory overload.

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework:** React 18
- **Styling:** Custom CSS Variables & Modular CSS (Vanilla)
- **Routing:** React Router v6
- **Animations:** CSS Transitions & Keyframes (Soft Depth)

### Backend (Flask)
- **Language:** Python 3.12
- **Database:** Hybrid Handler (MongoDB with local `data.json` fallback)
- **Modular Structure:** Flask Blueprints for Auth, Mood, and Activity management.
- **ML Integration:** Mock Mood Analysis model ready for future deep learning integration.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.12+)
- MongoDB (Optional, local fallback enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rakshi2609/dukhi-soumya.git
   cd dukhi-soumya
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python3 app.py
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🐳 Hosting with Docker

NeuroLearn is fully containerized for easy deployment.

1. **Build and Start:**
   ```bash
   docker-compose up --build
   ```
   The frontend will be available at `http://localhost:80` and the backend at `http://localhost:5000`.

2. **Environment Configuration:**
   Modify the `.env` files in the `frontend/` and `backend/` directories to match your production environment before building.

## 🎨 Design Philosophy
NeuroLearn follows the **Soft Maximalism** (Guided Journal) philosophy:
- **No-Line Rule:** No rigid borders or lines; structure is defined by tonal layering and spacing.
- **Depth & Texture:** Soft shadows and blurred glassmorphism (`backdrop-filter`) for a premium feel.
- **Typography:** Noto Serif (Headlines), Plus Jakarta Sans (Body), and Caveat (Handwritten accents).

## 📄 License
MIT License
