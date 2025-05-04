import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
