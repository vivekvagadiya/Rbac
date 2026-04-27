import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import usePermission from "../hooks/permission.hook";

const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const { hasPermission } = usePermission();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 RBAC check
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;