import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTasks, updateTask, deleteTask } from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Decode JWT to get user info
  const user = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { role: payload.role, userId: payload.userId };
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }
    fetchTasks();
    
    // Show performance toast
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
  }, [navigate, token, user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setGlobalError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Optimistic status update
  const handleUpdateStatus = async (taskId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [taskId]: true }));
    setActionError(prev => ({ ...prev, [taskId]: "" }));

    const originalTasks = [...tasks];
    setTasks(tasks.map(t => (t._id === taskId ? { ...t, status: newStatus } : t)));

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error(err);
      setActionError(prev => ({ ...prev, [taskId]: "Failed to update status" }));
      setTasks(originalTasks); // rollback
    } finally {
      setActionLoading(prev => ({ ...prev, [taskId]: false }));
    }
  };

  // Optimistic delete
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setActionLoading(prev => ({ ...prev, [taskId]: true }));
    setActionError(prev => ({ ...prev, [taskId]: "" }));

    const originalTasks = [...tasks];
    setTasks(tasks.filter(t => t._id !== taskId));

    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error(err);
      setActionError(prev => ({ ...prev, [taskId]: "Failed to delete task" }));
      setTasks(originalTasks); // rollback
    } finally {
      setActionLoading(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };

  if (loading) return (
    <div className="dashboard-container">
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
        <h2>Loading Your Dashboard</h2>
        <p>Fetching your tasks...</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );

  if (globalError) return (
    <div className="dashboard-container">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p className="error-message">{globalError}</p>
        <button 
          className="retry-btn"
          onClick={fetchTasks}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
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

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              <span className="title-icon">📊</span>
              Task Dashboard
            </h1>
            <div className="user-info">
              <span className="user-greeting">Welcome back!</span>
              <div className="role-badge">
                <span className="badge-icon">👤</span>
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{tasks.filter(t => t.status === 'pending').length}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>{tasks.filter(t => t.status === 'in-progress').length}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{tasks.filter(t => t.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <h2 className="tasks-title">
            <span className="title-icon">🎯</span>
            Your Tasks
          </h2>
          <Link to="/add-task" className="add-task-btn">
            <span className="btn-icon">+</span>
            Add New Task
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>Get started by creating your first task!</p>
            <Link to="/add-task" className="empty-state-btn">
              Create Your First Task
            </Link>
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
                  <div className="task-actions-mini">
                    {user.role === "user" && (
                      <>
                        <select
                          className="status-select"
                          value={task.status}
                          disabled={actionLoading[task._id]}
                          onChange={e => handleUpdateStatus(task._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <button
                          className="delete-btn"
                          disabled={actionLoading[task._id]}
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          {actionLoading[task._id] ? (
                            <div className="mini-loader"></div>
                          ) : (
                            "🗑️"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                <div className="task-meta">
                  <span className={`task-status status-${task.status}`}>
                    <span className="status-indicator"></span>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                  </span>
                  
                  {task.dueDate && (
                    <span className="task-due">
                      <span className="due-icon">📅</span>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  
                  {task.priority && (
                    <span className={`task-priority priority-${task.priority}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  )}
                </div>

                {actionError[task._id] && (
                  <div className="task-error">
                    <span className="error-icon">⚠️</span>
                    {actionError[task._id]}
                  </div>
                )}

                <div className="task-progress">
                  <div className={`progress-bar progress-${task.status}`}>
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;


// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { getTasks, updateTask, deleteTask } from "../services/api";
// import "../styles/Dashboard.css";

// function Dashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [globalError, setGlobalError] = useState("");
//   const [actionLoading, setActionLoading] = useState({});
//   const [actionError, setActionError] = useState({});
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   // Decode JWT to get user info
//   const user = useMemo(() => {
//     if (!token) return null;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return { role: payload.role, userId: payload.userId };
//     } catch {
//       return null;
//     }
//   }, [token]);

//   useEffect(() => {
//     if (!token || !user) {
//       navigate("/login");
//       return;
//     }
//     fetchTasks();
//   }, [navigate, token, user]);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const data = await getTasks();
//       setTasks(data);
//     } catch (err) {
//       console.error(err);
//       setGlobalError("Could not load tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Optimistic status update
//   const handleUpdateStatus = async (taskId, newStatus) => {
//     setActionLoading(prev => ({ ...prev, [taskId]: true }));
//     setActionError(prev => ({ ...prev, [taskId]: "" }));

//     const originalTasks = [...tasks];
//     setTasks(tasks.map(t => (t._id === taskId ? { ...t, status: newStatus } : t)));

//     try {
//       await updateTask(taskId, { status: newStatus });
//     } catch (err) {
//       console.error(err);
//       setActionError(prev => ({ ...prev, [taskId]: "Failed to update status" }));
//       setTasks(originalTasks); // rollback
//     } finally {
//       setActionLoading(prev => ({ ...prev, [taskId]: false }));
//     }
//   };

//   // Optimistic delete
//   const handleDeleteTask = async (taskId) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;

//     setActionLoading(prev => ({ ...prev, [taskId]: true }));
//     setActionError(prev => ({ ...prev, [taskId]: "" }));

//     const originalTasks = [...tasks];
//     setTasks(tasks.filter(t => t._id !== taskId));

//     try {
//       await deleteTask(taskId);
//     } catch (err) {
//       console.error(err);
//       setActionError(prev => ({ ...prev, [taskId]: "Failed to delete task" }));
//       setTasks(originalTasks); // rollback
//     } finally {
//       setActionLoading(prev => ({ ...prev, [taskId]: false }));
//     }
//   };

//   if (loading) return (
//     <div className="dashboard-container">
//       <div className="loading-state">
//         <div className="loading-spinner"></div>
//         <p>Loading tasks...</p>
//       </div>
//     </div>
//   );

//   if (globalError) return (
//     <div className="dashboard-container">
//       <div className="error-state">
//         <p className="error-message">{globalError}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-content">
//         <div className="dashboard-header">
//           <h1 className="dashboard-title">Dashboard</h1>
//           <div className="user-info">
//             <span>Logged in as:</span>
//             <span className="role-badge">{user?.role}</span>
//           </div>
//         </div>

//         <div className="dashboard-actions">
//           <h2 className="tasks-title">Your Tasks</h2>
//           <Link to="/add-task" className="add-task-btn">
//             Add New Task
//           </Link>
//         </div>

//         {tasks.length === 0 ? (
//           <div className="empty-state">
//             <h3>No tasks found</h3>
//             <p>Get started by creating your first task!</p>
//           </div>
//         ) : (
//           <div className="tasks-grid">
//             {tasks.map(task => (
//               <div key={task._id} className="task-card">
//                 <div className="task-header">
//                   <h3 className="task-title">{task.title}</h3>
//                 </div>

//                 {task.description && (
//                   <p className="task-description">{task.description}</p>
//                 )}

//                 <div className="task-meta">
//                   <span className={`task-status status-${task.status}`}>
//                     <span className="status-indicator"></span>
//                     {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
//                   </span>
//                   {task.dueDate && (
//                     <span className="task-due">
//                       📅 Due: {new Date(task.dueDate).toLocaleDateString()}
//                     </span>
//                   )}
//                 </div>

//                 {user.role === "user" && (
//                   <div className="task-actions">
//                     <select
//                       className="status-select"
//                       value={task.status}
//                       disabled={actionLoading[task._id]}
//                       onChange={e => handleUpdateStatus(task._id, e.target.value)}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="in-progress">In Progress</option>
//                       <option value="completed">Completed</option>
//                     </select>

//                     <button
//                       className="delete-btn"
//                       disabled={actionLoading[task._id]}
//                       onClick={() => handleDeleteTask(task._id)}
//                     >
//                       {actionLoading[task._id] ? "..." : "Delete"}
//                     </button>

//                     {actionError[task._id] && (
//                       <p className="error-message">{actionError[task._id]}</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
