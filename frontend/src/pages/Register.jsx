import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'parent' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.status === 'success') {
                toast.success("Account created successfully!");
                navigate('/dashboard');
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error registering:", error);
            toast.error("Could not connect to server");
        }
        setLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-card shadow-soft">
                <div className="register-left">
                    <span className="hand-badge">Join our Community</span>
                    <h1>Create your <span className="italic-accent">NeuroLearn</span> account</h1>
                    <p>Begin a journey tailored specifically to your child's sensory and educational needs.</p>
                    
                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="material-symbols-outlined">verified</span>
                            <span>Secure & Private Data</span>
                        </div>
                        <div className="feature-item">
                            <span className="material-symbols-outlined">analytics</span>
                            <span>Detailed Progress Tracking</span>
                        </div>
                    </div>
                </div>

                <div className="register-right">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                placeholder="Sarah Johnson" 
                                required 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="sarah@example.com" 
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div className="input-group">
                            <label>I am a...</label>
                            <select 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="parent">Parent / Caregiver</option>
                                <option value="educator">Educator</option>
                                <option value="student">Student (Self-Care)</option>
                            </select>
                        </div>

                        <button className="btn-primary w-full" type="submit" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>

                        <p className="login-link">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
        </div>
    );
};

export default Register;
