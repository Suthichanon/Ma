// src/components/Auth/withAuthRedirect.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseAuth";
import { Navigate } from "react-router-dom";

const withAuthRedirect = (Component: React.ComponentType) => {
  const AuthRedirect: React.FC = () => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    React.useEffect(() => {
      if (loading && user) {
        navigate("/home");
      }
    }, [user, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (user) {
      return <Navigate to="/home" />; // Prevent rendering the component if user is logged in
    }

    return <Component />;
  };

  return AuthRedirect;
};

export default withAuthRedirect;
