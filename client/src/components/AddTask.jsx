import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddTask.css";

function AddTask() {
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", status: "pending" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Task created!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to create task");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    }
  };

  return (
    <div className="container">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default AddTask;
