import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Logs from './components/Logs';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext'; // Make sure this import is correct



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
            <Route path="/tasks/new" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
            <Route path="/tasks/edit/:id" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
            <Route path="/logs" element={<ProtectedRoute adminOnly><Logs /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/tasks" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (adminOnly && user.role !== 'admin') return <div>Access denied. Admin only.</div>;
  
  return children;
}

export default App;