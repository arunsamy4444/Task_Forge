import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

    // Use environment variable or fallback to localhost
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Check role from token
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      if (payload.role !== "admin") throw new Error("Not authorized as admin");

      localStorage.setItem("token", data.token);
      navigate("/admin-dashboard");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminLogin;
