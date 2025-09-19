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

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    </div>
  );

  if (globalError) return (
    <div className="dashboard-container">
      <div className="error-state">
        <p className="error-message">{globalError}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="user-info">
            <span>Logged in as:</span>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        <div className="dashboard-actions">
          <h2 className="tasks-title">Your Tasks</h2>
          <Link to="/add-task" className="add-task-btn">
            Add New Task
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Get started by creating your first task!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
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
                      📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {user.role === "user" && (
                  <div className="task-actions">
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
                      {actionLoading[task._id] ? "..." : "Delete"}
                    </button>

                    {actionError[task._id] && (
                      <p className="error-message">{actionError[task._id]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { getTasks, updateTask, deleteTask } from "../services/taskApi";
// import "../styles/Dashboard.css";

// function Dashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [role, setRole] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//     // Use environment variable for backend URL
//   const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     // Decode JWT to get role
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       setRole(payload.role);
//     } catch (err) {
//       console.error("Invalid token");
//       navigate("/login");
//       return;
//     }

//     fetchTasks();
//   }, [navigate, token]);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//        const res = await fetch(`${API_URL}/api/tasks`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch tasks");
//       const data = await res.json();
//       setTasks(data);
//     } catch (err) {
//       console.error(err);
//       setError("Could not load tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (taskId, newStatus) => {
//     try {
//       const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (res.ok) fetchTasks();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteTask = async (taskId) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;
//     try {
//       const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) setTasks(tasks.filter((t) => t._id !== taskId));
//     } catch (err) {
//       console.error(err);
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
  
//   if (error) return (
//     <div className="dashboard-container">
//       <div className="error-state">
//         <p className="error-message">{error}</p>
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
//             <span className="role-badge">{role}</span>
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
//             {tasks.map((task) => (
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

//                 {role === "user" && (
//                   <div className="task-actions">
//                     <select
//                       className="status-select"
//                       value={task.status}
//                       onChange={(e) => updateStatus(task._id, e.target.value)}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="in-progress">In Progress</option>
//                       <option value="completed">Completed</option>
//                     </select>

//                     <button
//                       className="delete-btn"
//                       onClick={() => deleteTask(task._id)}
//                     >
//                       Delete
//                     </button>
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