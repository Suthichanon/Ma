import React, { useState } from "react";
import { auth } from "../../firebase/firebaseAuth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard")
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Box>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Text color="red.500">{error}</Text>}
      <Button onClick={handleSignup}>Signup</Button>
    </Box>
  );
};

export default Signup;
