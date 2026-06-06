import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until auth state is restored
  if (loading) return null;

  // If logged in → allow access
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
