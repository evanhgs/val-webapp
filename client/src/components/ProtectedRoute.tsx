import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext) || {};
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;