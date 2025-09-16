import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Decode JWT to get role
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    } catch (err) {
      console.error("Invalid token");
      navigate("/login");
      return;
    }

    // Fetch tasks
    fetch("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, [navigate, token]);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Logged in as: <strong>{role}</strong></p>
      <Link to="/add-task">
        <button>Add Task</button>
      </Link>

      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <h3>{task.title}</h3>
              <p>{task.description || "No description"}</p>
              <p>Status: <strong>{task.status}</strong></p>
              {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
