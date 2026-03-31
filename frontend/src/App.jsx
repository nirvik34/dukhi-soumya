import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MoodDetection from './pages/MoodDetection';
import Communication from './pages/Communication';
import ParentDashboard from './pages/ParentDashboard';
import Activities from './pages/Activities';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood" element={<MoodDetection />} />
        <Route path="/communicate" element={<Communication />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/activities" element={<Activities />} />
      </Routes>
    </div>
  );
}

export default App;
