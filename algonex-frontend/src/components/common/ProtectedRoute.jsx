import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children, roles, requiredRole }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Accept both `roles` (array) and `requiredRole` (string) — App.jsx uses
  // requiredRole; with only `roles` supported the admin gate never ran.
  const allowedRoles = roles || (requiredRole ? [requiredRole] : null);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
