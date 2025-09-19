import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AddTask.css";

function AddTask() {
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    dueDate: "", 
    status: "pending" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

    // Use environment variable or fallback to localhost
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      navigate("/login");
      return;
    }

    try {
     const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Task created successfully!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to create task");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-task-container">
      <div className="add-task-card">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        
        <div className="add-task-header">
          <h2>Create New Task</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="form-group">
            <input 
              name="title" 
              className="form-input"
              placeholder="Task Title"
              value={form.title} 
              onChange={handleChange} 
              required 
            />
            <label className="input-label">Task Title</label>
          </div>
          
          <div className="form-group">
            <textarea 
              name="description" 
              className="form-input"
              placeholder="Task Description"
              value={form.description} 
              onChange={handleChange}
              rows="4"
            />
            <label className="input-label">Description (Optional)</label>
          </div>
          
          <div className="form-group">
            <input 
              type="date" 
              name="dueDate" 
              className="form-input"
              value={form.dueDate} 
              onChange={handleChange} 
            />
            <label className="input-label">Due Date (Optional)</label>
          </div>
          
          <div className="form-group">
            <select 
              name="status" 
              className="form-select"
              value={form.status} 
              onChange={handleChange}
            >
              <option value="pending" className="option-pending">Pending</option>
              <option value="in-progress" className="option-in-progress">In Progress</option>
              <option value="completed" className="option-completed">Completed</option>
              <option value="overdue" className="option-overdue">Overdue</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className={`create-task-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTask;