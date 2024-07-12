// src/components/Auth/ForgotPassword.tsx
import React, { useState } from "react";
import { auth } from "../../firebase/firebaseAuth";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, Center, VStack } from "@chakra-ui/react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset email has been sent to your email address.");
      setError("");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError(error.message);
        setMessage("");
      } else if (error instanceof Error) {
        setError(error.message);
        setMessage("");
      } else {
        setError("An unexpected error occurred");
        setMessage("");
      }
    }
  };

  return (
    <Center height="100vh">
      <Box width="md" p={6} borderWidth={1} borderRadius={20} boxShadow="lg">
        <Heading as="h1" size="lg" textAlign="center" mb={6}>
          Forgot Password
        </Heading>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
        >
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            {error && (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            )}
            {message && (
              <Text color="green.500" textAlign="center">
                {message}
              </Text>
            )}
            <Button type="submit" colorScheme="teal" width="full">
              Send Reset Email
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default ForgotPassword;
