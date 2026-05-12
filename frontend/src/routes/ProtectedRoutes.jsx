import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import usePermission from "../hooks/permission.hook";

const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const { hasPermission } = usePermission();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // wait until user exists
  if (!user) {
    return <div>Loading...</div>;
  }

  if (permission) {
    const allowed = hasPermission(permission);

    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;