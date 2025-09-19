// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

    // Use environment variable for backend URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) navigate("/admin-login");
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/admin-login");
    fetchTasks();
  }, [navigate, token]);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/admin-login");
        }}
      >
        Logout
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>All Tasks</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
