import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        NeuroLearn
      </div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Dashboard</NavLink>
        <NavLink to="/mood" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Mood</NavLink>
        <NavLink to="/activities" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Activities</NavLink>
        <NavLink to="/communicate" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Communicate</NavLink>
        <NavLink to="/parent" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Parent</NavLink>
      </div>
      <div className="navbar-profile">
        <span className="material-symbols-outlined">account_circle</span>
      </div>
    </nav>
  );
};

export default Navbar;
