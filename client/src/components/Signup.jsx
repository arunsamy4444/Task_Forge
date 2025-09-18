import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/api";
import "../styles/Signup.css";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

  return (
    <div className="signup-container">
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