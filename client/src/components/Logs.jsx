import React, { useState, useEffect } from 'react';
import { logsAPI } from '../services/api'; // Make sure this import is also correct


const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await logsAPI.getAll();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div>Loading logs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="logs-container">
      <h2>System Logs</h2>
      <div className="logs-table">
        <div className="logs-header">
          <div>Timestamp</div>
          <div>User</div>
          <div>Action</div>
          <div>Task</div>
          <div>Details</div>
        </div>
        {logs.map(log => (
          <div key={log._id} className="log-row">
            <div>{formatDate(log.createdAt)}</div>
            <div>
              {log.userId ? (
                <>
                  {log.userId.username} ({log.userId.email})
                </>
              ) : (
                'Unknown User'
              )}
            </div>
            <div>
              <span className={`action-badge ${log.action}`}>
                {log.action}
              </span>
            </div>
            <div>
              {log.taskId ? log.taskId.title : 'N/A'}
            </div>
            <div>{log.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;