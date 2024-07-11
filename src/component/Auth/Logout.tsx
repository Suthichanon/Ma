import React from "react";
import { Button } from "@chakra-ui/react";
import { auth } from "../../firebase/firebaseAuth";
import { FirebaseError } from "firebase/app";

const Logout: React.FC = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // handle successful logout (e.g., redirect to login page)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error logging out:", error.message);
      } else if (error instanceof Error) {
        console.error("Error logging out:", error.message);
      } else {
        console.error("Unknown error logging out:", error);
      }
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
