// Ce code définit une route protégée qui restreint l'accès aux utilisateurs authentifiés.
// Si l'utilisateur est authentifié, il affiche les composants enfants.
// Sinon, il redirige l'utilisateur vers la page de login.

import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext) || {};
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;