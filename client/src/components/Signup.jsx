import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import "../styles/Signup.css";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [showToast, setShowToast] = useState(false);
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

  // Show toast notification on component mount
  useEffect(() => {
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
      
      // Redirect to login after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
          <div className="toast-progress"></div>
        </div>
      )}

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

      <div className="signup-card">
        {/* Header with animated logo */}
        <div className="signup-header">
          <div className="logo-wrapper">
            <div className="logo-orb"></div>
            <div className="logo-pulse"></div>
          </div>
          <h2>Create Account</h2>
          <p className="signup-subtitle">Join TaskForge today</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Username Field */}
          <div className="form-group">
            <input 
              type="text" 
              name="username" 
              value={form.username}
              onChange={handleChange}
              onFocus={() => handleFocus("username")}
              onBlur={handleBlur}
              className={`form-input ${focusedField === "username" ? "focused" : ""} ${form.username ? "has-value" : ""}`}
              required 
            />
            <label className={`input-label ${focusedField === "username" || form.username ? "active" : ""}`}>
              Username
            </label>
            <div className="input-underline"></div>
          </div>
          
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
            className={`signup-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-loader"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div className="message-container">
            <div className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
              <div className="message-icon">
                {message.includes('successful') ? '✅' : '⚠️'}
              </div>
              <div className="message-content">
                <strong>{message.includes('successful') ? 'Success!' : 'Registration Failed'}</strong>
                <p>{message}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Login Prompt */}
        <div className="login-section">
          <div className="divider">
            <span>Already have an account?</span>
          </div>
          <p className="login-prompt">
            <Link to="/login" className="login-link">Sign in to your account</Link>
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

export default Signup;



// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { signup } from "../services/api";
// import "../styles/Signup.css";

// function Signup() {
//   const [form, setForm] = useState({ username: "", email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showToast, setShowToast] = useState(false);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   // Show toast notification on component mount
//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowToast(true);
//     }, 2000);

//     // Auto-hide toast after 8 seconds
//     const hideTimer = setTimeout(() => {
//       setShowToast(false);
//     }, 8000);

//     return () => {
//       clearTimeout(timer);
//       clearTimeout(hideTimer);
//     };
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setIsLoading(true);
    
//     try {
//       const data = await signup(form.username, form.email, form.password);
//       setMessage(data.message || "Signup successful!");
//       setForm({ username: "", email: "", password: "" });
//     } catch (err) {
//       setMessage(err.message || "Error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <div className="signup-container">

//       <div className="signup-card">
//         <div className="signup-header">
//           <h2>Create Account</h2>
//         </div>
//         <form onSubmit={handleSubmit} className="signup-form">
//           <div className="form-group">
//             <input 
//               type="text" 
//               name="username" 
//               className="form-input"
//               placeholder="Username" 
//               value={form.username} 
//               onChange={handleChange} 
//               required 
//             />
//             <label className="input-label">Username</label>
//           </div>
          
//           <div className="form-group">
//             <input 
//               type="email" 
//               name="email" 
//               className="form-input"
//               placeholder="Email" 
//               value={form.email} 
//               onChange={handleChange} 
//               required 
//             />
//             <label className="input-label">Email</label>
//           </div>
          
//           <div className="form-group">
//             <input 
//               type="password" 
//               name="password" 
//               className="form-input"
//               placeholder="Password" 
//               value={form.password} 
//               onChange={handleChange} 
//               required 
//             />
//             <label className="input-label">Password</label>
//           </div>
          
//           <button 
//             type="submit" 
//             className={`signup-button ${isLoading ? 'loading' : ''}`}
//             disabled={isLoading}
//           >
//             {isLoading ? '' : 'Create Account'}
//           </button>
//         </form>
        
//         {message && (
//           <p className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
//             {message}
//           </p>
//         )}
        
//         <p className="login-prompt">
//           Already have an account? <Link to="/login" className="login-link">Login here</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;