import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const data = await login(form.email, form.password);
      localStorage.setItem("token", data.token);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="bg-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${i * 0.5}s`,
            '--duration': `${15 + i * 2}s`,
            '--size': `${2 + Math.random() * 3}px`
          }}></div>
        ))}
      </div>

      <div className="login-card">
        {/* Header with animated logo */}
        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-orb"></div>
            <div className="logo-pulse"></div>
          </div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              className={`form-input ${focusedField === "email" ? "focused" : ""} ${form.email ? "has-value" : ""}`}
              required
            />
            <label className={`input-label ${focusedField === "email" || form.email ? "active" : ""}`}>
              Email Address
            </label>
            <div className="input-underline"></div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => handleFocus("password")}
              onBlur={handleBlur}
              className={`form-input ${focusedField === "password" ? "focused" : ""} ${form.password ? "has-value" : ""}`}
              required
            />
            <label className={`input-label ${focusedField === "password" || form.password ? "active" : ""}`}>
              Password
            </label>
            <div className="input-underline"></div>
          </div>

          {/* Submit Button with Loading State */}
          <button 
            type="submit" 
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-loader"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span className="button-icon">→</span>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div className="message-container">
            <div className="message error-message">
              <div className="message-icon">⚠️</div>
              <div className="message-content">
                <strong>Authentication Failed</strong>
                <p>{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Signup Prompt */}
        <div className="signup-section">
          <div className="divider">
            <span>New to TaskForge?</span>
          </div>
          <p className="signup-prompt">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Create account
            </Link>
          </p>
        </div>

        {/* Performance Hint */}
        <div className="performance-hint">
          <small>💡 Using free tier - may experience slower response times</small>
        </div>
      </div>
    </div>
  );
}

export default Login;










// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../services/api";
// import "../styles/Login.css";

// function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       const data = await login(form.email, form.password);
//       localStorage.setItem("token", data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setMessage(err.response?.data?.message || err.message || "Invalid credentials");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <h2>Login</h2>
//         </div>
//         <form onSubmit={handleSubmit} className="login-form">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="form-input"
//             required
//           />
//           <button type="submit" className="login-button">Login</button>
//         </form>
//         {message && <p className="message error-message">{message}</p>}
//         <p className="signup-prompt">
//           Don't have an account? <Link to="/signup" className="signup-link">Signup here</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
