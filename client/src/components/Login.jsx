import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await login(form.email, form.password);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        {message && <p className="message error-message">{message}</p>}
        <p className="signup-prompt">
          Don't have an account? <Link to="/signup" className="signup-link">Signup here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
