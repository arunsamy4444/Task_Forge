import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddTask from "./components/AddTask";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Toast Component
const Toast = ({ message, onClose, duration = 8000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="performance-toast">
      <div className="toast-content">
        <div className="toast-icon">⚡</div>
        <div className="toast-text">
          <strong>Performance Notice</strong>
          <p>{message}</p>
          <a 
            href="https://github.com/arunsamy4444/Task_Forge" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            📥 Get Code on GitHub
          </a>
        </div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
      <div className="toast-progress"></div>
    </div>
  );
};

function App() {
  const [showToast, setShowToast] = useState(false);

  // Show toast on every component mount/refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <Router>
      {/* Performance Toast */}
      {showToast && (
        <Toast 
          message="This is hosted on free tier, so it's slow. For better performance, try running locally."
          onClose={closeToast}
        />
      )}
      
      <Routes>
        {/* User routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-task" element={<AddTask />} />

        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;