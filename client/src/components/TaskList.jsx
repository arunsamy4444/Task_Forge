import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../services/api'; // Make sure this import is also correct


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="task-list-container">
      <div className="task-header">
        <h2>My Tasks</h2>
        <Link to="/tasks/new" className="btn-primary">Create New Task</Link>
      </div>
      
      {tasks.length === 0 ? (
        <p>No tasks found. Create your first task!</p>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <span className={`status-badge ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                <div>Created: {new Date(task.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="task-actions">
                <Link to={`/tasks/edit/${task._id}`} className="btn-secondary">Edit</Link>
                <button 
                  onClick={() => handleDelete(task._id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;