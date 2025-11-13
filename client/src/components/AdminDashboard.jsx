import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Decode JWT just to check role
  const user = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { role: payload.role };
    } catch {
      return null;
    }
  }, [token]);

  // Show performance toast
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

  const fetchTasksHandler = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
      navigate("/admin-login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/admin-login");
      return;
    }
    fetchTasksHandler();
  }, [navigate, token, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  const closeToast = () => {
    setShowToast(false);
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  if (loading) return (
    <div className="admin-dashboard-container">
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

      <div className="loading-container">
        <div className="nexus-loader">
          <div className="loader-orb"></div>
          <div className="loader-orb"></div>
          <div className="loader-orb"></div>
        </div>
        <h2>Loading Admin Dashboard</h2>
        <p>Fetching all tasks...</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="admin-dashboard-container">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Access Denied</h2>
        <p className="error-message">{error}</p>
        <button 
          className="retry-btn"
          onClick={() => navigate("/admin-login")}
        >
          Go to Admin Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
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
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${i * 0.5}s`,
            '--duration': `${15 + i * 2}s`,
            '--size': `${2 + Math.random() * 3}px`
          }}></div>
        ))}
      </div>

      <div className="admin-dashboard-content">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-section">
            <div className="admin-icon">👑</div>
            <h1 className="admin-title">Admin Dashboard</h1>
          </div>
          
          <div className="admin-actions">
            <div className="admin-info">
              <span>Administrator Access</span>
              <div className="admin-badge">
                <span className="badge-icon">🛡️</span>
                Admin
              </div>
            </div>
            
            <button onClick={handleLogout} className="logout-btn">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{totalTasks}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{pendingTasks}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>{inProgressTasks}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{completedTasks}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              All Tasks ({totalTasks})
            </h2>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Tasks Found</h3>
              <p>There are no tasks in the system yet.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task, index) => (
                <div 
                  key={task._id} 
                  className={`task-card task-card-${task.status}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className={`task-status-badge status-${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </div>
                  </div>

                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  <div className="task-meta">
                    <div className="task-meta-item task-due">
                      <span className="meta-icon">📅</span>
                      <span>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </span>
                    </div>
                    
                    <div className="task-meta-item task-author">
                      <span className="meta-icon">👤</span>
                      <span className="author-name">
                        {task.createdBy || "Unknown User"}
                      </span>
                    </div>

                    {task.priority && (
                      <div className={`task-priority priority-${task.priority}`}>
                        {task.priority} priority
                      </div>
                    )}
                  </div>

                  <div className="task-actions">
                    <button className="action-btn">
                      <span>👁️</span>
                      View Details
                    </button>
                    <button className="action-btn delete">
                      <span>🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;










// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { getTasks } from "../services/api";

// function AdminDashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   // Decode JWT just to check role
//   const user = useMemo(() => {
//     if (!token) return null;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return { role: payload.role };
//     } catch {
//       return null;
//     }
//   }, [token]);

//   const fetchTasksHandler = async () => {
//     try {
//       setLoading(true);
//       const data = await getTasks();
//       setTasks(data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch tasks");
//       navigate("/admin-login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token || !user || user.role !== "admin") {
//       navigate("/admin-login");
//       return;
//     }
//     fetchTasksHandler();
//   }, [navigate, token, user]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/admin-login");
//   };

//   return (
//     <div className="container">
//       <h2>Admin Dashboard</h2>
//       <button onClick={handleLogout}>Logout</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {loading ? (
//         <p>Loading tasks...</p>
//       ) : tasks.length === 0 ? (
//         <p>No tasks found</p>
//       ) : (
//         <ul>
//           {tasks.map((task) => (
//             <li
//               key={task._id}
//               style={{
//                 border: "1px solid #ccc",
//                 padding: "10px",
//                 marginBottom: "10px",
//               }}
//             >
//               <h3>{task.title}</h3>
//               <p>{task.description || "No description"}</p>
//               <p>Status: {task.status}</p>
//               <p>
//                 Due:{" "}
//                 {task.dueDate
//                   ? new Date(task.dueDate).toLocaleDateString()
//                   : "N/A"}
//               </p>
//               <p>Created by: {task.createdBy || "Unknown"}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;