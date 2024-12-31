import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const authSlice = useSelector((state) => state.authSlice);
  const user = authSlice.user;
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated users to login, preserving the attempted path
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
