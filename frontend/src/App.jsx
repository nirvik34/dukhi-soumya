import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MoodDetection from './pages/MoodDetection';
import Communication from './pages/Communication';
import ParentDashboard from './pages/ParentDashboard';
import Activities from './pages/Activities';
import Register from './pages/Register';
import Login from './pages/Login';
import BubblePop from './pages/games/BubblePop';
import SoundMatch from './pages/games/SoundMatch';
import ColorSorting from './pages/games/ColorSorting';
import FeelingJournal from './pages/games/FeelingJournal';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood" element={<MoodDetection />} />
        <Route path="/communicate" element={<Communication />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/games/bubble-pop" element={<BubblePop />} />
        <Route path="/games/sound-match" element={<SoundMatch />} />
        <Route path="/games/color-sorting" element={<ColorSorting />} />
        <Route path="/games/feeling-journal" element={<FeelingJournal />} />
      </Routes>
    </div>
  );
}

export default App;
