import { Navigate } from "react-router-dom";
import { useAuth } from "../api/auth-context.jsx";

export default function ProtectedRoute({ role, children }) {
  const { session, ready } = useAuth();

  if (!ready) return null;
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.user.role !== role) {
    return <Navigate to={session.user.role === "farmer" ? "/farmer" : "/mill"} replace />;
  }
  return children;
}
