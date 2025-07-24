// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
