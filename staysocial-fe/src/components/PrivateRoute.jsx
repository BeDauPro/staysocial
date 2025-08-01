import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const role = userInfo?.role;
  
  console.log('PrivateRoute Debug:', { isAuthenticated, role, allowedRoles });
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedRole = role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      console.log(`Role ${role} not in allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <Outlet />;
};

export default PrivateRoute;
