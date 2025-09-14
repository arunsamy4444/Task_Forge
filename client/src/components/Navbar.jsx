import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Fixed import path

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav>
      <div className="nav-brand">
        <Link to="/tasks">TaskOps</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/tasks">Tasks</Link>
            {user.role === 'admin' && <Link to="/logs">Logs</Link>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;