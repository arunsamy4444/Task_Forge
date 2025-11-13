import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api"; // use your api.js helper
import "../styles/Login.css";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await login(form.email, form.password); // use api.js

      // Decode role from token
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      if (payload.role !== "admin") {
        throw new Error("Not authorized as admin");
      }

      localStorage.setItem("token", data.token);
      navigate("/admin-dashboard");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

export default AdminLogin;