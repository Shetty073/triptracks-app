import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/authContext";

const UnAuthenticatedRoute = () => {
  const { user } = useAuth();
  
  return user ? <Navigate to="/dashboard/trips" replace /> : <Outlet />;
};

export default UnAuthenticatedRoute;
