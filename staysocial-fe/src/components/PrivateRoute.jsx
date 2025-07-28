// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  console.log('PrivateRoute Debug:', { isAuthenticated, role, allowedRoles }); // Debug log

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Normalize case để so sánh
    const normalizedRole = role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      console.log(`Role ${role} not in allowed roles:`, allowedRoles); // Debug log
      return <Navigate to="/unauthorized" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;