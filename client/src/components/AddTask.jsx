import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTask } from "../services/api";
import "../styles/AddTask.css";

function AddTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    priority: "medium"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Show toast notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowToast(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    // Validate form
    if (!form.title.trim()) {
      setError("Task title is required");
      setIsLoading(false);
      return;
    }

    try {
      await createTask(form);
      // Show success message instead of alert
      setError("success"); // Using error state for success for simplicity
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating task");
    } finally {
      setIsLoading(false);
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="add-task-container">
      {/* Performance Toast */}
      {showToast && (
        <div className="performance-toast">
          <div className="toast-content">
            <div className="toast-icon">⚡</div>
            <div className="toast-text">
              <strong>Performance Notice</strong>
              <p>This app is hosted on free tier. For better performance, run locally.</p>
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

      {/* Animated Background */}
      <div className="bg-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${i * 0.5}s`,
            '--duration': `${15 + i * 2}s`,
            '--size': `${2 + Math.random() * 3}px`
          }}></div>
        ))}
      </div>

      <div className="add-task-card">
        {/* Header */}
        <div className="task-header">
          <Link to="/dashboard" className="back-button">
            <span className="back-icon">←</span>
            Back to Dashboard
          </Link>
          
          <div className="add-task-header">
            <div className="header-icon">➕</div>
            <h2>Create New Task</h2>
            <p className="header-subtitle">Add a new task to your dashboard</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className={`message ${error === "success" ? "success-message" : "error-message"}`}>
            <div className="message-icon">
              {error === "success" ? "✅" : "⚠️"}
            </div>
            <div className="message-content">
              <strong>
                {error === "success" ? "Success!" : "Error"}
              </strong>
              <p>
                {error === "success" 
                  ? "Task created successfully! Redirecting..." 
                  : error
                }
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-task-form">
          {/* Title Field */}
          <div className="form-group">
            <input
              name="title"
              className={`form-input ${focusedField === "title" ? "focused" : ""} ${form.title ? "has-value" : ""}`}
              placeholder=" "
              value={form.title}
              onChange={handleChange}
              onFocus={() => handleFocus("title")}
              onBlur={handleBlur}
              required
            />
            <label className={`input-label ${focusedField === "title" || form.title ? "active" : ""}`}>
              Task Title *
            </label>
            <div className="input-underline"></div>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <textarea
              name="description"
              className={`form-input ${focusedField === "description" ? "focused" : ""} ${form.description ? "has-value" : ""}`}
              placeholder=" "
              value={form.description}
              onChange={handleChange}
              onFocus={() => handleFocus("description")}
              onBlur={handleBlur}
              rows="4"
            />
            <label className={`input-label ${focusedField === "description" || form.description ? "active" : ""}`}>
              Description
            </label>
            <div className="input-underline"></div>
          </div>

          <div className="form-row">
            {/* Due Date Field */}
            <div className="form-group">
              <input
                type="date"
                name="dueDate"
                className={`form-input ${focusedField === "dueDate" ? "focused" : ""} ${form.dueDate ? "has-value" : ""}`}
                value={form.dueDate}
                onChange={handleChange}
                onFocus={() => handleFocus("dueDate")}
                onBlur={handleBlur}
                min={today}
              />
              <label className={`input-label ${focusedField === "dueDate" || form.dueDate ? "active" : ""}`}>
                Due Date
              </label>
              <div className="input-underline"></div>
            </div>

            {/* Priority Field */}
            <div className="form-group">
              <select
                name="priority"
                className={`form-select ${focusedField === "priority" ? "focused" : ""}`}
                value={form.priority}
                onChange={handleChange}
                onFocus={() => handleFocus("priority")}
                onBlur={handleBlur}
              >
                <option value="low" className="option-low">Low Priority</option>
                <option value="medium" className="option-medium">Medium Priority</option>
                <option value="high" className="option-high">High Priority</option>
              </select>
              <label className={`input-label ${focusedField === "priority" || form.priority ? "active" : ""}`}>
                Priority
              </label>
            </div>
          </div>

          {/* Status Field */}
          <div className="form-group">
            <select
              name="status"
              className={`form-select ${focusedField === "status" ? "focused" : ""}`}
              value={form.status}
              onChange={handleChange}
              onFocus={() => handleFocus("status")}
              onBlur={handleBlur}
            >
              <option value="pending" className="option-pending">
                ⏳ Pending
              </option>
              <option value="in-progress" className="option-in-progress">
                🚀 In Progress
              </option>
              <option value="completed" className="option-completed">
                ✅ Completed
              </option>
            </select>
            <label className={`input-label ${focusedField === "status" || form.status ? "active" : ""}`}>
              Status
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`create-task-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || !form.title.trim()}
          >
            {isLoading ? (
              <>
                <div className="button-loader"></div>
                <span>Creating Task...</span>
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                <span>Create Task</span>
              </>
            )}
          </button>

          {/* Form Hint */}
          <div className="form-hint">
            <small>Fields marked with * are required</small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;













// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { createTask } from "../services/api"; // use api.js helper
// import "../styles/AddTask.css";

// function AddTask() {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     dueDate: "",
//     status: "pending",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       await createTask(form); // use service call
//       alert("Task created successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Error creating task");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="add-task-container">
//       <div className="add-task-card">
//         <Link to="/dashboard" className="back-button">
//           ← Back to Dashboard
//         </Link>

//         <div className="add-task-header">
//           <h2>Create New Task</h2>
//         </div>

//         <form onSubmit={handleSubmit} className="add-task-form">
//           <div className="form-group">
//             <input
//               name="title"
//               className="form-input"
//               placeholder="Task Title"
//               value={form.title}
//               onChange={handleChange}
//               required
//             />
//             <label className="input-label">Task Title</label>
//           </div>

//           <div className="form-group">
//             <textarea
//               name="description"
//               className="form-input"
//               placeholder="Task Description"
//               value={form.description}
//               onChange={handleChange}
//               rows="4"
//             />
//             <label className="input-label">Description (Optional)</label>
//           </div>

//           <div className="form-group">
//             <input
//               type="date"
//               name="dueDate"
//               className="form-input"
//               value={form.dueDate}
//               onChange={handleChange}
//             />
//             <label className="input-label">Due Date (Optional)</label>
//           </div>

//           <div className="form-group">
//             <select
//               name="status"
//               className="form-select"
//               value={form.status}
//               onChange={handleChange}
//             >
//               <option value="pending" className="option-pending">
//                 Pending
//               </option>
//               <option value="in-progress" className="option-in-progress">
//                 In Progress
//               </option>
//               <option value="completed" className="option-completed">
//                 Completed
//               </option>
//               <option value="overdue" className="option-overdue">
//                 Overdue
//               </option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className={`create-task-button ${isLoading ? "loading" : ""}`}
//             disabled={isLoading}
//           >
//             {isLoading ? "" : "Create Task"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddTask;