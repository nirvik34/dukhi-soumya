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
      </Routes>
    </div>
  );
}

export default App;
