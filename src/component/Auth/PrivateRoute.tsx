// src/components/Auth/PrivateRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseAuth";

const PrivateRoute: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
