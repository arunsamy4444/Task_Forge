import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/api";
import "../styles/Signup.css";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Show toast notification on component mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 2000);

    // Auto-hide toast after 8 seconds
    const hideTimer = setTimeout(() => {
      setShowToast(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    
    try {
      const data = await signup(form.username, form.email, form.password);
      setMessage(data.message || "Signup successful!");
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div className="signup-container">
      {/* Performance Toast Notification */}
      {showToast && (
        <div className="performance-toast">
          <div className="toast-content">
            <div className="toast-icon">⚡</div>
            <div className="toast-text">
              <strong>Performance Notice</strong>
              <p>This app is hosted on free tier. For better performance, run locally. Code available on GitHub!</p>
              <a 
                href="https://github.com/arunsamy4444/Task_Forge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-link"
              >
                View on GitHub
              </a>
            </div>
            <button className="toast-close" onClick={closeToast}>×</button>
          </div>
        </div>
      )}

      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input 
              type="text" 
              name="username" 
              className="form-input"
              placeholder="Username" 
              value={form.username} 
              onChange={handleChange} 
              required 
            />
            <label className="input-label">Username</label>
          </div>
          
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              className="form-input"
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
            <label className="input-label">Email</label>
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              name="password" 
              className="form-input"
              placeholder="Password" 
              value={form.password} 
              onChange={handleChange} 
              required 
            />
            <label className="input-label">Password</label>
          </div>
          
          <button 
            type="submit" 
            className={`signup-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Create Account'}
          </button>
        </form>
        
        {message && (
          <p className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
            {message}
          </p>
        )}
        
        <p className="login-prompt">
          Already have an account? <Link to="/login" className="login-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;