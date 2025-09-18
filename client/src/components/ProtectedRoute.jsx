// protects routes based on token and role
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/admin-login" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (role && payload.role !== role) return <Navigate to="/admin-login" />;
  } catch {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default ProtectedRoute;
