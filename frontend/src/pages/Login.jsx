import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                toast.success(`Welcome back, ${data.user?.name || 'Explorer'}!`);
                navigate('/dashboard');
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            toast.error("Could not connect to server");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card shadow-soft">
                <div className="login-left">
                    <span className="hand-badge">Welcome Back</span>
                    <h1>Continue your <span className="italic-accent">Journey</span></h1>
                    <p>Log in to access your personalized educational path and track progress.</p>
                </div>

                <div className="login-right">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
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

                        <button className="btn-primary w-full" type="submit" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                            <span className="material-symbols-outlined">login</span>
                        </button>

                        <p className="register-link">
                            New to NeuroLearn? <Link to="/register">Create an Account</Link>
                        </p>
                    </form>
                </div>
            </div>
            
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
        </div>
    );
};

export default Login;
